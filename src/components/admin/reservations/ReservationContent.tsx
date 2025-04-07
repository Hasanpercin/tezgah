
import { Spinner } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ReservationTable } from "../ReservationTable";
import { Reservation, ReservationStatus } from "./types";

type ReservationContentProps = {
  reservations: Reservation[];
  isLoading: boolean;
  error: any;
  selectedDate: Date | undefined;
  onStatusChange: (id: string, newStatus: ReservationStatus) => void;
};

export const ReservationContent: React.FC<ReservationContentProps> = ({
  reservations,
  isLoading,
  error,
  selectedDate,
  onStatusChange
}) => {
  if (isLoading) {
    return (
      <div className="md:col-span-2 flex items-center justify-center h-64">
        <Spinner className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:col-span-2 flex flex-col items-center justify-center h-64">
        <div className="text-destructive mb-2">Rezervasyonlar yüklenirken hata oluştu.</div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="md:col-span-2 border rounded-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {selectedDate ? (
              format(selectedDate, "d MMMM yyyy", { locale: tr })
            ) : (
              "Seçilen Tarih"
            )}
            <span className="ml-2 text-muted-foreground">Rezervasyonlar</span>
          </h2>
          <div className="text-sm font-medium bg-primary/10 text-primary py-1 px-3 rounded-full">
            {reservations.length} rezervasyon
          </div>
        </div>

        <ReservationTable 
          reservations={reservations} 
          onStatusChange={onStatusChange} 
        />
      </div>
    </div>
  );
};
