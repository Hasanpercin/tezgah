
import { Clock, CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

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
  status: "Onaylandı" | "Beklemede" | "İptal";
};

type ReservationCalendarProps = {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  reservations: Reservation[];
};

export const ReservationCalendar = ({ 
  selectedDate, 
  onSelectDate, 
  reservations 
}: ReservationCalendarProps) => {
  const todayReservations = reservations.filter(r => 
    new Date(r.date).toDateString() === new Date().toDateString()
  ).length;
  
  return (
    <div className="space-y-2">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        className="w-full"
      />
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>Bugün</span>
          </div>
          <span className="font-medium">{todayReservations} rezervasyon</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            <span>Bu Hafta</span>
          </div>
          <span className="font-medium">{reservations.length} rezervasyon</span>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="mt-4 w-full"
        onClick={() => onSelectDate(new Date())}
      >
        Bugüne Dön
      </Button>
    </div>
  );
};
