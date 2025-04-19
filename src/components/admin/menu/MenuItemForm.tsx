
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MenuCategory, MenuItem } from "@/services/menuService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BasicDetails } from "./menu-item-form/BasicDetails";
import { ImageSection } from "./menu-item-form/ImageSection";
import { AdditionalDetails } from "./menu-item-form/AdditionalDetails";
import { FoodProperties } from "./menu-item-form/FoodProperties";
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
      display_order: item?.display_order || 0
    }
  });

  const handleImageSelected = (url: string) => {
    setImageUrl(url);
    form.setValue('image_path', url);
  };
  
  const onSubmit = async (values: MenuItemFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && item) {
        const { error } = await supabase
          .from("menu_items")
          .update({
            ...values,
            updated_at: new Date().toISOString()
          })
          .eq("id", item.id);

        if (error) throw error;
        toast({
          title: "Başarılı",
          description: "Menü öğesi başarıyla güncellendi",
        });
      } else {
        const { error } = await supabase
          .from("menu_items")
          .insert(values);

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
          <BasicDetails form={form} categories={categories} />
          <div className="flex-1 space-y-4">
            <ImageSection imageUrl={imageUrl} onImageSelected={handleImageSelected} />
            <AdditionalDetails form={form} />
          </div>
        </div>

        <FoodProperties form={form} />
      
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
