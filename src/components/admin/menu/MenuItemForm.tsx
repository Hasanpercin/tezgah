
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MenuCategory, MenuItem, MenuItemOption, MenuItemVariant, fetchMenuItemOptions } from "@/services/menuService";
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
  const [loadingOptions, setLoadingOptions] = useState(isEditMode && !!item);
  
  // Function to ensure all options have an ID
  const prepareOptions = (options: any[] = []): MenuItemOption[] => {
    return options.map(option => ({
      id: option.id || crypto.randomUUID(),
      name: option.name || '',
      price_adjustment: option.price_adjustment || 0,
      is_required: option.is_required || false
    }));
  };

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
      options: [],
      variants: item?.variants || []
    }
  });
  
  // Fetch options when in edit mode
  useEffect(() => {
    const fetchOptions = async () => {
      if (isEditMode && item?.id) {
        try {
          setLoadingOptions(true);
          const { data, error } = await supabase
            .from('menu_item_options')
            .select('*')
            .eq('menu_item_id', item.id);
            
          if (error) throw error;
          
          const formattedOptions = prepareOptions(data || []);
          form.setValue('options', formattedOptions);
        } catch (error) {
          console.error("Error fetching options:", error);
          toast({
            title: "Hata",
            description: "Seçenekler yüklenirken bir hata oluştu.",
            variant: "destructive",
          });
        } finally {
          setLoadingOptions(false);
        }
      }
    };
    
    fetchOptions();
  }, [isEditMode, item, form, toast]);

  const handleImageSelected = (url: string | null) => {
    setImageUrl(url);
    form.setValue('image_path', url);
  };
  
  const onSubmit = async (values: MenuItemFormValues) => {
    setIsSubmitting(true);
    try {
      const formattedValues = {
        name: values.name,
        category_id: values.category_id,
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

      let menuItemId: string;
      
      if (isEditMode && item) {
        menuItemId = item.id;
        const { error } = await supabase
          .from("menu_items")
          .update({
            ...formattedValues,
            updated_at: new Date().toISOString()
          })
          .eq("id", item.id);

        if (error) throw error;
        
      } else {
        const { data, error } = await supabase
          .from("menu_items")
          .insert(formattedValues)
          .select('id')
          .single();

        if (error) throw error;
        if (!data) throw new Error("Menü öğesi oluşturulamadı.");
        
        menuItemId = data.id;
      }

      // Always update options by deleting old ones and inserting new ones
      await handleOptionsUpdate(menuItemId, prepareOptions(values.options));
        
      toast({
        title: "Başarılı",
        description: isEditMode 
          ? "Menü öğesi başarıyla güncellendi" 
          : "Yeni menü öğesi başarıyla oluşturuldu",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionsUpdate = async (menuItemId: string, options: MenuItemOption[]) => {
    try {
      console.log("Updating options for menu item:", menuItemId);
      console.log("Options to save:", options);
      
      // First delete all existing options
      const { error: deleteError } = await supabase
        .from('menu_item_options')
        .delete()
        .eq('menu_item_id', menuItemId);

      if (deleteError) throw deleteError;

      // Then insert new options if there are any
      if (options.length > 0) {
        const optionsToInsert = options.map(option => ({
          menu_item_id: menuItemId,
          name: option.name,
          price_adjustment: option.price_adjustment,
          is_required: option.is_required
        }));
        
        const { error: insertError } = await supabase
          .from('menu_item_options')
          .insert(optionsToInsert);

        if (insertError) throw insertError;
        
        console.log("Options saved successfully:", optionsToInsert.length);
      }
    } catch (error: any) {
      console.error('Error updating options:', error);
      throw error;
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
        
        <OptionsSection form={form} isLoading={loadingOptions} />
      
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
