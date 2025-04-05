
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Types (matching from other components)
type Table = {
  id: number;
  type: 'window' | 'center' | 'corner' | 'booth';
  size: 2 | 4 | 6 | 8;
  position: { x: number; y: number };
  available: boolean;
  label: string;
};

type FixMenuOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starter' | 'main' | 'dessert';
  image?: string;
};

type ReservationSummaryProps = {
  date: Date | null;
  time: string;
  guests: string;
  selectedTable: Table | null;
  selectedFixMenu: FixMenuOption | null;
  selectedALaCarteItems: { item: MenuItem, quantity: number }[];
  isPrePayment: boolean;
};

const ReservationSummary = ({
  date,
  time,
  guests,
  selectedTable,
  selectedFixMenu,
  selectedALaCarteItems,
  isPrePayment
}: ReservationSummaryProps) => {
  // Calculate subtotal
  const calculateSubtotal = () => {
    if (selectedFixMenu) {
      return selectedFixMenu.price * parseInt(guests);
    } else {
      return selectedALaCarteItems.reduce(
        (sum, { item, quantity }) => sum + (item.price * quantity),
        0
      );
    }
  };
  
  // Calculate discount (if pre-payment is enabled)
  const calculateDiscount = () => {
    if (!isPrePayment) return 0;
    
    const subtotal = calculateSubtotal();
    // 10% discount for pre-payment
    return Math.round(subtotal * 0.1);
  };
  
  // Calculate final total
  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };
  
  // Check if all required information is provided
  const isComplete = date && time && guests && selectedTable && 
    (selectedFixMenu || selectedALaCarteItems.length > 0);
  
  return (
    <div className="py-6">
      <div className="pb-6">
        <h3 className="text-lg font-semibold mb-2">Rezervasyon Özeti</h3>
        <p className="text-muted-foreground">
          Lütfen rezervasyon bilgilerinizi kontrol edin.
        </p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {/* Reservation Details */}
          <div className="mb-6">
            <h4 className="text-base font-medium mb-4">Rezervasyon Detayları</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tarih</p>
                <p className="font-medium">
                  {date ? date.toLocaleDateString('tr-TR') : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Saat</p>
                <p className="font-medium">{time || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Kişi Sayısı</p>
                <p className="font-medium">{guests || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Masa</p>
                <p className="font-medium">{selectedTable?.label || '-'}</p>
              </div>
            </div>
          </div>
          
          {/* Menu Details */}
          <div className="mb-6">
            <h4 className="text-base font-medium mb-4">Menü Detayları</h4>
            
            {selectedFixMenu ? (
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <h5 className="font-medium">{selectedFixMenu.name}</h5>
                  <Badge variant="outline">{selectedFixMenu.price} ₺ / kişi</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{selectedFixMenu.description}</p>
                <div className="text-sm flex justify-between">
                  <span>{guests} kişi x {selectedFixMenu.price} ₺</span>
                  <span className="font-medium">{parseInt(guests) * selectedFixMenu.price} ₺</span>
                </div>
              </div>
            ) : selectedALaCarteItems.length > 0 ? (
              <div className="border-b pb-4 mb-4 space-y-2">
                {selectedALaCarteItems.map(({ item, quantity }) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {quantity}x {item.name}
                      <span className="text-muted-foreground ml-2">{item.price} ₺/adet</span>
                    </span>
                    <span className="font-medium">{item.price * quantity} ₺</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">Henüz menü seçimi yapılmadı.</p>
            )}
            
            {/* Price Calculation */}
            {(selectedFixMenu || selectedALaCarteItems.length > 0) && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span>{calculateSubtotal()} ₺</span>
                </div>
                
                {isPrePayment && (
                  <div className="flex justify-between text-green-600">
                    <span>Ön Ödeme İndirimi (10%)</span>
                    <span>-{calculateDiscount()} ₺</span>
                  </div>
                )}
                
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Toplam</span>
                  <span>{calculateTotal()} ₺</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Notes */}
          <div className="p-3 bg-muted/50 rounded-md text-sm text-muted-foreground">
            <p>
              {isPrePayment ? (
                "Rezervasyonunuzu ön ödeme ile tamamlayarak %10 indirim fırsatından yararlanıyorsunuz. Ödemeniz, toplam tutardan düşülecektir."
              ) : (
                "Rezervasyonunuzu ön ödemesiz olarak tamamlıyorsunuz. Ödemeyi restoranda gerçekleştireceksiniz."
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationSummary;
