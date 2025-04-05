
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  Image as ImageIcon, 
  FileEdit, 
  Save,
  Info,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

export const WebsiteContentPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("homepage");
  
  const handleSaveChanges = () => {
    toast({
      title: "İçerik güncellendi",
      description: "Web sitesi içeriği başarıyla güncellendi",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Web Sitesi İçerik Yönetimi</CardTitle>
          <CardDescription>
            Sitenizin içeriğini ve görsellerini buradan düzenleyebilirsiniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="homepage">
                <Home size={16} className="mr-2" /> Anasayfa
              </TabsTrigger>
              <TabsTrigger value="about">
                <Info size={16} className="mr-2" /> Hakkımızda
              </TabsTrigger>
              <TabsTrigger value="gallery">
                <ImageIcon size={16} className="mr-2" /> Galeri
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Phone size={16} className="mr-2" /> İletişim
              </TabsTrigger>
            </TabsList>

            {/* Homepage Content */}
            <TabsContent value="homepage" className="space-y-6">
              <div className="space-y-4">
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
                  <Button onClick={handleSaveChanges} className="flex items-center gap-2">
                    <Save size={16} /> Değişiklikleri Kaydet
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* About Us Content */}
            <TabsContent value="about" className="space-y-6">
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
                  <Button onClick={handleSaveChanges} className="flex items-center gap-2">
                    <Save size={16} /> Değişiklikleri Kaydet
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Gallery Content */}
            <TabsContent value="gallery" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Galeri Yönetimi</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="relative group aspect-square border rounded-md overflow-hidden">
                      <img 
                        src={`https://source.unsplash.com/random/300x300?food&sig=${item}`} 
                        alt={`Gallery item ${item}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" className="text-white">
                          <FileEdit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white">
                          <Trash2 size={16} className="text-red-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border border-dashed rounded-md flex flex-col items-center justify-center aspect-square">
                    <Button variant="ghost" className="flex flex-col h-full w-full items-center justify-center gap-2">
                      <Plus size={24} />
                      <span className="text-sm">Yeni Görsel Ekle</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button onClick={handleSaveChanges} className="flex items-center gap-2">
                    <Save size={16} /> Değişiklikleri Kaydet
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Contact Content */}
            <TabsContent value="contact" className="space-y-6">
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
                  <Button onClick={handleSaveChanges} className="flex items-center gap-2">
                    <Save size={16} /> Değişiklikleri Kaydet
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
