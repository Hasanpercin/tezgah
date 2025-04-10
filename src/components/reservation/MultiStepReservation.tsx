
import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Utensils, CreditCard, CheckCircle } from "lucide-react";
import { useReservationState } from './hooks/useReservationState';
import ReservationForm from '@/components/ReservationForm'; // Fixed import path
import TableSelection from './TableSelection';
import StepIndicator from './components/StepIndicator';
import NavigationButtons from './NavigationButtons';
import MenuSelection from './MenuSelection'; 
import PaymentStep from './components/PaymentStep';
import ReservationSummary from './ReservationSummary';
import { STEPS } from './types/reservationTypes';
import { supabase } from "@/integrations/supabase/client";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const MultiStepReservation = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
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
  
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  useEffect(() => {
    // If the user is not authenticated, show a message and set the redirect flag
    if (!isAuthenticated) {
      toast({
        title: "Giriş Yapın",
        description: "Rezervasyon yapmak için lütfen giriş yapın.",
        variant: "default",
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
                     loyaltyData.points + totalPoints >= 1000 ? 'Altın' : 
                     'Bronz'
            })
            .eq('user_id', user.id);
          
          // Add to point history
          await supabase
            .from('point_history')
            .insert({
              user_id: user.id,
              points: totalPoints,
              description: `Rezervasyon tamamlama: ${state.menuSelection.type !== 'at_restaurant' ? 'Menü önceden seçildi' : 'Standart rezervasyon'}`
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
            <a href="/login" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
              Giriş Yap
            </a>
            <a href="/register" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md">
              Kayıt Ol
            </a>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <div ref={containerRef} className="space-y-8" data-reservation-step>
        <StepIndicator 
          currentStep={currentStep} 
          steps={STEPS}
          skipStep={state.menuSelection.type === 'at_restaurant' ? 3 : undefined}
        />
        
        <Card className="p-6">
          {currentStep === 0 && (
            <ReservationForm />
          )}
          
          {currentStep === 1 && (
            <TableSelection 
              selectedTable={state.selectedTable}
              onSelectTable={setSelectedTable}
              date={state.formData.date || new Date()}
              time={state.formData.time}
              guests={parseInt(state.formData.guests || '0')} // Fixed by providing a string type
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
              reservation={state}
              onPaymentComplete={setPaymentComplete}
            />
          )}
          
          {currentStep === 4 && (
            <ReservationSummary state={state} />
          )}
          
          {currentStep < STEPS.length - 1 && (
            <NavigationButtons
              currentStep={currentStep}
              onNext={currentStep === 2 && state.menuSelection.type === 'at_restaurant' ? skipPaymentStep : handleNextStep}
              onPrev={handlePrevStep}
              canProceed={!!canProceed()} // Fixed by ensuring boolean type
              menuSelectionType={state.menuSelection.type}
            />
          )}
        </Card>
      </div>
    </QueryClientProvider>
  );
};

export default MultiStepReservation;
