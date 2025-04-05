
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { MenuCategoryType } from "@/components/MenuCategory";
import { Button } from "@/components/ui/button";
import { Clock, CalendarDays, Users, Table as TableIcon, QrCode } from "lucide-react";
import { format } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

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

  // Fetching menu data directly instead of trying to extract it from Menu component
  useEffect(() => {
    setIsLoadingMenu(true);
    
    // Import the menu categories directly
    import("../pages/Menu").then((module) => {
      // Access the menuCategories variable directly
      if (module && module.default) {
        try {
          // Get the Menu component
          const menuModule = module.default;
          
          // Create a temporary instance to access the menuCategories
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
          
          setMenuData(menuCategories);
          setIsLoadingMenu(false);
        } catch (error) {
          console.error("Menu data extraction error:", error);
          toast({
            title: "Hata",
            description: "Menü verileri yüklenirken bir sorun oluştu.",
            variant: "destructive",
          });
          setIsLoadingMenu(false);
        }
      }
    }).catch(error => {
      console.error("Menu data yüklenemedi:", error);
      toast({
        title: "Hata",
        description: "Menü verileri yüklenirken bir sorun oluştu.",
        variant: "destructive",
      });
      setIsLoadingMenu(false);
    });
  }, [toast]);

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

  // Filter reservations by date
  const filteredReservations = selectedDate 
    ? reservations.filter(res => {
        const resDate = new Date(res.date);
        return resDate.toDateString() === selectedDate.toDateString();
      })
    : reservations;

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
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="w-full"
                    />
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>Bugün</span>
                        </div>
                        <span className="font-medium">{reservations.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).length} rezervasyon</span>
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
                      onClick={() => setSelectedDate(new Date())}
                    >
                      Bugüne Dön
                    </Button>
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
                    {isLoadingReservations ? (
                      <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : filteredReservations.length > 0 ? (
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
                          {filteredReservations.map((res) => (
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
                                      onClick={() => handleStatusChange(res.id, "confirmed")}
                                      className="text-green-600"
                                    >
                                      Onayla
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusChange(res.id, "pending")}
                                      className="text-yellow-600"
                                    >
                                      Beklet
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleStatusChange(res.id, "cancelled")}
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
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Bu tarihte rezervasyon bulunmuyor.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Menu and QR Code Tab */}
            <TabsContent value="menu-qr" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sidebar with menu categories */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Menü Kategorileri</CardTitle>
                    <CardDescription>
                      QR kod oluşturmak için kategori seçin
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {isLoadingMenu ? (
                      <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : menuData.length > 0 ? (
                      menuData.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-3 rounded-md hover:bg-muted cursor-pointer"
                        >
                          <span>{category.name}</span>
                          <Badge variant="secondary">
                            {category.items.length} ürün
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        Menü kategorileri yüklenemedi.
                      </div>
                    )}
                    
                    <Button variant="outline" className="w-full mt-4">
                      <TableIcon size={16} className="mr-2" /> Masa QR Kodları
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Main content with QR code generator */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <QrCode size={20} className="mr-2" /> QR Kod Oluşturucu
                    </CardTitle>
                    <CardDescription>
                      Masalarda kullanmak için menü QR kodları oluşturun
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <QRCodeGenerator />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminCMS;
