
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatCardNumber, formatExpiryDate, formatCVV, getCardType } from "../utils/cardFormatters";
import { isFormValid } from "../utils/cardValidation";

type FormData = {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

type UsePaymentFormProps = {
  amount: number;
  onPaymentComplete?: (transactionId: string) => void;
};

export const usePaymentForm = ({ amount, onPaymentComplete }: UsePaymentFormProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Apply appropriate formatting based on input field
    if (name === "cardNumber") {
      setFormData({
        ...formData,
        [name]: formatCardNumber(value),
      });
      return;
    }
    
    if (name === "expiryDate") {
      setFormData({
        ...formData,
        [name]: formatExpiryDate(value),
      });
      return;
    }
    
    if (name === "cvv") {
      setFormData({
        ...formData,
        [name]: formatCVV(value),
      });
      return;
    }
    
    // For cardholder name, no special formatting
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const cardType = getCardType(formData.cardNumber);
  const formValid = isFormValid(formData);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValid) {
      toast({
        title: "Hata",
        description: "Lütfen tüm ödeme bilgilerini doğru şekilde girin.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing with a delay
    setTimeout(() => {
      const transactionId = "TRX" + Date.now().toString().substring(6);
      
      setIsProcessing(false);
      toast({
        title: "Ödeme Başarılı",
        description: `${amount.toFixed(2)} ₺ tutarındaki ödemeniz alındı.`,
      });
      
      if (onPaymentComplete) {
        onPaymentComplete(transactionId);
      }
    }, 1500);
  };

  return {
    formData,
    isProcessing,
    cardType,
    handleChange,
    handleSubmit,
    formValid
  };
};
