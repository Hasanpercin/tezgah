
import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReservationState } from './hooks/useReservationState';
import ReservationForm from '@/components/ReservationForm';
import TableSelection from './TableSelection';
import StepIndicator from './components/StepIndicator';
import NavigationButtons from './NavigationButtons';
import MenuSelection from './MenuSelection'; 
import PaymentStep from './components/PaymentStep';
import ReservationSummary from './ReservationSummary';
import { STEPS } from './types/reservationTypes';
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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
  const [paymentEnabled, setPaymentEnabled] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Giriş Yapın",
        description: "Rezervasyon yapmak için lütfen giriş yapın.",
        variant: "default",
      });
      setShouldRedirect(true);
    }
  }, [isAuthenticated, toast]);
  
  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('website_content')
          .select('value')
          .eq('section', 'payment')
          .eq('key', 'payment_settings')
          .single();
          
        if (error) {
          console.error("Error fetching payment settings:", error);
          return;
        }
        
        if (data && data.value) {
          try {
            const settings = JSON.parse(data.value);
            setPaymentEnabled(settings.enable_payment_step);
          } catch (parseError) {
            console.error("Error parsing payment settings:", parseError);
          }
        }
      } catch (error) {
        console.error("Error fetching payment settings:", error);
      }
    };
    
    fetchPaymentSettings();
  }, []);
  
  const addLoyaltyPointsOnCompletion = async () => {
    if (currentStep === 4 && user) {
      try {
        const { data: loyaltyData } = await supabase
          .from('loyalty_points')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (loyaltyData) {
          const pointsToAdd = 100;
          const extraPoints = state.menuSelection.type !== 'at_restaurant' ? 50 : 0;
          const totalPoints = pointsToAdd + extraPoints;
          
          await supabase
            .from('loyalty_points')
            .update({ 
              points: loyaltyData.points + totalPoints,
              level: loyaltyData.points + totalPoints >= 500 ? 'Gümüş' : 
                     loyaltyData.points + totalPoints >= 1000 ? 'Altın' : 
                     'Bronz'
            })
            .eq('user_id', user.id);
          
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
      <Card className="p-6 md:p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h3 className="text-xl font-semibold">Lütfen Giriş Yapın</h3>
          <p>Rezervasyon yapabilmek için hesabınıza giriş yapmalısınız.</p>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 mt-4">
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
  
  const shouldSkipPaymentStep = state.menuSelection.type === 'at_restaurant' || !paymentEnabled;
  
  return (
    <QueryClientProvider client={queryClient}>
      <div ref={containerRef} className="space-y-6" data-reservation-step>
        <StepIndicator 
          currentStep={currentStep} 
          steps={STEPS}
          skipStep={shouldSkipPaymentStep ? 3 : undefined}
        />
        
        <Card className={`${isMobile ? 'p-4' : 'p-6'} overflow-x-hidden`}>
          <div className="overflow-x-auto">
            {currentStep === 0 && (
              <ReservationForm />
            )}
            
            {currentStep === 1 && (
              <TableSelection 
                selectedTable={state.selectedTable}
                onSelectTable={setSelectedTable}
                date={state.formData.date || new Date()}
                time={state.formData.time}
                guests={state.formData.guests.toString()} // Convert to string explicitly
              />
            )}
            
            {currentStep === 2 && (
              <MenuSelection 
                value={state.menuSelection}
                onChange={setMenuSelection}
                guestCount={state.formData.guests}
              />
            )}
            
            {currentStep === 3 && paymentEnabled && state.menuSelection.type !== 'at_restaurant' && (
              <PaymentStep 
                reservation={state}
                onPaymentComplete={setPaymentComplete}
              />
            )}
            
            {currentStep === 4 && (
              <ReservationSummary state={state} />
            )}
          </div>
          
          {currentStep < STEPS.length - 1 && (
            <NavigationButtons
              currentStep={currentStep}
              onNext={currentStep === 2 && shouldSkipPaymentStep ? skipPaymentStep : handleNextStep}
              onPrev={handlePrevStep}
              canProceed={!!canProceed()}
              menuSelectionType={state.menuSelection.type}
            />
          )}
        </Card>
      </div>
    </QueryClientProvider>
  );
};

export default MultiStepReservation;

