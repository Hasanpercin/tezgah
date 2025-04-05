
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, ArrowLeft, Calendar, Users, Utensils, CreditCard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import Components
import ReservationForm from "@/components/ReservationForm";
import TableSelection from "@/components/reservation/TableSelection";
import MenuSelection from "@/components/reservation/MenuSelection";
import ReservationSummary from "@/components/reservation/ReservationSummary";
import PaymentForm from "@/components/payments/PaymentForm";

// Define types
type Table = {
  id: number;
  type: 'window' | 'center' | 'corner' | 'booth';
  size: 2 | 4 | 6 | 8;
  position: { x: number; y: number };
  available: boolean;
  label: string;
};

type FixMenuOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starter' | 'main' | 'dessert';
  image?: string;
};

// Steps of the reservation process
const STEPS = [
  { id: 'details', name: 'Rezervasyon Detayları', icon: Calendar },
  { id: 'table', name: 'Masa Seçimi', icon: Users },
  { id: 'menu', name: 'Menü Seçimi', icon: Utensils },
  { id: 'payment', name: 'Özet ve Ödeme', icon: CreditCard },
  { id: 'confirmation', name: 'Onay', icon: CheckCircle },
];

const MultiStepReservation = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: null as Date | null,
    time: '',
    guests: '2',
    notes: '',
  });
  
  // Additional reservation state
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedFixMenu, setSelectedFixMenu] = useState<FixMenuOption | null>(null);
  const [selectedALaCarteItems, setSelectedALaCarteItems] = useState<{ item: MenuItem, quantity: number }[]>([]);
  const [isPrePayment, setIsPrePayment] = useState(true);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  
  // Handle form data changes from the basic reservation form
  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData({
      ...formData,
      ...data,
    });
  };
  
  // Calculate total payment amount
  const calculateTotal = () => {
    let subtotal = 0;
    
    if (selectedFixMenu) {
      subtotal = selectedFixMenu.price * parseInt(formData.guests);
    } else {
      subtotal = selectedALaCarteItems.reduce(
        (sum, { item, quantity }) => sum + (item.price * quantity),
        0
      );
    }
    
    // Apply 10% discount for pre-payment
    if (isPrePayment) {
      return subtotal - Math.round(subtotal * 0.1);
    }
    
    return subtotal;
  };
  
  // Handle payment completion
  const handlePaymentComplete = (txId: string) => {
    setTransactionId(txId);
    // Move to confirmation step
    setCurrentStep(4);
  };
  
  // Check if current step is valid to move to next
  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basic details
        return formData.name && formData.email && formData.phone && formData.date && formData.time && formData.guests;
      case 1: // Table selection
        return selectedTable !== null;
      case 2: // Menu selection
        return selectedFixMenu !== null || selectedALaCarteItems.length > 0;
      case 3: // Payment & summary
        return !isPrePayment || transactionId !== null; // If not pre-paying, can proceed without transaction
      default:
        return true;
    }
  };
  
  // Go to next step
  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
      
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Go to previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Skip payment if not pre-paying
  const handleSkipPayment = () => {
    setIsPrePayment(false);
    setCurrentStep(4); // Skip to confirmation
  };

  return (
    <div className="container-custom max-w-5xl">
      {/* Step Indicator */}
      <div className="mb-10">
        <div className="hidden md:flex justify-between">
          {STEPS.map((step, idx) => (
            <div 
              key={step.id}
              className={`flex flex-col items-center ${
                idx <= currentStep ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full 
                ${idx < currentStep ? "bg-primary text-primary-foreground" : 
                  idx === currentStep ? "bg-primary/20 border border-primary" : 
                  "bg-muted border border-border"}
              `}>
                {idx < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className="mt-2 text-sm font-medium">{step.name}</span>
            </div>
          ))}
        </div>
        
        {/* Mobile Step Indicator */}
        <div className="block md:hidden mb-6">
          <h2 className="text-xl font-semibold">
            {STEPS[currentStep].name}
          </h2>
          <div className="text-sm text-muted-foreground mt-1">
            Adım {currentStep + 1} / {STEPS.length}
          </div>
        </div>
      </div>
      
      {/* Step Content */}
      <div>
        {/* Step 1: Reservation Details */}
        {currentStep === 0 && (
          <div className="bg-card border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Rezervasyon Bilgileri</h3>
            <ReservationForm />
          </div>
        )}
        
        {/* Step 2: Table Selection */}
        {currentStep === 1 && (
          <div className="bg-card border rounded-lg p-6 mb-6">
            <TableSelection
              onSelectTable={setSelectedTable}
              selectedTable={selectedTable}
              date={formData.date}
              time={formData.time}
              guests={formData.guests}
            />
          </div>
        )}
        
        {/* Step 3: Menu Selection */}
        {currentStep === 2 && (
          <div className="bg-card border rounded-lg p-6 mb-6">
            <MenuSelection
              onFixMenuSelected={setSelectedFixMenu}
              onALaCarteItemsSelected={setSelectedALaCarteItems}
              selectedFixMenu={selectedFixMenu}
              selectedALaCarteItems={selectedALaCarteItems}
              guests={formData.guests}
            />
          </div>
        )}
        
        {/* Step 4: Summary & Payment */}
        {currentStep === 3 && (
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
        )}
        
        {/* Step 5: Confirmation */}
        {currentStep === 4 && (
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
        )}
      </div>
      
      {/* Navigation Buttons */}
      {currentStep < 4 && (
        <div className="flex justify-between mt-10">
          {currentStep > 0 ? (
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri
            </Button>
          ) : (
            <div></div> // Empty placeholder for flex alignment
          )}
          
          {(currentStep < 3 || (currentStep === 3 && !isPrePayment)) && (
            <Button 
              onClick={handleNextStep} 
              disabled={!canProceed()}
              className="flex items-center"
            >
              {currentStep === 3 ? "Tamamla" : "Devam Et"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiStepReservation;
