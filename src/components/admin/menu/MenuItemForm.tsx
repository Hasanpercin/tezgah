
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MenuCategory, MenuItem, MenuItemOption, MenuItemVariant } from "@/services/menuService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BasicDetails } from "./menu-item-form/BasicDetails";
import { ImageSection } from "./menu-item-form/ImageSection";
import { AdditionalDetails } from "./menu-item-form/AdditionalDetails";
import { FoodProperties } from "./menu-item-form/FoodProperties";
import { OptionsSection } from "./menu-item-form/OptionsSection";
import { menuItemSchema, MenuItemFormValues } from "./menu-item-form/types";

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

  const form = useForm<MenuItemFormValues>({
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
      is_in_stock: item?.is_in_stock !== false,
      display_order: item?.display_order || 0,
      options: item?.options || [],
      variants: item?.variants || []
    }
  });

  const handleImageSelected = (url: string) => {
    setImageUrl(url);
    form.setValue('image_path', url);
  };
  
  const onSubmit = async (values: MenuItemFormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure all required fields are present and properly typed
      const formattedValues = {
        name: values.name,
        category_id: values.category_id, // Now guaranteed to be a string from our schema
        description: values.description || null,
        price: values.price,
        image_path: values.image_path || null,
        ingredients: values.ingredients || null,
        allergens: values.allergens || null,
        is_vegetarian: values.is_vegetarian,
        is_vegan: values.is_vegan,
        is_gluten_free: values.is_gluten_free,
        is_spicy: values.is_spicy,
        is_featured: values.is_featured,
        is_in_stock: values.is_in_stock,
        display_order: values.display_order
      };

      // First, handle the basic menu item update/insert
      if (isEditMode && item) {
        const { error } = await supabase
          .from("menu_items")
          .update({
            ...formattedValues,
            updated_at: new Date().toISOString()
          })
          .eq("id", item.id);

        if (error) throw error;

        // After successful update of the main menu item, handle options
        await handleOptionsUpdate(item.id, values.options || []);
        
        toast({
          title: "Başarılı",
          description: "Menü öğesi başarıyla güncellendi",
        });
      } else {
        // For new menu items, first create the item then add options
        const { data, error } = await supabase
          .from("menu_items")
          .insert(formattedValues)
          .select('id')
          .single();

        if (error) throw error;
        
        if (data && values.options && values.options.length > 0) {
          await handleOptionsUpdate(data.id, values.options);
        }

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

  // Helper function to handle options update/insert
  const handleOptionsUpdate = async (menuItemId: string, options: MenuItemOption[]) => {
    // We'll implement this in a future update with a proper database table for menu_item_options
    // For now, we're just preparing the component structure
    console.log('Saving options for menu item:', menuItemId, options);
    // In a real implementation, we would insert/update options in a separate table
    return true;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <h2 className="text-lg font-semibold mb-4">
          {isEditMode ? "Menü Öğesini Düzenle" : "Yeni Menü Öğesi Ekle"}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          <BasicDetails form={form} categories={categories} />
          <div className="flex-1 space-y-4">
            <ImageSection imageUrl={imageUrl} onImageSelected={handleImageSelected} />
            <AdditionalDetails form={form} />
          </div>
        </div>

        <FoodProperties form={form} />
        
        <OptionsSection form={form} />
      
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
