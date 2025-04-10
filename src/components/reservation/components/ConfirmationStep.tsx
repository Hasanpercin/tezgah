
import React from 'react';
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { ReservationState } from '../types/reservationTypes';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ConfirmationStepProps {
  state: ReservationState;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ state }) => {
  // Format date
  const formattedDate = state.formData.date 
    ? format(new Date(state.formData.date), 'PP', { locale: tr }) 
    : '';

  return (
    <div className="space-y-8">
      <Card className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-green-700 mb-2">
          Rezervasyonunuz Onaylandı!
        </h2>
        <p className="text-lg mb-4">
          Rezervasyon detayları e-posta adresinize gönderildi.
        </p>
        <p className="text-muted-foreground">
          Rezervasyon Numarası: <span className="font-medium">{'RES' + Math.floor(Math.random() * 9000000 + 1000000)}</span>
        </p>
      </Card>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Rezervasyon Detayları</h3>
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
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
