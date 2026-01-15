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
import { UsertoRegister, currentUser } from "@/types/user";


const API_BASE_URL = 'http://localhost:8000';


// Auth (fastapi-users) — common subpaths (under /auth or /auth/jwt)

// POST http://localhost:8000/auth/register — Register a new user ✅


async function registerUser(user: UsertoRegister): Promise<currentUser> {

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
        return await response.json() as currentUser;

    }
    catch (error) {
        console.error('Error registering user:', error);
    }

}

// POST http://localhost:8000/auth/jwt/login — Log in (get JWT) ✅
async function loginUser(formData: URLSearchParams): Promise<any> {

    try {
        const response = await fetch(`${API_BASE_URL}/auth/jwt/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
            // CRITICAL: Tells the browser to accept and store the cookie [web:69]
            credentials: 'include',
        });

        if (response.status === 204) {
            console.log("Login successful! Cookie stored by browser.");
            // Redirect to your dashboard [web:72]
        } else {
            const errorData = await response.json();
            alert(errorData.detail); // e.g., "LOGIN_BAD_CREDENTIALS"
        }
    } catch (err) {
        console.error("Login error:", err);
    }

}

// POST http://localhost:8000/auth/jwt/logout — Log out (delete cookie)
async function logoutUser() {
    
    try {
        
        const response = await fetch(`${API_BASE_URL}/auth/jwt/logout`, {
            method: 'POST',
            // CRITICAL: Tells the browser to include cookies 
            credentials: 'include',
        },);

        if (response.status === 204 || response.status === 200) {
            console.log("Logged out successfully on backend.");
            // Redirect to homepage or login page
        } else {
            const errorData = await response.json();
            alert(errorData.detail);
        }

    } catch (err) {
        console.error("Logout error:", err);
    }
}

// POST http://localhost:8000/auth/reset-password — Start/reset password flow ✅
async function resetPassword(email: string) {

}

// POST http://localhost:8000/auth/verify — Email verification (and /auth/verify/resend) ✅
async function verifyEmail(token: string) {

}

// Users

// GET http://localhost:8000/users/me — List current user
async function getCurrentUser():Promise<currentUser> {
    const resp = await fetch(`${API_BASE_URL}/users/me`, 
        { credentials: 'include' }
    );

    if (resp.status === 401) {
        // This is a known state: the user is a guest.
        throw new Error("GUEST_USER"); 
    }

    if (!resp.ok) throw new Error(resp.statusText);

    return await resp.json() as currentUser;
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

    const formdata = new FormData();

    formdata.append('file', file);
    if (caption) formdata.append('caption', caption); 

    try {

        const resp = await fetch(`${API_BASE_URL}/upload`, {
            method: "POST",
            headers: {},
            credentials: 'include',
            body: formdata,
        });

        if(resp.ok){
            
            const result = await resp.json();

            console.log('Success:', result);
        }
        else {
            throw new Error(`Failed to uplaod feed: ${resp.statusText}`)
        }

    } catch(err) {
        console.log("Error", err);
    }

}

// GET http://localhost:8000/feed — Return posts feed (latest first) — auth required 🔒
async function getFeed() {

    try {
        const resp = await fetch(`${API_BASE_URL}/feed`, {
        method: 'GET',
        credentials: 'include'
    });
     
    if (!resp.ok) {
        throw new Error(`Failed to fetch feed: ${resp.statusText}`);
    }

    const posts: Post[] = await resp.json();
    return posts;
    
    } catch (error) {
        console.error('Error fetching feed:', error);
    }

}


// DELETE http://localhost:8000/posts/{post_id} — Delete a post by UUID (owner only) — auth + ownership 🔒
async function deletePost(postId: string) {

    try {

        const resp = await fetch(`${API_BASE_URL}/posts/${postId}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }

        })

        if (!resp.ok) {
            throw new Error(`Server responded with status ${resp.statusText}`);
        }

        let result = await resp.json();
        return result;

    } catch(err) {
         console.error("Error deleting resource:", err);
         return null;
    }

}


export {
    registerUser,
    loginUser,
    logoutUser,
    resetPassword,
    verifyEmail,
    getCurrentUser,
    getUserById,
    updateUser,
    deleteUser,
    uploadFile,
    getFeed,
    deletePost
};

