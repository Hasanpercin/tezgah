
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash, Edit } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { MenuItemFormValues, OptionValues } from "./types";
import { v4 as uuidv4 } from "uuid";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface OptionsSectionProps {
  form: UseFormReturn<MenuItemFormValues>;
}

export function OptionsSection({ form }: OptionsSectionProps) {
  const options = form.watch("options") || [];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [optionForm, setOptionForm] = useState<OptionValues>({
    id: uuidv4(),
    name: "",
    price_adjustment: 0,
    is_required: false
  });

  const handleOpenDialog = (index?: number) => {
    if (index !== undefined) {
      const option = options[index];
      setOptionForm({
        id: option.id,
        name: option.name,
        price_adjustment: option.price_adjustment,
        is_required: option.is_required
      });
      setEditingIndex(index);
    } else {
      setOptionForm({
        id: uuidv4(),
        name: "",
        price_adjustment: 0,
        is_required: false
      });
      setEditingIndex(null);
    }
    setIsDialogOpen(true);
  };

  const handleSaveOption = () => {
    const newOptions = [...options];
    
    if (editingIndex !== null) {
      newOptions[editingIndex] = optionForm;
    } else {
      newOptions.push(optionForm);
    }
    
    form.setValue("options", newOptions);
    setIsDialogOpen(false);
  };

  const handleDeleteOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    form.setValue("options", newOptions);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel>Seçenekler</FormLabel>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="mr-2 h-4 w-4" /> Seçenek Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingIndex !== null ? "Seçenek Düzenle" : "Yeni Seçenek Ekle"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <FormLabel>Seçenek Adı</FormLabel>
                <Input 
                  value={optionForm.name} 
                  onChange={(e) => setOptionForm({...optionForm, name: e.target.value})}
                  placeholder="Ekstra malzeme, sos vb."
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel>Fiyat Farkı (₺)</FormLabel>
                <Input 
                  type="number" 
                  value={optionForm.price_adjustment}
                  onChange={(e) => setOptionForm({...optionForm, price_adjustment: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-required"
                  checked={optionForm.is_required}
                  onCheckedChange={(checked) => setOptionForm({...optionForm, is_required: checked})}
                />
                <FormLabel htmlFor="is-required" className="cursor-pointer">Zorunlu Seçenek</FormLabel>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>İptal</Button>
              <Button onClick={handleSaveOption} disabled={!optionForm.name}>
                {editingIndex !== null ? "Güncelle" : "Ekle"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {options.length > 0 ? (
        <div className="space-y-2">
          {options.map((option, index) => (
            <Card key={option.id} className="bg-muted/30">
              <CardContent className="p-3 flex justify-between items-center">
                <div className="flex-1">
                  <div className="font-medium">{option.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-4">
                    {option.price_adjustment > 0 && (
                      <span>+{option.price_adjustment} ₺</span>
                    )}
                    {option.is_required && (
                      <Badge variant="outline" className="bg-blue-50">Zorunlu</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleOpenDialog(index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteOption(index)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground border border-dashed rounded-md p-4 text-center">
          Bu ürün için henüz seçenek eklenmedi
        </div>
      )}
      
      <Separator className="my-4" />
    </div>
  );
}
