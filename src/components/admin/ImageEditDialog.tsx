
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./ImageUploader";
import { GalleryImageType } from "@/types/gallery";

type ImageEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: GalleryImageType | null;
  onSave: (image: GalleryImageType) => void;
};

export const ImageEditDialog = ({ 
  open, 
  onOpenChange, 
  image, 
  onSave 
}: ImageEditDialogProps) => {
  const [editedImage, setEditedImage] = useState<GalleryImageType | null>(image);
  const [showImageUploader, setShowImageUploader] = useState(false);
  
  // Update local state when the image prop changes
  useEffect(() => {
    setEditedImage(image);
    setShowImageUploader(false);
  }, [image]);
  
  const handleSave = () => {
    if (editedImage) {
      onSave(editedImage);
      onOpenChange(false);
    }
  };

  const handleImageSelected = (imageUrl: string) => {
    if (editedImage) {
      setEditedImage({
        ...editedImage,
        src: imageUrl,
      });
      setShowImageUploader(false);
    }
  };

  if (!editedImage) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Görsel Düzenle</DialogTitle>
          <DialogDescription>
            Görsel detaylarını buradan düzenleyebilirsiniz.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image-title">Başlık</Label>
            <Input
              id="image-title"
              value={editedImage.title || ''}
              onChange={(e) => setEditedImage({...editedImage, title: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="image-alt">Alt Metin</Label>
            <Input
              id="image-alt"
              value={editedImage.alt || ''}
              onChange={(e) => setEditedImage({...editedImage, alt: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="image-description">Açıklama</Label>
            <Textarea
              id="image-description"
              value={editedImage.description || ''}
              onChange={(e) => setEditedImage({...editedImage, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Görsel</Label>
            {showImageUploader ? (
              <ImageUploader 
                onImageSelected={handleImageSelected}
                folder="gallery"
              />
            ) : (
              <div className="space-y-2">
                <div className="flex justify-center mb-4">
                  <img 
                    src={editedImage.src} 
                    alt={editedImage.alt || 'Preview'} 
                    className="max-h-48 object-contain rounded-md"
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowImageUploader(true)}
                >
                  Görseli Değiştir
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button type="button" onClick={handleSave}>
            Kaydet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
