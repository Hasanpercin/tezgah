
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "../ImageUploader";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Check } from "lucide-react";

interface HeaderImageData {
  id?: string;
  key: string;
  section: string;
  value: string;
  image_path?: string | null;
  updated_at?: string;
}

interface HeaderImagesContentProps {
  onSave: () => void;
}

export const HeaderImagesContent = ({ onSave }: HeaderImagesContentProps) => {
  const { toast } = useToast();
  const [headerImages, setHeaderImages] = useState<HeaderImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadHeaderImages();
  }, []);

  const loadHeaderImages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("website_content")
        .select("*")
        .in('section', ['profile_header', 'loyalty_header', 'gallery_header']);

      if (error) throw error;

      // If header images don't exist, create default entries
      if (!data || data.length === 0) {
        const defaultHeaders = [
          {
            section: "profile_header",
            key: "profile_header_image",
            value: "Profil Sayfası Header Görseli",
            image_path: null
          },
          {
            section: "loyalty_header",
            key: "loyalty_header_image",
            value: "Sadakat Sayfası Header Görseli",
            image_path: null
          },
          {
            section: "gallery_header",
            key: "gallery_header_image",
            value: "Galeri Sayfası Header Görseli",
            image_path: null
          }
        ];

        const { data: newData, error: insertError } = await supabase
          .from("website_content")
          .insert(defaultHeaders)
          .select();

        if (insertError) throw insertError;
        setHeaderImages(newData || []);
      } else {
        // Check if all required headers exist
        const sections = ['profile_header', 'loyalty_header', 'gallery_header'];
        const missingHeaders: HeaderImageData[] = [];
        
        sections.forEach(section => {
          if (!data.some(item => item.section === section)) {
            missingHeaders.push({
              section: section,
              key: `${section}_image`,
              value: `${section.charAt(0).toUpperCase() + section.slice(1).replace('_', ' ')} Görseli`,
              image_path: null
            });
          }
        });
        
        if (missingHeaders.length > 0) {
          const { data: newHeaders, error: insertError } = await supabase
            .from("website_content")
            .insert(missingHeaders)
            .select();
            
          if (insertError) throw insertError;
          
          setHeaderImages([...data, ...(newHeaders || [])]);
        } else {
          setHeaderImages(data);
        }
      }
    } catch (error: any) {
      console.error("Error loading header images:", error.message);
      toast({
        title: "Hata",
        description: "Header görsellerini yüklerken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelected = async (headerKey: string, imageUrl: string) => {
    try {
      setIsSaving((prev) => ({ ...prev, [headerKey]: true }));

      // Find the header item to update
      const headerToUpdate = headerImages.find(h => h.key === headerKey);
      
      if (headerToUpdate?.id) {
        console.log("Updating header image:", headerToUpdate.id, imageUrl);

        // Update the database record
        const { error: updateError } = await supabase
          .from("website_content")
          .update({ image_path: imageUrl })
          .eq("id", headerToUpdate.id);

        if (updateError) throw updateError;

        // Update local state
        setHeaderImages(prev => 
          prev.map(item => 
            item.key === headerKey ? { ...item, image_path: imageUrl } : item
          )
        );

        toast({
          title: "Başarılı",
          description: "Header görseli başarıyla güncellendi.",
        });
        
        if (onSave) onSave();
      }
    } catch (error: any) {
      console.error("Error updating header image:", error.message);
      toast({
        title: "Hata",
        description: "Header görselini güncellerken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSaving((prev) => ({ ...prev, [headerKey]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {headerImages.map((header) => {
          let sectionTitle = "Header Görseli";
          let sectionDescription = "Sayfada gösterilecek olan banner görseli";
          
          if (header.section === "profile_header") {
            sectionTitle = "Profil Sayfası Header Görseli";
            sectionDescription = "Profil sayfasında gösterilecek olan banner görseli";
          } else if (header.section === "loyalty_header") {
            sectionTitle = "Sadakat Sayfası Header Görseli";
            sectionDescription = "Sadakat sayfasında gösterilecek olan banner görseli";
          } else if (header.section === "gallery_header") {
            sectionTitle = "Galeri Sayfası Header Görseli";
            sectionDescription = "Galeri sayfasında gösterilecek olan banner görseli";
          }

          return (
            <Card key={header.key} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{sectionTitle}</CardTitle>
                <CardDescription>{sectionDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {header.image_path ? (
                    <div className="relative aspect-[3/1] rounded-md overflow-hidden border">
                      <img
                        src={header.image_path}
                        alt={sectionTitle}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-md flex items-center justify-center aspect-[3/1] bg-muted/30">
                      <p className="text-muted-foreground">
                        Henüz görsel yüklenmemiş
                      </p>
                    </div>
                  )}
                  
                  <ImageUploader
                    onImageSelected={(imageUrl) => handleImageSelected(header.key, imageUrl)}
                    accept="image/png, image/jpeg"
                    folder="header-images"
                  />
                  
                  <p className="text-xs text-muted-foreground">
                    * Önerilen görsel boyutları: 1920x640 piksel
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Son güncelleme: {new Date(header.updated_at || Date.now()).toLocaleString('tr-TR')}
                </p>
                {isSaving[header.key] && (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Kaydediliyor...</span>
                  </div>
                )}
                {!isSaving[header.key] && header.image_path && (
                  <div className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-2" />
                    <span>Görsel yüklendi</span>
                  </div>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
