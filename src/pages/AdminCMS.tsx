
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, LayoutDashboard, Settings, Menu, Utensils } from "lucide-react";
import { MenuCategoryType } from "@/components/MenuCategory";
import { ReservationsPanel } from "@/components/admin/ReservationsPanel";
import { MenuQRPanel } from "@/components/admin/MenuQRPanel";
import { WebsiteContentPanel } from "@/components/admin/WebsiteContentPanel";
import { MenuManagementPanel } from "@/components/admin/MenuManagementPanel";

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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [menuData, setMenuData] = useState<MenuCategoryType[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  // Fetching reservations (Mock data for now)
  useEffect(() => {
    if (activeTab === "reservations" || activeTab === "dashboard") {
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
    }
  }, [activeTab]);

  // Fetching menu data directly
  useEffect(() => {
    if (activeTab === "menu-qr" || activeTab === "dashboard") {
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
    }
  }, [activeTab]);

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
              Sitenizi ve işletmenizi bu panel üzerinden yönetebilirsiniz.
            </p>
          </div>
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LayoutDashboard size={16} /> Genel Bakış
              </TabsTrigger>
              <TabsTrigger value="reservations" className="flex items-center gap-2">
                <Users size={16} /> Rezervasyonlar
              </TabsTrigger>
              <TabsTrigger value="menu" className="flex items-center gap-2">
                <Utensils size={16} /> Menü
              </TabsTrigger>
              <TabsTrigger value="menu-qr" className="flex items-center gap-2">
                <Menu size={16} /> QR Kod
              </TabsTrigger>
              <TabsTrigger value="website" className="flex items-center gap-2">
                <Settings size={16} /> Site İçeriği
              </TabsTrigger>
            </TabsList>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Reservations Summary */}
                <div className="col-span-1">
                  <h2 className="text-xl font-semibold mb-4">Rezervasyon Özeti</h2>
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span>Bugün</span>
                      <span className="font-medium">{reservations.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).length} rezervasyon</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded">
                      <span>Bu Hafta</span>
                      <span className="font-medium">{reservations.length} rezervasyon</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span>Onay Bekleyen</span>
                      <span className="font-medium">{reservations.filter(r => r.status === "pending").length} rezervasyon</span>
                    </div>
                  </div>
                </div>
                
                {/* Menu Summary */}
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
                          sum + category.items.filter(item => item.image).length, 0
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
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
                      onClick={() => setActiveTab("menu-qr")}
                    >
                      <span>QR Kod Oluştur</span>
                      <Menu size={16} />
                    </button>
                    <button 
                      className="w-full text-left p-3 hover:bg-muted rounded-md transition-colors flex justify-between items-center"
                      onClick={() => setActiveTab("website")}
                    >
                      <span>Site İçeriğini Düzenle</span>
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Recent Reservations Preview */}
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
                        {isLoadingReservations ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-6 text-center">
                              <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          reservations.slice(0, 3).map((reservation) => (
                            <tr key={reservation.id}>
                              <td className="px-4 py-3 whitespace-nowrap">{reservation.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {new Date(reservation.date).toLocaleDateString('tr-TR')}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">{reservation.time}</td>
                              <td className="px-4 py-3 whitespace-nowrap">{reservation.guests}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                  reservation.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : reservation.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {reservation.status === "confirmed" ? "Onaylandı" : 
                                   reservation.status === "pending" ? "Beklemede" : "İptal Edildi"}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
            
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
            
            {/* Menu Management Tab (New) */}
            <TabsContent value="menu" className="space-y-6">
              <MenuManagementPanel />
            </TabsContent>
            
            {/* Menu and QR Code Tab */}
            <TabsContent value="menu-qr" className="space-y-6">
              <MenuQRPanel 
                menuData={menuData}
                isLoading={isLoadingMenu}
              />
            </TabsContent>
            
            {/* Website Content Tab */}
            <TabsContent value="website" className="space-y-6">
              <WebsiteContentPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminCMS;
