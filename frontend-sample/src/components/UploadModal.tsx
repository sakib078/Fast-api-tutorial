import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ImagePlus, Upload, X } from 'lucide-react';

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadModal = ({ open, onOpenChange }: UploadModalProps) => {
  const { user } = useAuth();
  const { addPost } = usePosts();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !preview) return;

    setIsUploading(true);
    
    // Simulate upload delay - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addPost(preview, caption, user.id, user.email);
    
    // Reset form
    setFile(null);
    setPreview(null);
    setCaption('');
    setIsUploading(false);
    onOpenChange(false);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Share a Moment
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          {!preview ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-accent/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-foreground font-medium">Drop an image here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full aspect-square object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Write a caption for your moment..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="resize-none bg-accent"
              rows={3}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!preview || isUploading}
              className="flex-1"
            >
              {isUploading ? 'Uploading...' : 'Share'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
