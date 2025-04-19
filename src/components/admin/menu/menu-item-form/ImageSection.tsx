
import React from "react";
import { FormLabel } from "@/components/ui/form";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ImageSectionProps {
  imageUrl: string | null;
  onImageSelected: (url: string | null) => void;
}

export function ImageSection({ imageUrl, onImageSelected }: ImageSectionProps) {
  const handleRemoveImage = () => {
    onImageSelected(null);  // Set to null to remove the image
  };

  return (
    <div className="space-y-4">
      <FormLabel>Ürün Görseli</FormLabel>
      <div className="mb-4">
        <ImageUploader 
          onImageSelected={onImageSelected}
          folder="menu_items"
        />
      </div>
      
      {imageUrl && (
        <div className="mt-2 space-y-2">
          <div className="border rounded-md overflow-hidden w-full h-40">
            <img 
              src={imageUrl} 
              alt="Ürün Görseli" 
              className="w-full h-full object-cover"
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="text-destructive border-destructive hover:bg-destructive/10"
            onClick={handleRemoveImage}
          >
            <Trash className="mr-2 h-4 w-4" /> Görseli Kaldır
          </Button>
        </div>
      )}
    </div>
  );
}
