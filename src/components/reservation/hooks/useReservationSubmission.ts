
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { ReservationState } from '../types/reservationTypes';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export const useReservationSubmission = (
  user: User | null,
  state: ReservationState,
  toast: ReturnType<typeof useToast>['toast'],
  setCurrentStep: (step: number) => void
) => {
  // Function to send webhook notification with enhanced error handling and logging
  const sendWebhookNotification = async (reservationData: any) => {
    console.log('Starting webhook notification process...');
    
    // Format the date if it exists for better readability
    const formattedReservationData = {
      ...reservationData,
      // Make sure we format date information in a more readable way
      formattedDate: reservationData.date ? new Date(reservationData.date).toLocaleDateString('tr-TR') : null,
      // Include the full form data explicitly for webhook
      userDetails: {
        name: state.formData.name,
        email: state.formData.email,
        phone: state.formData.phone,
      },
      reservationDetails: {
        date: state.formData.date ? state.formData.date.toLocaleDateString('tr-TR') : null,
        time: state.formData.time,
        guests: parseInt(state.formData.guests.toString()),
        notes: state.formData.notes,
        occasion: state.formData.occasion
      },
      // Include table selection information
      tableDetails: state.selectedTable ? {
        tableId: state.selectedTable.id,
        tableName: state.selectedTable.name || state.selectedTable.label,
        tableSize: state.selectedTable.size,
        tableType: state.selectedTable.type
      } : null,
      // Include any payment information if available
      paymentDetails: state.payment ? {
        isPaid: state.payment.isPaid,
        amount: state.payment.amount,
        discountAmount: state.payment.discountAmount,
        transactionId: state.payment.transactionId
      } : null
    };
    
    console.log('Enhanced reservation data to be sent:', JSON.stringify(formattedReservationData, null, 2));

    try {
      const webhookUrl = 'https://k2vqd09z.rpcd.app/webhook-test/eecc6166-3b73-4d10-bccb-b4a14ed51a6e';
      console.log('Sending POST request to webhook URL:', webhookUrl);

      const startTime = performance.now();
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedReservationData)
      });
      const endTime = performance.now();

      console.log(`Webhook request completed in ${Math.round(endTime - startTime)}ms`);
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      const responseText = await response.text();
      console.log('Full response body:', responseText);

      if (!response.ok) {
        throw new Error(`Webhook failed with status ${response.status}: ${responseText}`);
      }

      // Log success metrics
      console.log('Webhook notification successful');
      console.log('Request-Response cycle completed in:', Math.round(endTime - startTime), 'ms');

      toast({
        title: "Webhook Başarılı",
        description: "Rezervasyon bilgileri webhook'a başarıyla gönderildi.",
        variant: "default"
      });

      return true;
    } catch (error) {
      // Enhanced error logging
      console.error('Webhook notification error details:');
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else {
        console.error('Unknown error type:', error);
      }

      toast({
        title: "Webhook Hatası",
        description: error instanceof Error 
          ? `Webhook bildirimi başarısız: ${error.message}`
          : "Webhook gönderiminde beklenmeyen bir hata oluştu",
        variant: "destructive"
      });

      // Return false to indicate failure
      return false;
    }
  };

  // Main reservation submission function
  return useCallback(async () => {
    console.log('Starting reservation submission process...');
    
    try {
      if (!user) {
        throw new Error("Kullanıcı girişi yapılmamış");
      }

      // Generate a unique ID for the reservation
      const reservationId = uuidv4();

      // Prepare reservation data
      const reservationData = {
        id: reservationId,
        user_id: user.id,
        name: state.formData.name,
        email: state.formData.email,
        phone: state.formData.phone,
        date: state.formData.date?.toISOString(),
        time: state.formData.time,
        guests: parseInt(state.formData.guests.toString()),
        notes: state.formData.notes,
        occasion: state.formData.occasion,
        status: "Beklemede",
        selected_table: state.selectedTable ? { id: state.selectedTable.id } : null,
        selected_items: {
          menuSelectionType: state.menuSelection.type,
          fixedMenuId: state.menuSelection.selectedFixedMenus && state.menuSelection.selectedFixedMenus.length > 0 ? state.menuSelection.selectedFixedMenus[0].menu.id : null,
          items: state.menuSelection.selectedMenuItems ? state.menuSelection.selectedMenuItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
          })) : null
        },
        has_prepayment: state.payment?.isPaid || false,
        total_amount: state.payment?.amount || 0,
      };

      console.log('Attempting to insert reservation into database...');
      const { error } = await supabase
        .from("reservations")
        .insert([reservationData]);

      if (error) {
        console.error('Supabase insertion error:', error);
        throw error;
      }
      
      console.log('Reservation successfully inserted into database');

      // Send webhook notification with enhanced error handling
      const webhookResult = await sendWebhookNotification(reservationData);
      
      if (!webhookResult) {
        console.warn('Webhook notification failed, but reservation was created in database');
        // We continue the process since the reservation was saved
      } else {
        console.log('Webhook notification completed successfully');
      }

      // If a fixed menu is selected, save it to the reservation_fixed_menus table
      if (state.menuSelection.type === 'fixed_menu' && state.menuSelection.selectedFixedMenus && state.menuSelection.selectedFixedMenus.length > 0) {
        await Promise.all(state.menuSelection.selectedFixedMenus.map(async (fixedMenu) => {
          await supabase
            .from('reservation_fixed_menus')
            .insert({
              reservation_id: reservationId,
              fixed_menu_id: fixedMenu.menu.id,
              quantity: fixedMenu.quantity
            });
        }));
      }

      // Add loyalty points
      await addLoyaltyPoints(user.id, state);

      toast({
        title: "Rezervasyon Başarılı!",
        description: "Rezervasyonunuz başarıyla oluşturuldu. Onay için lütfen bekleyiniz.",
      });

      // Reset the state
      resetReservationState(setCurrentStep);
    } catch (error) {
      console.error('Reservation submission error:', error);
      
      toast({
        title: "Rezervasyon Hatası",
        description: error instanceof Error 
          ? error.message 
          : "Rezervasyon oluşturulurken beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    }
  }, [state, user, toast, setCurrentStep]);
};

// Helper function to add loyalty points
const addLoyaltyPoints = async (userId: string, state: ReservationState) => {
  try {
    const { data: loyaltyData } = await supabase
      .from('loyalty_points')
      .select('*')
      .eq('user_id', userId)
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
        .eq('user_id', userId);
      
      await supabase
        .from('point_history')
        .insert({
          user_id: userId,
          points: totalPoints,
          description: `Rezervasyon tamamlama: ${state.menuSelection.type !== 'at_restaurant' ? 'Menü önceden seçildi' : 'Standart rezervasyon'}`
        });
      
      console.log(`Added ${totalPoints} loyalty points to user ${userId}`);
    }
  } catch (error) {
    console.error("Error updating loyalty points:", error);
  }
};

// Helper function to reset reservation state
const resetReservationState = (setCurrentStep: (step: number) => void) => {
  // Reset state logic would go here, but we'll instead rely on the parent component's implementation
  setCurrentStep(0);
};
