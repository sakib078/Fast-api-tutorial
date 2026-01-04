import { useState } from 'react';
import { usePosts } from '@/contexts/PostContext';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import UploadModal from '@/components/UploadModal';
import { ImageOff } from 'lucide-react';

const Feed = () => {
  const { posts } = usePosts();
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onUploadClick={() => setUploadOpen(true)} />
      
      <main className="max-w-lg mx-auto px-4 py-6">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex p-4 rounded-full bg-muted mb-4">
              <ImageOff className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No moments yet</h2>
            <p className="text-muted-foreground">Be the first to share a moment!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <UploadModal open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
};

export default Feed;
