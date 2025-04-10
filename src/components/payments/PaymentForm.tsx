
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import CardNumberInput from "./components/CardNumberInput";
import CardDetailsRow from "./components/CardDetailsRow";
import CardTypeIndicator from "./components/CardTypeIndicator";
import PaymentFooter from "./components/PaymentFooter";
import { usePaymentForm } from "./hooks/usePaymentForm";

type PaymentFormProps = {
  amount: number;
  onPaymentComplete?: (transactionId: string) => void;
  onCancel?: () => void;
  reservationData?: {
    name: string;
    email: string;
    phone: string;
    reservationId: string;
  };
};

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  amount, 
  onPaymentComplete, 
  onCancel,
  reservationData 
}) => {
  const {
    formData,
    isProcessing,
    cardType,
    handleChange,
    handleSubmit,
    formValid
  } = usePaymentForm({ amount, onPaymentComplete });
  
  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Ödeme Bilgileri</h3>
        <CardTypeIndicator cardType={cardType} />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardholderName">Kart Sahibinin Adı Soyadı</Label>
          <Input
            id="cardholderName"
            name="cardholderName"
            placeholder="Ad Soyad"
            value={formData.cardholderName}
            onChange={handleChange}
            required
          />
        </div>
        
        <CardNumberInput 
          value={formData.cardNumber} 
          onChange={handleChange} 
        />
        
        <CardDetailsRow
          expiryDate={formData.expiryDate}
          cvv={formData.cvv}
          onChange={handleChange}
        />
        
        <div className="flex items-center text-sm text-muted-foreground mt-4 mb-2">
          <Lock className="h-4 w-4 mr-2" />
          <p>Ödeme bilgileriniz güvenli bir şekilde işlenmektedir.</p>
        </div>
        
        <PaymentFooter 
          amount={amount} 
          isProcessing={isProcessing} 
          isFormValid={formValid}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
};

export default PaymentForm;
