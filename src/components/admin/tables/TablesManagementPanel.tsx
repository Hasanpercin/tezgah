
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { TableDashboard } from "./TableDashboard";
import { TableList } from "./TableList";
import { TableDialog } from "./TableDialog";
import { TableLayout } from "./TableLayout";
import { TableData } from "./types";

export const TablesManagementPanel = () => {
  const { toast } = useToast();
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<TableData | null>(null);
  const [isPositionSaved, setIsPositionSaved] = useState(true);

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

  const handleSubmit = async (formData: TableData) => {
    try {
      let result;
      
      if (editingTable?.id) {
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
        result = await supabase.from("tables").insert([formData as any]);
        
        if (result.error) throw result.error;
        
        toast({
          title: "Başarılı",
          description: "Yeni masa başarıyla eklendi.",
        });
      }
      
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

  const handleUpdatePositions = async (updatedTables: TableData[]) => {
    try {
      for (const table of updatedTables) {
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
      setTables(updatedTables);
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
  };

  const handleAddNew = () => {
    setEditingTable(null);
    setDialogOpen(true);
  };

  // Calculate stats for dashboard
  const activeTablesCount = tables.filter(t => t.is_active).length;
  const totalCapacity = tables.reduce((sum, table) => sum + table.size, 0);

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
          <TableDashboard 
            tablesCount={tables.length}
            activeTablesCount={activeTablesCount}
            totalCapacity={totalCapacity}
          />
          <TableList 
            tables={tables}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddNew={handleAddNew}
          />
        </TabsContent>
        
        <TabsContent value="layout">
          <TableLayout 
            tables={tables} 
            onUpdatePositions={handleUpdatePositions}
            isPositionSaved={isPositionSaved} 
          />
        </TabsContent>
      </Tabs>

      <TableDialog 
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        editingTable={editingTable}
      />
    </div>
  );
};
