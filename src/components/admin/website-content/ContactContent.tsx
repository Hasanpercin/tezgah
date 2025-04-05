
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Save } from "lucide-react";

type ContactContentProps = {
  onSave: () => void;
};

export const ContactContent = ({ onSave }: ContactContentProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">İletişim Bilgileri</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-muted-foreground" />
            <label className="block text-sm font-medium">Adres Bilgisi</label>
          </div>
          <Textarea 
            defaultValue="Atatürk Mahallesi, Gazi Bulvarı No: 123, İstanbul, Türkiye" 
            rows={3}
          />
          
          <div className="flex items-center gap-2">
            <Phone size={18} className="text-muted-foreground" />
            <label className="block text-sm font-medium">Telefon Numarası</label>
          </div>
          <Input defaultValue="+90 (212) 123 45 67" />
          
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-muted-foreground" />
            <label className="block text-sm font-medium">E-posta Adresi</label>
          </div>
          <Input defaultValue="info@lezzetduragi.com" />
          
          <div className="pt-2">
            <h4 className="font-medium mb-2">Çalışma Saatleri</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <Input defaultValue="Pazartesi - Cuma" />
              <Input defaultValue="11:00 - 22:00" />
              <Input defaultValue="Cumartesi - Pazar" />
              <Input defaultValue="10:00 - 23:00" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-muted-foreground" />
            <label className="block text-sm font-medium">Google Maps Konumu</label>
          </div>
          <div className="border rounded-md p-2 bg-muted/30">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Google Maps iframe kodu yapıştırılacak</p>
            </div>
            <Textarea 
              className="mt-2" 
              placeholder="Google Maps embed kodunu buraya yapıştırın"
              rows={3}
            />
          </div>
          
          <div className="pt-2">
            <h4 className="font-medium mb-2">Sosyal Medya Bağlantıları</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium w-24">Instagram:</span>
                <Input defaultValue="instagram.com/lezzetduragi" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium w-24">Facebook:</span>
                <Input defaultValue="facebook.com/lezzetduragi" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium w-24">Twitter:</span>
                <Input defaultValue="twitter.com/lezzetduragi" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button onClick={onSave} className="flex items-center gap-2">
          <Save size={16} /> Değişiklikleri Kaydet
        </Button>
      </div>
    </div>
  );
};
