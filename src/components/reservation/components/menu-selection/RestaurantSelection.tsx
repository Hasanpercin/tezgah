
import { FileText } from 'lucide-react';

const RestaurantSelection = () => {
  return (
    <div className="mt-8 p-6 bg-muted/30 rounded-xl text-center max-w-3xl mx-auto">
      <FileText className="h-12 w-12 mx-auto text-primary/60 mb-4" />
      <h4 className="text-xl font-medium mb-3">Menü Seçiminizi Restoranda Yapacaksınız</h4>
      <p className="text-muted-foreground mb-4">
        Rezervasyonunuz onaylandı. Menü seçiminizi restoranımıza geldiğinizde yapabilirsiniz. 
        Şefimiz ve ekibimiz size özel bir deneyim için hazır olacak.
      </p>
      <p className="text-sm text-amber-600">
        Not: Önceden menü seçimi yapmazsanız %10 indirim hakkınızı kullanamayacaksınız.
      </p>
    </div>
  );
};

export default RestaurantSelection;
