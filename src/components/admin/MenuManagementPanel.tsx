
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MenuCategoriesTable } from "./menu/MenuCategoriesTable";
import { MenuItemsTable } from "./menu/MenuItemsTable";
import { MenuItemForm } from "./menu/MenuItemForm";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus } from "lucide-react";
import { MenuCategory } from "@/services/menuService";

const categorySchema = z.object({
  name: z.string().min(2, { message: "Kategori adı en az 2 karakter olmalıdır" }),
  description: z.string().optional(),
  display_order: z.coerce.number().int().min(0)
});

export const MenuManagementPanel = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeTab, setActiveTab] = useState("categories");
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);

  const categoryForm = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      display_order: 0
    }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCategories(data as MenuCategory[]);
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Kategori bilgileri yüklenemedi: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openNewCategoryDialog = () => {
    categoryForm.reset({
      name: "",
      description: "",
      display_order: categories.length
    });
    setIsEditing(false);
    setCategoryDialogOpen(true);
  };

  const openEditCategoryDialog = (category: MenuCategory) => {
    categoryForm.reset({
      name: category.name,
      description: category.description || "",
      display_order: category.display_order
    });
    setSelectedCategory(category);
    setIsEditing(true);
    setCategoryDialogOpen(true);
  };

  const onCategorySubmit = async (values: z.infer<typeof categorySchema>) => {
    try {
      if (isEditing && selectedCategory) {
        // Update existing category
        const { error } = await supabase
          .from("menu_categories")
          .update({
            name: values.name,
            description: values.description || null,
            display_order: values.display_order,
            updated_at: new Date().toISOString()
          })
          .eq("id", selectedCategory.id);

        if (error) throw error;
        toast({
          title: "Başarılı",
          description: "Kategori başarıyla güncellendi",
        });
      } else {
        // Create new category
        const { error } = await supabase
          .from("menu_categories")
          .insert({
            name: values.name,
            description: values.description || null,
            display_order: values.display_order
          });

        if (error) throw error;
        toast({
          title: "Başarılı",
          description: "Yeni kategori başarıyla oluşturuldu",
        });
      }

      // Refresh categories list
      fetchCategories();
      setCategoryDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from("menu_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Başarılı",
        description: "Kategori başarıyla silindi",
      });
      
      // Refresh categories
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Kategori silinemedi: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Menü Yönetimi</CardTitle>
          <CardDescription>
            Restoranınızın menü kategorilerini ve ürünlerini buradan yönetebilirsiniz
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="categories">Kategoriler</TabsTrigger>
              <TabsTrigger value="items">Menü Öğeleri</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Menü Kategorileri</h3>
                <Button onClick={openNewCategoryDialog}>
                  <Plus className="mr-2 h-4 w-4" /> Yeni Kategori
                </Button>
              </div>
              <Separator className="my-4" />
              
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <MenuCategoriesTable 
                  categories={categories}
                  onEdit={openEditCategoryDialog}
                  onDelete={handleDeleteCategory}
                />
              )}
            </TabsContent>
            
            <TabsContent value="items">
              <MenuItemsTable categories={categories} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
            </DialogTitle>
            <DialogDescription>
              Menü kategorisinin detaylarını girin ve kaydedin.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori Adı</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Örn: Başlangıçlar" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Açıklama (Opsiyonel)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Kategori hakkında kısa bir açıklama" 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Görüntüleme Sırası</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCategoryDialogOpen(false)}
                >
                  İptal
                </Button>
                <Button type="submit">
                  {isEditing ? "Güncelle" : "Ekle"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
