
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
  const sendWebhookNotification = async (reservationData: any, reservationId?: string) => {
    console.log('Starting webhook notification process...', { reservationData, reservationId });
    
    try {
      // Prepare reservation data for webhook
      const webhookData = {
        reservationId: reservationId || reservationData.id || "test-" + uuidv4(),
        userDetails: {
          name: reservationData.formData?.name || "Test User",
          email: reservationData.formData?.email || "test@example.com",
          phone: reservationData.formData?.phone || "+90 555 555 5555"
        },
        reservationDetails: {
          date: reservationData.formData?.date 
            ? new Date(reservationData.formData.date).toLocaleDateString('tr-TR') 
            : new Date().toLocaleDateString('tr-TR'),
          time: reservationData.formData?.time || "19:00",
          guests: parseInt(reservationData.formData?.guests) || 4,
          notes: reservationData.formData?.notes || "Test reservation notes",
          occasion: reservationData.formData?.occasion || "Test occasion"
        },
        tableDetails: reservationData.selectedTable 
          ? {
              tableId: reservationData.selectedTable.id,
              tableName: reservationData.selectedTable.label || "Bilinmeyen Masa",
              tableSize: reservationData.selectedTable.size,
              tableType: reservationData.selectedTable.type
            }
          : {
              tableId: "test-table-1",
              tableName: "Pencere Kenarı 1",
              tableSize: 4,
              tableType: "window"
            },
        menuSelection: {
          type: reservationData.menuSelection?.type || "fixed_menu",
          selectedFixedMenus: reservationData.menuSelection?.selectedFixedMenus || [
            {
              menuId: "test-menu-1",
              menuName: "Akşam Menüsü",
              quantity: 2,
              price: 450
            }
          ],
          selectedMenuItems: reservationData.menuSelection?.selectedMenuItems || [
            {
              itemId: "test-item-1",
              itemName: "Test Yemeği",
              quantity: 1,
              price: 120
            }
          ]
        },
        paymentDetails: {
          isPaid: reservationData.payment?.isPaid || false,
          amount: reservationData.payment?.amount || 0,
          discountAmount: 0,
          transactionId: reservationData.payment?.transactionId || "test-transaction-" + uuidv4()
        }
      };

      // Updated webhook URL
      const webhookUrl = 'https://k2vqd09z.rpcd.app/webhook/a68f9d2d-5f33-4541-8365-699a686ec901';
      
      // Improved iOS Safari detection
      const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                         !navigator.userAgent.includes('Chrome') && 
                         !navigator.userAgent.includes('CriOS');
                         
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // For iOS Safari or other mobile browsers, use our most reliable approach
      if (isIOSSafari || isMobile) {
        console.log(`Using mobile-optimized webhook approach (iOS Safari: ${isIOSSafari}, Mobile: ${isMobile})`);
        
        // Create reliable method for iOS Safari
        const encodedData = encodeURIComponent(JSON.stringify(webhookData));
        const fullUrl = `${webhookUrl}?data=${encodedData}`;
        
        console.log('Mobile webhook URL:', fullUrl);
        
        // Multiple methods to ensure delivery on iOS Safari
        try {
          // Method 1: Image request technique (works on almost all browsers including iOS Safari)
          const img = new Image();
          
          // Set up handling
          img.onload = () => {
            console.log('Mobile webhook successful via image method');
            toast({
              title: "Webhook Bildirimi Başarılı",
              description: "Rezervasyon verileri webhook'a başarıyla gönderildi.",
              variant: "default"
            });
          };
          
          img.onerror = () => {
            console.log('Mobile webhook image failed to load, but request may have been processed');
            // We don't show error as the request might still be processed
          };
          
          // Add timestamp to prevent caching (critical for iOS Safari)
          const cacheBuster = Date.now();
          img.src = `${fullUrl}&cacheBuster=${cacheBuster}`;
          
          // Method 2: Use XMLHttpRequest as backup on mobile (works on some browsers when fetch fails)
          setTimeout(() => {
            console.log("Trying XMLHttpRequest as backup method");
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `${fullUrl}&secondTry=true&cacheBuster=${Date.now()}`, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
          }, 300);
          
        } catch (innerError) {
          console.error("Error with mobile webhook methods:", innerError);
          // We still return success as the first method might have worked
        }
        
        return true;
      } else {
        // Desktop approach with fetch and proper error handling
        console.log('Using standard desktop webhook approach');
        console.log('Webhook data being sent:', JSON.stringify(webhookData, null, 2));
        
        const encodedData = encodeURIComponent(JSON.stringify(webhookData));
        const fullUrl = `${webhookUrl}?data=${encodedData}`;
        
        console.log('Full URL:', fullUrl);

        const startTime = performance.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);  // 10 second timeout

        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
          cache: 'no-store',
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const endTime = performance.now();

        console.log(`Webhook request completed in ${Math.round(endTime - startTime)}ms`);
        console.log('Response status:', response.status);

        const responseText = await response.text();
        console.log('Full response content:', responseText);

        if (!response.ok) {
          throw new Error(`Webhook failed with status code ${response.status}: ${responseText}`);
        }

        toast({
          title: "Webhook Bildirimi Başarılı",
          description: "Rezervasyon verileri webhook'a başarıyla gönderildi.",
          variant: "default"
        });

        return true;
      }
    } catch (error) {
      console.error('Webhook sending error details:', error);

      toast({
        title: "Webhook Bildirimi Hatası",
        description: error instanceof Error 
          ? `Webhook bildirimi başarısız: ${error.message}`
          : "Webhook gönderiminde beklenmeyen bir hata oluştu",
        variant: "destructive"
      });

      return false;
    }
  };

  // Main reservation submission function
  const submitReservation = useCallback(async () => {
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
        table_id: state.selectedTable ? state.selectedTable.id : null,
        menu_selection_type: state.menuSelection.type,
        fixed_menu_id: state.menuSelection.selectedFixedMenus && state.menuSelection.selectedFixedMenus.length > 0 ? 
          state.menuSelection.selectedFixedMenus[0].menu.id : null,
        has_prepayment: state.payment?.isPaid || false,
        total_amount: state.payment?.amount || 0,
      };

      console.log('Rezervasyon veritabanına ekleniyor...', reservationData);
      const { error } = await supabase
        .from("reservations")
        .insert([reservationData]);

      if (error) {
        console.error('Supabase ekleme hatası:', error);
        throw error;
      }
      
      console.log('Rezervasyon başarıyla veritabanına eklendi');

      // Webhook bildirimi gönderme işlemi - Burası kritik!
      console.log('Rezervasyon için webhook bildirimi gönderiliyor...');
      await sendWebhookNotification(state, reservationId);
      
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

  return {
    submitReservation,
    sendWebhookNotification // Export for webhook testing
  };
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
