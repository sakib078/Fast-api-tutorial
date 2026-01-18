from pydantic import BaseModel
from fastapi_users import schemas
from typing import Optional, List
from datetime import datetime
import uuid

class CommentRead(BaseModel):
    id: uuid.UUID
    text: str
    user_id: uuid.UUID
    created_at: datetime
    class Config:
        from_attributes = True

class PostUpdate(BaseModel):
    caption: Optional[str] = None
    like_action: Optional[str] = None # "like" or "unlike"
    new_comment: Optional[str] = None


class PostCreate(BaseModel):
    title: str
    content: str
      
    
class PostResponse(BaseModel):
    id: uuid.UUID
    caption: str
    url: str
    likes_count: int
    comments: List[CommentRead]
    class Config:
        from_attributes = True
    

class UserRead(schemas.BaseUser[uuid.UUID]):
    pass
    
class UserCreate(schemas.BaseUserCreate):
    pass


class UserUpdate(schemas.BaseUserUpdate):
    pass