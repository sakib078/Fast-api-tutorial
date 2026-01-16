import { useState } from 'react';
import { Post } from '@/types/post';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Trash2, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const { likePost, addComment, deletePost } = usePosts();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const hasLiked = user ? post.likes.includes(user.id) : false;
  const isOwner = user?.id === post.userId;

  const handleLike = () => {
    if (user) {
      likePost(post.id, user.id);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && commentText.trim()) {
      addComment(post.id, user.id, user.email, commentText.trim());
      setCommentText('');
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(post.id);
    }
  };

  // const getInitials = (email: string) => {
  //   return email.split('@')[0].slice(0, 2).toUpperCase();
  // };

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {/* {getInitials(post.userEmail)} */}
            </AvatarFallback>
          </Avatar>
          <div>
            {/* <p className="font-medium text-foreground">{post.userEmail.split('@')[0]}</p> */}
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        {isOwner && (
          <Button variant="ghost" size="icon" onClick={handleDelete} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Image */}
      <div className="aspect-square bg-muted">
        <img 
          src={post.imageUrl} 
          alt={post.caption} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Actions */}
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLike}
            className={hasLiked ? 'text-destructive hover:text-destructive' : 'text-muted-foreground hover:text-foreground'}
          >
            <Heart className={`h-5 w-5 ${hasLiked ? 'fill-current' : ''}`} />
            <span className="ml-1">{post.likes.length}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowComments(!showComments)}
            className="text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="ml-1">{post.comments.length}</span>
          </Button>
        </div>

        {/* Caption */}
        <p className="text-foreground">
          {/* <span className="font-medium">{post.userEmail.split('@')[0]}</span>{' '} */}
          {post.caption}
        </p>

        {/* Comments */}
        {showComments && (
          <div className="space-y-3 pt-2 border-t border-border">
            {post.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2 text-sm">
                    {/* <span className="font-medium text-foreground">{comment.userEmail.split('@')[0]}</span> */}
                    <span className="text-foreground">{comment.text}</span>
                  </div>
                ))}
              </div>
            )}
            
            <form onSubmit={handleComment} className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-accent text-sm"
              />
              <Button type="submit" size="icon" variant="ghost" disabled={!commentText.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
