
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ReservationSummary from '../ReservationSummary';
import PaymentForm from '@/components/payments/PaymentForm';
import { ReservationState, ReservationSummaryProps } from '../types/reservationTypes';

type PaymentStepProps = {
  state: ReservationState;
  calculateTotal: () => number;
  handleSkipPayment: () => void;
  handlePaymentComplete: (txId: string) => void;
  setIsPrePayment: (isPrePayment: boolean) => void;
};

const PaymentStep: React.FC<PaymentStepProps> = ({ 
  state, 
  calculateTotal, 
  handleSkipPayment,
  handlePaymentComplete,
  setIsPrePayment
}) => {
  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Rezervasyon Özeti</h3>
        <ReservationSummary 
          state={state}
          calculateTotal={calculateTotal}
          showPaymentInfo={false}
        />
      </Card>

      {state.isPrePayment ? (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Ön Ödeme</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Rezervasyonunuzu tamamlamak için lütfen {calculateTotal()} TL tutarındaki ön ödemeyi gerçekleştirin. 
            Ön ödeme rezervasyonunuzu garanti altına alır ve toplam tutardan düşülür.
          </p>
          
          <PaymentForm 
            amount={calculateTotal()} 
            onPaymentComplete={handlePaymentComplete}
          />
          
          <div className="mt-6">
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => setIsPrePayment(false)}
                className="text-sm"
              >
                Ön ödeme yapmadan devam et
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Ön ödeme tutarı: <strong>{calculateTotal()} TL</strong>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Ödeme Bilgisi</h3>
          <p className="text-muted-foreground mb-4">
            Ön ödeme yapmadan devam etmeyi seçtiniz. Ödemeyi restoranda yapabilirsiniz.
          </p>
          <p className="font-semibold">Toplam tutar: {calculateTotal()} TL</p>
          
          <div className="mt-6">
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => setIsPrePayment(true)}
              >
                Yine de ön ödeme yap
              </Button>
              
              <Button 
                onClick={handleSkipPayment}
              >
                Ödeme Yapmadan Devam Et
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PaymentStep;
