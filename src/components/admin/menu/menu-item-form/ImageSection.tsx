
import React from "react";
import { FormLabel } from "@/components/ui/form";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface ImageSectionProps {
  imageUrl: string | null;
  onImageSelected: (url: string) => void;
}

export function ImageSection({ imageUrl, onImageSelected }: ImageSectionProps) {
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
        <div className="mt-2">
          <div className="border rounded-md overflow-hidden w-full h-40">
            <img 
              src={imageUrl} 
              alt="Ürün Görseli" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
