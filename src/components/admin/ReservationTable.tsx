import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, Mail, Eye, XCircle, CheckCircle } from "lucide-react";
import { Reservation, ReservationStatus } from "./reservations/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type ReservationTableProps = {
  reservations: Reservation[];
  onStatusChange: (id: string, newStatus: ReservationStatus) => void;
};

export const ReservationTable = ({ reservations, onStatusChange }: ReservationTableProps) => {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const handleStatusChange = async (id: string, newStatus: ReservationStatus, reservation: Reservation) => {
    try {
      await onStatusChange(id, newStatus);
      
      if (reservation.email) {
        const notificationData = {
          type: 'reservation_status',
          reservationId: id,
          status: newStatus,
          customerEmail: reservation.email,
          customerName: reservation.name || 'Değerli Müşterimiz',
          date: format(new Date(reservation.date), "dd.MM.yyyy"),
          time: reservation.time,
          guests: reservation.guests,
          tableInfo: reservation.selected_table?.name || ''
        };
        
        const response = await fetch('https://uvndgrbclfavulineazs.supabase.co/functions/v1/send-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationData)
        });
        
        if (!response.ok) {
          console.error('Notification email failed to send');
        }
      }
    } catch (error) {
      console.error("Error updating reservation status:", error);
    }
  };

  if (!reservations.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Bu tarihte rezervasyon bulunmuyor.
      </div>
    );
  }

  const getBadgeStyle = (status: string) => {
    switch(status) {
      case "Onaylandı": 
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Beklemede": 
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "İptal": 
      default:
        return "bg-red-100 text-red-800 hover:bg-red-100";
    }
  };

  const getMenuTypeDisplay = (type?: string): string => {
    switch (type) {
      case "fixed_menu":
        return "Fix Menü";
      case "a_la_carte":
        return "A La Carte";
      case "at_restaurant":
        return "Restoranda Seçim";
      default:
        return "Belirtilmedi";
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Misafir</TableHead>
            <TableHead>İletişim</TableHead>
            <TableHead>Tarih & Saat</TableHead>
            <TableHead>Kişi</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>İşlem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((res) => (
            <TableRow key={res.id}>
              <TableCell>
                <div className="font-medium">{res.name || "İsimsiz"}</div>
                {res.occasion && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {res.occasion === "birthday" ? "Doğum Günü" :
                     res.occasion === "anniversary" ? "Yıl Dönümü" :
                     res.occasion === "business" ? "İş Yemeği" :
                     res.occasion === "date" ? "Romantik Akşam Yemeği" : "Özel"}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-sm" onClick={() => {}}>
                      <div className="text-left flex flex-col">
                        <div className="text-sm flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {res.phone || "Belirtilmedi"}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {res.email || "Belirtilmedi"}
                        </div>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Müşteri İletişim Bilgileri</DialogTitle>
                      <DialogDescription>
                        {res.name || "İsimsiz"} - Rezervasyon #{res.id.substring(0, 8)}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Telefon</h4>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${res.phone}`} className="text-blue-600 hover:underline">
                            {res.phone || "Belirtilmedi"}
                          </a>
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">E-posta</h4>
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${res.email}`} className="text-blue-600 hover:underline">
                            {res.email || "Belirtilmedi"}
                          </a>
                        </p>
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Kapat</Button>
                      </DialogClose>
                      
                      {res.phone && (
                        <a href={`tel:${res.phone}`}>
                          <Button>
                            <Phone className="mr-2 h-4 w-4" /> Ara
                          </Button>
                        </a>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                {format(new Date(res.date), "dd.MM.yyyy")} {res.time}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users size={16} /> {res.guests}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getBadgeStyle(res.status)}>
                  {res.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedReservation(res)}>
                        <Eye size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Rezervasyon Detayları</DialogTitle>
                        <DialogDescription>
                          Rezervasyon #{res.id.substring(0, 8)} - {format(new Date(res.date), "dd.MM.yyyy")} {res.time}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <ScrollArea className="max-h-[70vh]">
                        <div className="space-y-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-sm font-semibold mb-3">Misafir Bilgileri</h3>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs text-muted-foreground">Ad Soyad</p>
                                  <p className="font-medium">{res.name || "Belirtilmedi"}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">E-posta</p>
                                  <p className="font-medium">{res.email || "Belirtilmedi"}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Telefon</p>
                                  <p className="font-medium">{res.phone || "Belirtilmedi"}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-semibold mb-3">Rezervasyon Detayları</h3>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs text-muted-foreground">Rezervasyon ID</p>
                                  <p className="font-medium">{res.id}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Tarih & Saat</p>
                                  <p className="font-medium">
                                    {format(new Date(res.date), "dd.MM.yyyy")} {res.time}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Kişi Sayısı</p>
                                  <p className="font-medium">{res.guests} kişi</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Durum</p>
                                  <Badge className={getBadgeStyle(res.status)}>
                                    {res.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="text-sm font-semibold mb-3">Menü Seçimi</h3>
                            {res.selected_items ? (
                              <div className="bg-muted/30 p-3 rounded-md">
                                <p className="mb-2">
                                  <Badge variant="outline">
                                    {getMenuTypeDisplay(res.selected_items.menuSelectionType)}
                                  </Badge>
                                </p>
                                
                                {res.selected_items.menuSelectionType === "fixed_menu" && res.selected_items.fixedMenuId && (
                                  <p>Fix menü seçildi (ID: {res.selected_items.fixedMenuId})</p>
                                )}
                                
                                {res.selected_items.menuSelectionType === "a_la_carte" && res.selected_items.items?.length > 0 && (
                                  <div>
                                    <p className="mb-1 text-sm">Seçilen ürünler:</p>
                                    <ul className="list-disc list-inside text-sm">
                                      {res.selected_items.items.map((item, index) => (
                                        <li key={index}>
                                          {item.name} x {item.quantity || 1}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {res.selected_items.menuSelectionType === "at_restaurant" && (
                                  <p className="text-sm">Menü seçimi restoranda yapılacak</p>
                                )}
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm">Menü seçimi bilgisi bulunamadı</p>
                            )}
                          </div>

                          <Separator />
                          <div>
                            <h3 className="text-sm font-semibold mb-2">Notlar</h3>
                            {res.notes ? (
                              <p className="text-sm bg-muted/30 p-3 rounded-md">{res.notes}</p>
                            ) : (
                              <p className="text-muted-foreground text-sm">Not bulunmuyor</p>
                            )}
                          </div>
                        </div>
                      </ScrollArea>
                      
                      <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              handleStatusChange(res.id, "İptal", res);
                              setSelectedReservation(null);
                            }}
                            className="flex-1 sm:flex-auto"
                          >
                            <XCircle className="mr-2 h-4 w-4" /> İptal Et
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => {
                              handleStatusChange(res.id, "Onaylandı", res);
                              setSelectedReservation(null);
                            }}
                            className="flex-1 sm:flex-auto"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" /> Onayla
                          </Button>
                        </div>
                        
                        <DialogClose asChild>
                          <Button variant="outline" size="sm">Kapat</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        İşlem
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(res.id, "Onaylandı", res)}
                        className="text-green-600"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Onayla
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(res.id, "Beklemede", res)}
                        className="text-yellow-600"
                      >
                        Beklet
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(res.id, "İptal", res)}
                        className="text-red-600"
                      >
                        <XCircle className="mr-2 h-4 w-4" /> İptal Et
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
