
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileEdit, ImageIcon, Save } from "lucide-react";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { Skeleton } from "@/components/ui/skeleton";

type AboutContentProps = {
  onSave: () => void;
};

export const AboutContent = ({ onSave }: AboutContentProps) => {
  const { content, isLoading, updateMultipleContent } = useWebsiteContent('about');

  const [formValues, setFormValues] = useState({
    page_title: '',
    story_text: '',
    mission_text: '',
    vision_text: '',
    image: '',
    team_member_1_name: '',
    team_member_1_title: '',
    team_member_2_name: '',
    team_member_2_title: '',
  });

  useEffect(() => {
    if (!isLoading && Object.keys(content).length > 0) {
      setFormValues({
        page_title: content.page_title || '',
        story_text: content.story_text || '',
        mission_text: content.mission_text || '',
        vision_text: content.vision_text || '',
        image: content.image || '',
        team_member_1_name: content.team_member_1_name || '',
        team_member_1_title: content.team_member_1_title || '',
        team_member_2_name: content.team_member_2_name || '',
        team_member_2_title: content.team_member_2_title || '',
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
      console.error("Error saving about content:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
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
      <div>
        <h3 className="text-lg font-medium mb-4">Hakkımızda Sayfası</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sayfa Başlığı</label>
            <Input 
              value={formValues.page_title} 
              onChange={(e) => handleChange('page_title', e.target.value)}
            />
            
            <label className="block text-sm font-medium mb-1 mt-4">Hikayemiz Metni</label>
            <Textarea 
              value={formValues.story_text}
              onChange={(e) => handleChange('story_text', e.target.value)}
              rows={5}
            />
            
            <label className="block text-sm font-medium mb-1 mt-4">Misyonumuz Metni</label>
            <Textarea 
              value={formValues.mission_text}
              onChange={(e) => handleChange('mission_text', e.target.value)}
              rows={3}
            />
            
            <label className="block text-sm font-medium mb-1 mt-4">Vizyonumuz Metni</label>
            <Textarea 
              value={formValues.vision_text}
              onChange={(e) => handleChange('vision_text', e.target.value)}
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
                src={formValues.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop"} 
                alt="Hakkımızda görsel önizleme" 
                className="w-full h-auto"
              />
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Ekip Üyelerimiz</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {formValues.team_member_1_name
                        .split(' ')
                        .map(part => part[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input 
                      value={formValues.team_member_1_name} 
                      onChange={(e) => handleChange('team_member_1_name', e.target.value)}
                      placeholder="İsim" 
                      className="mb-1" 
                    />
                    <Input 
                      value={formValues.team_member_1_title}
                      onChange={(e) => handleChange('team_member_1_title', e.target.value)}
                      placeholder="Ünvan" 
                    />
                  </div>
                  <Button variant="ghost" size="sm">
                    <FileEdit size={16} />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {formValues.team_member_2_name
                        .split(' ')
                        .map(part => part[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input 
                      value={formValues.team_member_2_name}
                      onChange={(e) => handleChange('team_member_2_name', e.target.value)}
                      placeholder="İsim" 
                      className="mb-1" 
                    />
                    <Input 
                      value={formValues.team_member_2_title}
                      onChange={(e) => handleChange('team_member_2_title', e.target.value)}
                      placeholder="Ünvan" 
                    />
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
        <Button onClick={handleSaveChanges} className="flex items-center gap-2">
          <Save size={16} /> Değişiklikleri Kaydet
        </Button>
      </div>
    </div>
  );
};
