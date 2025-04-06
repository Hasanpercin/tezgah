
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
import { Users } from "lucide-react";
import { Reservation, ReservationStatus } from "./reservations/types";

type ReservationTableProps = {
  reservations: Reservation[];
  onStatusChange: (id: string, newStatus: ReservationStatus) => void;
};

export const ReservationTable = ({ reservations, onStatusChange }: ReservationTableProps) => {
  if (!reservations.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Bu tarihte rezervasyon bulunmuyor.
      </div>
    );
  }

  return (
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
              <div className="text-sm">{res.phone || "Belirtilmedi"}</div>
              <div className="text-xs text-muted-foreground">{res.email || "Belirtilmedi"}</div>
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
              <Badge className={`${
                res.status === "Onaylandı" 
                  ? "bg-green-100 text-green-800 hover:bg-green-100" 
                  : res.status === "Beklemede" 
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" 
                  : "bg-red-100 text-red-800 hover:bg-red-100"
              }`}>
                {res.status}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    İşlem
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => onStatusChange(res.id, "Onaylandı")}
                    className="text-green-600"
                  >
                    Onayla
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onStatusChange(res.id, "Beklemede")}
                    className="text-yellow-600"
                  >
                    Beklet
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onStatusChange(res.id, "İptal")}
                    className="text-red-600"
                  >
                    İptal Et
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
