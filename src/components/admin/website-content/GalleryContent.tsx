
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GalleryImage } from "../GalleryImage";
import { ImageUploader } from "../ImageUploader";
import { ImageEditDialog } from "../ImageEditDialog";
import { GalleryImageType } from "@/types/gallery";

type GalleryContentProps = {
  onSave: () => void;
};

// Mock initial gallery data
const initialGalleryImages: GalleryImageType[] = [
  {
    id: 1,
    src: "https://source.unsplash.com/random/300x300?food&sig=1",
    alt: "Gallery item 1",
    title: "Yemek 1",
    description: "Lezzetli menümüzden bir görsel",
  },
  {
    id: 2,
    src: "https://source.unsplash.com/random/300x300?food&sig=2",
    alt: "Gallery item 2",
    title: "Yemek 2",
    description: "Özel tarifimizle hazırlanmış lezzet",
  },
  {
    id: 3,
    src: "https://source.unsplash.com/random/300x300?food&sig=3",
    alt: "Gallery item 3",
    title: "Yemek 3",
  },
  {
    id: 4,
    src: "https://source.unsplash.com/random/300x300?food&sig=4",
    alt: "Gallery item 4",
  },
  {
    id: 5,
    src: "https://source.unsplash.com/random/300x300?food&sig=5",
    alt: "Gallery item 5",
  },
  {
    id: 6,
    src: "https://source.unsplash.com/random/300x300?food&sig=6",
    alt: "Gallery item 6",
  },
];

export const GalleryContent = ({ onSave }: GalleryContentProps) => {
  const { toast } = useToast();
  const [galleryImages, setGalleryImages] = useState<GalleryImageType[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditImage, setCurrentEditImage] = useState<GalleryImageType | null>(null);
  const [nextId, setNextId] = useState(7); // Start after our initial mock data

  // Initialize with mock data
  useEffect(() => {
    setGalleryImages(initialGalleryImages);
  }, []);

  const handleDeleteImage = (id: number) => {
    setGalleryImages(prev => prev.filter(img => img.id !== id));
    toast({
      title: "Görsel Silindi",
      description: "Görsel başarıyla silindi",
    });
  };

  const handleEditImage = (id: number) => {
    const image = galleryImages.find(img => img.id === id);
    if (image) {
      setCurrentEditImage(image);
      setEditDialogOpen(true);
    }
  };

  const handleSaveImage = (editedImage: GalleryImageType) => {
    setGalleryImages(prev => 
      prev.map(img => img.id === editedImage.id ? editedImage : img)
    );
    toast({
      title: "Görsel Güncellendi",
      description: "Görsel detayları başarıyla güncellendi",
    });
  };

  const handleNewImage = (file: File, previewUrl: string) => {
    const newImage: GalleryImageType = {
      id: nextId,
      src: previewUrl,
      alt: file.name.split('.')[0], // Use filename as alt text initially
      title: file.name.split('.')[0], // Use filename as title initially
    };
    
    setGalleryImages(prev => [...prev, newImage]);
    setNextId(prev => prev + 1);
    
    toast({
      title: "Görsel Yüklendi",
      description: "Yeni görsel başarıyla eklendi",
    });
  };

  const handleSaveChanges = () => {
    // Here you would typically save to a backend
    onSave();
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Galeri Yönetimi</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {galleryImages.map((image) => (
          <GalleryImage
            key={image.id}
            id={image.id}
            src={image.src}
            alt={image.alt || `Gallery item ${image.id}`}
            onDelete={handleDeleteImage}
            onEdit={handleEditImage}
          />
        ))}
        
        <div className="border border-dashed rounded-md flex flex-col items-center justify-center aspect-square">
          <ImageUploader
            onImageSelected={handleNewImage}
            className="h-full w-full"
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveChanges} className="flex items-center gap-2">
          <Save size={16} /> Değişiklikleri Kaydet
        </Button>
      </div>

      <ImageEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        image={currentEditImage}
        onSave={handleSaveImage}
      />
    </div>
  );
};
