
import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { ReservationSummaryProps } from './types/reservationTypes';
import { Calendar, Clock, Users, MapPin, CreditCard, Tag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export const ReservationSummary = ({ state }: ReservationSummaryProps) => {
  // Calculate totals for display
  const calculateSubtotal = () => {
    if (state.menuSelection.type === 'fixed_menu' && state.menuSelection.selectedFixedMenu) {
      return state.menuSelection.selectedFixedMenu.price * parseInt(state.formData.guests);
    } else if (state.menuSelection.type === 'a_la_carte' && state.menuSelection.selectedMenuItems) {
      return state.menuSelection.selectedMenuItems.reduce((sum, item) => {
        return sum + (item.price * (item.quantity || 1));
      }, 0);
    }
    return 0;
  };
  
  const subtotal = state.payment?.amount !== undefined 
    ? (state.payment.amount + (state.payment.discountAmount || 0))
    : calculateSubtotal();
    
  const discount = state.payment?.discountAmount || 0;
  const discountPercentage = state.payment?.discountPercentage || 0;
  const total = subtotal - discount;
  
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Rezervasyon Özeti</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Tarih</p>
                <p className="font-medium">
                  {state.formData.date
                    ? format(state.formData.date, 'PPP', { locale: tr })
                    : 'Tarih seçilmedi'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Saat</p>
                <p className="font-medium">{state.formData.time}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Users className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Kişi Sayısı</p>
                <p className="font-medium">{state.formData.guests} Kişi</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Masa</p>
                <p className="font-medium">
                  {state.selectedTable 
                    ? `${state.selectedTable.name || state.selectedTable.label} (${state.selectedTable.size} kişilik)`
                    : 'Masa seçilmedi'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Tag className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Menü Seçimi</p>
                <div>
                  {state.menuSelection.type === 'fixed_menu' && state.menuSelection.selectedFixedMenu && (
                    <div>
                      <Badge className="mb-1">Sabit Menü</Badge>
                      <p className="font-medium">{state.menuSelection.selectedFixedMenu.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {state.formData.guests} kişi × {state.menuSelection.selectedFixedMenu.price.toLocaleString('tr-TR')} ₺
                      </p>
                    </div>
                  )}
                  
                  {state.menuSelection.type === 'a_la_carte' && state.menuSelection.selectedMenuItems && (
                    <div>
                      <Badge className="mb-1">A La Carte</Badge>
                      <p className="text-sm">
                        {state.menuSelection.selectedMenuItems.length} farklı ürün, toplam {state.menuSelection.selectedMenuItems.reduce((sum, item) => sum + (item.quantity || 1), 0)} adet
                      </p>
                    </div>
                  )}
                  
                  {state.menuSelection.type === 'at_restaurant' && (
                    <p className="font-medium">Restoranda seçim yapılacak</p>
                  )}
                </div>
              </div>
            </div>
            
            {state.payment?.isPaid && (
              <div className="flex items-start">
                <CreditCard className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Ödeme Durumu</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                    Ön Ödeme Tamamlandı
                  </Badge>
                  {state.payment.transactionId && (
                    <p className="text-xs text-muted-foreground mt-1">
                      İşlem No: {state.payment.transactionId}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {(state.menuSelection.type !== 'at_restaurant' || state.payment?.isPaid) && (
          <>
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ara Toplam:</span>
                <span>{subtotal.toLocaleString('tr-TR')} ₺</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>İndirim ({discountPercentage}%):</span>
                  <span>-{discount.toLocaleString('tr-TR')} ₺</span>
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-medium">
                <span>Toplam:</span>
                <span>{total.toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>
          </>
        )}
        
        {state.formData.notes && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="font-medium text-sm">Özel Notlar:</p>
            <p className="text-sm">{state.formData.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
