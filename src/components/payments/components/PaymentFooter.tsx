
import React from "react";
import { Button } from "@/components/ui/button";

type PaymentFooterProps = {
  amount: number;
  isProcessing: boolean;
  isFormValid: boolean;
  onCancel?: () => void;
};

const PaymentFooter: React.FC<PaymentFooterProps> = ({ 
  amount, 
  isProcessing, 
  isFormValid, 
  onCancel 
}) => {
  return (
    <div className="pt-4 flex flex-col gap-3">
      <div className="flex justify-between font-medium">
        <span>Toplam Tutar:</span>
        <span>{amount.toFixed(2)} ₺</span>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isProcessing || !isFormValid}
      >
        {isProcessing ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            İşlem Yapılıyor...
          </span>
        ) : (
          "Ödemeyi Tamamla"
        )}
      </Button>
      
      {onCancel && (
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          İptal
        </Button>
      )}
    </div>
  );
};

export default PaymentFooter;
