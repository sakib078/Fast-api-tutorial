# Backend — FAST API tutorial

Quick start
1. Open PowerShell in Backend folder:
   cd "C:\Users\sakib\Desktop\FAST API tutorial\Backend"
2. Create & activate venv:
   python -m venv .venv
   .venv\Scripts\Activate.ps1
3. Install deps:
   pip install -r requirements.txt

Run server
- Development (works):
  uvicorn app.app:app --host 127.0.0.1 --port 8000 --reload
- Without auto-reload (fewer CancelledError logs):
  uvicorn app.app:app --host 127.0.0.1 --port 8000

Base URL: http://127.0.0.1:8000

Endpoints (full URLs, one-line)
- POST  http://127.0.0.1:8000/upload — Upload file (multipart file + caption) — auth required  
- GET   http://127.0.0.1:8000/feed — Return posts feed (latest first) — auth required  
- DELETE http://127.0.0.1:8000/posts/{post_id} — Delete post by UUID (owner only) — auth required  
- PATCH http://127.0.0.1:8000/post/{post_id} — Update post (like/unlike, add comment, update caption) — auth required

Auth (fastapi-users)
- POST http://127.0.0.1:8000/auth/register — Register new user  
- POST http://127.0.0.1:8000/auth/jwt/login — Login (get JWT)  
- POST http://127.0.0.1:8000/auth/reset-password — Password reset flow  
- POST http://127.0.0.1:8000/auth/verify — Email verification (and resend)

Users
- GET  http://127.0.0.1:8000/users — List users  
- GET  http://127.0.0.1:8000/users/{id} — Get user by id  
- PATCH/PUT http://127.0.0.1:8000/users/{id} — Update user  
- DELETE http://127.0.0.1:8000/users/{id} — Delete user

Troubleshooting
- Error "Attribute 'app' not found in module 'main'": run uvicorn with module path that contains the FastAPI app (uvicorn app.app:app) or modify main.py to expose `app`.  
- Remove `--reload` to avoid async CancelledError noise from the auto-reloader.  
- Check console for tracebacks on startup; DB tables are created at app lifespan startup.

That's it.