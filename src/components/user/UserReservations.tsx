
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, isAfter } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, Calendar, Clock, Users, XCircle, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserReservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  notes?: string;
  occasion?: string;
  created_at: string;
  selected_items?: any;
}

const UserReservations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<UserReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDetails, setExpandedDetails] = useState<string | null>(null);
  const [cancelReservationId, setCancelReservationId] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Fetch user reservations
  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true })
          .order('time', { ascending: true });

        if (error) throw error;
        setReservations(data || []);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        toast({
          title: 'Hata',
          description: 'Rezervasyonlar yüklenirken bir hata oluştu.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user, toast]);

  const toggleDetails = (id: string) => {
    setExpandedDetails(expandedDetails === id ? null : id);
  };
  
  const openCancelDialog = (id: string) => {
    setCancelReservationId(id);
    setCancelDialogOpen(true);
  };

  const cancelReservation = async () => {
    if (!cancelReservationId) return;
    
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'İptal', updated_at: new Date().toISOString() })
        .eq('id', cancelReservationId);
        
      if (error) throw error;
      
      // Update local state
      setReservations(reservations.map(res => 
        res.id === cancelReservationId ? { ...res, status: 'İptal' } : res
      ));
      
      toast({
        title: 'Rezervasyon İptal Edildi',
        description: 'Rezervasyonunuz başarıyla iptal edilmiştir.',
      });
      
      setCancelDialogOpen(false);
      setCancelReservationId(null);
    } catch (error) {
      console.error('Error canceling reservation:', error);
      toast({
        title: 'Hata',
        description: 'Rezervasyon iptal edilirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  const getMenuTypeDisplay = (type?: string): string => {
    switch (type) {
      case "fixed_menu":
        return "Fix Menü";
      case "a_la_carte":
        return "A La Carte";
      case "mixed":
        return "Karışık Seçim";
      case "at_restaurant":
        return "Restoranda Seçim";
      default:
        return "Belirtilmedi";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Onaylandı':
        return 'bg-green-100 text-green-800';
      case 'Beklemede':
        return 'bg-yellow-100 text-yellow-800';
      case 'İptal':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if reservation can be canceled
  const canCancelReservation = (reservation: UserReservation) => {
    // Only active reservations can be canceled
    if (reservation.status !== 'Onaylandı' && reservation.status !== 'Beklemede') return false;
    
    // Check if reservation date is in the future
    const today = new Date();
    const reservationDate = parseISO(`${reservation.date}T${reservation.time}`);
    
    // Allow cancellation if reservation is at least 3 hours in the future
    const threeHoursFromNow = new Date(today.getTime() + 3 * 60 * 60 * 1000);
    return isAfter(reservationDate, threeHoursFromNow);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="mb-4 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto opacity-30" />
        </div>
        <h3 className="text-lg font-medium mb-2">Henüz rezervasyonunuz bulunmuyor</h3>
        <p className="text-muted-foreground mb-4">Yeni bir rezervasyon oluşturmak için rezervasyon sayfasını ziyaret edebilirsiniz.</p>
        <Button asChild>
          <a href="/reservation">Rezervasyon Yap</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <Card key={reservation.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>
                  Rezervasyon - {format(new Date(reservation.date), 'dd MMMM yyyy')}
                </CardTitle>
                <CardDescription>
                  #{reservation.id.substring(0, 8)} · {format(new Date(reservation.created_at), 'dd.MM.yyyy')} tarihinde oluşturuldu
                </CardDescription>
              </div>
              <Badge className={getStatusBadgeClass(reservation.status)}>
                {reservation.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(reservation.date), 'dd MMMM yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{reservation.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{reservation.guests} kişi</span>
              </div>
            </div>
            
            {expandedDetails === reservation.id && (
              <div className="mt-4 space-y-4 text-sm">
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Utensils className="h-4 w-4" /> Menü Seçimi
                  </h4>
                  
                  {reservation.selected_items ? (
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getMenuTypeDisplay(reservation.selected_items.menuSelectionType)}
                        </Badge>
                      </p>
                      
                      {(reservation.selected_items.menuSelectionType === 'fixed_menu' || reservation.selected_items.menuSelectionType === 'mixed') && 
                       reservation.selected_items.fixedMenus && reservation.selected_items.fixedMenus.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium mb-1">Fix Menüler:</p>
                          <ul className="list-disc list-inside text-xs">
                            {reservation.selected_items.fixedMenus.map((item: any, idx: number) => (
                              <li key={idx}>{item.menu?.name} x {item.quantity || 1}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {(reservation.selected_items.menuSelectionType === 'a_la_carte' || reservation.selected_items.menuSelectionType === 'mixed') && 
                       reservation.selected_items.items && reservation.selected_items.items.length > 0 && (
                        <div>
                          <p className="text-xs font-medium mb-1">A La Carte Seçimler:</p>
                          <ul className="list-disc list-inside text-xs">
                            {reservation.selected_items.items.map((item: any, idx: number) => (
                              <li key={idx}>{item.name} x {item.quantity || 1}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {reservation.selected_items.menuSelectionType === 'at_restaurant' && (
                        <p className="text-xs">Menü seçimi restoranda yapılacak</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs">Menü seçimi bilgisi bulunamadı</p>
                  )}
                </div>
                
                {reservation.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notlar</h4>
                    <p className="text-muted-foreground">{reservation.notes}</p>
                  </div>
                )}
                
                {reservation.occasion && (
                  <div>
                    <h4 className="font-medium mb-2">Özel Durum</h4>
                    <p className="text-muted-foreground">
                      {reservation.occasion === "birthday" ? "Doğum Günü" :
                       reservation.occasion === "anniversary" ? "Yıl Dönümü" :
                       reservation.occasion === "business" ? "İş Yemeği" :
                       reservation.occasion === "date" ? "Romantik Akşam Yemeği" : 
                       reservation.occasion}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between pt-2">
            <Button 
              variant="ghost" 
              onClick={() => toggleDetails(reservation.id)}
              className="text-muted-foreground text-sm"
            >
              {expandedDetails === reservation.id ? (
                <>Detayları Gizle <ChevronUp className="ml-1 h-4 w-4" /></>
              ) : (
                <>Detayları Göster <ChevronDown className="ml-1 h-4 w-4" /></>
              )}
            </Button>
            
            {canCancelReservation(reservation) && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => openCancelDialog(reservation.id)}
              >
                <XCircle className="mr-2 h-4 w-4" /> İptal Et
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
      
      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rezervasyon İptali</DialogTitle>
            <DialogDescription>
              Bu rezervasyonu iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Vazgeç
            </Button>
            <Button variant="destructive" onClick={cancelReservation}>
              İptal Et
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserReservations;
