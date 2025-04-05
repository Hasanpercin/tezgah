
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, CreditCard } from "lucide-react";

type PaymentFormProps = {
  amount: number;
  onPaymentComplete?: (transactionId: string) => void;
  onCancel?: () => void;
};

const PaymentForm = ({ amount, onPaymentComplete, onCancel }: PaymentFormProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces after every 4 digits
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "") // Remove spaces
        .replace(/\D/g, "") // Remove non-digits
        .slice(0, 16); // Limit to 16 digits
      
      // Add space after every 4 digits
      const formattedCardNumber = formattedValue
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      
      setFormData({
        ...formData,
        [name]: formattedCardNumber,
      });
      return;
    }
    
    // Format expiry date as MM/YY
    if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\D/g, "") // Remove non-digits
        .slice(0, 4); // Limit to 4 digits
      
      if (formattedValue.length > 2) {
        const formattedDate = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
        setFormData({
          ...formData,
          [name]: formattedDate,
        });
      } else {
        setFormData({
          ...formData,
          [name]: formattedValue,
        });
      }
      return;
    }
    
    // Format CVV (3 digits only)
    if (name === "cvv") {
      const formattedValue = value
        .replace(/\D/g, "") // Remove non-digits
        .slice(0, 3); // Limit to 3 digits
      
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
      return;
    }
    
    // For cardholder name, no special formatting
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Form validation
  const isFormValid = () => {
    return (
      formData.cardholderName.trim().length > 0 &&
      formData.cardNumber.replace(/\s/g, "").length === 16 &&
      formData.expiryDate.length === 5 &&
      formData.cvv.length === 3
    );
  };
  
  // Handle payment submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
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
  
  // Determine card type based on the first digits
  const getCardType = () => {
    const cardNumber = formData.cardNumber.replace(/\s/g, "");
    
    if (cardNumber.startsWith("4")) return "VISA";
    if (/^5[1-5]/.test(cardNumber)) return "MasterCard";
    if (/^3[47]/.test(cardNumber)) return "American Express";
    if (/^6(?:011|5)/.test(cardNumber)) return "Discover";
    
    return null;
  };
  
  const cardType = getCardType();
  
  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Ödeme Bilgileri</h3>
        <div className="flex gap-2">
          <div className={`opacity-${cardType === "VISA" ? "100" : "30"}`}>
            <span className="font-bold text-blue-600">VISA</span>
          </div>
          <div className={`opacity-${cardType === "MasterCard" ? "100" : "30"}`}>
            <span className="font-bold text-red-600">MC</span>
          </div>
        </div>
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
        
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Kart Numarası</Label>
          <div className="relative">
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="XXXX XXXX XXXX XXXX"
              value={formData.cardNumber}
              onChange={handleChange}
              required
              className="pl-10"
            />
            <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Son Kullanma Tarihi</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              name="cvv"
              placeholder="XXX"
              value={formData.cvv}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mt-4 mb-2">
          <Lock className="h-4 w-4 mr-2" />
          <p>Ödeme bilgileriniz güvenli bir şekilde işlenmektedir.</p>
        </div>
        
        <div className="pt-4 flex flex-col gap-3">
          <div className="flex justify-between font-medium">
            <span>Toplam Tutar:</span>
            <span>{amount.toFixed(2)} ₺</span>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isProcessing || !isFormValid()}
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
      </form>
    </div>
  );
};

export default PaymentForm;
