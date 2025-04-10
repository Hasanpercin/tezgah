
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Award, Save, Users, Gift } from "lucide-react";

interface LoyaltySettingsType {
  [key: string]: any;
  bronze_threshold: number;
  silver_threshold: number;
  gold_threshold: number;
  platinum_threshold: number;
  points_per_spend: number;
  reservation_bonus: number;
  event_bonus: number;
  birthday_multiplier: number;
}

interface LoyaltyContentProps {
  onSave: () => void;
}

export const LoyaltyContent = ({ onSave }: LoyaltyContentProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState<LoyaltySettingsType>({
    bronze_threshold: 0,
    silver_threshold: 250, 
    gold_threshold: 500,
    platinum_threshold: 1000,
    points_per_spend: 10,
    reservation_bonus: 50,
    event_bonus: 25,
    birthday_multiplier: 2,
  });
  
  const [rewards, setRewards] = useState([
    { id: 1, name: "Ücretsiz Tatlı", points: 100, description: "Dilediğiniz bir tatlıyı ücretsiz alın" },
    { id: 2, name: "Ücretsiz İçecek", points: 150, description: "Dilediğiniz bir içeceği ücretsiz alın" },
    { id: 3, name: "%10 İndirim", points: 200, description: "Toplam hesabınızda %10 indirim" },
    { id: 4, name: "Özel Masa Rezervasyonu", points: 300, description: "Premium masa rezervasyonu" }
  ]);
  
  useEffect(() => {
    const fetchLoyaltySettings = async () => {
      setIsLoading(true);
      try {
        // Fetch settings from website_content table with 'loyalty' section
        const { data, error } = await supabase
          .from("website_content")
          .select("key, value")
          .eq("section", "loyalty");
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Convert array of objects to a single settings object
          const settingsObj = data.reduce((acc: Record<string, any>, item) => {
            try {
              // Try to parse JSON if it's a JSON string
              acc[item.key] = JSON.parse(item.value);
            } catch (e) {
              // If not JSON, use the raw value
              acc[item.key] = item.value;
            }
            return acc;
          }, {});
          
          setSettings({
            ...settings,
            ...settingsObj
          });
          
          // If rewards are available in the settings
          if (settingsObj.rewards) {
            setRewards(settingsObj.rewards);
          }
        } else {
          // If no settings found, create default ones
          await setupDefaultSettings();
        }
      } catch (error: any) {
        console.error("Error fetching loyalty settings:", error.message);
        toast({
          title: "Hata",
          description: "Sadakat programı ayarları yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLoyaltySettings();
  }, [toast]);
  
  const setupDefaultSettings = async () => {
    try {
      // Create default settings in database
      const defaultSettings = {
        bronze_threshold: 0,
        silver_threshold: 250, 
        gold_threshold: 500,
        platinum_threshold: 1000,
        points_per_spend: 10,
        reservation_bonus: 50,
        event_bonus: 25,
        birthday_multiplier: 2,
        rewards: rewards
      };
      
      for (const [key, value] of Object.entries(defaultSettings)) {
        await supabase
          .from("website_content")
          .insert({
            section: "loyalty",
            key,
            value: typeof value === 'object' ? JSON.stringify(value) : value.toString()
          });
      }
      
      toast({
        title: "Varsayılan Ayarlar",
        description: "Sadakat programı için varsayılan ayarlar oluşturuldu.",
      });
    } catch (error: any) {
      console.error("Error setting up default loyalty settings:", error.message);
      toast({
        title: "Hata",
        description: "Varsayılan ayarlar oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: parseInt(value) || 0
    });
  };
  
  const handleRewardChange = (index: number, field: string, value: any) => {
    const updatedRewards = [...rewards];
    updatedRewards[index] = {
      ...updatedRewards[index],
      [field]: field === 'points' ? (parseInt(value) || 0) : value
    };
    setRewards(updatedRewards);
  };
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Save general settings
      for (const [key, value] of Object.entries(settings)) {
        if (key === 'rewards') continue; // Skip rewards, we'll handle them separately

        const { data, error } = await supabase
          .from("website_content")
          .select("id")
          .eq("section", "loyalty")
          .eq("key", key)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
          throw error;
        }
        
        if (data) {
          // Update existing setting
          await supabase
            .from("website_content")
            .update({ 
              value: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
              updated_at: new Date().toISOString()
            })
            .eq("id", data.id);
        } else {
          // Create new setting
          await supabase
            .from("website_content")
            .insert({
              section: "loyalty",
              key,
              value: typeof value === 'object' ? JSON.stringify(value) : value.toString()
            });
        }
      }
      
      // Save rewards separately
      const { data, error } = await supabase
        .from("website_content")
        .select("id")
        .eq("section", "loyalty")
        .eq("key", "rewards")
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        // Update existing rewards
        await supabase
          .from("website_content")
          .update({ 
            value: JSON.stringify(rewards),
            updated_at: new Date().toISOString()
          })
          .eq("id", data.id);
      } else {
        // Create new rewards
        await supabase
          .from("website_content")
          .insert({
            section: "loyalty",
            key: "rewards",
            value: JSON.stringify(rewards)
          });
      }
      
      toast({
        title: "Ayarlar Kaydedildi",
        description: "Sadakat programı ayarları başarıyla güncellendi.",
      });
      
      if (onSave) onSave();
    } catch (error: any) {
      console.error("Error saving loyalty settings:", error.message);
      toast({
        title: "Hata",
        description: error.message || "Ayarlar kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" /> 
            Sadakat Programı Ayarları
          </CardTitle>
          <CardDescription>
            Sadakat programı ile ilgili ayarları buradan düzenleyebilirsiniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Genel Ayarlar
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Ödüller
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Seviye Eşikleri</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bronze_threshold">Bronz Seviyesi (Puan)</Label>
                      <Input 
                        id="bronze_threshold" 
                        name="bronze_threshold" 
                        type="number" 
                        value={settings.bronze_threshold} 
                        onChange={handleInputChange}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground mt-1">Başlangıç seviyesi</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="silver_threshold">Gümüş Seviyesi (Puan)</Label>
                      <Input 
                        id="silver_threshold" 
                        name="silver_threshold" 
                        type="number" 
                        value={settings.silver_threshold} 
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="gold_threshold">Altın Seviyesi (Puan)</Label>
                      <Input 
                        id="gold_threshold" 
                        name="gold_threshold" 
                        type="number" 
                        value={settings.gold_threshold} 
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="platinum_threshold">Platin Seviyesi (Puan)</Label>
                      <Input 
                        id="platinum_threshold" 
                        name="platinum_threshold" 
                        type="number" 
                        value={settings.platinum_threshold} 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Puan Kazanımı</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="points_per_spend">Harcama Başına Puan</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="points_per_spend" 
                          name="points_per_spend" 
                          type="number" 
                          value={settings.points_per_spend} 
                          onChange={handleInputChange}
                        />
                        <span className="text-sm whitespace-nowrap">puan / 100₺</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="reservation_bonus">Rezervasyon Bonusu</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="reservation_bonus" 
                          name="reservation_bonus" 
                          type="number" 
                          value={settings.reservation_bonus} 
                          onChange={handleInputChange}
                        />
                        <span className="text-sm">puan</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="event_bonus">Etkinlik Bonusu</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="event_bonus" 
                          name="event_bonus" 
                          type="number" 
                          value={settings.event_bonus} 
                          onChange={handleInputChange}
                        />
                        <span className="text-sm">puan</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="birthday_multiplier">Doğum Günü Çarpanı</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="birthday_multiplier" 
                          name="birthday_multiplier" 
                          type="number" 
                          value={settings.birthday_multiplier} 
                          onChange={handleInputChange}
                        />
                        <span className="text-sm">x puan</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rewards" className="space-y-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Ödül Seçenekleri</h3>
                
                {rewards.map((reward, index) => (
                  <Card key={reward.id} className="border border-muted">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`reward-name-${index}`}>Ödül Adı</Label>
                          <Input 
                            id={`reward-name-${index}`}
                            value={reward.name} 
                            onChange={(e) => handleRewardChange(index, 'name', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`reward-points-${index}`}>Gereken Puan</Label>
                          <Input 
                            id={`reward-points-${index}`}
                            type="number"
                            value={reward.points} 
                            onChange={(e) => handleRewardChange(index, 'points', e.target.value)}
                          />
                        </div>
                        
                        <div className="md:col-span-1">
                          <Label htmlFor={`reward-desc-${index}`}>Açıklama</Label>
                          <Input
                            id={`reward-desc-${index}`}
                            value={reward.description} 
                            onChange={(e) => handleRewardChange(index, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-8">
            <Button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Ayarları Kaydet
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
