
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, CheckCircle } from "lucide-react";
import { ReservationState } from '../types/reservationTypes';

interface ConfirmationStepProps {
  state: ReservationState;
  calculateTotal: () => number;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ 
  state, 
  calculateTotal 
}) => {
  const { formData, selectedTable, isPrePayment, transactionId } = state;
  
  return (
    <div className="bg-card border rounded-lg p-8 text-center">
      <div className="bg-primary/10 inline-flex items-center justify-center w-16 h-16 rounded-full mb-6">
        <CheckCircle size={32} className="text-primary" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Rezervasyonunuz Alındı!</h2>
      <p className="text-lg mb-6">
        Rezervasyonunuz başarıyla oluşturuldu. Detaylar e-posta adresinize gönderilmiştir.
      </p>
      
      <div className="bg-muted p-6 rounded-lg mb-8 mx-auto max-w-md text-left">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Rezervasyon Adı</p>
            <p className="font-medium">{formData.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tarih</p>
              <p className="font-medium">
                {formData.date?.toLocaleDateString('tr-TR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saat</p>
              <p className="font-medium">{formData.time}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Masa</p>
              <p className="font-medium">{selectedTable?.label}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kişi Sayısı</p>
              <p className="font-medium">{formData.guests} kişi</p>
            </div>
          </div>
          
          {isPrePayment && transactionId && (
            <div>
              <p className="text-sm text-muted-foreground">Ödeme Durumu</p>
              <div className="flex items-center">
                <Check size={16} className="text-green-600 mr-1" />
                <p className="font-medium text-green-600">
                  {calculateTotal()} ₺ ödendi
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                İşlem ID: {transactionId}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          Ana Sayfaya Dön
        </Button>
        <Button onClick={() => window.print()}>
          Rezervasyon Bilgilerini Yazdır
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
