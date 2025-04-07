
import { formatPrice } from '@/services/menuService';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Users, Clock, Utensils, MapPin, FileText } from 'lucide-react';
import { FixMenuOption } from './types/reservationTypes';

export type ReservationSummaryProps = {
  formData: {
    name: string;
    email: string;
    phone: string;
    date: Date | null;
    time: string;
    guests: string;
    notes?: string;
  };
  selectedTable: {
    id: number | string;
    name?: string;
    size: 2 | 4 | 6 | 8;
    type: 'window' | 'center' | 'corner' | 'booth';
  } | null;
  selectedFixMenu: FixMenuOption | null;
  selectedALaCarteItems: { 
    item: {
      id: string;
      name: string;
      price: number;
    }, 
    quantity: number 
  }[];
  selectAtRestaurant: boolean;
  totalAmount?: number;
};

const ReservationSummary: React.FC<ReservationSummaryProps> = ({
  formData,
  selectedTable,
  selectedFixMenu,
  selectedALaCarteItems,
  selectAtRestaurant,
  totalAmount
}) => {
  return (
    <Card className="border">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Rezervasyon Özeti</h3>
        
        {/* Personal & Reservation Details */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{formData.name}</p>
              <p className="text-sm text-muted-foreground">{formData.email}</p>
              <p className="text-sm text-muted-foreground">{formData.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <p>
              {formData.date 
                ? format(formData.date, 'dd.MM.yyyy') 
                : 'Tarih seçilmedi'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <p>{formData.time || 'Saat seçilmedi'}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <p>{formData.guests} Kişi</p>
          </div>
          
          {formData.notes && formData.notes.trim() !== '' && (
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm">{formData.notes}</p>
            </div>
          )}
        </div>
        
        {/* Table Details */}
        <Separator className="my-4" />
        <div className="mb-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Masa
          </h4>
          
          {selectedTable ? (
            <div className="text-sm pl-6">
              <p>
                {selectedTable.name || `Masa #${selectedTable.id}`}
                <span className="ml-2 text-muted-foreground">
                  ({selectedTable.size} Kişilik, 
                  {selectedTable.type === 'window' ? ' Pencere Kenarı' : 
                   selectedTable.type === 'corner' ? ' Köşe' : 
                   selectedTable.type === 'center' ? ' Orta' : 
                   selectedTable.type === 'booth' ? ' Alan' : ''}
                  )
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground pl-6">Henüz masa seçilmedi</p>
          )}
        </div>
        
        {/* Menu Details */}
        <Separator className="my-4" />
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Utensils className="h-4 w-4" /> Menü
          </h4>
          
          {selectAtRestaurant ? (
            <p className="text-sm pl-6">Menü seçimi restoranda yapılacak</p>
          ) : selectedFixMenu ? (
            <div className="pl-6">
              <p className="font-medium">{selectedFixMenu.name}</p>
              <div className="flex justify-between mt-1 text-sm">
                <span>
                  {selectedFixMenu.quantity || formData.guests} x {formatPrice(selectedFixMenu.price)}
                </span>
                <span className="font-medium">
                  {formatPrice(selectedFixMenu.price * (selectedFixMenu.quantity || parseInt(formData.guests)))}
                </span>
              </div>
            </div>
          ) : selectedALaCarteItems.length > 0 ? (
            <div className="pl-6">
              <p className="font-medium mb-2">A La Carte</p>
              <div className="space-y-1 text-sm">
                {selectedALaCarteItems.map(({item, quantity}) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x {quantity}</span>
                    <span>{formatPrice(item.price * quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground pl-6">Henüz menü seçilmedi</p>
          )}
        </div>
        
        {/* Total */}
        {totalAmount !== undefined && (
          <>
            <Separator className="my-4" />
            <div className="flex justify-between items-center pt-2">
              <p className="font-semibold">Toplam</p>
              <p className="font-semibold text-xl text-primary">
                {formatPrice(totalAmount)}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationSummary;
