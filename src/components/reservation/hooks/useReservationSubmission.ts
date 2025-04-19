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
    
    // Sample test data
    const testData = {
      reservationId: "test-" + uuidv4(),
      userDetails: {
        name: "Test User",
        email: "test@example.com",
        phone: "+90 555 555 5555"
      },
      reservationDetails: {
        date: new Date().toLocaleDateString('tr-TR'),
        time: "19:00",
        guests: 4,
        notes: "Test reservation notes",
        occasion: "Test occasion"
      },
      tableDetails: {
        tableId: "test-table-1",
        tableName: "Pencere Kenarı 1",
        tableSize: 4,
        tableType: "window"
      },
      menuSelection: {
        type: "fixed_menu",
        selectedFixedMenus: [
          {
            menuId: "test-menu-1",
            menuName: "Akşam Menüsü",
            quantity: 2,
            price: 450
          }
        ],
        selectedMenuItems: [
          {
            itemId: "test-item-1",
            itemName: "Test Yemeği",
            quantity: 1,
            price: 120
          }
        ]
      },
      paymentDetails: {
        isPaid: true,
        amount: 1020,
        discountAmount: 0,
        transactionId: "test-transaction-" + uuidv4()
      }
    };

    try {
      // Convert test data to query parameters
      const queryParams = new URLSearchParams({
        data: JSON.stringify(testData)
      }).toString();

      const webhookUrl = 'https://k2vqd09z.rpcd.app/webhook-test/a68f9d2d-5f33-4541-8365-699a686ec901';
      const fullUrl = `${webhookUrl}?${queryParams}`;
      
      console.log('Sending GET request to webhook URL:', fullUrl);

      const startTime = performance.now();
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
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

      toast({
        title: "Webhook Test Başarılı",
        description: "Test verisi webhook'a başarıyla gönderildi.",
        variant: "default"
      });

      return true;
    } catch (error) {
      console.error('Webhook test error details:', error);

      toast({
        title: "Webhook Test Hatası",
        description: error instanceof Error 
          ? `Webhook test bildirimi başarısız: ${error.message}`
          : "Webhook test gönderiminde beklenmeyen bir hata oluştu",
        variant: "destructive"
      });

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
