
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Loader2, Plus, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FixedMenuForm } from "./FixedMenuForm";
import { FixedMenuPackage } from "@/services/fixedMenuService";

export function FixedMenusTable() {
  const { toast } = useToast();
  const [fixedMenus, setFixedMenus] = useState<FixedMenuPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<FixedMenuPackage | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  useEffect(() => {
    fetchFixedMenus();
  }, []);

  const fetchFixedMenus = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("fixed_menu_packages")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setFixedMenus(data as FixedMenuPackage[]);
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Fix menüler yüklenemedi: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewClick = () => {
    setSelectedMenu(null);
    setIsEditMode(false);
    setDialogOpen(true);
  };

  const handleEditClick = (menu: FixedMenuPackage) => {
    setSelectedMenu(menu);
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
        .from("fixed_menu_packages")
        .delete()
        .eq("id", deletingItemId);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Fix menü başarıyla silindi",
      });
      
      fetchFixedMenus();
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
    fetchFixedMenus();
    setDialogOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Fix Menü Paketleri</h3>
        <Button onClick={handleAddNewClick}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Fix Menü Ekle
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Menü Adı</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead className="hidden md:table-cell">Fiyat</TableHead>
              <TableHead className="hidden md:table-cell">Durum</TableHead>
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
            ) : fixedMenus.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Henüz fix menü kaydı bulunmuyor.
                </TableCell>
              </TableRow>
            ) : (
              fixedMenus.map((menu) => (
                <TableRow key={menu.id} className={menu.is_active ? '' : 'bg-muted/20'}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {menu.image_path && (
                        <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                          <img 
                            src={menu.image_path} 
                            alt={menu.name} 
                            className={`w-full h-full object-cover ${!menu.is_active ? 'opacity-50' : ''}`}
                          />
                        </div>
                      )}
                      <div>{menu.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="truncate max-w-[200px]">
                    {menu.description || "Açıklama yok"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatPrice(menu.price)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant={menu.is_active ? "outline" : "secondary"}
                      className={menu.is_active ? "bg-green-50" : ""}
                    >
                      {menu.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditClick(menu)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteClick(menu.id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <FixedMenuForm
            menu={selectedMenu}
            isEditMode={isEditMode}
            onSuccess={handleFormSubmitted}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fix menüyü silmek istediğinizden emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz ve menü kalıcı olarak silinecektir.
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
