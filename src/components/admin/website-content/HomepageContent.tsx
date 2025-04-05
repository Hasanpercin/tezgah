
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Save } from "lucide-react";

type HomepageContentProps = {
  onSave: () => void;
};

export const HomepageContent = ({ onSave }: HomepageContentProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Anasayfa Hero Bölümü</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hero Başlık</label>
            <Input defaultValue="Lezzet Durağı'na Hoş Geldiniz" />
            
            <label className="block text-sm font-medium mb-1 mt-4">Hero Alt Başlık</label>
            <Input defaultValue="Eşsiz Lezzetler ve Unutulmaz Anlar" />
            
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
              src="/lovable-uploads/3c8b4a11-1461-48d3-97c1-2083985f8652.png" 
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
            <Input defaultValue="Taze Malzemeler" />
            <label className="block text-sm font-medium mt-2">Açıklama 1</label>
            <Textarea defaultValue="Günlük taze ve yerel malzemelerle hazırlanmış yemekler" rows={2} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Başlık 2</label>
            <Input defaultValue="Özel Tarifler" />
            <label className="block text-sm font-medium mt-2">Açıklama 2</label>
            <Textarea defaultValue="Şefimizin özel ve benzersiz tarifleriyle hazırlanan lezzetler" rows={2} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Başlık 3</label>
            <Input defaultValue="Konforlu Ortam" />
            <label className="block text-sm font-medium mt-2">Açıklama 3</label>
            <Textarea defaultValue="Rahat ve şık bir atmosferde unutulmaz bir yemek deneyimi" rows={2} />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onSave} className="flex items-center gap-2">
          <Save size={16} /> Değişiklikleri Kaydet
        </Button>
      </div>
    </div>
  );
};
