
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Clock, Users, MapPin, Info, Utensils } from "lucide-react";
import { ReservationSummaryProps } from '../types/reservationTypes';

const ConfirmationStep = ({ state }: ReservationSummaryProps) => {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Tarih seçilmedi';
    return format(date, 'd MMMM yyyy', { locale: tr });
  };
  
  const getMenuSelectionText = () => {
    const { menuSelection } = state;
    if (menuSelection.type === 'fixed_menu' && menuSelection.selectedFixedMenu) {
      return `Fix Menü: ${menuSelection.selectedFixedMenu.name}`;
    } else if (menuSelection.type === 'a_la_carte') {
      return 'A La Carte Menü';
    } else {
      return 'Restoranda Menü Seçimi';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-semibold">Rezervasyonunuz Onaylandı</h3>
        <p className="text-muted-foreground mt-2">
          Rezervasyon bilgileriniz başarıyla kaydedildi.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Rezervasyon Özeti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reservation Details */}
            <div>
              <h4 className="text-md font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Rezervasyon Bilgileri
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Tarih</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(state.formData.date)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Saat</p>
                    <p className="text-sm text-muted-foreground">
                      {state.formData.time}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Kişi Sayısı</p>
                    <p className="text-sm text-muted-foreground">
                      {state.formData.guests} kişi
                    </p>
                  </div>
                </div>
                
                {state.formData.occasion && (
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Özel Gün</p>
                      <p className="text-sm text-muted-foreground">
                        {state.formData.occasion}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Table and Menu Details */}
            <div>
              <h4 className="text-md font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Masa ve Menü Bilgileri
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Masa</p>
                    <p className="text-sm text-muted-foreground">
                      {state.selectedTable?.name || state.selectedTable?.label || 'Masa seçilmedi'}
                      {state.selectedTable?.type && ` (${state.selectedTable.type})`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Menü Seçimi</p>
                    <p className="text-sm text-muted-foreground">
                      {getMenuSelectionText()}
                    </p>
                  </div>
                </div>
                
                {state.menuSelection.type === 'fixed_menu' && state.menuSelection.selectedFixedMenu && (
                  <div className="p-3 bg-primary/5 rounded-md mt-2">
                    <p className="text-sm font-medium">
                      {state.formData.guests} kişi × {state.menuSelection.selectedFixedMenu.name}
                    </p>
                    {typeof state.menuSelection.selectedFixedMenu.price === 'number' && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Toplam: {(parseInt(state.formData.guests) * state.menuSelection.selectedFixedMenu.price).toLocaleString('tr-TR')} ₺
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Contact Details */}
          <div>
            <h4 className="text-md font-semibold mb-4 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              İletişim Bilgileri
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">İsim</p>
                <p className="text-sm text-muted-foreground">
                  {state.formData.name}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">E-posta</p>
                <p className="text-sm text-muted-foreground">
                  {state.formData.email}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Telefon</p>
                <p className="text-sm text-muted-foreground">
                  {state.formData.phone}
                </p>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          {state.formData.notes && (
            <div>
              <h4 className="text-md font-semibold mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Notlar
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                {state.formData.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center mt-6 text-sm text-muted-foreground">
        <p>Rezervasyon değişikliği veya iptali için lütfen bizimle iletişime geçin.</p>
        <p className="mt-1">Rezervasyonunuzla ilgili sorularınız için +90 554 434 60 68 numaralı telefondan bizimle iletişime geçebilirsiniz.</p>
      </div>
    </div>
  );
};

export default ConfirmationStep;
