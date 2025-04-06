
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReservationTable } from "./ReservationTable";
import { ReservationCalendar } from "./ReservationCalendar";
import { format } from "date-fns";
import { Users, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Reservation = {
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      setError(null);
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

        console.log("Fetched reservations:", data);

        if (data) {
          const formattedReservations = data.map(res => ({
            ...res,
            date: new Date(res.date),
            guests: String(res.guests),
            name: res.name || "İsimsiz",
            email: res.email || "",
            phone: res.phone || ""
          })) as Reservation[];

          setReservations(formattedReservations);
        }
      } catch (error: any) {
        console.error("Error fetching reservations:", error);
        setError("Rezervasyonlar yüklenirken bir hata oluştu");
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
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8 text-red-500">
              <AlertCircle className="h-10 w-10 mb-2" />
              <p>{error}</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="text-center p-8">
              <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Bu tarihte rezervasyon bulunmuyor</p>
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
