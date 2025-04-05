
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Save } from "lucide-react";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { Skeleton } from "@/components/ui/skeleton";

type HomepageContentProps = {
  onSave: () => void;
};

export const HomepageContent = ({ onSave }: HomepageContentProps) => {
  const { content, isLoading, updateMultipleContent } = useWebsiteContent('homepage');
  
  const [formValues, setFormValues] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_image: '',
    feature_title_1: '',
    feature_desc_1: '',
    feature_title_2: '',
    feature_desc_2: '',
    feature_title_3: '',
    feature_desc_3: '',
  });

  useEffect(() => {
    if (!isLoading && Object.keys(content).length > 0) {
      setFormValues({
        hero_title: content.hero_title || '',
        hero_subtitle: content.hero_subtitle || '',
        hero_image: content.hero_image || '',
        feature_title_1: content.feature_title_1 || '',
        feature_desc_1: content.feature_desc_1 || '',
        feature_title_2: content.feature_title_2 || '',
        feature_desc_2: content.feature_desc_2 || '',
        feature_title_3: content.feature_title_3 || '',
        feature_desc_3: content.feature_desc_3 || '',
      });
    }
  }, [content, isLoading]);

  const handleChange = (key: keyof typeof formValues, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await updateMultipleContent(formValues);
      onSave();
    } catch (error) {
      console.error("Error saving homepage content:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
        <div className="pt-4 border-t">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Anasayfa Hero Bölümü</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hero Başlık</label>
            <Input 
              value={formValues.hero_title} 
              onChange={(e) => handleChange('hero_title', e.target.value)}
            />
            
            <label className="block text-sm font-medium mb-1 mt-4">Hero Alt Başlık</label>
            <Input 
              value={formValues.hero_subtitle}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
            />
            
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Hero Arkaplan Görseli</label>
              <div className="flex gap-2 items-center">
                <Button variant="outline" className="flex items-center gap-2">
                  <ImageIcon size={16} /> Görsel Seç
                </Button>
                <span className="text-xs text-muted-foreground">Önerilen boyut: 1920x1080px</span>
              </div>
            </div>
          </div>
          <div className="border rounded-md p-4 bg-muted/50">
            <img 
              src={formValues.hero_image || "/lovable-uploads/3c8b4a11-1461-48d3-97c1-2083985f8652.png"} 
              alt="Hero önizleme" 
              className="rounded-md w-full h-auto" 
            />
            <p className="text-xs text-center mt-2 text-muted-foreground">Hero Görsel Önizleme</p>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-4">Öne Çıkan Bölüm</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Başlık 1</label>
            <Input 
              value={formValues.feature_title_1}
              onChange={(e) => handleChange('feature_title_1', e.target.value)}
            />
            <label className="block text-sm font-medium mt-2">Açıklama 1</label>
            <Textarea 
              value={formValues.feature_desc_1}
              onChange={(e) => handleChange('feature_desc_1', e.target.value)}
              rows={2} 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Başlık 2</label>
            <Input 
              value={formValues.feature_title_2}
              onChange={(e) => handleChange('feature_title_2', e.target.value)}
            />
            <label className="block text-sm font-medium mt-2">Açıklama 2</label>
            <Textarea 
              value={formValues.feature_desc_2}
              onChange={(e) => handleChange('feature_desc_2', e.target.value)}
              rows={2} 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Başlık 3</label>
            <Input 
              value={formValues.feature_title_3}
              onChange={(e) => handleChange('feature_title_3', e.target.value)}
            />
            <label className="block text-sm font-medium mt-2">Açıklama 3</label>
            <Textarea 
              value={formValues.feature_desc_3}
              onChange={(e) => handleChange('feature_desc_3', e.target.value)}
              rows={2} 
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveChanges} className="flex items-center gap-2">
          <Save size={16} /> Değişiklikleri Kaydet
        </Button>
      </div>
    </div>
  );
};
