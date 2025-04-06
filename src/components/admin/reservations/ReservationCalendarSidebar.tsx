
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReservationCalendar } from "@/components/admin/ReservationCalendar";
import { Reservation } from "./types";

interface ReservationCalendarSidebarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  reservations: Reservation[];
}

export const ReservationCalendarSidebar = ({
  selectedDate,
  onSelectDate,
  reservations
}: ReservationCalendarSidebarProps) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Tarih Seçin</CardTitle>
        <CardDescription>
          Rezervasyonları filtrelemek için tarih seçin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReservationCalendar
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          reservations={reservations}
        />
      </CardContent>
    </Card>
  );
};
