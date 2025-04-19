
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { MenuItemFormValues } from "./types";

interface AdditionalDetailsProps {
  form: UseFormReturn<MenuItemFormValues>;
}

export function AdditionalDetails({ form }: AdditionalDetailsProps) {
  return (
    <div className="flex-1 space-y-4">
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
  );
}
