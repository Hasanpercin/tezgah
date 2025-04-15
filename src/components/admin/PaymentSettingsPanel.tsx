
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';

interface DiscountSettings {
  standard_discount_percentage: number;
  high_amount_discount_percentage: number;
  high_amount_threshold: number;
}

interface PaymentSettings {
  enable_payment_step: boolean;
  admin_notification_email: string;
}

export function PaymentSettingsPanel() {
  const [activeTab, setActiveTab] = useState("discounts");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [discountSettings, setDiscountSettings] = useState<DiscountSettings>({
    standard_discount_percentage: 10,
    high_amount_discount_percentage: 15,
    high_amount_threshold: 3000,
  });
  
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    enable_payment_step: true,
    admin_notification_email: 'hasanpercin35@gmail.com'
  });
  
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // Try to get discount settings from the website_content table
        const { data: discountData, error: discountError } = await supabase
          .from('website_content')
          .select('*')
          .eq('section', 'payment')
          .eq('key', 'discount_settings');
          
        if (discountError) throw discountError;
        
        if (discountData && discountData.length > 0) {
          // Parse the value which should be JSON
          try {
            const settings = JSON.parse(discountData[0].value);
            setDiscountSettings(settings);
          } catch (parseError) {
            console.error("Error parsing discount settings:", parseError);
            // Use default settings
          }
        } else {
          // No settings found, create default settings
          await supabase
            .from('website_content')
            .insert({
              section: 'payment',
              key: 'discount_settings',
              value: JSON.stringify(discountSettings)
            });
        }
        
        // Fetch payment settings
        const { data: paymentData, error: paymentError } = await supabase
          .from('website_content')
          .select('*')
          .eq('section', 'payment')
          .eq('key', 'payment_settings');
          
        if (paymentError) throw paymentError;
        
        if (paymentData && paymentData.length > 0) {
          // Parse the value which should be JSON
          try {
            const settings = JSON.parse(paymentData[0].value);
            setPaymentSettings(settings);
          } catch (parseError) {
            console.error("Error parsing payment settings:", parseError);
            // Use default settings
          }
        } else {
          // No settings found, create default settings
          await supabase
            .from('website_content')
            .insert({
              section: 'payment',
              key: 'payment_settings',
              value: JSON.stringify(paymentSettings)
            });
        }
      } catch (error) {
        console.error("Error fetching payment settings:", error);
        toast({
          title: "Hata",
          description: "Ödeme ayarları yüklenirken bir hata oluştu.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDiscountSettings(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };
  
  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleToggleChange = (checked: boolean) => {
    setPaymentSettings(prev => ({
      ...prev,
      enable_payment_step: checked
    }));
  };
  
  const saveDiscountSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('website_content')
        .update({
          value: JSON.stringify(discountSettings),
          updated_at: new Date().toISOString()
        })
        .eq('section', 'payment')
        .eq('key', 'discount_settings');
        
      if (error) throw error;
      
      toast({
        title: "Başarılı",
        description: "İndirim ayarları başarıyla kaydedildi.",
      });
    } catch (error) {
      console.error("Error saving discount settings:", error);
      toast({
        title: "Hata",
        description: "İndirim ayarları kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const savePaymentSettings = async () => {
    setIsSaving(true);
    try {
      // Check if payment settings record exists
      const { data, error: fetchError } = await supabase
        .from('website_content')
        .select('*')
        .eq('section', 'payment')
        .eq('key', 'payment_settings');
        
      if (fetchError) throw fetchError;
      
      if (data && data.length > 0) {
        // Update existing record
        const { error } = await supabase
          .from('website_content')
          .update({
            value: JSON.stringify(paymentSettings),
            updated_at: new Date().toISOString()
          })
          .eq('section', 'payment')
          .eq('key', 'payment_settings');
          
        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('website_content')
          .insert({
            section: 'payment',
            key: 'payment_settings',
            value: JSON.stringify(paymentSettings)
          });
          
        if (error) throw error;
      }
      
      toast({
        title: "Başarılı",
        description: "Ödeme ayarları başarıyla kaydedildi.",
      });
    } catch (error) {
      console.error("Error saving payment settings:", error);
      toast({
        title: "Hata",
        description: "Ödeme ayarları kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Ödeme Ayarları
        </h2>
        <p className="text-muted-foreground">
          Rezervasyon ve ödeme sistemine ait ayarları buradan yapabilirsiniz.
        </p>
      </div>
      
      <Tabs 
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="discounts">İndirim Ayarları</TabsTrigger>
          <TabsTrigger value="payment_methods">Ödeme Yöntemleri</TabsTrigger>
          <TabsTrigger value="payment_settings">Ödeme Ayarları</TabsTrigger>
        </TabsList>
        
        <TabsContent value="discounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>İndirim Ayarları</CardTitle>
              <CardDescription>
                Rezervasyon sırasında uygulanacak indirim oranlarını ve koşullarını buradan ayarlayabilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div>
                    <Label htmlFor="standard_discount_percentage" className="mb-2 block">
                      Standart İndirim Oranı (%)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="standard_discount_percentage"
                        name="standard_discount_percentage"
                        type="number"
                        min="0"
                        max="100"
                        value={discountSettings.standard_discount_percentage}
                        onChange={handleInputChange}
                        className="max-w-[100px]"
                      />
                      <span className="text-muted-foreground">
                        Tüm çevrimiçi rezervasyonlarda uygulanacak indirim oranı
                      </span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <Label htmlFor="high_amount_threshold" className="block">
                      Yüksek Miktar İndirimi İçin Eşik Değer (TL)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="high_amount_threshold"
                        name="high_amount_threshold"
                        type="number"
                        min="0"
                        step="100"
                        value={discountSettings.high_amount_threshold}
                        onChange={handleInputChange}
                        className="max-w-[150px]"
                      />
                      <span className="text-muted-foreground">
                        TL ve üzeri siparişlerde yüksek miktar indirimi uygulanır
                      </span>
                    </div>
                    
                    <Label htmlFor="high_amount_discount_percentage" className="mt-4 block">
                      Yüksek Miktar İndirim Oranı (%)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="high_amount_discount_percentage"
                        name="high_amount_discount_percentage"
                        type="number"
                        min="0"
                        max="100"
                        value={discountSettings.high_amount_discount_percentage}
                        onChange={handleInputChange}
                        className="max-w-[100px]"
                      />
                      <span className="text-muted-foreground">
                        Yüksek miktarlı siparişlerde uygulanacak indirim oranı
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={saveDiscountSettings}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Kaydediliyor...
                        </>
                      ) : (
                        "Değişiklikleri Kaydet"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>İndirim Koşulları</CardTitle>
              <CardDescription>
                İndirim uygulama kuralları ve bilgilendirmeler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>İndirimler sadece çevrimiçi rezervasyonlarda ve ön ödeme yapılması durumunda geçerlidir.</li>
                <li>İndirimler otomatik olarak uygulanır ve diğer kampanyalarla birleştirilemez.</li>
                <li>Rezervasyon iptal edilirse ödenen tutar iade edilmez, ancak başka bir tarihte kullanılabilir.</li>
                <li>Seçilen menü ürünlerinin toplam tutarı üzerinden indirim uygulanır.</li>
                <li>Restorana gelerek yapılan rezervasyonlarda indirim uygulanmaz.</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment_methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ödeme Yöntemleri</CardTitle>
              <CardDescription>
                Kabul edilen ödeme yöntemleri ve entegrasyonları buradan yönetebilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Bu özellik henüz geliştirme aşamasındadır.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment_settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ödeme Adımı Ayarları</CardTitle>
              <CardDescription>
                Rezervasyon sürecindeki ödeme adımını etkinleştirebilir veya devre dışı bırakabilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable_payment">Ödeme Adımını Etkinleştir</Label>
                      <p className="text-sm text-muted-foreground">
                        Menü seçiminden sonra ödeme adımını gösterir veya atlar.
                      </p>
                    </div>
                    <Switch
                      id="enable_payment"
                      checked={paymentSettings.enable_payment_step}
                      onCheckedChange={handleToggleChange}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <Label htmlFor="admin_notification_email" className="block">
                      Admin E-posta Adresi
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="admin_notification_email"
                        name="admin_notification_email"
                        type="email"
                        value={paymentSettings.admin_notification_email}
                        onChange={handlePaymentInputChange}
                        className="max-w-[300px]"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ödeme adımı kapalıyken, rezervasyon bilgileri bu e-posta adresine gönderilecektir.
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={savePaymentSettings}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Kaydediliyor...
                        </>
                      ) : (
                        "Değişiklikleri Kaydet"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Bilgilendirme</CardTitle>
              <CardDescription>
                Ödeme adımı ayarları hakkında önemli notlar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Ödeme adımı <strong>kapatıldığında</strong>, menü seçimi yapan müşterilerden ödeme alınmaz.</li>
                <li>Ödeme adımı kapalıyken, rezervasyon ve menü bilgileri yukarıda belirtilen e-posta adresine otomatik olarak gönderilir.</li>
                <li>Ödeme adımı <strong>açıkken</strong>, menü seçimi yapan müşteriler ödeme adımına yönlendirilir.</li>
                <li>Müşteriler her durumda "Restorantta Seçim" seçeneğini kullanarak ödeme yapmadan rezervasyon yapabilirler.</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
