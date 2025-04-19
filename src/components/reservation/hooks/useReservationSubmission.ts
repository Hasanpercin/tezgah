
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { ReservationState } from '../types/reservationTypes';
import { User } from '@supabase/supabase-js';

export const useReservationSubmission = (
  user: User | null,
  state: ReservationState,
  toast: any,
  setCurrentStep: (step: number) => void
) => {
  // Function to send webhook notification
  const sendWebhookNotification = async (reservationData: any) => {
    try {
      const response = await fetch('https://k2vqd09z.rpcd.app/webhook/eecc6166-3b73-4d10-bccb-b4a14ed51a6e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData)
      });

      if (!response.ok) {
        console.error('Webhook notification failed', await response.text());
      }
    } catch (error) {
      console.error('Error sending webhook notification:', error);
    }
  };

  // Function to handle submitting the reservation
  return useCallback(async () => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
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

      // Insert reservation data into Supabase
      const { error } = await supabase
        .from("reservations")
        .insert([reservationData]);

      if (error) {
        throw error;
      }

      // Send webhook notification
      await sendWebhookNotification(reservationData);

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

      // Show success message
      toast({
        title: "Rezervasyon Başarılı!",
        description: "Rezervasyonunuz başarıyla oluşturuldu. Onay için lütfen bekleyiniz.",
      });

      // Reset the state
      resetReservationState(setCurrentStep);
    } catch (error: any) {
      // Show error message
      toast({
        title: "Rezervasyon Hatası",
        description: error.message || "Rezervasyon oluşturulurken bir hata oluştu.",
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
