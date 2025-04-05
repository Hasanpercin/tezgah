
import { Button } from "@/components/ui/button";
import { FileEdit, Save } from "lucide-react";
import { Trash2, Plus } from "@/components/admin/icons";

type GalleryContentProps = {
  onSave: () => void;
};

export const GalleryContent = ({ onSave }: GalleryContentProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Galeri Yönetimi</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="relative group aspect-square border rounded-md overflow-hidden">
            <img 
              src={`https://source.unsplash.com/random/300x300?food&sig=${item}`} 
              alt={`Gallery item ${item}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button variant="ghost" size="sm" className="text-white">
                <FileEdit size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="text-white">
                <Trash2 size={16} className="text-red-400" />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="border border-dashed rounded-md flex flex-col items-center justify-center aspect-square">
          <Button variant="ghost" className="flex flex-col h-full w-full items-center justify-center gap-2">
            <Plus size={24} />
            <span className="text-sm">Yeni Görsel Ekle</span>
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button onClick={onSave} className="flex items-center gap-2">
          <Save size={16} /> Değişiklikleri Kaydet
        </Button>
      </div>
    </div>
  );
};
