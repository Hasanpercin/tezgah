
import { formatDate } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/services/menuService";
import { ReservationState } from "./types/reservationTypes";

interface ReservationSummaryProps {
  state: ReservationState;
  calculateTotal: () => number;
  showPaymentInfo?: boolean;
}

const ReservationSummary = ({ state, calculateTotal, showPaymentInfo = true }: ReservationSummaryProps) => {
  const { formData, selectedTable, selectedFixMenu, selectedALaCarteItems, selectAtRestaurant } = state;
  
  // Total calculation
  const total = calculateTotal();
  const hasItemsSelected = selectedFixMenu || selectedALaCarteItems.length > 0 || selectAtRestaurant;
  
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <h3 className="text-lg font-semibold">Rezervasyon Özeti</h3>
        
        {/* Basic Info */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ad Soyad:</span>
            <span className="font-medium">{formData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tarih:</span>
            <span className="font-medium">
              {formData.date ? formatDate(formData.date, "dd.MM.yyyy") : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Saat:</span>
            <span className="font-medium">{formData.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kişi Sayısı:</span>
            <span className="font-medium">{formData.guests}</span>
          </div>
          {formData.occasion && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Özel Gün:</span>
              <span className="font-medium">{formData.occasion}</span>
            </div>
          )}
        </div>
        
        {/* Table Info */}
        {selectedTable && (
          <div className="border-t pt-4">
            <h4 className="text-base font-medium mb-2">Masa Bilgisi</h4>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Masa:</span>
              <span className="font-medium">{selectedTable.name || selectedTable.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kapasite:</span>
              <span className="font-medium">{selectedTable.size} Kişi</span>
            </div>
          </div>
        )}
        
        {/* Menu Info */}
        {hasItemsSelected && (
          <div className="border-t pt-4">
            <h4 className="text-base font-medium mb-2">Menü Seçimi</h4>
            
            {selectAtRestaurant ? (
              <p className="text-muted-foreground">Menü seçiminizi restoranda yapacaksınız.</p>
            ) : selectedFixMenu ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fix Menü:</span>
                  <span className="font-medium">{selectedFixMenu.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kişi Başı:</span>
                  <span className="font-medium">{formatPrice(selectedFixMenu.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Toplam:</span>
                  <span className="font-medium">
                    {formatPrice(selectedFixMenu.price * parseInt(formData.guests))}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedALaCarteItems.map(({ item, quantity }) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">{item.name} x {quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * quantity)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Payment Info */}
        {showPaymentInfo && hasItemsSelected && !selectAtRestaurant && (
          <div className="border-t pt-4">
            <h4 className="text-base font-medium mb-2">Ödeme Bilgisi</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ödeme Türü:</span>
                <span className="font-medium">
                  {state.isPrePayment ? "Ön Ödeme (10% İndirim)" : "Restoranda Ödeme"}
                </span>
              </div>
              {state.isPrePayment && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">İndirim:</span>
                    <span className="font-medium text-green-600">
                      {formatPrice(total * 0.1)}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Ödenecek Tutar:</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Notes */}
        {formData.notes && (
          <div className="border-t pt-4">
            <h4 className="text-base font-medium mb-2">Notlar</h4>
            <p className="text-muted-foreground">{formData.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationSummary;
