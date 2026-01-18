import shutil
import os
import uuid
import tempfile
from fastapi import FastAPI, HTTPException, File, UploadFile, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import PostCreate, PostResponse , UserRead, UserCreate, UserUpdate, PostUpdate
from app.db import Post, create_db_and_tables, get_async_session, User
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from sqlalchemy import select
from sqlalchemy.orm import selectinload, joinedload
from app.images import imagekit
# from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions
from pathlib import Path
from app.user import current_active_user, fastapi_users, auth_backend



@asynccontextmanager
async def lifespan(app: FastAPI):

    await create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:8080", 
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # MUST be a specific list, not ["*"] when allow_credentials is True 
    allow_credentials=True,      # REQUIRED for HttpOnly cookies
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router( fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"])
app.include_router( fastapi_users.get_register_router(UserRead, UserCreate ), prefix="/auth", tags=["auth"])
app.include_router( fastapi_users.get_reset_password_router(), prefix="/auth", tags=["auth"])
app.include_router( fastapi_users.get_verify_router(UserRead), prefix="/auth", tags=["auth"])
app.include_router( fastapi_users.get_users_router(UserRead, UserUpdate), prefix="/users", tags=["users"])


@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    caption: str = Form(""),
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):

    temp_file_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file_path = temp_file.name
            shutil.copyfileobj(file.file, temp_file)

        upload_result = imagekit.files.upload(
            file=Path(temp_file_path),
            file_name=file.filename,
            folder="/uploads/",
            tags=["backend-upload"],
            use_unique_file_name=True
        )
        
        # print(f"upload obj: {upload_result}")

        file_id = getattr(upload_result, "file_id", None) or getattr(upload_result, "fileId", None) \
          or (upload_result.get("file_id") if isinstance(upload_result, dict) else None)
          
        url = getattr(upload_result, "url", None) or (upload_result.get("url") if isinstance(upload_result, dict) else None)

        if (file_id or url):

            post = Post(
                user_id=user.id,
                caption=caption,
                url= upload_result.url,
                file_type= "video" if file.content_type.startswith("video/") else "image",
                file_name=upload_result.name
                
            )
            
            session.add(post)
            await session.commit()
            await session.refresh(post)

            return post

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)


@app.get("/feed")
async def get_feed(
    
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
):
    # 1. Fetch Posts with Likes and Comments pre-loaded (Required for Async)
    # selectinload is the best way to load collections like likes and comments
    post_query = select(Post).options(
        selectinload(Post.likers),
        selectinload(Post.comments)
    ).order_by(Post.created_at.desc())
    
    post_result = await session.execute(post_query)
    posts = post_result.scalars().all() # .scalars().all() is cleaner than [row[0] for row in result.all()]

    # 2. Fetch all Users to create your email mapping dictionary
    user_query = select(User)
    user_result = await session.execute(user_query)
    users = user_result.scalars().all()
    user_dict = {u.id: u.email for u in users}

    posts_data = []

    # 3. Build the response matching your frontend Post interface
    for post in posts:
        posts_data.append({
            "id": str(post.id),
            "userId": str(post.user_id),
            "email": user_dict.get(post.user_id, "Unknown"), # Mapping email from dict
            "caption": post.caption,
            "url": post.url,
            "file_type": post.file_type,
            "file_name": post.file_name,
            "created_at": post.created_at.isoformat(),
            "likes": [str(u.id) for u in post.likers], # This works because of selectinload
            "comments": [
                {
                    "id": str(c.id), 
                    "userId": str(c.user_id), 
                    "text": c.text,
                    "createdAt": c.created_at.isoformat()
                } for c in post.comments
            ],
            "is_owner": post.user_id == user.id,
        })

    return {"posts": posts_data}

@app.delete("/posts/{post_id}")
async def delete_post(post_id: str, user: User = Depends(current_active_user), session: AsyncSession = Depends(get_async_session)):
    try:
        post_uuid = uuid.UUID(post_id)

        result = await session.execute(select(Post).where(Post.id == post_uuid))
        post = result.scalars().first()

        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        if post.user_id != user.id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this post")
        

        await session.delete(post)
        await session.commit()

        return {"success": True, "message": "Post deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/post/{post_id}")
async def update_post(
    post_id: str, 
    update_data: PostUpdate,
    user: User = Depends(current_active_user), 
    session: AsyncSession = Depends(get_async_session)
):
    try:
        post_uuid = uuid.UUID(post_id)
        # Eager load relationships to avoid async errors
        query = select(Post).where(Post.id == post_uuid).options(
            selectinload(Post.likers),
            selectinload(Post.comments)
        )
        
        result = await session.execute(query)
        post = result.scalar_one_or_none()

        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        # 1. Handle Likes
        if update_data.like_action == "like":
            if user not in post.likers:
                post.likers.append(user)
        elif update_data.like_action == "unlike":
            if user in post.likers:
                post.likers.remove(user)

        # 2. Handle Comments
        if update_data.new_comment:
            from app.db import Comment
            new_comment = Comment(
                text=update_data.new_comment,
                user_id=user.id,
                post_id=post.id
            )
            session.add(new_comment)

        # 3. Handle Caption Update (Optional)
        if update_data.caption:
            post.caption = update_data.caption

        await session.commit()
        await session.refresh(post)
        return {"success": True, "likes_count": len(post.likers)}

    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))
     
  
