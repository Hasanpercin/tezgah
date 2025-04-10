
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Calendar, Users, Utensils, CreditCard, CheckCircle } from "lucide-react";

// Import Components
import ReservationForm from "@/components/ReservationForm";
import TableSelection from "@/components/reservation/TableSelection";
import MenuSelection from "@/components/reservation/MenuSelection";
import StepIndicator from './components/StepIndicator';
import PaymentStep from './components/PaymentStep';
import ConfirmationStep from './components/ConfirmationStep';
import { useReservationState } from './hooks/useReservationState';
import { useToast } from "@/hooks/use-toast";

const MultiStepReservation = () => {
  const {
    currentStep,
    containerRef,
    state,
    calculateTotal,
    handlePaymentComplete,
    canProceed,
    handleNextStep,
    handlePrevStep,
    handleSkipPayment,
    setSelectedTable,
    setSelectedFixMenu,
    setSelectedALaCarteItems,
    setSelectAtRestaurant,
    setIsPrePayment
  } = useReservationState();
  
  const { toast } = useToast();
  
  // Devam et butonunun neden aktif olmadığını konsola yazdırmak için kontrol ediyoruz
  useEffect(() => {
    if (currentStep === 2) {
      console.log("Menu Selection State:", {
        selectedFixMenu: !!state.selectedFixMenu,
        selectedALaCarteItems: state.selectedALaCarteItems.length,
        selectAtRestaurant: state.selectAtRestaurant,
        canProceed: canProceed()
      });
    }
  }, [currentStep, state.selectedFixMenu, state.selectedALaCarteItems, state.selectAtRestaurant, canProceed]);
  
  return (
    <div className="container-custom max-w-5xl" ref={containerRef} data-reservation-step>
      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />
      
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
              selectedTable={state.selectedTable}
              date={state.formData.date}
              time={state.formData.time}
              guests={state.formData.guests}
            />
          </div>
        )}
        
        {/* Step 3: Menu Selection */}
        {currentStep === 2 && (
          <div className="bg-card border rounded-lg p-6 mb-6">
            <MenuSelection
              onFixMenuSelected={setSelectedFixMenu}
              onALaCarteItemsSelected={setSelectedALaCarteItems}
              onSelectAtRestaurant={setSelectAtRestaurant}
              selectedFixMenu={state.selectedFixMenu}
              selectedALaCarteItems={state.selectedALaCarteItems}
              selectAtRestaurant={state.selectAtRestaurant}
              guests={state.formData.guests}
            />
          </div>
        )}
        
        {/* Step 4: Summary & Payment */}
        {currentStep === 3 && (
          <PaymentStep 
            state={state}
            calculateTotal={calculateTotal}
            handleSkipPayment={handleSkipPayment}
            handlePaymentComplete={handlePaymentComplete}
            setIsPrePayment={setIsPrePayment}
          />
        )}
        
        {/* Step 5: Confirmation */}
        {currentStep === 4 && (
          <ConfirmationStep 
            state={state}
            calculateTotal={calculateTotal}
          />
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
          
          {(currentStep < 3 || (currentStep === 3 && !state.isPrePayment)) && (
            <Button 
              onClick={() => {
                if (canProceed()) {
                  handleNextStep();
                } else if (currentStep === 2) {
                  toast({
                    title: "Lütfen bir seçim yapın",
                    description: "Devam etmek için fix menü, alakart menü veya restoranda seçim yapma seçeneklerinden birini seçmelisiniz.",
                    variant: "destructive"
                  });
                }
              }}
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
