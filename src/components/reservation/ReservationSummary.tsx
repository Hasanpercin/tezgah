
import React from 'react';
import { Card } from "@/components/ui/card";
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ReservationSummaryProps } from './types/reservationTypes';

const ReservationSummary: React.FC<ReservationSummaryProps> = ({ 
  state, 
  calculateTotal,
  showPaymentInfo = true 
}) => {
  // Format date
  const formattedDate = state.formData.date 
    ? format(new Date(state.formData.date), 'PP', { locale: tr }) 
    : '';

  return (
    <div className="space-y-4">
      {/* Reservation Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">İsim</p>
          <p className="text-base">{state.formData.name}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium">İletişim Bilgileri</p>
          <p className="text-base">{state.formData.email}</p>
          <p className="text-sm text-muted-foreground">{state.formData.phone}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium">Tarih & Saat</p>
          <p className="text-base">{formattedDate}, {state.formData.time}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium">Misafir Sayısı</p>
          <p className="text-base">{state.formData.guests} Kişi</p>
        </div>
        
        {state.formData.occasion && (
          <div>
            <p className="text-sm font-medium">Özel Gün</p>
            <p className="text-base">
              {state.formData.occasion === 'birthday' ? 'Doğum Günü' :
               state.formData.occasion === 'anniversary' ? 'Yıldönümü' :
               state.formData.occasion === 'business' ? 'İş Yemeği' :
               state.formData.occasion === 'date' ? 'Romantik Akşam Yemeği' : 'Diğer'}
            </p>
          </div>
        )}
        
        {state.formData.notes && (
          <div className="col-span-2">
            <p className="text-sm font-medium">Notlar</p>
            <p className="text-base">{state.formData.notes}</p>
          </div>
        )}
      </div>
      
      {/* Table Information */}
      {state.selectedTable && (
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium mb-2">Masa Bilgisi</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Masa</p>
              <p className="text-base">{state.selectedTable.name || state.selectedTable.label}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium">Konum</p>
              <p className="text-base">
                {state.selectedTable.type === 'window' ? 'Pencere Kenarı' :
                 state.selectedTable.type === 'center' ? 'Orta Bölüm' :
                 state.selectedTable.type === 'corner' ? 'Köşe' : 'Özel Bölüm'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium">Kapasite</p>
              <p className="text-base">{state.selectedTable.size} Kişilik</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Menu Information */}
      {!state.selectAtRestaurant && (
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium mb-2">Menü Bilgisi</h4>
          {state.selectedFixMenu ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-medium">{state.selectedFixMenu.name}</p>
                  <p className="text-sm text-muted-foreground">{state.selectedFixMenu.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{state.selectedFixMenu.price} TL</p>
                  <p className="text-sm text-muted-foreground">
                    {state.selectedFixMenu.quantity || parseInt(state.formData.guests)} × {state.selectedFixMenu.price} TL
                  </p>
                </div>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <p className="text-base font-medium">Toplam</p>
                <p className="text-lg font-bold">
                  {state.selectedFixMenu.price * (state.selectedFixMenu.quantity || parseInt(state.formData.guests))} TL
                </p>
              </div>
            </div>
          ) : state.selectedALaCarteItems.length > 0 ? (
            <div>
              {state.selectedALaCarteItems.map((orderItem, index) => (
                <div key={orderItem.item.id} className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-medium">{orderItem.item.name}</p>
                    <p className="text-sm text-muted-foreground">{orderItem.quantity} adet</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{orderItem.item.price} TL</p>
                    <p className="text-sm text-muted-foreground">{orderItem.quantity} × {orderItem.item.price} TL</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 mt-2">
                <p className="text-base font-medium">Toplam</p>
                <p className="text-lg font-bold">
                  {state.selectedALaCarteItems.reduce((sum, item) => 
                    sum + (item.item.price * item.quantity), 0)} TL
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Menü seçilmedi</p>
          )}
        </div>
      )}
      
      {/* Payment Information */}
      {showPaymentInfo && (
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium mb-2">Ödeme Bilgisi</h4>
          {state.isPrePayment ? (
            <>
              <div className="flex justify-between items-center mb-1">
                <p>Ön Ödeme Tutarı</p>
                <p className="font-medium">{calculateTotal()} TL</p>
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                %10 ön ödeme indirimi uygulandı
              </div>
            </>
          ) : (
            <p className="text-muted-foreground mb-2">
              Ödeme restoranda yapılacak
            </p>
          )}
          
          <div className="flex justify-between items-center pt-2 border-t">
            <p className="text-base font-medium">Toplam Tutar</p>
            <p className="text-lg font-bold">{calculateTotal()} TL</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationSummary;
