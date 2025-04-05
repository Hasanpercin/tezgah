
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Save } from "lucide-react";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { Skeleton } from "@/components/ui/skeleton";

type ContactContentProps = {
  onSave: () => void;
};

export const ContactContent = ({ onSave }: ContactContentProps) => {
  const { content, isLoading, updateMultipleContent } = useWebsiteContent('contact');

  const [formValues, setFormValues] = useState({
    address: '',
    phone: '',
    email: '',
    hours_weekday_label: '',
    hours_weekday_value: '',
    hours_weekend_label: '',
    hours_weekend_value: '',
    maps_embed: '',
    instagram: '',
    facebook: '',
    twitter: '',
  });

  useEffect(() => {
    if (!isLoading && Object.keys(content).length > 0) {
      setFormValues({
        address: content.address || '',
        phone: content.phone || '',
        email: content.email || '',
        hours_weekday_label: content.hours_weekday_label || '',
        hours_weekday_value: content.hours_weekday_value || '',
        hours_weekend_label: content.hours_weekend_label || '',
        hours_weekend_value: content.hours_weekend_value || '',
        maps_embed: content.maps_embed || '',
        instagram: content.instagram || '',
        facebook: content.facebook || '',
        twitter: content.twitter || '',
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
      console.error("Error saving contact content:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

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
            value={formValues.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
          />
          
          <div className="flex items-center gap-2">
            <Phone size={18} className="text-muted-foreground" />
            <label className="block text-sm font-medium">Telefon Numarası</label>
          </div>
          <Input 
            value={formValues.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-muted-foreground" />
            <label className="block text-sm font-medium">E-posta Adresi</label>
          </div>
          <Input 
            value={formValues.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          
          <div className="pt-2">
            <h4 className="font-medium mb-2">Çalışma Saatleri</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <Input 
                value={formValues.hours_weekday_label}
                onChange={(e) => handleChange('hours_weekday_label', e.target.value)}
              />
              <Input 
                value={formValues.hours_weekday_value}
                onChange={(e) => handleChange('hours_weekday_value', e.target.value)}
              />
              <Input 
                value={formValues.hours_weekend_label}
                onChange={(e) => handleChange('hours_weekend_label', e.target.value)}
              />
              <Input 
                value={formValues.hours_weekend_value}
                onChange={(e) => handleChange('hours_weekend_value', e.target.value)}
              />
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
              {formValues.maps_embed ? (
                <div dangerouslySetInnerHTML={{ __html: formValues.maps_embed }} />
              ) : (
                <p className="text-sm text-muted-foreground">Google Maps iframe kodu yapıştırılacak</p>
              )}
            </div>
            <Textarea 
              className="mt-2" 
              placeholder="Google Maps embed kodunu buraya yapıştırın"
              value={formValues.maps_embed}
              onChange={(e) => handleChange('maps_embed', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="pt-2">
            <h4 className="font-medium mb-2">Sosyal Medya Bağlantıları</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium w-24">Instagram:</span>
                <Input 
                  value={formValues.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium w-24">Facebook:</span>
                <Input 
                  value={formValues.facebook}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium w-24">Twitter:</span>
                <Input 
                  value={formValues.twitter}
                  onChange={(e) => handleChange('twitter', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button onClick={handleSaveChanges} className="flex items-center gap-2">
          <Save size={16} /> Değişiklikleri Kaydet
        </Button>
      </div>
    </div>
  );
};
