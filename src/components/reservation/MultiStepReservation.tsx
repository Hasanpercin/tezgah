
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

// Import Components
import ReservationForm from "@/components/ReservationForm";
import TableSelection from "@/components/reservation/TableSelection";
import MenuSelection from "@/components/reservation/MenuSelection";
import StepIndicator from './components/StepIndicator';
import ConfirmationStep from './components/ConfirmationStep';
import PaymentStep from './components/PaymentStep';
import { useReservationState } from './hooks/useReservationState';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Updated steps with payment
export const STEPS = [
  { id: 0, name: "Rezervasyon Bilgileri", icon: "Calendar" },
  { id: 1, name: "Masa Seçimi", icon: "Users" },
  { id: 2, name: "Menü Seçimi", icon: "Utensils" },
  { id: 3, name: "Ödeme", icon: "CreditCard" },
  { id: 4, name: "Onay", icon: "CheckCircle" }
];

const MultiStepReservation = () => {
  const {
    currentStep,
    containerRef,
    state,
    canProceed,
    handleNextStep,
    handlePrevStep,
    setSelectedTable,
    setMenuSelection,
    setPaymentComplete,
    reservationId,
    skipPaymentStep
  } = useReservationState();
  
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  // When reaching the confirmation step, add loyalty points if user is logged in
  useEffect(() => {
    const addLoyaltyPointsOnCompletion = async () => {
      if (currentStep === 4 && isAuthenticated && user) {
        try {
          // Reservation bonus
          const reservationBonus = 50;
          
          // Get current loyalty points
          const { data: loyaltyData, error: loyaltyError } = await supabase
            .from('loyalty_points')
            .select('points, level')
            .eq('user_id', user.id)
            .single();
            
          if (loyaltyError) throw loyaltyError;
          
          if (loyaltyData) {
            // Update loyalty points
            const newTotalPoints = loyaltyData.points + reservationBonus;
            
            // Determine new level based on points
            let newLevel = loyaltyData.level;
            if (newTotalPoints >= 2000) newLevel = 'Platin';
            else if (newTotalPoints >= 1000) newLevel = 'Altın';
            else if (newTotalPoints >= 500) newLevel = 'Gümüş';
            else if (newTotalPoints >= 250) newLevel = 'Bronz';
            
            // Update loyalty points
            const { error: updateError } = await supabase
              .from('loyalty_points')
              .update({ 
                points: newTotalPoints,
                level: newLevel
              })
              .eq('user_id', user.id);
              
            if (updateError) throw updateError;
            
            // Add point history entry
            const { error: historyError } = await supabase
              .from('point_history')
              .insert({
                user_id: user.id,
                points: reservationBonus,
                description: `Rezervasyon: ${state.formData.date} - ${state.formData.time}`
              });
              
            if (historyError) throw historyError;
            
            // Notify user
            toast({
              title: "Sadakat Puanı Kazandınız!",
              description: `${reservationBonus} puan hesabınıza eklendi. Yeni toplam puanınız: ${newTotalPoints}`,
              duration: 5000,
            });
          }
        } catch (error) {
          console.error("Error updating loyalty points:", error);
        }
      }
    };
    
    addLoyaltyPointsOnCompletion();
  }, [currentStep, isAuthenticated, user, state.formData, toast]);
  
  // Handle payment completion
  const handlePaymentComplete = (transactionId: string) => {
    setPaymentComplete(transactionId);
  };
  
  // Check if we should skip payment based on menu selection type
  const shouldSkipPayment = state.menuSelection.type === 'at_restaurant';
  
  return (
    <div className="container-custom max-w-5xl" ref={containerRef} data-reservation-step>
      {/* Step Indicator */}
      <StepIndicator 
        currentStep={currentStep} 
        steps={STEPS} 
        skipStep={shouldSkipPayment && currentStep === 2 ? 3 : undefined} 
      />
      
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
              value={state.menuSelection}
              onChange={setMenuSelection}
              guestCount={state.formData.guests}
            />
          </div>
        )}
        
        {/* Step 4: Payment */}
        {currentStep === 3 && (
          <div className="bg-card border rounded-lg p-6 mb-6">
            <PaymentStep 
              state={state}
              onPaymentComplete={handlePaymentComplete}
            />
          </div>
        )}
        
        {/* Step 5: Confirmation */}
        {currentStep === 4 && (
          <ConfirmationStep 
            state={state}
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
          
          {currentStep !== 3 && ( // Hide next button on payment step
            <Button 
              onClick={() => {
                if (currentStep === 2 && shouldSkipPayment) {
                  skipPaymentStep();
                } else {
                  handleNextStep();
                }
              }}
              disabled={!canProceed()}
              className="flex items-center"
            >
              {currentStep === 2 ? 
                (shouldSkipPayment ? "Tamamla" : "Ödemeye Geç") : 
                "Devam Et"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      {/* User Loyalty Information */}
      {isAuthenticated && user && (
        <div className="mt-4 p-4 bg-primary/10 rounded-md text-sm text-center">
          <p className="font-medium">Sadakat Programı:</p>
          <p className="text-muted-foreground">
            Rezervasyon yaptığınızda 50 bonus puan kazanırsınız.
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiStepReservation;
