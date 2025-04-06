
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReservationTable } from "./ReservationTable";
import { ReservationCalendar } from "./ReservationCalendar";
import { format } from "date-fns";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

type ReservationsPanelProps = {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onStatusChange: (id: string, newStatus: "Onaylandı" | "Beklemede" | "İptal") => void;
};

export const ReservationsPanel = ({
  selectedDate,
  onSelectDate,
  onStatusChange
}: ReservationsPanelProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        let query = supabase.from("reservations").select("*");
        
        if (selectedDate) {
          const dateString = new Date(selectedDate).toISOString().split('T')[0];
          query = query.eq('date', dateString);
        }

        const { data, error } = await query.order('date', { ascending: true });
        
        if (error) {
          throw error;
        }

        if (data) {
          const formattedReservations = data.map(res => ({
            ...res,
            date: new Date(res.date),
            guests: String(res.guests)
          })) as Reservation[];

          setReservations(formattedReservations);
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [selectedDate]);

  const filteredReservations = selectedDate 
    ? reservations.filter(res => {
        const resDate = new Date(res.date);
        return resDate.toDateString() === selectedDate.toDateString();
      })
    : reservations;
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar with calendar */}
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
      
      {/* Main content with reservations */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {selectedDate ? format(selectedDate, "d MMMM yyyy") : "Tüm"} Rezervasyonlar
            </span>
            <Badge variant="secondary" className="text-base px-2 py-1">
              {filteredReservations.length} rezervasyon
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ReservationTable 
              reservations={filteredReservations} 
              onStatusChange={onStatusChange} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
