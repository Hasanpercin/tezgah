
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { TableData } from "./types";

interface TableFormData {
  name: string;
  type: 'window' | 'center' | 'corner' | 'booth';
  size: number;
  position_x: number;
  position_y: number;
  is_active: boolean;
}

interface TableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TableFormData) => Promise<void>;
  editingTable: TableData | null;
}

export const TableDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  editingTable 
}: TableDialogProps) => {
  const [formData, setFormData] = useState<TableFormData>({
    name: '',
    type: 'center',
    size: 4,
    position_x: 50,
    position_y: 50,
    is_active: true
  });

  useEffect(() => {
    if (editingTable) {
      setFormData({
        name: editingTable.name,
        type: editingTable.type,
        size: editingTable.size,
        position_x: editingTable.position_x,
        position_y: editingTable.position_y,
        is_active: editingTable.is_active
      });
    } else {
      setFormData({
        name: '',
        type: 'center',
        size: 4,
        position_x: 50,
        position_y: 50,
        is_active: true
      });
    }
  }, [editingTable]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingTable ? "Masa Düzenle" : "Yeni Masa Ekle"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Masa Adı</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Masa Türü</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value as 'window' | 'center' | 'corner' | 'booth')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Masa türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="window">Pencere Kenarı</SelectItem>
                  <SelectItem value="center">Orta Alan</SelectItem>
                  <SelectItem value="corner">Köşe</SelectItem>
                  <SelectItem value="booth">Loca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Kapasite (Kişi)</Label>
              <Input
                id="size"
                name="size"
                type="number"
                min="1"
                max="20"
                value={formData.size}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_active">Durum</Label>
              <Select
                value={formData.is_active ? "active" : "inactive"}
                onValueChange={(value) => handleSelectChange("is_active", value === "active" ? "true" : "false")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position_x">Konum X (%)</Label>
              <Input
                id="position_x"
                name="position_x"
                type="number"
                min="0"
                max="100"
                value={formData.position_x}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position_y">Konum Y (%)</Label>
              <Input
                id="position_y"
                name="position_y"
                type="number"
                min="0"
                max="100"
                value={formData.position_y}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {editingTable ? "Güncelle" : "Kaydet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
