
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MenuCategory, MenuItem } from "../MenuManagementPanel";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";

const menuItemSchema = z.object({
  name: z.string().min(2, { message: "Ürün adı en az 2 karakter olmalıdır" }),
  category_id: z.string().min(1, { message: "Lütfen bir kategori seçin" }),
  description: z.string().optional(),
  price: z.coerce.number().positive({ message: "Fiyat pozitif bir değer olmalıdır" }),
  image_path: z.string().optional().nullable(),
  ingredients: z.string().optional(),
  allergens: z.string().optional(),
  is_vegetarian: z.boolean().default(false),
  is_vegan: z.boolean().default(false),
  is_gluten_free: z.boolean().default(false),
  is_spicy: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  display_order: z.coerce.number().int().default(0)
});

type MenuItemFormProps = {
  categories: MenuCategory[];
  item: MenuItem | null;
  isEditMode: boolean;
  onSuccess: () => void;
  onCancel: () => void;
};

export function MenuItemForm({ categories, item, isEditMode, onSuccess, onCancel }: MenuItemFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(item?.image_path || null);

  const form = useForm<z.infer<typeof menuItemSchema>>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: item?.name || "",
      category_id: item?.category_id || "",
      description: item?.description || "",
      price: item?.price || 0,
      image_path: item?.image_path || null,
      ingredients: item?.ingredients || "",
      allergens: item?.allergens || "",
      is_vegetarian: item?.is_vegetarian || false,
      is_vegan: item?.is_vegan || false,
      is_gluten_free: item?.is_gluten_free || false,
      is_spicy: item?.is_spicy || false,
      is_featured: item?.is_featured || false,
      display_order: item?.display_order || 0
    }
  });

  const handleImageSelected = (url: string) => {
    setImageUrl(url);
    form.setValue('image_path', url);
  };
  
  const onSubmit = async (values: z.infer<typeof menuItemSchema>) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && item) {
        // Update existing menu item
        const { error } = await supabase
          .from("menu_items")
          .update({
            name: values.name,
            category_id: values.category_id,
            description: values.description || null,
            price: values.price,
            image_path: values.image_path,
            ingredients: values.ingredients || null,
            allergens: values.allergens || null,
            is_vegetarian: values.is_vegetarian,
            is_vegan: values.is_vegan,
            is_gluten_free: values.is_gluten_free,
            is_spicy: values.is_spicy,
            is_featured: values.is_featured,
            display_order: values.display_order,
            updated_at: new Date().toISOString()
          })
          .eq("id", item.id);

        if (error) throw error;
        toast({
          title: "Başarılı",
          description: "Menü öğesi başarıyla güncellendi",
        });
      } else {
        // Create new menu item
        const { error } = await supabase
          .from("menu_items")
          .insert({
            name: values.name,
            category_id: values.category_id,
            description: values.description || null,
            price: values.price,
            image_path: values.image_path,
            ingredients: values.ingredients || null,
            allergens: values.allergens || null,
            is_vegetarian: values.is_vegetarian,
            is_vegan: values.is_vegan,
            is_gluten_free: values.is_gluten_free,
            is_spicy: values.is_spicy,
            is_featured: values.is_featured,
            display_order: values.display_order
          });

        if (error) throw error;
        toast({
          title: "Başarılı",
          description: "Yeni menü öğesi başarıyla oluşturuldu",
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <h2 className="text-lg font-semibold mb-4">
          {isEditMode ? "Menü Öğesini Düzenle" : "Yeni Menü Öğesi Ekle"}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column */}
          <div className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ürün Adı</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ürün adını girin" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ürün açıklaması girin"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fiyat (₺)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sıralama</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-4">
            <FormLabel>Ürün Görseli</FormLabel>
            <div className="mb-4">
              <ImageUploader 
                onImageSelected={handleImageSelected}
                folder="menu_items"
              />
            </div>
            
            {imageUrl && (
              <div className="mt-2">
                <div className="border rounded-md overflow-hidden w-full h-40">
                  <img 
                    src={imageUrl} 
                    alt="Ürün Görseli" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İçindekiler (Opsiyonel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="İçindekiler listesi"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allergens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alerjenler (Opsiyonel)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Örn: Gluten, süt ürünleri, kuruyemiş"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Features Checkboxes */}
        <div>
          <FormLabel>Özellikler</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
            <FormField
              control={form.control}
              name="is_vegetarian"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Vejetaryen</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_vegan"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Vegan</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_gluten_free"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Glutensiz</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_spicy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Acılı</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Öne Çıkan</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
      
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>İptal</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Kaydediliyor..." : isEditMode ? "Güncelle" : "Ekle"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
