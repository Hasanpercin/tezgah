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
  
  const handleFormDataChange = (data: Partial<ReservationFormData>) => {
    setState({
      ...state,
      formData: {
        ...state.formData,
        ...data,
      }
    });
  };

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
  
  const handleNextStep = async () => {
    if (currentStep < 2 && canProceed()) {
      if (currentStep === 1) {
        try {
          if (reservationId && state.selectedTable) {
            await supabase
              .from('reservation_tables')
              .insert({
                reservation_id: reservationId,
                table_id: state.selectedTable.id
              } as any);
          }
          
          await supabase
            .from('reservations')
            .update({
              status: 'confirmed'
            })
            .eq('id', reservationId);
            
          const webhookSuccess = await sendReservationToWebhook();
          if (webhookSuccess) {
            toast({
              title: "Rezervasyon Tamamlandı",
              description: "Rezervasyon bilgileri başarıyla kaydedildi ve iletildi.",
              variant: "default",
            });
          }
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
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const sendReservationToWebhook = async () => {
    try {
      const webhookUrl = 'https://k2vqd09z.rpcd.app/webhook-test/eecc6166-3b73-4d10-bccb-b4a14ed51a6e';
      
      const webhookData = {
        name: state.formData.name,
        email: state.formData.email,
        phone: state.formData.phone,
        reservationId: reservationId,
        date: state.formData.date ? state.formData.date.toISOString().split('T')[0] : null,
        time: state.formData.time,
        guests: state.formData.guests,
        notes: state.formData.notes || '',
        occasion: state.formData.occasion || '',
        tableName: state.selectedTable?.name || state.selectedTable?.label || '',
        tableType: state.selectedTable?.type || '',
        tableSize: state.selectedTable?.size || 0
      };
      
      console.log("Sending reservation data to webhook:", JSON.stringify(webhookData, null, 2));
      
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'no-cors',
          body: JSON.stringify(webhookData)
        });
        
        console.log("Webhook notification attempted, no response expected due to no-cors mode");
      } catch (fetchError) {
        console.error("Fetch error in webhook:", fetchError);
      }
      
      toast({
        title: "Rezervasyon Bilgileri Gönderildi",
        description: "Rezervasyon bilgileri başarıyla sistem yöneticisine iletildi.",
        duration: 3000,
      });
      
      return true;
    } catch (error: any) {
      console.error("Webhook error:", error.message);
      toast({
        title: "Bildirim Hatası",
        description: "Rezervasyon bilgileri gönderilemedi, ancak rezervasyonunuz başarıyla kaydedildi.",
        variant: "destructive",
      });
      
      return false;
    }
  };

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
