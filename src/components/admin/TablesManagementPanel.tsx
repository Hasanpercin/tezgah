
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Edit, Plus, Save, Coffee, Move } from "lucide-react";

interface TableData {
  id?: string;
  name: string;
  type: 'window' | 'center' | 'corner' | 'booth';
  size: number;
  position_x: number;
  position_y: number;
  is_active: boolean;
}

export const TablesManagementPanel = () => {
  const { toast } = useToast();
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<TableData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [isPositionSaved, setIsPositionSaved] = useState(true);
  const layoutRef = useRef<HTMLDivElement>(null);
  
  // Form state
  const [formData, setFormData] = useState<TableData>({
    name: '',
    type: 'center',
    size: 4,
    position_x: 50,
    position_y: 50,
    is_active: true
  });

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("tables")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      setTables(data as TableData[] || []);
    } catch (error: any) {
      console.error("Error loading tables:", error.message);
      toast({
        title: "Hata",
        description: "Masalar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let result;
      
      if (editingTable?.id) {
        // Update existing table
        result = await supabase
          .from("tables")
          .update({
            name: formData.name,
            type: formData.type,
            size: formData.size,
            position_x: formData.position_x,
            position_y: formData.position_y,
            is_active: formData.is_active,
          } as any)
          .eq("id", editingTable.id);
        
        if (result.error) throw result.error;
        
        toast({
          title: "Başarılı",
          description: "Masa başarıyla güncellendi.",
        });
      } else {
        // Create new table
        result = await supabase.from("tables").insert([formData as any]);
        
        if (result.error) throw result.error;
        
        toast({
          title: "Başarılı",
          description: "Yeni masa başarıyla eklendi.",
        });
      }
      
      // Reset form and close dialog
      handleCloseDialog();
      loadTables();
      
    } catch (error: any) {
      console.error("Error saving table:", error.message);
      toast({
        title: "Hata",
        description: error.message || "Masa kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleTableDragStart = (e: React.MouseEvent, tableId: string) => {
    if (activeTab !== "layout") return;
    setDraggedTable(tableId);
    setIsDragging(true);
    e.preventDefault(); // Prevent default browser drag behavior
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedTable || !layoutRef.current) return;

    // Calculate the bounds of the layout container
    const rect = layoutRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate position as percentage of container
    const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    // Update table position in local state
    setTables(prevTables => 
      prevTables.map(table => 
        table.id === draggedTable 
          ? { ...table, position_x: percentX, position_y: percentY }
          : table
      )
    );
    setIsPositionSaved(false);
  };

  const handleMouseUp = async () => {
    if (!isDragging || !draggedTable) return;

    const draggedTableData = tables.find(t => t.id === draggedTable);
    if (draggedTableData) {
      try {
        const { error } = await supabase
          .from("tables")
          .update({
            position_x: draggedTableData.position_x,
            position_y: draggedTableData.position_y
          })
          .eq("id", draggedTable);
        
        if (error) throw error;
        
        toast({
          title: "Konum Güncellendi",
          description: "Masa konumu başarıyla kaydedildi.",
        });
        setIsPositionSaved(true);
      } catch (error: any) {
        console.error("Error updating table position:", error.message);
        toast({
          title: "Hata",
          description: "Masa konumu kaydedilirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    }

    setIsDragging(false);
    setDraggedTable(null);
  };

  const handleSaveAllPositions = async () => {
    try {
      // For each table in the tables array, update its position in the database
      for (const table of tables) {
        if (table.id) {
          const { error } = await supabase
            .from("tables")
            .update({
              position_x: table.position_x,
              position_y: table.position_y
            })
            .eq("id", table.id);
          
          if (error) throw error;
        }
      }
      
      toast({
        title: "Konumlar Güncellendi",
        description: "Tüm masa konumları başarıyla kaydedildi.",
      });
      setIsPositionSaved(true);
    } catch (error: any) {
      console.error("Error updating table positions:", error.message);
      toast({
        title: "Hata",
        description: "Masa konumları kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (table: TableData) => {
    setEditingTable(table);
    setFormData({
      name: table.name,
      type: table.type,
      size: table.size,
      position_x: table.position_x,
      position_y: table.position_y,
      is_active: table.is_active
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu masayı silmek istediğinizden emin misiniz?")) {
      return;
    }
    
    try {
      const { error } = await supabase.from("tables").delete().eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Başarılı",
        description: "Masa başarıyla silindi.",
      });
      
      loadTables();
    } catch (error: any) {
      console.error("Error deleting table:", error.message);
      toast({
        title: "Hata",
        description: "Masa silinirken bir hata oluştu. Bu masa bir rezervasyona atanmış olabilir.",
        variant: "destructive",
      });
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTable(null);
    setFormData({
      name: '',
      type: 'center',
      size: 4,
      position_x: 50,
      position_y: 50,
      is_active: true
    });
  };

  // Masa türüne göre renk sınıfı
  const getTypeColorClass = (type: string) => {
    switch (type) {
      case 'window': return 'text-blue-600 bg-blue-100';
      case 'center': return 'text-green-600 bg-green-100';
      case 'corner': return 'text-yellow-600 bg-yellow-100';
      case 'booth': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Masa türü için Türkçe çeviri
  const getTypeTranslation = (type: string) => {
    switch (type) {
      case 'window': return 'Pencere Kenarı';
      case 'center': return 'Orta Alan';
      case 'corner': return 'Köşe';
      case 'booth': return 'Loca';
      default: return type;
    }
  };

  // Gösterge paneli
  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Masa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tables.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Aktif Masa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tables.filter(t => t.is_active).length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Kapasite</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {tables.reduce((sum, table) => sum + table.size, 0)} kişi
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Masaların listesi
  const renderTableList = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Masalar</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTable(null)}>
              <Plus className="mr-2 h-4 w-4" /> Yeni Masa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingTable ? "Masa Düzenle" : "Yeni Masa Ekle"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Masa Adı</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Masa Türü</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Masa türü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="window">Pencere Kenarı</SelectItem>
                      <SelectItem value="center">Orta Alan</SelectItem>
                      <SelectItem value="corner">Köşe</SelectItem>
                      <SelectItem value="booth">Loca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Kapasite (Kişi)</Label>
                  <Input
                    id="size"
                    name="size"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.size}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="is_active">Durum</Label>
                  <Select
                    value={formData.is_active ? "active" : "inactive"}
                    onValueChange={(value) => handleSelectChange("is_active", value === "active" ? "true" : "false")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Pasif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position_x">Konum X (%)</Label>
                  <Input
                    id="position_x"
                    name="position_x"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.position_x}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position_y">Konum Y (%)</Label>
                  <Input
                    id="position_y"
                    name="position_y"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.position_y}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={handleCloseDialog}>
                  İptal
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {editingTable ? "Güncelle" : "Kaydet"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : tables.length === 0 ? (
          <div className="text-center py-8">
            <Coffee className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Henüz hiç masa eklenmemiş.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Masa Adı</TableHead>
                  <TableHead>Tür</TableHead>
                  <TableHead>Kapasite</TableHead>
                  <TableHead>Konum (X,Y)</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table.id}>
                    <TableCell className="font-medium">{table.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColorClass(table.type)}`}>
                        {getTypeTranslation(table.type)}
                      </span>
                    </TableCell>
                    <TableCell>{table.size} kişi</TableCell>
                    <TableCell>{Math.round(table.position_x)}%, {Math.round(table.position_y)}%</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        table.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {table.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => table.id && handleEdit(table)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => table.id && handleDelete(table.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Masa Yönetimi</h2>
        <p className="text-muted-foreground">
          Restoran masa düzenini ve masa özelliklerini bu panel üzerinden yönetebilirsiniz.
        </p>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="list">Masa Listesi</TabsTrigger>
          <TabsTrigger value="layout">Yerleşim Planı</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          {renderDashboard()}
          {renderTableList()}
        </TabsContent>
        
        <TabsContent value="layout">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Masa Yerleşim Planı</CardTitle>
              {!isPositionSaved && (
                <Button onClick={handleSaveAllPositions}>
                  <Save className="mr-2 h-4 w-4" />
                  Konumları Kaydet
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="p-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="flex items-center text-sm text-yellow-700">
                  <Move className="mr-2 h-4 w-4" />
                  Masaları sürükleyerek yerleşim düzenini ayarlayabilirsiniz. Değişiklikleri kaydetmeyi unutmayın.
                </p>
              </div>
              
              <div 
                className="border-2 border-gray-400 p-8 rounded-lg min-h-[500px] relative"
                ref={layoutRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white px-3 py-1 text-xs border border-gray-400 rounded-md">
                  Giriş/Çıkış
                </div>
                
                {/* Table layout with draggable tables */}
                <div className="w-full h-full relative">
                  {tables.map((table) => {
                    // Masa türüne göre renk sınıfı belirle
                    const typeClass = table.type === 'window' ? "bg-blue-100 border-blue-300" :
                                     table.type === 'center' ? "bg-green-100 border-green-300" :
                                     table.type === 'corner' ? "bg-yellow-100 border-yellow-300" :
                                     "bg-purple-100 border-purple-300";
                    
                    // Masa büyüklüğü için sınıf belirle
                    const sizeClass = table.size <= 2 ? "w-16 h-16" :
                                     table.size <= 4 ? "w-20 h-20" : 
                                     table.size <= 6 ? "w-24 h-24" : "w-28 h-28";
                    
                    // Sürüklenen masa için ek sınıf
                    const draggingClass = table.id === draggedTable ? "ring-2 ring-primary shadow-lg z-10" : "";
                    
                    return (
                      <div
                        key={table.id}
                        className={`absolute flex items-center justify-center rounded-md border-2 ${typeClass} ${sizeClass} ${draggingClass} ${!table.is_active ? 'opacity-40' : ''} cursor-move`}
                        style={{ 
                          left: `${table.position_x}%`, 
                          top: `${table.position_y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onMouseDown={(e) => table.id && handleTableDragStart(e, table.id)}
                      >
                        <span className="text-xs font-medium text-center select-none pointer-events-none">
                          {table.name}<br/>
                          {`${table.size} kişi`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded-sm"></div>
                  <span className="text-xs">Pencere Kenarı</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded-sm"></div>
                  <span className="text-xs">Orta Alan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded-sm"></div>
                  <span className="text-xs">Köşe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded-sm"></div>
                  <span className="text-xs">Loca</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
