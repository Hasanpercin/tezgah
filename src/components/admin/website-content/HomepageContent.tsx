
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
    feature_section_title: '',
    feature_section_description: '',
    feature_button_text: '',
    feature_title_1: '',
    feature_desc_1: '',
    feature_title_2: '',
    feature_desc_2: '',
    feature_title_3: '',
    feature_desc_3: '',
    about_title: '',
    about_text_1: '',
    about_text_2: '',
    about_button_text: '',
    atmosphere_title: '',
    atmosphere_description: '',
    gallery_button_text: '',
    reservation_title: '',
    reservation_description: '',
    reservation_button_text: '',
    reservation_bg_image: '',
  });

  useEffect(() => {
    if (!isLoading && Object.keys(content).length > 0) {
      setFormValues({
        hero_title: content.hero_title || '',
        hero_subtitle: content.hero_subtitle || '',
        hero_image: content.hero_image || '',
        feature_section_title: content.feature_section_title || '',
        feature_section_description: content.feature_section_description || '',
        feature_button_text: content.feature_button_text || '',
        feature_title_1: content.feature_title_1 || '',
        feature_desc_1: content.feature_desc_1 || '',
        feature_title_2: content.feature_title_2 || '',
        feature_desc_2: content.feature_desc_2 || '',
        feature_title_3: content.feature_title_3 || '',
        feature_desc_3: content.feature_desc_3 || '',
        about_title: content.about_title || '',
        about_text_1: content.about_text_1 || '',
        about_text_2: content.about_text_2 || '',
        about_button_text: content.about_button_text || '',
        atmosphere_title: content.atmosphere_title || '',
        atmosphere_description: content.atmosphere_description || '',
        gallery_button_text: content.gallery_button_text || '',
        reservation_title: content.reservation_title || '',
        reservation_description: content.reservation_description || '',
        reservation_button_text: content.reservation_button_text || '',
        reservation_bg_image: content.reservation_bg_image || '',
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
              <Input 
                value={formValues.hero_image}
                onChange={(e) => handleChange('hero_image', e.target.value)}
                placeholder="Görsel URL'si"
              />
              <p className="text-xs text-muted-foreground mt-1">Önerilen boyut: 1920x1080px</p>
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
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bölüm Başlığı</label>
            <Input 
              value={formValues.feature_section_title}
              onChange={(e) => handleChange('feature_section_title', e.target.value)}
              placeholder="Öne Çıkan Lezzetler"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bölüm Açıklaması</label>
            <Input 
              value={formValues.feature_section_description}
              onChange={(e) => handleChange('feature_section_description', e.target.value)}
              placeholder="Şefimizin özenle hazırladığı özel tarifler ve mevsimlik lezzetler"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Buton Metni</label>
            <Input 
              value={formValues.feature_button_text}
              onChange={(e) => handleChange('feature_button_text', e.target.value)}
              placeholder="Tüm Menüyü Gör"
            />
          </div>
        </div>
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
      
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-4">Hakkımızda Bölümü</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Başlık</label>
              <Input 
                value={formValues.about_title}
                onChange={(e) => handleChange('about_title', e.target.value)}
                placeholder="Lezzet Durağı'na Hoş Geldiniz"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Metin 1</label>
              <Textarea 
                value={formValues.about_text_1}
                onChange={(e) => handleChange('about_text_1', e.target.value)}
                placeholder="2010 yılından beri İstanbul'un kalbinde, geleneksel tatları modern sunumlarla buluşturuyoruz."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Metin 2</label>
              <Textarea 
                value={formValues.about_text_2}
                onChange={(e) => handleChange('about_text_2', e.target.value)}
                placeholder="Taze ve mevsimsel malzemelerle hazırlanan özel tariflerimiz, şeflerimizin yaratıcı dokunuşları ve sıcak atmosferimizle unutulmaz bir yemek deneyimi sunuyoruz."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Buton Metni</label>
              <Input 
                value={formValues.about_button_text}
                onChange={(e) => handleChange('about_button_text', e.target.value)}
                placeholder="Daha Fazla Bilgi"
              />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium">Hakkımızda Görsel Önizlemeleri</p>
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Varsayılan görseller kullanılacak</p>
            </div>
            <p className="text-xs text-muted-foreground">Not: Hakkımızda sayfası içinden görselleri düzenleyebilirsiniz</p>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-4">Atmosfer Bölümü</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Başlık</label>
            <Input 
              value={formValues.atmosphere_title}
              onChange={(e) => handleChange('atmosphere_title', e.target.value)}
              placeholder="Restoran Atmosferi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Açıklama</label>
            <Input 
              value={formValues.atmosphere_description}
              onChange={(e) => handleChange('atmosphere_description', e.target.value)}
              placeholder="Sıcak ve konforlu ambiyansımızda unutulmaz anlar yaşayın"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Buton Metni</label>
            <Input 
              value={formValues.gallery_button_text}
              onChange={(e) => handleChange('gallery_button_text', e.target.value)}
              placeholder="Galeriyi Gör"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-4">Rezervasyon CTA</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Başlık</label>
              <Input 
                value={formValues.reservation_title}
                onChange={(e) => handleChange('reservation_title', e.target.value)}
                placeholder="Rezervasyon Yaptırın"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Açıklama</label>
              <Textarea 
                value={formValues.reservation_description}
                onChange={(e) => handleChange('reservation_description', e.target.value)}
                placeholder="Özel anlarınızı unutulmaz kılmak ve lezzetli bir deneyim yaşamak için hemen rezervasyon yapın."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Buton Metni</label>
              <Input 
                value={formValues.reservation_button_text}
                onChange={(e) => handleChange('reservation_button_text', e.target.value)}
                placeholder="Rezervasyon Yap"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Arkaplan Görseli</label>
              <Input 
                value={formValues.reservation_bg_image}
                onChange={(e) => handleChange('reservation_bg_image', e.target.value)}
                placeholder="Görsel URL'si"
              />
              <p className="text-xs text-muted-foreground mt-1">Önerilen boyut: 1920x1080px</p>
            </div>
          </div>
          <div className="border rounded-md overflow-hidden">
            <div className="aspect-video bg-cover bg-center" style={{
              backgroundImage: `url(${formValues.reservation_bg_image || "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=500"})`,
            }}>
            </div>
            <p className="text-xs text-center p-2 text-muted-foreground">Rezervasyon CTA Arkaplan Önizleme</p>
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

