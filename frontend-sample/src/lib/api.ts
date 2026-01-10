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

import { Post, Comment } from "@/types/post";
import { UsertoRegister } from "@/types/user";


const API_BASE_URL = 'http://localhost:8000';


// Auth (fastapi-users) — common subpaths (under /auth or /auth/jwt)

// POST http://localhost:8000/auth/register — Register a new user ✅


async function registerUser(user: UsertoRegister): Promise<Response> {

    try {
        const response = await fetch(API_BASE_URL + '/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error(`Blast! Our data was not received favorably: ${response.statusText}`);
        }
        
        console.log('User registered successfully');
        return await response.json();

    }
    catch (error) {
        console.error('Error registering user:', error);
    }

}

// POST http://localhost:8000/auth/jwt/login — Log in (get JWT) ✅
async function loginUser(email: string, password: string) {
    
    try {
        const response = await fetch(API_BASE_URL + '/auth/jwt/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            throw new Error(`Blast! Our data was not received favorably: ${response.statusText}`);
        }
        console.log('User logged in successfully');
        return await response.json();
    }
    catch (error) {
        console.error('Error logging in user:', error);
    }
    

}

// POST http://localhost:8000/auth/reset-password — Start/reset password flow ✅
async function resetPassword(email: string) {

}

// POST http://localhost:8000/auth/verify — Email verification (and /auth/verify/resend) ✅
async function verifyEmail(token: string) {

}

// Users

// GET http://localhost:8000/users — List users
async function listUsers() {

}

// GET http://localhost:8000/users/{id} — Get user by id
async function getUserById(id: string) {

}

// PATCH/PUT http://localhost:8000/users/{id} — Update user
async function updateUser(id: string, data: any) {

}

// DELETE http://localhost:8000/users/{id} — Delete user
async function deleteUser(id: string) {

}

// Posts

// POST http://localhost:8000/upload — Upload a file (multipart file, optional caption) — auth required 🔒
async function uploadFile(file: File, caption?: string) {

}

// GET http://localhost:8000/feed — Return posts feed (latest first) — auth required 🔒
async function getFeed() {

}

// DELETE http://localhost:8000/posts/{post_id} — Delete a post by UUID (owner only) — auth + ownership 🔒
async function deletePost(postId: string) {

}


export {
    registerUser,
    loginUser,
    resetPassword,
    verifyEmail,
    listUsers,
    getUserById,
    updateUser,
    deleteUser,
    uploadFile,
    getFeed,
    deletePost
};

