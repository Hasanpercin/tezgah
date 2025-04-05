
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileEdit, ImageIcon, Save } from "lucide-react";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUploader } from "../ImageUploader";

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
    team_member_1_image: '',
    team_member_2_name: '',
    team_member_2_title: '',
    team_member_2_image: '',
    team_member_3_name: '',
    team_member_3_title: '',
    team_member_3_image: '',
  });

  const [showTeamMember3, setShowTeamMember3] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

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
        team_member_1_image: content.team_member_1_image || '',
        team_member_2_name: content.team_member_2_name || '',
        team_member_2_title: content.team_member_2_title || '',
        team_member_2_image: content.team_member_2_image || '',
        team_member_3_name: content.team_member_3_name || '',
        team_member_3_title: content.team_member_3_title || '',
        team_member_3_image: content.team_member_3_image || '',
      });
      
      setShowTeamMember3(!!content.team_member_3_name);
    }
  }, [content, isLoading]);

  const handleChange = (key: keyof typeof formValues, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageSelected = (imageUrl: string, imageType: string) => {
    setUploadingImage(null);
    handleChange(imageType as keyof typeof formValues, imageUrl);
  };

  const handleSaveChanges = async () => {
    try {
      await updateMultipleContent(formValues);
      onSave();
    } catch (error) {
      console.error("Error saving about content:", error);
    }
  };

  const addTeamMember = () => {
    setShowTeamMember3(true);
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
              {uploadingImage === 'image' ? (
                <ImageUploader 
                  onImageSelected={(url) => handleImageSelected(url, 'image')} 
                  folder="about"
                />
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2" 
                      onClick={() => setUploadingImage('image')}
                    >
                      <ImageIcon size={16} /> Görsel Seç
                    </Button>
                    <span className="text-xs text-muted-foreground">Önerilen boyut: 1200x800px</span>
                  </div>
                  {formValues.image && (
                    <div className="border rounded-md overflow-hidden">
                      <img 
                        src={formValues.image} 
                        alt="Hakkımızda görsel önizleme" 
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Ekip Üyelerimiz</h4>
              <div className="space-y-4">
                {/* Team Member 1 */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    {uploadingImage === 'team_member_1_image' ? (
                      <div className="w-12 h-12 flex items-center justify-center bg-muted">
                        <span className="text-xs">...</span>
                      </div>
                    ) : formValues.team_member_1_image ? (
                      <AvatarImage src={formValues.team_member_1_image} alt={formValues.team_member_1_name} />
                    ) : (
                      <AvatarFallback>
                        {formValues.team_member_1_name
                          .split(' ')
                          .map(part => part[0])
                          .join('')
                          .toUpperCase() || 'U1'}
                      </AvatarFallback>
                    )}
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setUploadingImage('team_member_1_image')}
                  >
                    <FileEdit size={16} />
                  </Button>
                </div>
                
                {uploadingImage === 'team_member_1_image' && (
                  <ImageUploader 
                    onImageSelected={(url) => handleImageSelected(url, 'team_member_1_image')} 
                    folder="team"
                  />
                )}
                
                {/* Team Member 2 */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    {uploadingImage === 'team_member_2_image' ? (
                      <div className="w-12 h-12 flex items-center justify-center bg-muted">
                        <span className="text-xs">...</span>
                      </div>
                    ) : formValues.team_member_2_image ? (
                      <AvatarImage src={formValues.team_member_2_image} alt={formValues.team_member_2_name} />
                    ) : (
                      <AvatarFallback>
                        {formValues.team_member_2_name
                          .split(' ')
                          .map(part => part[0])
                          .join('')
                          .toUpperCase() || 'U2'}
                      </AvatarFallback>
                    )}
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setUploadingImage('team_member_2_image')}
                  >
                    <FileEdit size={16} />
                  </Button>
                </div>
                
                {uploadingImage === 'team_member_2_image' && (
                  <ImageUploader 
                    onImageSelected={(url) => handleImageSelected(url, 'team_member_2_image')} 
                    folder="team"
                  />
                )}
                
                {/* Team Member 3 (Optional) */}
                {showTeamMember3 && (
                  <>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        {uploadingImage === 'team_member_3_image' ? (
                          <div className="w-12 h-12 flex items-center justify-center bg-muted">
                            <span className="text-xs">...</span>
                          </div>
                        ) : formValues.team_member_3_image ? (
                          <AvatarImage src={formValues.team_member_3_image} alt={formValues.team_member_3_name} />
                        ) : (
                          <AvatarFallback>
                            {formValues.team_member_3_name
                              .split(' ')
                              .map(part => part[0])
                              .join('')
                              .toUpperCase() || 'U3'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <Input 
                          value={formValues.team_member_3_name}
                          onChange={(e) => handleChange('team_member_3_name', e.target.value)}
                          placeholder="İsim" 
                          className="mb-1" 
                        />
                        <Input 
                          value={formValues.team_member_3_title}
                          onChange={(e) => handleChange('team_member_3_title', e.target.value)}
                          placeholder="Ünvan" 
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setUploadingImage('team_member_3_image')}
                      >
                        <FileEdit size={16} />
                      </Button>
                    </div>
                    
                    {uploadingImage === 'team_member_3_image' && (
                      <ImageUploader 
                        onImageSelected={(url) => handleImageSelected(url, 'team_member_3_image')} 
                        folder="team"
                      />
                    )}
                  </>
                )}
                
                {!showTeamMember3 && (
                  <div className="flex items-center justify-center">
                    <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={addTeamMember}>
                      <FileEdit size={14} /> Yeni Ekip Üyesi Ekle
                    </Button>
                  </div>
                )}
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
