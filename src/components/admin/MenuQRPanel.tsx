
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuCategoryList } from "./MenuCategoryList";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { 
  QrCode, 
  Image as ImageIcon, 
  FileEdit, 
  Plus, 
  Trash2 
} from "lucide-react";
import { MenuCategoryType } from "@/components/MenuCategory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type MenuQRPanelProps = {
  menuData: MenuCategoryType[];
  isLoading: boolean;
};

export const MenuQRPanel = ({ menuData, isLoading }: MenuQRPanelProps) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryType | null>(null);
  const [showQRCodes, setShowQRCodes] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedPrice, setEditedPrice] = useState("");

  const handleSelectCategory = (category: MenuCategoryType) => {
    setSelectedCategory(category);
    setShowQRCodes(false);
    setEditMode(false);
  };

  const handleShowQRCodes = () => {
    setShowQRCodes(true);
    setSelectedCategory(null);
    setEditMode(false);
  };

  const handleEditItem = (itemId: string) => {
    if (selectedCategory) {
      const item = selectedCategory.items.find(i => i.id === itemId);
      if (item) {
        setEditedName(item.name);
        setEditedDescription(item.description || "");
        setEditedPrice(item.price);
        setEditMode(true);
      }
    }
  };

  const handleSaveChanges = () => {
    toast({
      title: "Değişiklikler kaydedildi",
      description: "Menü öğesi başarıyla güncellendi",
    });
    setEditMode(false);
  };

  const renderRightPanel = () => {
    if (showQRCodes) {
      return (
        <div>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode size={20} className="mr-2" /> QR Kod Oluşturucu
            </CardTitle>
            <CardDescription>
              Masalarda kullanmak için menü QR kodları oluşturun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QRCodeGenerator />
          </CardContent>
        </div>
      );
    } 
    
    if (selectedCategory && !editMode) {
      return (
        <div>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{selectedCategory.name}</CardTitle>
              <CardDescription>
                Bu kategorideki menü öğelerini düzenleyin
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => {
              toast({
                title: "Yeni ürün ekleniyor",
                description: "Bu özellik henüz geliştirme aşamasındadır.",
              });
            }}>
              <Plus size={16} className="mr-1" /> Yeni Ürün
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedCategory.items.map((item) => (
                <div key={item.id} className="flex items-start p-3 border rounded-md">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="font-medium mt-1">{item.price}</p>
                  </div>
                  {item.image && (
                    <div className="w-16 h-16 rounded overflow-hidden mr-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditItem(item.id)}
                    >
                      <FileEdit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Silme işlemi",
                          description: "Bu özellik henüz geliştirme aşamasındadır.",
                        });
                      }}
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </div>
      );
    }
    
    if (editMode) {
      return (
        <div>
          <CardHeader>
            <CardTitle>Menü Öğesini Düzenle</CardTitle>
            <CardDescription>
              Seçilen menü öğesinin bilgilerini güncelleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="item-name">Ürün Adı</label>
                <Input 
                  id="item-name" 
                  value={editedName} 
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="item-description">Açıklama</label>
                <Textarea 
                  id="item-description" 
                  value={editedDescription} 
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="item-price">Fiyat</label>
                <Input 
                  id="item-price" 
                  value={editedPrice} 
                  onChange={(e) => setEditedPrice(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="item-image">Görsel</label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ImageIcon size={16} /> Görsel Seç
                  </Button>
                  <span className="text-sm text-muted-foreground">Görsel yüklemek için tıklayın</span>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setEditMode(false)}
                >
                  İptal
                </Button>
                <Button onClick={handleSaveChanges}>
                  Kaydet
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <QrCode size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Menü QR Yönetimi</h3>
          <p className="text-muted-foreground">
            Soldaki listeden bir kategori seçin veya QR kod oluşturmak için butona tıklayın.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar with menu categories */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Menü Kategorileri</CardTitle>
          <CardDescription>
            QR kod oluşturmak için kategori seçin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <MenuCategoryList 
            categories={menuData} 
            isLoading={isLoading} 
            onSelectCategory={handleSelectCategory}
            onShowQRCodes={handleShowQRCodes}
          />
        </CardContent>
      </Card>
      
      {/* Main content with QR code generator or category editor */}
      <Card className="md:col-span-2">
        {renderRightPanel()}
      </Card>
    </div>
  );
};
