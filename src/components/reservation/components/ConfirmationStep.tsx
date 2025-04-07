
import React from 'react';
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import ReservationSummary from '../ReservationSummary';
import { ReservationState, ReservationSummaryProps } from '../types/reservationTypes';

interface ConfirmationStepProps {
  state: ReservationState;
  calculateTotal: () => number;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ state, calculateTotal }) => {
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
          Rezervasyon Numarası: <span className="font-medium">{state.transactionId || "RES" + Math.floor(Math.random() * 9000000 + 1000000)}</span>
        </p>
      </Card>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Rezervasyon Detayları</h3>
        <ReservationSummary 
          state={state}
          calculateTotal={calculateTotal} 
        />
      </div>
    </div>
  );
};

export default ConfirmationStep;
