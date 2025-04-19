
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Users, LayoutDashboard, Settings, Menu, Utensils } from "lucide-react";
import { MenuCategoryType } from "@/components/MenuCategory";
import { ReservationsPanel } from "@/components/admin/reservations/ReservationsPanel";
import { type Reservation, type ReservationStatus } from "@/components/admin/reservations/types";
import { MenuQRPanel } from "@/components/admin/MenuQRPanel";
import { WebsiteContentPanel } from "@/components/admin/WebsiteContentPanel";
import { MenuManagementPanel } from "@/components/admin/MenuManagementPanel";
import { supabase } from "@/integrations/supabase/client";
import { PaymentSettingsPanel } from "@/components/admin/PaymentSettingsPanel";
import { TablesManagementPanel } from "@/components/admin/tables/TablesManagementPanel";
import { Json } from "@/integrations/supabase/types";

const AdminCMS = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [menuData, setMenuData] = useState<MenuCategoryType[]>([]);

  useEffect(() => {
    if (activeTab === "menu-qr" || activeTab === "dashboard") {
      setIsLoadingMenu(true);
      
      const menuCategories: MenuCategoryType[] = [
        {
          id: "starters",
          name: "Başlangıçlar",
          items: [
            {
              id: "1",
              name: "Mevsim Salatası",
              description: "Taze mevsim sebzeleri, akdeniz yeşillikleri, kiraz domates, salatalık ve özel sos ile",
              price: 75, // Changed from string to number
              image_path: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300"
            },
            {
              id: "2",
              name: "Humus Tabağı",
              description: "Nohut püresi, susam ezmesi (tahini), zeytinyağı, limon ve baharatlar ile",
              price: 65, // Changed from string to number
            }
          ]
        },
        {
          id: "mains",
          name: "Ana Yemekler",
          items: [
            {
              id: "6",
              name: "Özel Lezzet Burger",
              description: "180 gr dana eti, cheddar peyniri, karamelize soğan, özel burger sosu ve ev yapımı patates kızartması ile",
              price: 145, // Changed from string to number
              image_path: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=300"
            },
            {
              id: "7",
              name: "Izgara Somon",
              description: "Limon ve otlar ile marine edilmiş somon fileto, sebzeli pilav ve taze yeşillikler ile",
              price: 180, // Changed from string to number
            }
          ]
        }
      ];
      
      setTimeout(() => {
        setMenuData(menuCategories);
        setIsLoadingMenu(false);
      }, 500);
    }
  }, [activeTab]);

  const handleStatusChange = async (id: string, newStatus: "Onaylandı" | "Beklemede" | "İptal") => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Durum Güncellendi",
        description: `Rezervasyon durumu ${newStatus} olarak güncellendi.`,
      });
    } catch (error) {
      console.error("Error updating reservation status:", error);
      toast({
        title: "Hata",
        description: "Durum güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Yönetim Paneli</h1>
            <p className="text-muted-foreground mt-2">
              Sitenizi ve işletmenizi bu panel üzerinden yönetebilirsiniz.
            </p>
          </div>
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LayoutDashboard size={16} /> Genel Bakış
              </TabsTrigger>
              <TabsTrigger value="reservations" className="flex items-center gap-2">
                <Users size={16} /> Rezervasyonlar
              </TabsTrigger>
              <TabsTrigger value="tables" className="flex items-center gap-2">
                <Utensils size={16} /> Masalar
              </TabsTrigger>
              <TabsTrigger value="menu" className="flex items-center gap-2">
                <Utensils size={16} /> Menü
              </TabsTrigger>
              <TabsTrigger value="menu-qr" className="flex items-center gap-2">
                <Menu size={16} /> QR Kod
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard size={16} /> Ödeme
              </TabsTrigger>
              <TabsTrigger value="website" className="flex items-center gap-2">
                <Settings size={16} /> Site İçeriği
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardSummaryCard />
                
                <div className="col-span-1">
                  <h2 className="text-xl font-semibold mb-4">Menü Özeti</h2>
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span>Kategoriler</span>
                      <span className="font-medium">{menuData.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded">
                      <span>Toplam Ürün</span>
                      <span className="font-medium">
                        {menuData.reduce((sum, category) => sum + category.items.length, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span>Görsel İçeren Ürünler</span>
                      <span className="font-medium">
                        {menuData.reduce((sum, category) => 
                          sum + category.items.filter(item => item.image_path).length, 0
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1">
                  <h2 className="text-xl font-semibold mb-4">Hızlı İşlemler</h2>
                  <div className="border rounded-lg p-4 space-y-2">
                    <button 
                      className="w-full text-left p-3 hover:bg-muted rounded-md transition-colors flex justify-between items-center"
                      onClick={() => setActiveTab("reservations")}
                    >
                      <span>Rezervasyonları Yönet</span>
                      <Users size={16} />
                    </button>
                    <button 
                      className="w-full text-left p-3 hover:bg-muted rounded-md transition-colors flex justify-between items-center"
                      onClick={() => setActiveTab("menu")}
                    >
                      <span>Menüyü Düzenle</span>
                      <Utensils size={16} />
                    </button>
                    <button 
                      className="w-full text-left p-3 hover:bg-muted rounded-md transition-colors flex justify-between items-center"
                      onClick={() => setActiveTab("payment")}
                    >
                      <span>Ödeme Ayarları</span>
                      <CreditCard size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <DashboardRecentReservations />
            </TabsContent>
            
            <TabsContent value="reservations" className="space-y-6">
              <ReservationsPanel />
            </TabsContent>
            
            <TabsContent value="tables" className="space-y-6">
              <TablesManagementPanel />
            </TabsContent>
            
            <TabsContent value="menu" className="space-y-6">
              <MenuManagementPanel />
            </TabsContent>
            
            <TabsContent value="menu-qr" className="space-y-6">
              <MenuQRPanel 
                menuData={menuData}
                isLoading={isLoadingMenu}
              />
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-6">
              <PaymentSettingsPanel />
            </TabsContent>
            
            <TabsContent value="website" className="space-y-6">
              <WebsiteContentPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

const DashboardSummaryCard = () => {
  const [reservationStats, setReservationStats] = useState({
    today: 0,
    thisWeek: 0,
    pending: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReservationStats = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('reservations').select('*');
        
        if (error) throw error;
        
        if (data) {
          const today = new Date().toISOString().split('T')[0];
          const todayReservations = data.filter(r => r.date === today);
          
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const thisWeekReservations = data.filter(r => {
            const reservationDate = new Date(r.date);
            return reservationDate >= oneWeekAgo;
          });
          
          const pendingReservations = data.filter(r => r.status === 'Beklemede');
          
          setReservationStats({
            today: todayReservations.length,
            thisWeek: thisWeekReservations.length,
            pending: pendingReservations.length
          });
        }
      } catch (error) {
        console.error("Error fetching reservation stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservationStats();
  }, []);

  if (isLoading) {
    return (
      <div className="col-span-1">
        <h2 className="text-xl font-semibold mb-4">Rezervasyon Özeti</h2>
        <div className="border rounded-lg p-4 space-y-2">
          <div className="animate-pulse h-8 bg-muted rounded mb-2"></div>
          <div className="animate-pulse h-8 bg-muted rounded mb-2"></div>
          <div className="animate-pulse h-8 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-1">
      <h2 className="text-xl font-semibold mb-4">Rezervasyon Özeti</h2>
      <div className="border rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
          <span>Bugün</span>
          <span className="font-medium">{reservationStats.today} rezervasyon</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded">
          <span>Bu Hafta</span>
          <span className="font-medium">{reservationStats.thisWeek} rezervasyon</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
          <span>Onay Bekleyen</span>
          <span className="font-medium">{reservationStats.pending} rezervasyon</span>
        </div>
      </div>
    </div>
  );
};

// Only modifying the DashboardRecentReservations component to handle JSON data correctly
const DashboardRecentReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentReservations = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .order('date', { ascending: true })
          .limit(3);
        
        if (error) throw error;
        
        if (data) {
          // Convert the data to match Reservation type
          const formattedReservations = data.map(res => {
            // Handle selected_items safely
            let selectedItems: any | undefined = undefined;
            
            if (res.selected_items) {
              // Safely parse the JSON data
              const si = res.selected_items as any;
              selectedItems = {
                menuSelectionType: si.menuSelectionType || "at_restaurant",
                fixedMenuId: si.fixedMenuId,
                items: Array.isArray(si.items) ? si.items : []
              };
            }
            
            return {
              ...res,
              date: new Date(res.date),
              guests: Number(res.guests),
              name: res.name || "İsimsiz",
              email: res.email || "",
              phone: res.phone || "",
              selected_items: selectedItems
            };
          }) as Reservation[];
          
          setReservations(formattedReservations);
        }
      } catch (error) {
        console.error("Error fetching recent reservations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentReservations();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Son Rezervasyonlar</h2>
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ad Soyad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tarih</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Saat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Kişi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Durum</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-4 py-3 whitespace-nowrap">{reservation.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(reservation.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{reservation.time}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{reservation.guests}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        reservation.status === "Onaylandı"
                          ? "bg-green-100 text-green-800"
                          : reservation.status === "Beklemede"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {reservation.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                    Henüz rezervasyon bulunmuyor
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCMS;
