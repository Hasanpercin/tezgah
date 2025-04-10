
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

// Import Components
import ReservationForm from "@/components/ReservationForm";
import TableSelection from "./TableSelection";
import MenuSelection from "./MenuSelection";
import { ReservationSummary } from "./ReservationSummary";
import { useReservationState } from './hooks/useReservationState';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { STEPS } from './types/reservationTypes';

// Import components that were missing
import StepIndicator from "./components/StepIndicator";
import PaymentStep from "./components/PaymentStep";
import ConfirmationStep from './components/ConfirmationStep';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

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
    skipPaymentStep
  } = useReservationState();
  
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    // If the user is not authenticated, show a message and set the redirect flag
    if (!isAuthenticated) {
      toast({
        title: "Giriş Yapın",
        description: "Rezervasyon yapmak için lütfen giriş yapın.",
        variant: "default"
      });
      setShouldRedirect(true);
    }
  }, [isAuthenticated, toast]);
  
  // Add loyalty points when reservation is completed
  const addLoyaltyPointsOnCompletion = async () => {
    if (currentStep === 4 && user) {
      try {
        // Check if user has a loyalty points record
        const { data: loyaltyData } = await supabase
          .from('loyalty_points')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (loyaltyData) {
          // Add points for completing a reservation
          const pointsToAdd = 100; // Base points for reservation
          // Add extra points if they chose a menu in advance
          const extraPoints = state.menuSelection.type !== 'at_restaurant' ? 50 : 0;
          const totalPoints = pointsToAdd + extraPoints;
          
          // Update loyalty points
          await supabase
            .from('loyalty_points')
            .update({
              points: loyaltyData.points + totalPoints,
              // Update level if needed (example logic)
              level: loyaltyData.points + totalPoints >= 500 ? 'Gümüş' : 
                    loyaltyData.points + totalPoints >= 1000 ? 'Altın' : 'Bronz'
            })
            .eq('user_id', user.id);
            
          // Add to point history
          await supabase
            .from('point_history')
            .insert({
              user_id: user.id,
              points: totalPoints,
              description: `Rezervasyon tamamlama: ${state.menuSelection.type !== 'at_restaurant' ? 
                'Menü önceden seçildi' : 'Standart rezervasyon'}`
            });
            
          console.log(`Added ${totalPoints} loyalty points to user ${user.id}`);
        }
      } catch (error) {
        console.error("Error updating loyalty points:", error);
      }
    }
  };
  
  useEffect(() => {
    addLoyaltyPointsOnCompletion();
  }, [currentStep, user]);
  
  if (shouldRedirect) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h3 className="text-xl font-semibold">Lütfen Giriş Yapın</h3>
          <p>Rezervasyon yapabilmek için hesabınıza giriş yapmalısınız.</p>
          <div className="flex space-x-4 mt-4">
            <a 
              href="/login"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Giriş Yap
            </a>
            <a 
              href="/register" 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md"
            >
              Kayıt Ol
            </a>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <div ref={containerRef} className="space-y-8">
        {/* Step Indicator */}
        <StepIndicator 
          currentStep={currentStep} 
          steps={STEPS} 
          skipStep={state.menuSelection.type === 'at_restaurant' ? 3 : undefined} 
        />
        
        <Card className="p-6">
          {/* Step Content */}
          {currentStep === 0 && (
            <ReservationForm />
          )}
          
          {currentStep === 1 && (
            <TableSelection
              selectedTable={state.selectedTable}
              onSelectTable={setSelectedTable}
              date={state.formData.date || new Date()}
              time={state.formData.time}
              guests={state.formData.guests}
            />
          )}
          
          {currentStep === 2 && (
            <MenuSelection
              value={state.menuSelection}
              onChange={setMenuSelection}
              guestCount={state.formData.guests}
            />
          )}
          
          {currentStep === 3 && state.menuSelection.type !== 'at_restaurant' && (
            <PaymentStep 
              state={state}
              onPaymentComplete={setPaymentComplete}
            />
          )}
          
          {currentStep === 4 && (
            <ReservationSummary state={state} />
          )}
          
          {/* Navigation Buttons */}
          {currentStep < STEPS.length - 1 && (
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
                    if (currentStep === 2 && state.menuSelection.type === 'at_restaurant') {
                      skipPaymentStep();
                    } else {
                      handleNextStep();
                    }
                  }}
                  disabled={!canProceed()}
                  className="flex items-center"
                >
                  {currentStep === 2 ? 
                    (state.menuSelection.type === 'at_restaurant' ? "Tamamla" : "Ödemeye Geç") : 
                    "Devam Et"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </Card>
        
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
    </QueryClientProvider>
  );
};

export default MultiStepReservation;
