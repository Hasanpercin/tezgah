
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GalleryImage } from "../GalleryImage";
import { ImageUploader } from "../ImageUploader";
import { ImageEditDialog } from "../ImageEditDialog";
import { GalleryImageType } from "@/types/gallery";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { supabase } from "@/integrations/supabase/client";

type GalleryContentProps = {
  onSave: () => void;
};

export const GalleryContent = ({ onSave }: GalleryContentProps) => {
  const { toast } = useToast();
  const { content, isLoading, updateContent, updateMultipleContent } = useWebsiteContent('gallery');
  
  const [galleryImages, setGalleryImages] = useState<GalleryImageType[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditImage, setCurrentEditImage] = useState<GalleryImageType | null>(null);
  const [nextId, setNextId] = useState(1);
  const [showUploader, setShowUploader] = useState(false);

  // Load gallery images from content
  useEffect(() => {
    if (!isLoading && content) {
      try {
        // Try to parse the gallery_images JSON string if it exists
        const savedImages = content.gallery_images ? JSON.parse(content.gallery_images) : [];
        if (Array.isArray(savedImages) && savedImages.length > 0) {
          setGalleryImages(savedImages);
          // Find the highest ID to set nextId properly
          const highestId = Math.max(...savedImages.map(img => img.id));
          setNextId(highestId + 1);
        }
      } catch (error) {
        console.error("Error parsing gallery images:", error);
        setGalleryImages([]);
      }
    }
  }, [content, isLoading]);

  const handleDeleteImage = async (id: number) => {
    // Find the image to get its URL
    const imageToDelete = galleryImages.find(img => img.id === id);
    if (!imageToDelete || !imageToDelete.src) return;

    try {
      // Extract the file path from the URL
      const url = new URL(imageToDelete.src);
      const filePath = url.pathname.split('/').slice(3).join('/');

      if (filePath) {
        // Delete the file from Supabase Storage
        const { error: deleteError } = await supabase.storage
          .from('website_images')
          .remove([filePath]);

        if (deleteError) {
          throw deleteError;
        }
      }

      // Update the gallery images state
      const updatedImages = galleryImages.filter(img => img.id !== id);
      setGalleryImages(updatedImages);
      
      // Save the updated gallery images to the database
      await updateContent('gallery_images', JSON.stringify(updatedImages));
      
      toast({
        title: "Görsel Silindi",
        description: "Görsel başarıyla silindi",
      });
    } catch (error: any) {
      console.error("Error deleting image:", error);
      toast({
        title: "Hata",
        description: `Görsel silinirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditImage = (id: number) => {
    const image = galleryImages.find(img => img.id === id);
    if (image) {
      setCurrentEditImage(image);
      setEditDialogOpen(true);
    }
  };

  const handleSaveImage = async (editedImage: GalleryImageType) => {
    const updatedImages = galleryImages.map(img => 
      img.id === editedImage.id ? editedImage : img
    );
    
    setGalleryImages(updatedImages);
    
    try {
      // Save the updated gallery images to the database
      await updateContent('gallery_images', JSON.stringify(updatedImages));
      
      toast({
        title: "Görsel Güncellendi",
        description: "Görsel detayları başarıyla güncellendi",
      });
    } catch (error: any) {
      console.error("Error updating image:", error);
      toast({
        title: "Hata",
        description: `Görsel güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleNewImage = async (imageUrl: string) => {
    const newImage: GalleryImageType = {
      id: nextId,
      src: imageUrl,
      alt: `Gallery image ${nextId}`,
      title: `Galeri Görsel ${nextId}`,
    };
    
    const updatedImages = [...galleryImages, newImage];
    setGalleryImages(updatedImages);
    setNextId(prevId => prevId + 1);
    setShowUploader(false);
    
    try {
      // Save the updated gallery images to the database
      await updateContent('gallery_images', JSON.stringify(updatedImages));
      
      toast({
        title: "Görsel Yüklendi",
        description: "Yeni görsel başarıyla eklendi",
      });
    } catch (error: any) {
      console.error("Error adding new image:", error);
      toast({
        title: "Hata",
        description: `Görsel eklenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Save gallery settings if needed
      const settings = {
        gallery_title: content.gallery_title || "Galeri",
        gallery_subtitle: content.gallery_subtitle || "Atmosferimiz ve lezzetlerimizden kareler",
        gallery_images: JSON.stringify(galleryImages)
      };
      
      await updateMultipleContent(settings);
      onSave();
      
      toast({
        title: "Değişiklikler Kaydedildi",
        description: "Galeri başarıyla güncellendi",
      });
    } catch (error: any) {
      console.error("Error saving gallery changes:", error);
      toast({
        title: "Hata",
        description: `Değişiklikler kaydedilirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Galeri Yönetimi</h3>
        </div>
        <div className="h-64 flex items-center justify-center border rounded-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Galeri Yönetimi</h3>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowUploader(!showUploader)}
            className="flex items-center gap-2"
          >
            <Plus size={16} /> Yeni Görsel Ekle
          </Button>
          <Button onClick={handleSaveChanges} className="flex items-center gap-2">
            <Save size={16} /> Değişiklikleri Kaydet
          </Button>
        </div>
      </div>
      
      {showUploader && (
        <div className="mb-4">
          <ImageUploader
            onImageSelected={handleNewImage}
            folder="gallery"
          />
        </div>
      )}
      
      <div className="border p-4 rounded-md mb-4">
        <h4 className="font-medium mb-2">Galeri Ayarları</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Galeri Başlık</label>
            <Input 
              value={content.gallery_title || "Galeri"}
              onChange={(e) => updateContent('gallery_title', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Galeri Alt Başlık</label>
            <Input 
              value={content.gallery_subtitle || "Atmosferimiz ve lezzetlerimizden kareler"}
              onChange={(e) => updateContent('gallery_subtitle', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {galleryImages.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-md">
          <p className="text-muted-foreground mb-4">Henüz hiç görsel eklenmemiş</p>
          <Button 
            variant="outline" 
            onClick={() => setShowUploader(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} /> İlk Görseli Ekle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {galleryImages.map((image) => (
            <div key={image.id} className="border rounded-md overflow-hidden group relative">
              <img 
                src={image.src} 
                alt={image.alt || `Gallery image ${image.id}`}
                className="w-full aspect-square object-cover" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleEditImage(image.id)}
                >
                  Düzenle
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteImage(image.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              {image.title && (
                <div className="p-2 bg-muted/80 absolute bottom-0 w-full text-sm font-medium truncate">
                  {image.title}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <ImageEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        image={currentEditImage}
        onSave={handleSaveImage}
      />
    </div>
  );
};

function Input({ value, onChange, className = '' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-input rounded-md ${className}`}
    />
  );
}
