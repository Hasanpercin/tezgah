
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MenuCategory, MenuItem } from "@/services/menuService";
import { Edit, Loader2, Plus, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MenuItemForm } from "./MenuItemForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type MenuItemsTableProps = {
  categories: MenuCategory[];
};

export function MenuItemsTable({ categories }: MenuItemsTableProps) {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (categories.length > 0) {
      fetchMenuItems();
    }
  }, [categories]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category_id === selectedCategory));
    }
  }, [selectedCategory, menuItems]);

  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setMenuItems(data as MenuItem[]);
      setFilteredItems(data as MenuItem[]);
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Menü öğeleri yüklenemedi: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleAddNewClick = () => {
    setSelectedItem(null);
    setIsEditMode(false);
    setDialogOpen(true);
  };

  const handleEditClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsEditMode(true);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingItemId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItemId) return;
    
    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", deletingItemId);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Menü öğesi başarıyla silindi",
      });
      
      // Refresh list
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Silme işlemi sırasında bir hata oluştu: " + error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeletingItemId(null);
    }
  };

  const handleFormSubmitted = () => {
    fetchMenuItems();
    setDialogOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Bilinmeyen Kategori";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-64">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddNewClick}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Ürün Ekle
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ürün Adı</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="hidden md:table-cell">Fiyat</TableHead>
              <TableHead className="hidden lg:table-cell">Özellikler</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Seçilen kategoride menü öğesi bulunmuyor.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {item.image_path && (
                        <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                          <img 
                            src={item.image_path} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        {item.name}
                        {item.is_featured && (
                          <Badge variant="outline" className="ml-2 bg-amber-100">Öne Çıkan</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryName(item.category_id)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatPrice(item.price)}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {item.is_vegetarian && (
                        <Badge variant="outline" className="bg-green-50">Vejetaryen</Badge>
                      )}
                      {item.is_vegan && (
                        <Badge variant="outline" className="bg-green-50">Vegan</Badge>
                      )}
                      {item.is_gluten_free && (
                        <Badge variant="outline" className="bg-blue-50">Glutensiz</Badge>
                      )}
                      {item.is_spicy && (
                        <Badge variant="outline" className="bg-red-50">Acılı</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditClick(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Menu Item Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <MenuItemForm 
            categories={categories}
            item={selectedItem}
            isEditMode={isEditMode}
            onSuccess={handleFormSubmitted}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Menü öğesini silmek istediğinizden emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz ve menü öğesi kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
