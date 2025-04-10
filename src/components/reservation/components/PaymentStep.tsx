
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ReservationState } from '../types/reservationTypes';
import { ArrowRight, CreditCard, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentForm from "@/components/payments/PaymentForm";
import { useToast } from "@/hooks/use-toast";
import { ReservationSummary } from "../ReservationSummary";

interface PaymentStepProps {
  state: ReservationState;
  onPaymentComplete: (transactionId: string) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ state, onPaymentComplete }) => {
  const { toast } = useToast();
  const [isShowingForm, setIsShowingForm] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  
  // Calculate the total based on selection type
  const calculateSubtotal = () => {
    if (state.menuSelection.type === 'fixed_menu' && state.menuSelection.selectedFixedMenu) {
      const quantity = state.menuSelection.selectedFixedMenu.quantity || parseInt(state.formData.guests);
      return state.menuSelection.selectedFixedMenu.price * quantity;
    } else if (state.menuSelection.type === 'a_la_carte' && state.menuSelection.selectedMenuItems) {
      return state.menuSelection.selectedMenuItems.reduce((sum, item) => {
        return sum + (item.price * (item.quantity || 1));
      }, 0);
    }
    return 0;
  };
  
  // Calculate discount
  const calculateDiscount = (subtotal: number) => {
    if (subtotal >= 3000) {
      // 15% discount for subtotals >= 3000 TL
      return subtotal * 0.15;
    } else if (subtotal > 0) {
      // 10% discount for subtotals < 3000 TL
      return subtotal * 0.10;
    }
    return 0;
  };
  
  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(subtotal);
  const total = subtotal - discount;
  
  const handlePaymentComplete = (txId: string) => {
    setIsPaymentComplete(true);
    setTransactionId(txId);
    onPaymentComplete(txId);
    
    toast({
      title: "Ödeme Başarılı",
      description: "Rezervasyon için ön ödeme başarıyla tamamlandı.",
    });
  };
  
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold">Ödeme</h3>
      
      <ReservationSummary state={state} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" /> Ödeme Detayları
          </CardTitle>
          <CardDescription>
            Rezervasyonunuzu tamamlamak için ön ödeme yapmanız gerekmektedir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ara Toplam:</span>
              <span>{subtotal.toLocaleString('tr-TR')} ₺</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>İndirim ({subtotal >= 3000 ? '15%' : '10%'}):</span>
                <span>-{discount.toLocaleString('tr-TR')} ₺</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between font-medium text-lg">
              <span>Toplam:</span>
              <span>{total.toLocaleString('tr-TR')} ₺</span>
            </div>
          </div>
          
          <Alert className="bg-amber-50 border-amber-200">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-amber-800">
              Ön ödeme, rezervasyon tutarının tamamını kapsamaktadır. Bu tutar, rezervasyon iptal edilmediği sürece geri ödenmez.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          {!isPaymentComplete ? (
            !isShowingForm ? (
              <Button 
                className="w-full"
                onClick={() => setIsShowingForm(true)}
              >
                Ödemeye Geç <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <div className="w-full">
                <PaymentForm 
                  amount={total}
                  onPaymentComplete={handlePaymentComplete}
                  onCancel={() => setIsShowingForm(false)}
                />
              </div>
            )
          ) : (
            <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="font-medium text-green-800">Ödeme Başarılı</p>
                <p className="text-sm text-green-600">İşlem No: {transactionId}</p>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentStep;
