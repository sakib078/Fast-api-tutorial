export interface Post {
  id: string;
  userId: string;
  userEmail: string;
  imageUrl: string;
  caption: string;
  createdAt: Date;
  likes: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userEmail: string;
  text: string;
  createdAt: Date;
}
