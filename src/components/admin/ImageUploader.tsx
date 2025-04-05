
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

type ImageUploaderProps = {
  onImageSelected: (imageUrl: string) => void;
  className?: string;
  folder?: string;
};

export const ImageUploader = ({ onImageSelected, className, folder = "general" }: ImageUploaderProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Hata",
        description: "Lütfen sadece görsel dosyaları yükleyin",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Hata",
        description: "Görsel boyutu 5MB'dan küçük olmalıdır",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Generate a unique filename
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `${folder}/${fileName}`;
      
      // Upload the image to Supabase Storage
      const { data, error } = await supabase.storage
        .from('website_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('website_images')
        .getPublicUrl(filePath);

      // Call the callback with the public URL
      onImageSelected(urlData.publicUrl);
      
      toast({
        title: "Başarılı",
        description: "Görsel başarıyla yüklendi",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Hata",
        description: `Görsel yüklenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`border ${isDragging ? 'border-primary border-dashed bg-primary/5' : 'border-dashed'} 
      rounded-md flex flex-col items-center justify-center p-6 transition-all ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
      <p className="text-sm text-center mb-2">
        Görsel yüklemek için sürükleyip bırakın veya tıklayın
      </p>
      <Button 
        variant="outline" 
        onClick={() => fileInputRef.current?.click()}
        type="button"
        disabled={isUploading}
      >
        {isUploading ? 'Yükleniyor...' : 'Görsel Seç'}
      </Button>
    </div>
  );
};
