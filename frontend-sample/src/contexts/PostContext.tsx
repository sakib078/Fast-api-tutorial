import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Post, Comment } from '@/types/post';

interface PostContextType {
  posts: Post[];
  addPost: (imageUrl: string, caption: string, userId: string, userEmail: string) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, userId: string, userEmail: string, text: string) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

// Sample posts for demo
const samplePosts: Post[] = [
  {
    id: '1',
    userId: 'user1',
    userEmail: 'alex@momento.com',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    caption: 'Morning hike in the mountains 🏔️',
    createdAt: new Date(Date.now() - 3600000),
    likes: ['user2', 'user3'],
    comments: [
      { id: 'c1', userId: 'user2', userEmail: 'sam@momento.com', text: 'Amazing view!', createdAt: new Date(Date.now() - 1800000) }
    ]
  },
  {
    id: '2',
    userId: 'user2',
    userEmail: 'sam@momento.com',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
    caption: 'Homemade pasta night 🍝',
    createdAt: new Date(Date.now() - 7200000),
    likes: ['user1'],
    comments: []
  },
  {
    id: '3',
    userId: 'user3',
    userEmail: 'jordan@momento.com',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
    caption: 'Stargazing tonight ✨',
    createdAt: new Date(Date.now() - 86400000),
    likes: ['user1', 'user2'],
    comments: [
      { id: 'c2', userId: 'user1', userEmail: 'alex@momento.com', text: 'So peaceful!', createdAt: new Date(Date.now() - 43200000) }
    ]
  }
];

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>(samplePosts);

  const savePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    localStorage.setItem('momento_posts', JSON.stringify(newPosts));
  };

  const addPost = (imageUrl: string, caption: string, userId: string, userEmail: string) => {
    const newPost: Post = {
      id: crypto.randomUUID(),
      userId,
      userEmail,
      imageUrl,
      caption,
      createdAt: new Date(),
      likes: [],
      comments: []
    };
    savePosts([newPost, ...posts]);
  };

  const deletePost = (postId: string) => {
    savePosts(posts.filter(p => p.id !== postId));
  };

  const likePost = (postId: string, userId: string) => {
    savePosts(posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likes.includes(userId);
        return {
          ...post,
          likes: hasLiked 
            ? post.likes.filter(id => id !== userId)
            : [...post.likes, userId]
        };
      }
      return post;
    }));
  };

  const addComment = (postId: string, userId: string, userEmail: string, text: string) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      userId,
      userEmail,
      text,
      createdAt: new Date()
    };
    savePosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
  };

  return (
    <PostContext.Provider value={{ posts, addPost, deletePost, likePost, addComment }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};
