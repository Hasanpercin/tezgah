
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Users, AlertCircle } from "lucide-react";
import { ReservationTable } from "../ReservationTable";
import { Reservation, ReservationStatus } from "./types";

interface ReservationContentProps {
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;
  selectedDate: Date | undefined;
  onStatusChange: (id: string, newStatus: ReservationStatus) => void;
}

export const ReservationContent = ({
  reservations,
  isLoading,
  error,
  selectedDate,
  onStatusChange
}: ReservationContentProps) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {selectedDate ? format(selectedDate, "d MMMM yyyy") : "Tüm"} Rezervasyonlar
          </span>
          <Badge variant="secondary" className="text-base px-2 py-1">
            {reservations.length} rezervasyon
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-red-500">
            <AlertCircle className="h-10 w-10 mb-2" />
            <p>{error}</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center p-8">
            <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Bu tarihte rezervasyon bulunmuyor</p>
          </div>
        ) : (
          <ReservationTable 
            reservations={reservations} 
            onStatusChange={onStatusChange} 
          />
        )}
      </CardContent>
    </Card>
  );
};
