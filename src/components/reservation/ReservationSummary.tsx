
import React, { useEffect } from 'react';
import { Check, Calendar, Users, MapPin, Clock, FileText } from 'lucide-react';
import { ReservationSummaryProps } from './types/reservationTypes';
import { useToast } from '@/hooks/use-toast';
import { useReservationSubmission } from './hooks/useReservationSubmission';
import { useAuth } from '@/context/AuthContext';

const ReservationSummary: React.FC<ReservationSummaryProps> = ({ state }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const dummySetCurrentStep = () => {};
  
  // Get the sendWebhookNotification function from our hook
  const { sendWebhookNotification } = useReservationSubmission(
    user,
    state,
    toast,
    dummySetCurrentStep
  );
  
  useEffect(() => {
    // When summary page loads, attempt to send the webhook notification with improved reliability 
    const sendWebhook = async () => {
      console.log("ReservationSummary bileşeni yüklendi, webhook gönderiliyor...");
      
      // Use multiple attempts with increasing delays for improved reliability
      const attemptWebhook = async (retryCount = 0, maxRetries = 3) => {
        try {
          console.log(`Webhook sending attempt ${retryCount + 1} of ${maxRetries + 1}`);
          const result = await sendWebhookNotification(state);
          if (result) {
            console.log("Webhook successfully sent from ReservationSummary");
          } else if (retryCount < maxRetries) {
            console.log(`Webhook send attempt ${retryCount + 1} failed, retrying in ${(retryCount + 1) * 1500}ms...`);
            // Exponential backoff for retries (1.5s, 3s, 4.5s)
            setTimeout(() => attemptWebhook(retryCount + 1, maxRetries), (retryCount + 1) * 1500);
          }
        } catch (error) {
          console.error("Webhook sending error:", error);
          if (retryCount < maxRetries) {
            console.log(`Retrying webhook after error (attempt ${retryCount + 1})...`);
            setTimeout(() => attemptWebhook(retryCount + 1, maxRetries), (retryCount + 1) * 1500);
          }
        }
      };
      
      // Start first attempt with a short delay to ensure component is fully mounted
      // This is critical for iOS Safari where the component might not be fully ready
      setTimeout(() => attemptWebhook(), 1000);
    };
    
    sendWebhook();
  }, []);
  
  const getMenuTypeText = () => {
    switch(state.menuSelection.type) {
      case 'fixed_menu':
        return 'Sabit Menü';
      case 'a_la_carte':
        return 'A La Carte Menü';
      case 'at_restaurant':
        return 'Restoranda Seçim';
      default:
        return 'Belirtilmemiş';
    }
  };
  
  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-600">Rezervasyonunuz Tamamlandı!</h2>
        <p className="text-muted-foreground mt-2">
          Rezervasyon detaylarınız aşağıda yer almaktadır.
        </p>
      </div>
      
      <div className="border rounded-lg p-6 bg-card">
        <h3 className="text-xl font-semibold mb-4">Rezervasyon Bilgileri</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tarih</p>
                <p className="font-medium">
                  {state.formData.date ? state.formData.date.toLocaleDateString('tr-TR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'Belirtilmemiş'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saat</p>
                <p className="font-medium">{state.formData.time || 'Belirtilmemiş'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kişi Sayısı</p>
                <p className="font-medium">{state.formData.guests} kişi</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Masa</p>
                <p className="font-medium">
                  {state.selectedTable ? state.selectedTable.label : 'Belirtilmemiş'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Menü Seçimi</p>
                <p className="font-medium">{getMenuTypeText()}</p>
                
                {state.menuSelection.type === 'fixed_menu' && state.menuSelection.selectedFixedMenu && (
                  <p className="text-sm mt-1">
                    {state.menuSelection.selectedFixedMenu.name} x 
                    {state.menuSelection.selectedFixedMenu.quantity || parseInt(state.formData.guests)}
                  </p>
                )}
                
                {state.menuSelection.type === 'a_la_carte' && state.menuSelection.selectedMenuItems && (
                  <div className="text-sm mt-1">
                    {state.menuSelection.selectedMenuItems.map((item, index) => (
                      <p key={item.id}>
                        {item.name} x {item.quantity || 1}
                        {index < state.menuSelection.selectedMenuItems!.length - 1 ? ', ' : ''}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {state.payment && state.payment.isPaid && (
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ödeme Durumu</p>
                  <p className="font-medium text-green-600">Ödeme Alındı ({state.payment.amount?.toLocaleString('tr-TR')} ₺)</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t">
          <p className="text-center text-muted-foreground">
            Rezervasyon iptal veya değişikliği için lütfen bizimle telefonla iletişime geçiniz.
            <br />
            <span className="font-medium text-foreground">+90 554 434 60 68</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReservationSummary;
