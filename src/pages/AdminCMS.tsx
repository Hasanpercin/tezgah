
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";
import { MenuCategoryType } from "@/components/MenuCategory";
import { ReservationsPanel } from "@/components/admin/ReservationsPanel";
import { MenuQRPanel } from "@/components/admin/MenuQRPanel";

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

const AdminCMS = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("reservations");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [menuData, setMenuData] = useState<MenuCategoryType[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  // Fetching reservations (Mock data for now)
  useEffect(() => {
    setIsLoadingReservations(true);
    
    // Simulating API call
    setTimeout(() => {
      const mockReservations: Reservation[] = [
        {
          id: "r1",
          name: "Ahmet Yılmaz",
          email: "ahmet@example.com",
          phone: "05321234567",
          date: new Date(),
          time: "19:30",
          guests: "4",
          occasion: "birthday",
          status: "confirmed"
        },
        {
          id: "r2",
          name: "Ayşe Demir",
          email: "ayse@example.com",
          phone: "05335556677",
          date: new Date(),
          time: "20:00",
          guests: "2",
          status: "pending"
        },
        {
          id: "r3",
          name: "Mehmet Kaya",
          email: "mehmet@example.com",
          phone: "05441234567",
          date: new Date(Date.now() + 86400000), // tomorrow
          time: "12:30",
          guests: "6",
          notes: "Pencere kenarı tercih edilir",
          status: "confirmed"
        }
      ];
      
      setReservations(mockReservations);
      setIsLoadingReservations(false);
    }, 1000);
  }, []);

  // Fetching menu data directly
  useEffect(() => {
    setIsLoadingMenu(true);
    
    // Hardcoded menu data to avoid issues with imports
    const menuCategories = [
      {
        id: "starters",
        name: "Başlangıçlar",
        items: [
          {
            id: 1,
            name: "Mevsim Salatası",
            description: "Taze mevsim sebzeleri, akdeniz yeşillikleri, kiraz domates, salatalık ve özel sos ile",
            price: "₺75",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300"
          },
          {
            id: 2,
            name: "Humus Tabağı",
            description: "Nohut püresi, susam ezmesi (tahini), zeytinyağı, limon ve baharatlar ile",
            price: "₺65",
          }
        ]
      },
      {
        id: "mains",
        name: "Ana Yemekler",
        items: [
          {
            id: 6,
            name: "Özel Lezzet Burger",
            description: "180 gr dana eti, cheddar peyniri, karamelize soğan, özel burger sosu ve ev yapımı patates kızartması ile",
            price: "₺145",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300"
          },
          {
            id: 7,
            name: "Izgara Somon",
            description: "Limon ve otlar ile marine edilmiş somon fileto, sebzeli pilav ve taze yeşillikler ile",
            price: "₺180",
          }
        ]
      }
    ];
    
    // Simulate API call delay
    setTimeout(() => {
      setMenuData(menuCategories);
      setIsLoadingMenu(false);
    }, 500);
  }, []);

  // Handle status change
  const handleStatusChange = (id: string, newStatus: "confirmed" | "pending" | "cancelled") => {
    setReservations(current => 
      current.map(res => res.id === id ? {...res, status: newStatus} : res)
    );
    
    toast({
      title: "Durum Güncellendi",
      description: `Rezervasyon durumu ${newStatus === "confirmed" ? "onaylandı" : newStatus === "pending" ? "beklemede" : "iptal edildi"}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Yönetim Paneli</h1>
            <p className="text-muted-foreground mt-2">
              Rezervasyon ve menü ayarlarınızı bu panelden yönetebilirsiniz.
            </p>
          </div>
          
          <Tabs defaultValue="reservations" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reservations">Rezervasyonlar</TabsTrigger>
              <TabsTrigger value="menu-qr">Menü ve QR Kod</TabsTrigger>
            </TabsList>
            
            {/* Reservations Tab */}
            <TabsContent value="reservations" className="space-y-6">
              <ReservationsPanel
                reservations={reservations}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onStatusChange={handleStatusChange}
                isLoading={isLoadingReservations}
              />
            </TabsContent>
            
            {/* Menu and QR Code Tab */}
            <TabsContent value="menu-qr" className="space-y-6">
              <MenuQRPanel 
                menuData={menuData}
                isLoading={isLoadingMenu}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminCMS;
