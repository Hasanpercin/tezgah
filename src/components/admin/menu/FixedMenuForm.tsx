
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FixedMenuPackage, MenuItem } from "@/services/fixedMenuService";
import { Loader2, X } from "lucide-react";

// Schema for form validation
const formSchema = z.object({
  name: z.string().min(2, "Menü adı en az 2 karakter olmalıdır"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Fiyat 0'dan küçük olamaz"),
  is_active: z.boolean().default(true),
  image_path: z.string().optional(),
});

type FixedMenuFormProps = {
  menu: FixedMenuPackage | null;
  isEditMode: boolean;
  onSuccess: () => void;
  onCancel: () => void;
};

export function FixedMenuForm({ menu, isEditMode, onSuccess, onCancel }: FixedMenuFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(menu?.image_path || null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: menu?.name || "",
      description: menu?.description || "",
      price: menu?.price || 0,
      is_active: menu?.is_active !== undefined ? menu.is_active : true,
      image_path: menu?.image_path || "",
    },
  });

  useEffect(() => {
    // Reset the form when the menu prop changes
    if (menu) {
      form.reset({
        name: menu.name || "",
        description: menu.description || "",
        price: menu.price || 0,
        is_active: menu.is_active !== undefined ? menu.is_active : true,
        image_path: menu.image_path || "",
      });
      setImagePreview(menu.image_path || null);
    }
  }, [menu, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      let imagePath = values.image_path;

      // Upload image if a new one is selected
      if (imageFile) {
        const fileName = `fixed-menu-${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("menu")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Generate public URL for the uploaded image
        const { data: publicURL } = supabase.storage
          .from("menu")
          .getPublicUrl(fileName);

        imagePath = publicURL?.publicUrl || "";
      }

      const formData = {
        name: values.name,
        description: values.description || null,
        price: values.price,
        is_active: values.is_active,
        image_path: imagePath || null,
        updated_at: new Date().toISOString(),
      };

      if (isEditMode && menu) {
        // Update existing menu
        const { error } = await supabase
          .from("fixed_menu_packages")
          .update(formData)
          .eq("id", menu.id);

        if (error) throw error;

        toast({
          title: "Başarılı",
          description: "Fix menü başarıyla güncellendi",
        });
      } else {
        // Create new menu
        const { error } = await supabase
          .from("fixed_menu_packages")
          .insert(formData);

        if (error) throw error;

        toast({
          title: "Başarılı",
          description: "Yeni fix menü başarıyla oluşturuldu",
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
      setIsLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      form.setValue("image_path", "pending-upload");
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    form.setValue("image_path", "");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-lg font-semibold mb-4">
          {isEditMode ? "Fix Menü Düzenle" : "Yeni Fix Menü Ekle"}
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <FormLabel>Menü Görseli</FormLabel>
          <div className="mt-2">
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-md overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Menu preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-md">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
                >
                  Görsel Seç
                </label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG veya GIF, max 5MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Menü Adı</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Fix menü adı" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Açıklama</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Menü açıklaması"
                  value={field.value || ""}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Field */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fiyat (TL)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  min={0}
                  step={0.01}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active Status */}
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Aktif Durum</FormLabel>
                <FormDescription>
                  Bu menü müşterilere gösterilsin mi?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Form Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            İptal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Güncelle" : "Oluştur"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
