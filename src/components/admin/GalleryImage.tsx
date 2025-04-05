
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileEdit, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type GalleryImageProps = {
  id: number;
  src: string;
  alt: string;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

export const GalleryImage = ({ id, src, alt, onDelete, onEdit }: GalleryImageProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <div className="relative group aspect-square border rounded-md overflow-hidden">
        <img 
          src={src} 
          alt={alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button variant="ghost" size="sm" className="text-white" onClick={() => onEdit(id)}>
            <FileEdit size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 size={16} className="text-red-400" />
          </Button>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Görseli Silmek İstiyor musunuz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Görsel kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(id)}>Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
