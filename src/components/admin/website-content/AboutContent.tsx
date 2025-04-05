
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileEdit, ImageIcon, Save } from "lucide-react";

type AboutContentProps = {
  onSave: () => void;
};

export const AboutContent = ({ onSave }: AboutContentProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-4">Hakkımızda Sayfası</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sayfa Başlığı</label>
            <Input defaultValue="Hikayemiz" />
            
            <label className="block text-sm font-medium mb-1 mt-4">Hikayemiz Metni</label>
            <Textarea 
              defaultValue="2010 yılında küçük bir aile işletmesi olarak başlayan Lezzet Durağı, yıllar içinde müşterilerinin desteği ve kaliteden ödün vermeyen anlayışıyla bugünlere geldi. Kurucumuz Ahmet Şef, Akdeniz ve Ege mutfağının eşsiz lezzetlerini modern dokunuşlarla birleştirerek özgün bir mutfak yarattı." 
              rows={5}
            />
            
            <label className="block text-sm font-medium mb-1 mt-4">Misyonumuz Metni</label>
            <Textarea 
              defaultValue="Misyonumuz, taze ve kaliteli malzemelerle hazırlanan lezzetleri, samimi bir ortamda misafirlerimize sunmak ve her ziyaretlerinde unutulmaz bir deneyim yaşatmaktır." 
              rows={3}
            />
            
            <label className="block text-sm font-medium mb-1 mt-4">Vizyonumuz Metni</label>
            <Textarea 
              defaultValue="Vizyonumuz, Türk mutfağını en iyi şekilde temsil ederek, hem yerel hem de uluslararası misafirlerimize benzersiz lezzetler sunmak ve gastronomi dünyasında saygın bir yer edinmektir." 
              rows={3}
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hakkımızda Sayfası Görseli</label>
              <div className="flex gap-2 items-center">
                <Button variant="outline" className="flex items-center gap-2">
                  <ImageIcon size={16} /> Görsel Seç
                </Button>
                <span className="text-xs text-muted-foreground">Önerilen boyut: 1200x800px</span>
              </div>
            </div>
            <div className="border rounded-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop" 
                alt="Hakkımızda görsel önizleme" 
                className="w-full h-auto"
              />
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Ekip Üyelerimiz</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>AY</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input defaultValue="Ahmet Yılmaz" placeholder="İsim" className="mb-1" />
                    <Input defaultValue="Kurucu Şef" placeholder="Ünvan" />
                  </div>
                  <Button variant="ghost" size="sm">
                    <FileEdit size={16} />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>MD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input defaultValue="Mehmet Demir" placeholder="İsim" className="mb-1" />
                    <Input defaultValue="Şef" placeholder="Ünvan" />
                  </div>
                  <Button variant="ghost" size="sm">
                    <FileEdit size={16} />
                  </Button>
                </div>
                
                <div className="flex items-center justify-center">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <FileEdit size={14} /> Yeni Ekip Üyesi Ekle
                  </Button>
                </div>
              </div>
            </div>
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
