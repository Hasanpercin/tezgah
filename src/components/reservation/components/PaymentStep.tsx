
import React from 'react';
import { ReservationState, PaymentInfo } from '../types/reservationTypes';
import PaymentForm from '@/components/payments/PaymentForm';

interface PaymentStepProps {
  reservation: ReservationState;
  onPaymentComplete: (paymentInfo: PaymentInfo) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ reservation, onPaymentComplete }) => {
  // Calculate the subtotal based on selection type
  const calculateSubtotal = () => {
    if (reservation.menuSelection.type === 'fixed_menu' && reservation.menuSelection.selectedFixedMenus && reservation.menuSelection.selectedFixedMenus.length > 0) {
      return reservation.menuSelection.selectedFixedMenus.reduce((sum, item) => {
        return sum + (item.menu.price * item.quantity);
      }, 0);
    } else if (reservation.menuSelection.type === 'a_la_carte' && reservation.menuSelection.selectedMenuItems) {
      return reservation.menuSelection.selectedMenuItems.reduce((sum, item) => {
        return sum + (item.price * (item.quantity || 1));
      }, 0);
    } else if (reservation.menuSelection.type === 'mixed') {
      let total = 0;
      // Add fixed menu items
      if (reservation.menuSelection.selectedFixedMenus && reservation.menuSelection.selectedFixedMenus.length > 0) {
        total += reservation.menuSelection.selectedFixedMenus.reduce((sum, item) => {
          return sum + (item.menu.price * item.quantity);
        }, 0);
      }
      // Add a la carte items
      if (reservation.menuSelection.selectedMenuItems && reservation.menuSelection.selectedMenuItems.length > 0) {
        total += reservation.menuSelection.selectedMenuItems.reduce((sum, item) => {
          return sum + (item.price * (item.quantity || 1));
        }, 0);
      }
      return total;
    }
    return 0;
  };

  // Calculate standard discount (10%)
  const calculateDiscount = (subtotal: number) => {
    // Default discount settings
    const discountPercentage = 10;
    return {
      percentage: discountPercentage,
      amount: subtotal * (discountPercentage / 100)
    };
  };

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(subtotal);
  const total = subtotal - discount.amount;

  const handlePaymentSuccess = (transactionId: string) => {
    onPaymentComplete({
      transactionId,
      isPaid: true,
      amount: total,
      discountPercentage: discount.percentage,
      discountAmount: discount.amount
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Ödeme</h3>
      
      <div className="bg-muted p-4 rounded-md mb-6">
        <h4 className="font-medium mb-2">Rezervasyon Özeti</h4>
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">Ad Soyad:</span> {reservation.formData.name}</p>
          <p><span className="font-medium">Tarih:</span> {reservation.formData.date?.toLocaleDateString('tr-TR')}</p>
          <p><span className="font-medium">Saat:</span> {reservation.formData.time}</p>
          <p><span className="font-medium">Kişi Sayısı:</span> {reservation.formData.guests}</p>
          
          {(reservation.menuSelection.type === 'fixed_menu' || reservation.menuSelection.type === 'mixed') && 
           reservation.menuSelection.selectedFixedMenus && 
           reservation.menuSelection.selectedFixedMenus.length > 0 && (
            <div>
              <span className="font-medium">Seçilen Menüler:</span>
              <ul className="list-disc list-inside pl-2">
                {reservation.menuSelection.selectedFixedMenus.map((item, index) => (
                  <li key={`fixed-${index}`}>
                    {item.menu.name} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {(reservation.menuSelection.type === 'a_la_carte' || reservation.menuSelection.type === 'mixed') && 
           reservation.menuSelection.selectedMenuItems && 
           reservation.menuSelection.selectedMenuItems.length > 0 && (
            <div>
              <span className="font-medium">Seçilen Yemekler:</span>
              <ul className="list-disc list-inside pl-2">
                {reservation.menuSelection.selectedMenuItems.map((item) => (
                  <li key={item.id}>
                    {item.name} x {item.quantity || 1}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-b py-4 space-y-2">
        <div className="flex justify-between">
          <span>Ara Toplam</span>
          <span>{subtotal.toLocaleString('tr-TR')} ₺</span>
        </div>
        
        <div className="flex justify-between text-green-600">
          <span>İndirim (%{discount.percentage})</span>
          <span>-{discount.amount.toLocaleString('tr-TR')} ₺</span>
        </div>
        
        <div className="flex justify-between font-semibold text-lg pt-2">
          <span>Toplam</span>
          <span>{total.toLocaleString('tr-TR')} ₺</span>
        </div>
      </div>

      <div className="pt-4">
        <PaymentForm 
          amount={total} 
          onPaymentComplete={handlePaymentSuccess} 
          reservationData={{
            name: reservation.formData.name,
            email: reservation.formData.email,
            phone: reservation.formData.phone,
            reservationId: "pending"
          }}
        />
      </div>
    </div>
  );
};

export default PaymentStep;
