
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
      const webhookUrl = 'https://k2vqd09z.rpcd.app/webhook-test/a68f9d2d-5f33-4541-8365-699a686ec901';
      
      // Doğrudan URL'ye data parametresi olarak ekle
      // Bu tür JSON veriler için encodeURIComponent ile kodlama şart
      const encodedData = encodeURIComponent(JSON.stringify(testData));
      const fullUrl = `${webhookUrl}?data=${encodedData}`;
      
      console.log('Webhook verisi gönderiliyor:', JSON.stringify(testData, null, 2));
      console.log('Tam URL:', fullUrl);

      const startTime = performance.now();
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      const endTime = performance.now();

      console.log(`Webhook isteği ${Math.round(endTime - startTime)}ms içinde tamamlandı`);
      console.log('Yanıt durumu:', response.status);
      console.log('Yanıt durum metni:', response.statusText);

      const responseText = await response.text();
      console.log('Tam yanıt içeriği:', responseText);

      if (!response.ok) {
        throw new Error(`Webhook ${response.status} kodu ile başarısız oldu: ${responseText}`);
      }

      toast({
        title: "Webhook Test Başarılı",
        description: "Test verisi webhook'a başarıyla gönderildi.",
        variant: "default"
      });

      return true;
    } catch (error) {
      console.error('Webhook test hatası detayları:', error);

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
    console.log('Rezervasyon gönderme işlemi başlatılıyor...');
    
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

      console.log('Rezervasyon veritabanına ekleniyor...');
      const { error } = await supabase
        .from("reservations")
        .insert([reservationData]);

      if (error) {
        console.error('Supabase ekleme hatası:', error);
        throw error;
      }
      
      console.log('Rezervasyon başarıyla veritabanına eklendi');

      // Hem rezervasyon oluşturulurken hem de manuel test için webhook'u çağırabiliriz
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

      toast({
        title: "Rezervasyon Başarılı!",
        description: "Rezervasyonunuz başarıyla oluşturuldu. Onay için lütfen bekleyiniz.",
      });

      // Reset the state
      resetReservationState(setCurrentStep);
    } catch (error) {
      console.error('Rezervasyon gönderme hatası:', error);
      
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
      
      console.log(`Kullanıcı ${userId}'ye ${totalPoints} sadakat puanı eklendi`);
    }
  } catch (error) {
    console.error("Sadakat puanları güncellenirken hata:", error);
  }
};

// Helper function to reset reservation state
const resetReservationState = (setCurrentStep: (step: number) => void) => {
  // Reset state logic would go here, but we'll instead rely on the parent component's implementation
  setCurrentStep(0);
};
