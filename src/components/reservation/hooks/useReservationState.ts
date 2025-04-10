
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  ReservationFormData, 
  ReservationState 
} from '../types/reservationTypes';

export const useReservationState = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize state - removed menu and payment related states
  const [state, setState] = useState<ReservationState>({
    selectedTable: null,
    basicFormCompleted: false,
    formData: {
      name: '',
      email: '',
      phone: '',
      date: null,
      time: '',
      guests: '2',
      notes: '',
    }
  });
  
  // Handle form data changes from the basic reservation form
  const handleFormDataChange = (data: Partial<ReservationFormData>) => {
    setState({
      ...state,
      formData: {
        ...state.formData,
        ...data,
      }
    });
  };

  // Handle the custom event from the ReservationForm component
  useEffect(() => {
    const handleReservationCompleted = (event: CustomEvent) => {
      const newReservationId = event.detail?.reservationId;
      
      setState(prevState => ({
        ...prevState,
        basicFormCompleted: true,
        formData: {
          ...prevState.formData,
          ...(event.detail?.formData || {})
        }
      }));
      
      if (newReservationId) {
        setReservationId(newReservationId);
      }
      
      // First step completed, move to next step
      if (currentStep === 0) {
        setCurrentStep(1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('reservationCompleted', 
        handleReservationCompleted as EventListener);

      return () => {
        container.removeEventListener('reservationCompleted', 
          handleReservationCompleted as EventListener);
      };
    }
  }, [currentStep]);

  // Check if current step is valid to move to next
  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basic details
        return state.basicFormCompleted || (
          state.formData.name && 
          state.formData.email && 
          state.formData.phone && 
          state.formData.date && 
          state.formData.time && 
          state.formData.guests
        );
      case 1: // Table selection
        return state.selectedTable !== null;
      default:
        return true;
    }
  };
  
  // Go to next step
  const handleNextStep = async () => {
    if (currentStep < 2 && canProceed()) {
      if (currentStep === 1) {
        try {
          // Save selected table to database
          if (reservationId && state.selectedTable) {
            await supabase
              .from('reservation_tables')
              .insert({
                reservation_id: reservationId,
                table_id: state.selectedTable.id
              } as any);
          }
          
          // Update reservation status
          await supabase
            .from('reservations')
            .update({
              status: 'confirmed'
            })
            .eq('id', reservationId);
            
          // Send reservation data to webhook
          await sendReservationToWebhook();
        } catch (error: any) {
          console.error("Reservation update error:", error.message);
          toast({
            title: "Hata",
            description: "Rezervasyon bilgileri güncellenirken bir hata oluştu.",
            variant: "destructive",
          });
        }
      }
      
      setCurrentStep(currentStep + 1);
      
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.log("Can't proceed to next step", { 
        currentStep, 
        canProceed: canProceed(),
        state: {
          selectedTable: !!state.selectedTable
        }
      });
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
  
  // Send reservation data to webhook
  const sendReservationToWebhook = async () => {
    try {
      const webhookUrl = 'https://k2vqd09z.rpcd.app/webhook-test/eecc6166-3b73-4d10-bccb-b4a14ed51a6e';
      
      // Prepare data to send to webhook
      const webhookData = {
        name: state.formData.name,
        email: state.formData.email,
        phone: state.formData.phone,
        reservationId: reservationId,
        date: state.formData.date ? state.formData.date.toISOString().split('T')[0] : null,
        time: state.formData.time,
        guests: state.formData.guests
      };
      
      // Send data to webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
      });
      
      if (response.ok) {
        console.log("Webhook notification sent successfully");
      } else {
        console.error("Failed to send webhook notification:", await response.text());
      }
    } catch (error: any) {
      console.error("Webhook error:", error.message);
    }
  };

  // Handlers for state updates
  const setSelectedTable = (table: Table | null) => {
    setState({
      ...state,
      selectedTable: table
    });
  };

  return {
    currentStep,
    containerRef,
    state,
    reservationId,
    canProceed,
    handleNextStep,
    handlePrevStep,
    setSelectedTable
  };
};
