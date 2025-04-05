
import React from 'react';
import { Button } from "@/components/ui/button";
import PaymentForm from "@/components/payments/PaymentForm";
import ReservationSummary from "@/components/reservation/ReservationSummary";
import { ReservationState } from '../types/reservationTypes';

interface PaymentStepProps {
  state: ReservationState;
  calculateTotal: () => number;
  handleSkipPayment: () => void;
  handlePaymentComplete: (txId: string) => void;
  setIsPrePayment: (isPre: boolean) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  state,
  calculateTotal,
  handleSkipPayment,
  handlePaymentComplete,
  setIsPrePayment
}) => {
  const { formData, selectedTable, selectedFixMenu, selectedALaCarteItems, isPrePayment } = state;
  
  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-lg p-6">
        <ReservationSummary
          date={formData.date}
          time={formData.time}
          guests={formData.guests}
          selectedTable={selectedTable}
          selectedFixMenu={selectedFixMenu}
          selectedALaCarteItems={selectedALaCarteItems}
          isPrePayment={isPrePayment}
        />
      </div>
      
      <div className="bg-card border rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Ödeme</h3>
          <p className="text-muted-foreground">
            Şimdi ödeme yaparak %10 indirim fırsatından yararlanın veya restoranda ödeme yapmayı tercih edin.
          </p>
        </div>
        
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button 
            variant="outline" 
            className="h-auto py-4"
            onClick={handleSkipPayment}
          >
            <div className="text-left">
              <div className="font-medium">Restoranda Ödeme</div>
              <div className="text-sm text-muted-foreground mt-1">
                Ödeme işlemini restoranda gerçekleştirin
              </div>
            </div>
          </Button>
          
          <Button 
            variant="default"
            className="h-auto py-4"
            onClick={() => setIsPrePayment(true)}
          >
            <div className="text-left">
              <div className="font-medium">Şimdi Öde, %10 İndirim Kazan</div>
              <div className="text-sm text-white/80 mt-1">
                Online ödeme ile indirimden yararlanın
              </div>
            </div>
          </Button>
        </div>
        
        {isPrePayment && (
          <PaymentForm 
            amount={calculateTotal()} 
            onPaymentComplete={handlePaymentComplete}
            onCancel={() => setIsPrePayment(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentStep;
