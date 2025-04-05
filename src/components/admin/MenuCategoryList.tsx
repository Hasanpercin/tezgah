
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MenuCategoryType } from "@/components/MenuCategory";
import { TableIcon } from "lucide-react";

type MenuCategoryListProps = {
  categories: MenuCategoryType[];
  isLoading: boolean;
  onSelectCategory: (category: MenuCategoryType) => void;
  onShowQRCodes: () => void;
};

export const MenuCategoryList = ({ 
  categories, 
  isLoading, 
  onSelectCategory,
  onShowQRCodes 
}: MenuCategoryListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Menü kategorileri yüklenemedi.
      </div>
    );
  }

  return (
    <>
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center justify-between p-3 rounded-md hover:bg-muted cursor-pointer"
          onClick={() => onSelectCategory(category)}
        >
          <span>{category.name}</span>
          <Badge variant="secondary">
            {category.items.length} ürün
          </Badge>
        </div>
      ))}
      
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={onShowQRCodes}
      >
        <TableIcon size={16} className="mr-2" /> Masa QR Kodları
      </Button>
    </>
  );
};
