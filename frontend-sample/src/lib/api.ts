
/*

Different api endpoints list implemented:
 
Base URL: http://localhost:8000

POST http://localhost:8000/upload — Upload a file (multipart file, optional caption) — auth required 🔒
GET http://localhost:8000/feed — Return posts feed (latest first) — auth required 🔒
DELETE http://localhost:8000/posts/{post_id} — Delete a post by UUID (owner only) — auth + ownership 🔒
Auth (fastapi-users) — common subpaths (under /auth or /auth/jwt)

POST http://localhost:8000/auth/register — Register a new user ✅
POST http://localhost:8000/auth/jwt/login — Log in (get JWT) ✅
POST http://localhost:8000/auth/reset-password — Start/reset password flow ✅
POST http://localhost:8000/auth/verify — Email verification (and /auth/verify/resend) ✅
Users

GET http://localhost:8000/users — List users
GET http://localhost:8000/users/{id} — Get user by id
PATCH/PUT http://localhost:8000/users/{id} — Update user
DELETE http://localhost:8000/users/{id} — Delete user

*/