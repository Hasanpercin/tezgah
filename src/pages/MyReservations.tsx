
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Users, AlertTriangle, CheckCircle2, Ban } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from '@/components/ui/skeleton';

interface UserReservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  name?: string;
  has_prepayment?: boolean;
  total_amount?: number;
  created_at: string;
}

const MyReservations = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<UserReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelReservationId, setCancelReservationId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });
          
        if (error) throw error;
        
        setReservations(data || []);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        toast({
          title: 'Hata',
          description: 'Rezervasyonlarınız yüklenirken bir hata oluştu.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReservations();
  }, [user, toast]);
  
  const handleCancelReservation = async () => {
    if (!cancelReservationId) return;
    
    try {
      // Check if reservation has prepayment
      const reservation = reservations.find(r => r.id === cancelReservationId);
      
      if (reservation?.has_prepayment) {
        toast({
          title: 'İptal Edilemedi',
          description: 'Ön ödemesi yapılan rezervasyonlar iptal edilemez. Lütfen restoranımızla iletişime geçin.',
          variant: 'destructive',
        });
        setCancelReservationId(null);
        return;
      }
      
      // Update reservation status to cancelled
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'İptal' })
        .eq('id', cancelReservationId);
        
      if (error) throw error;
      
      // Update local state
      setReservations(prev => 
        prev.map(res => 
          res.id === cancelReservationId 
            ? { ...res, status: 'İptal' } 
            : res
        )
      );
      
      toast({
        title: 'Rezervasyon İptal Edildi',
        description: 'Rezervasyonunuz başarıyla iptal edildi.',
      });
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast({
        title: 'Hata',
        description: 'Rezervasyon iptal edilirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setCancelReservationId(null);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Rezervasyonlarım</h1>
        <p className="text-muted-foreground mb-6">
          Rezervasyonlarınızı görüntülemek için lütfen giriş yapın.
        </p>
        <Button asChild>
          <a href="/login">Giriş Yap</a>
        </Button>
      </div>
    );
  }
  
  const upcomingReservations = reservations.filter(
    r => new Date(r.date) >= new Date() && r.status !== 'İptal'
  );
  
  const pastReservations = reservations.filter(
    r => new Date(r.date) < new Date() || r.status === 'İptal'
  );

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold mb-2">Rezervasyonlarım</h1>
      <p className="text-muted-foreground mb-8">
        Mevcut ve geçmiş tüm rezervasyonlarınızı buradan yönetebilirsiniz.
      </p>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
          <div className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Gelecek Rezervasyonlar</h2>
                
                {upcomingReservations.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tarih</TableHead>
                        <TableHead>Saat</TableHead>
                        <TableHead>Kişi</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Ön Ödeme</TableHead>
                        <TableHead>İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingReservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell>
                            {format(new Date(reservation.date), 'd MMMM yyyy', { locale: tr })}
                          </TableCell>
                          <TableCell>{reservation.time}</TableCell>
                          <TableCell>{reservation.guests}</TableCell>
                          <TableCell>
                            <StatusBadge status={reservation.status} />
                          </TableCell>
                          <TableCell>
                            {reservation.has_prepayment ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Ödendi
                              </Badge>
                            ) : 'Yapılmadı'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setCancelReservationId(reservation.id)}
                              disabled={reservation.has_prepayment}
                            >
                              <Ban className="h-4 w-4 mr-1" /> İptal Et
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>Gelecek rezervasyonunuz bulunmuyor</p>
                    <p className="text-sm mt-2">Yeni bir rezervasyon yapmak için rezervasyon sayfasını ziyaret edebilirsiniz.</p>
                    <Button className="mt-4" asChild>
                      <a href="/reservation">Rezervasyon Yap</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {pastReservations.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Geçmiş Rezervasyonlar</h2>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tarih</TableHead>
                        <TableHead>Saat</TableHead>
                        <TableHead>Kişi</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Tutar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastReservations.map((reservation) => (
                        <TableRow key={reservation.id} className="opacity-70">
                          <TableCell>
                            {format(new Date(reservation.date), 'd MMMM yyyy', { locale: tr })}
                          </TableCell>
                          <TableCell>{reservation.time}</TableCell>
                          <TableCell>{reservation.guests}</TableCell>
                          <TableCell>
                            <StatusBadge status={reservation.status} />
                          </TableCell>
                          <TableCell>
                            {reservation.total_amount 
                              ? `${reservation.total_amount.toLocaleString('tr-TR')} ₺` 
                              : '-'
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="mt-8 p-5 bg-muted rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="text-amber-600 h-5 w-5 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">İptal Koşulları</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Ön ödeme yapılan rezervasyonlar iptal edilemez.</li>
                  <li>Rezervasyon saatinizden 24 saat öncesine kadar iptal işlemi yapabilirsiniz.</li>
                  <li>İptal işlemi sonrası herhangi bir geri ödeme yapılmaz.</li>
                  <li>Özel durumlar için lütfen restoranımızla iletişime geçin: +90 554 434 60 68</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
      
      <AlertDialog open={!!cancelReservationId} onOpenChange={() => setCancelReservationId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rezervasyon İptal Edilsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Rezervasyonunuzu iptal etmek istediğinize emin misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelReservation} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Evet, İptal Et
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'Onaylandı':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700">
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Onaylandı
        </Badge>
      );
    case 'Beklemede':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
          <Clock className="h-3.5 w-3.5 mr-1" /> Beklemede
        </Badge>
      );
    case 'İptal':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700">
          <Ban className="h-3.5 w-3.5 mr-1" /> İptal Edildi
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export default MyReservations;
