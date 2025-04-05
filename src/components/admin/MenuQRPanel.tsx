
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuCategoryList } from "./MenuCategoryList";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { QrCode } from "lucide-react";
import { MenuCategoryType } from "@/components/MenuCategory";

type MenuQRPanelProps = {
  menuData: MenuCategoryType[];
  isLoading: boolean;
};

export const MenuQRPanel = ({ menuData, isLoading }: MenuQRPanelProps) => {
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
          <MenuCategoryList categories={menuData} isLoading={isLoading} />
        </CardContent>
      </Card>
      
      {/* Main content with QR code generator */}
      <Card className="md:col-span-2">
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
      </Card>
    </div>
  );
};
