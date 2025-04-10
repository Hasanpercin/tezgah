
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
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const { isAuthenticated, user } = useAuth();
  
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

  // When reaching the confirmation step, add loyalty points if user is logged in
  useEffect(() => {
    const addLoyaltyPointsOnCompletion = async () => {
      if (currentStep === 4 && isAuthenticated && user) {
        try {
          const total = calculateTotal();
          // 100₺ harcama başına 10 puan + rezervasyon için 50 puan
          const reservationBonus = 50;
          const spendingPoints = Math.floor(total / 10);
          const totalPoints = reservationBonus + spendingPoints;
          
          // Get current loyalty points
          const { data: loyaltyData, error: loyaltyError } = await supabase
            .from('loyalty_points')
            .select('points, level')
            .eq('user_id', user.id)
            .single();
            
          if (loyaltyError) throw loyaltyError;
          
          if (loyaltyData) {
            // Update loyalty points
            const newTotalPoints = loyaltyData.points + totalPoints;
            
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
                points: totalPoints,
                description: `Rezervasyon: ${state.formData.date} - ${state.formData.time}`
              });
              
            if (historyError) throw historyError;
            
            // Notify user
            toast({
              title: "Sadakat Puanı Kazandınız!",
              description: `${totalPoints} puan hesabınıza eklendi. Yeni toplam puanınız: ${newTotalPoints}`,
              duration: 5000,
            });
          }
        } catch (error) {
          console.error("Error updating loyalty points:", error);
        }
      }
    };
    
    addLoyaltyPointsOnCompletion();
  }, [currentStep, isAuthenticated, user, calculateTotal, state.formData, toast]);
  
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
      
      {/* User Loyalty Information */}
      {isAuthenticated && user && (
        <div className="mt-4 p-4 bg-primary/10 rounded-md text-sm text-center">
          <p className="font-medium">Sadakat Programı:</p>
          <p className="text-muted-foreground">
            Rezervasyon yaptığınızda 50 bonus puan + her 10₺ harcama için 1 puan kazanırsınız.
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiStepReservation;
