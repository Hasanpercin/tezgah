
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function PaymentSettingsPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  
  // Payment settings state
  const [settings, setSettings] = useState({
    enablePayments: true,
    enablePrePayment: true,
    prePaymentDiscount: 10,
    stripeEnabled: false,
    paypalEnabled: false,
    bankTransferEnabled: true,
    stripePublicKey: '',
    stripeSecretKey: '',
    paypalClientId: '',
    paypalSecretKey: '',
    bankName: 'Ziraat Bankası',
    bankAccountName: 'Tezgah Restoran Ltd. Şti.',
    bankIBAN: 'TR12 3456 7890 1234 5678 9012 34',
    bankDescription: 'Ödemeyi gerçekleştirdikten sonra dekont bilgilerinizi mail adresimize gönderiniz.'
  });

  // Fetch existing settings from database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('website_content')
          .select('*')
          .eq('section', 'payment_settings');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Convert stored settings to state
          const paymentSettings = data.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
          }, {} as Record<string, string>);
          
          setSettings(prevSettings => ({
            ...prevSettings,
            enablePayments: paymentSettings.enablePayments === 'true',
            enablePrePayment: paymentSettings.enablePrePayment === 'true',
            prePaymentDiscount: parseInt(paymentSettings.prePaymentDiscount || '10'),
            stripeEnabled: paymentSettings.stripeEnabled === 'true',
            paypalEnabled: paymentSettings.paypalEnabled === 'true',
            bankTransferEnabled: paymentSettings.bankTransferEnabled === 'true',
            stripePublicKey: paymentSettings.stripePublicKey || '',
            stripeSecretKey: paymentSettings.stripeSecretKey || '',
            paypalClientId: paymentSettings.paypalClientId || '',
            paypalSecretKey: paymentSettings.paypalSecretKey || '',
            bankName: paymentSettings.bankName || 'Ziraat Bankası',
            bankAccountName: paymentSettings.bankAccountName || 'Tezgah Restoran Ltd. Şti.',
            bankIBAN: paymentSettings.bankIBAN || 'TR12 3456 7890 1234 5678 9012 34',
            bankDescription: paymentSettings.bankDescription || 'Ödemeyi gerçekleştirdikten sonra dekont bilgilerinizi mail adresimize gönderiniz.'
          }));
        }
      } catch (error) {
        console.error("Error fetching payment settings:", error);
        toast({
          title: "Hata",
          description: "Ödeme ayarları yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    };
    
    fetchSettings();
  }, [toast]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value
    }));
  };

  // Handle checkbox/switch changes
  const handleToggleChange = (key: string, value: boolean) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value
    }));
  };

  // Save settings to database
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Convert settings object to array of records for database
      const settingsToSave = Object.entries(settings).map(([key, value]) => ({
        section: 'payment_settings',
        key,
        value: value.toString()
      }));
      
      // First delete existing settings
      const { error: deleteError } = await supabase
        .from('website_content')
        .delete()
        .eq('section', 'payment_settings');
      
      if (deleteError) throw deleteError;
      
      // Then insert new settings
      const { error: insertError } = await supabase
        .from('website_content')
        .insert(settingsToSave);
      
      if (insertError) throw insertError;
      
      toast({
        title: "Başarılı",
        description: "Ödeme ayarları başarıyla kaydedildi.",
      });
    } catch (error) {
      console.error("Error saving payment settings:", error);
      toast({
        title: "Hata",
        description: "Ödeme ayarları kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Ödeme Ayarları</h2>
        <p className="text-muted-foreground">
          Rezervasyon ve diğer hizmetler için ödeme yöntemlerini ve ayarlarını yapılandırın.
        </p>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="general">Genel Ayarlar</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
          <TabsTrigger value="bank">Banka Transferi</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {/* Genel Ayarlar */}
          <TabsContent value="general" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Genel Ödeme Ayarları</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enablePayments" className="text-base font-medium">
                      Ödemeleri Etkinleştir
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Rezervasyon için ödeme alma özelliğini açın veya kapatın
                    </p>
                  </div>
                  <Switch
                    id="enablePayments"
                    checked={settings.enablePayments}
                    onCheckedChange={(value) => handleToggleChange('enablePayments', value)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enablePrePayment" className="text-base font-medium">
                      Ön Ödeme Seçeneği
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Müşterilerin rezervasyon yaparken ön ödeme yapabilmesini sağlar
                    </p>
                  </div>
                  <Switch
                    id="enablePrePayment"
                    checked={settings.enablePrePayment}
                    onCheckedChange={(value) => handleToggleChange('enablePrePayment', value)}
                  />
                </div>
                
                {settings.enablePrePayment && (
                  <div>
                    <Label htmlFor="prePaymentDiscount" className="text-sm font-medium">
                      Ön Ödeme İndirimi (%)
                    </Label>
                    <div className="flex items-center mt-2">
                      <Input
                        id="prePaymentDiscount"
                        name="prePaymentDiscount"
                        type="number"
                        min="0"
                        max="50"
                        value={settings.prePaymentDiscount}
                        onChange={handleChange}
                        className="w-24"
                      />
                      <span className="ml-2 text-muted-foreground">%</span>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <div className="space-y-3">
                  <Label className="text-base font-medium">Ödeme Yöntemleri</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="stripeEnabled" 
                        checked={settings.stripeEnabled}
                        onCheckedChange={(checked) => handleToggleChange('stripeEnabled', checked === true)}
                      />
                      <Label htmlFor="stripeEnabled">Stripe (Kredi Kartı)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="paypalEnabled" 
                        checked={settings.paypalEnabled}
                        onCheckedChange={(checked) => handleToggleChange('paypalEnabled', checked === true)}
                      />
                      <Label htmlFor="paypalEnabled">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bankTransferEnabled" 
                        checked={settings.bankTransferEnabled}
                        onCheckedChange={(checked) => handleToggleChange('bankTransferEnabled', checked === true)}
                      />
                      <Label htmlFor="bankTransferEnabled">Banka Transferi</Label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Stripe Ayarları */}
          <TabsContent value="stripe" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Stripe Ayarları</h3>
                <Switch
                  checked={settings.stripeEnabled}
                  onCheckedChange={(value) => handleToggleChange('stripeEnabled', value)}
                />
              </div>
              
              {settings.stripeEnabled && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stripePublicKey">Public Key</Label>
                    <Input
                      id="stripePublicKey"
                      name="stripePublicKey"
                      value={settings.stripePublicKey}
                      onChange={handleChange}
                      placeholder="pk_test_..."
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="stripeSecretKey">Secret Key</Label>
                    <Input
                      id="stripeSecretKey"
                      name="stripeSecretKey"
                      type="password"
                      value={settings.stripeSecretKey}
                      onChange={handleChange}
                      placeholder="sk_test_..."
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <p className="text-sm">
                      Stripe hesabınız yoksa, <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">stripe.com</a> adresinden ücretsiz hesap oluşturabilirsiniz.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
          
          {/* PayPal Ayarları */}
          <TabsContent value="paypal" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">PayPal Ayarları</h3>
                <Switch
                  checked={settings.paypalEnabled}
                  onCheckedChange={(value) => handleToggleChange('paypalEnabled', value)}
                />
              </div>
              
              {settings.paypalEnabled && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="paypalClientId">Client ID</Label>
                    <Input
                      id="paypalClientId"
                      name="paypalClientId"
                      value={settings.paypalClientId}
                      onChange={handleChange}
                      placeholder="Client ID"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="paypalSecretKey">Secret Key</Label>
                    <Input
                      id="paypalSecretKey"
                      name="paypalSecretKey"
                      type="password"
                      value={settings.paypalSecretKey}
                      onChange={handleChange}
                      placeholder="Secret Key"
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <p className="text-sm">
                      PayPal Business hesabınız yoksa, <a href="https://www.paypal.com/business" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">paypal.com/business</a> adresinden hesap oluşturabilirsiniz.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
          
          {/* Banka Transferi Ayarları */}
          <TabsContent value="bank" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Banka Transferi Ayarları</h3>
                <Switch
                  checked={settings.bankTransferEnabled}
                  onCheckedChange={(value) => handleToggleChange('bankTransferEnabled', value)}
                />
              </div>
              
              {settings.bankTransferEnabled && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bankName">Banka Adı</Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      value={settings.bankName}
                      onChange={handleChange}
                      placeholder="Banka Adı"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bankAccountName">Hesap Sahibi</Label>
                    <Input
                      id="bankAccountName"
                      name="bankAccountName"
                      value={settings.bankAccountName}
                      onChange={handleChange}
                      placeholder="Hesap Sahibi Adı"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bankIBAN">IBAN</Label>
                    <Input
                      id="bankIBAN"
                      name="bankIBAN"
                      value={settings.bankIBAN}
                      onChange={handleChange}
                      placeholder="TR00 0000 0000 0000 0000 0000 00"
                      className="mt-1 font-mono"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bankDescription">Açıklama</Label>
                    <Input
                      id="bankDescription"
                      name="bankDescription"
                      value={settings.bankDescription}
                      onChange={handleChange}
                      placeholder="Ödeme talimatları"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </Button>
      </div>
    </div>
  );
}
