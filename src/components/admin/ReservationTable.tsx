
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: string;
  occasion?: string;
  notes?: string;
  status: "confirmed" | "pending" | "cancelled";
};

type ReservationTableProps = {
  reservations: Reservation[];
  onStatusChange: (id: string, newStatus: "confirmed" | "pending" | "cancelled") => void;
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
              <div className="font-medium">{res.name}</div>
              <div className="text-sm text-muted-foreground">{res.phone}</div>
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
                res.status === "confirmed" 
                  ? "bg-green-100 text-green-800 hover:bg-green-100" 
                  : res.status === "pending" 
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" 
                  : "bg-red-100 text-red-800 hover:bg-red-100"
              }`}>
                {res.status === "confirmed" ? "Onaylı" : res.status === "pending" ? "Beklemede" : "İptal"}
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
                    onClick={() => onStatusChange(res.id, "confirmed")}
                    className="text-green-600"
                  >
                    Onayla
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onStatusChange(res.id, "pending")}
                    className="text-yellow-600"
                  >
                    Beklet
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onStatusChange(res.id, "cancelled")}
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
