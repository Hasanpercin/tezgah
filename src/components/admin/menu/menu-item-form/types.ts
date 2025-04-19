
import { z } from "zod";

export const optionSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(1, { message: "Seçenek adı gerekli" }),
  price_adjustment: z.coerce.number().default(0),
  is_required: z.boolean().default(false)
});

export const variantSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(1, { message: "Çeşit adı gerekli" }),
  price_adjustment: z.coerce.number().default(0)
});

export const menuItemSchema = z.object({
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
  is_in_stock: z.boolean().default(true),
  display_order: z.coerce.number().int().default(0),
  options: z.array(optionSchema).default([]),
  variants: z.array(variantSchema).default([])
});

export type MenuItemFormValues = z.infer<typeof menuItemSchema>;
export type OptionValues = z.infer<typeof optionSchema>;
export type VariantValues = z.infer<typeof variantSchema>;
