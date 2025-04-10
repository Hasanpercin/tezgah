
import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  Users,
  Map,
  FileText,
  ChefHat,
  Utensils,
  Store
} from 'lucide-react';
import { ReservationSummaryProps } from './types/reservationTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ReservationSummary: React.FC<ReservationSummaryProps> = ({ state }) => {
  const { formData, selectedTable, menuSelection } = state;

  // Format date
  const formattedDate = formData.date
    ? format(formData.date, 'PPP', { locale: tr })
    : 'Belirtilmedi';

  // Get menu selection type in Turkish
  const getMenuTypeDisplay = () => {
    switch (menuSelection?.type) {
      case 'fixed_menu':
        return 'Fix Menü';
      case 'a_la_carte':
        return 'A La Carte';
      case 'at_restaurant':
        return 'Restoranda Seçim';
      default:
        return 'Belirtilmedi';
    }
  };

  // Calculate total price for selected items
  const calculateTotalPrice = () => {
    if (menuSelection?.type === 'fixed_menu' && menuSelection.selectedFixedMenu) {
      const guestCount = parseInt(formData.guests) || 1;
      const menuPrice = menuSelection.selectedFixedMenu.price || 0;
      return guestCount * menuPrice;
    }
    
    if (menuSelection?.type === 'a_la_carte' && menuSelection.selectedMenuItems?.length) {
      return menuSelection.selectedMenuItems.reduce((total, item) => {
        const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price)) || 0;
        const quantity = item.quantity || 1;
        return total + (itemPrice * quantity);
      }, 0);
    }
    
    return 0;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guest Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Misafir Bilgileri</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ad Soyad</p>
                  <p className="font-medium">{formData.name || 'Belirtilmedi'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">E-posta</p>
                  <p className="font-medium">{formData.email || 'Belirtilmedi'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="font-medium">{formData.phone || 'Belirtilmedi'}</p>
                </div>
                {formData.occasion && (
                  <div>
                    <p className="text-sm text-muted-foreground">Özel Gün</p>
                    <p className="font-medium">
                      {formData.occasion === 'birthday'
                        ? 'Doğum Günü'
                        : formData.occasion === 'anniversary'
                        ? 'Yıl Dönümü'
                        : formData.occasion === 'business'
                        ? 'İş Yemeği'
                        : formData.occasion === 'date'
                        ? 'Özel Akşam Yemeği'
                        : formData.occasion}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reservation Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Rezervasyon Detayları</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tarih</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Saat</p>
                    <p className="font-medium">{formData.time || 'Belirtilmedi'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Kişi Sayısı</p>
                    <p className="font-medium">{formData.guests} kişi</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Map className="h-4 w-4 mr-2 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Masa</p>
                    <p className="font-medium">
                      {selectedTable
                        ? `${selectedTable.name || selectedTable.label || 'Masa'} (${
                            selectedTable.size
                          } kişilik)`
                        : 'Belirtilmedi'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Selection */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Menü Seçimi</h3>
            <div className="flex items-center mb-4">
              {menuSelection?.type === 'fixed_menu' ? (
                <ChefHat className="h-5 w-5 mr-2 text-primary" />
              ) : menuSelection?.type === 'a_la_carte' ? (
                <Utensils className="h-5 w-5 mr-2 text-primary" />
              ) : (
                <Store className="h-5 w-5 mr-2 text-primary" />
              )}
              <Badge variant="outline" className="font-normal text-sm">
                {getMenuTypeDisplay()}
              </Badge>
            </div>

            {/* Fixed Menu Details */}
            {menuSelection?.type === 'fixed_menu' && menuSelection.selectedFixedMenu && (
              <div className="bg-card border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{menuSelection.selectedFixedMenu.name}</h4>
                    {menuSelection.selectedFixedMenu.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {menuSelection.selectedFixedMenu.description}
                      </p>
                    )}
                    <p className="text-sm font-medium mt-2">
                      {formData.guests} kişi × {menuSelection.selectedFixedMenu.price.toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {calculateTotalPrice().toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* A La Carte Menu Details */}
            {menuSelection?.type === 'a_la_carte' && menuSelection.selectedMenuItems && menuSelection.selectedMenuItems.length > 0 && (
              <div className="bg-card border rounded-md p-4">
                <div className="space-y-3">
                  {menuSelection.selectedMenuItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity || 1} × {typeof item.price === 'number' ? item.price.toLocaleString('tr-TR') : ''} ₺
                        </p>
                      </div>
                      <p className="font-medium">
                        {(((item.quantity || 1) * (typeof item.price === 'number' ? item.price : parseFloat(String(item.price)) || 0))).toLocaleString('tr-TR')} ₺
                      </p>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 mt-3 flex justify-between">
                    <p className="font-semibold">Toplam</p>
                    <p className="font-bold text-primary">
                      {calculateTotalPrice().toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Restaurant Selection */}
            {menuSelection?.type === 'at_restaurant' && (
              <div className="bg-card border rounded-md p-4">
                <p className="text-muted-foreground">
                  Menü seçiminizi restoranda gerçekleştireceksiniz. Servis ekibimiz size yardımcı olacaktır.
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          {formData.notes && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-start">
                <FileText className="h-5 w-5 mr-2 mt-1 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">Notlar</h4>
                  <p className="mt-1 text-muted-foreground">{formData.notes}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationSummary;
