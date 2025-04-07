
import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Move, Save } from "lucide-react";
import { TableData } from "./types";
import { useToast } from "@/hooks/use-toast";

interface TableLayoutProps {
  tables: TableData[];
  onUpdatePositions: (updatedTables: TableData[]) => Promise<void>;
  isPositionSaved: boolean;
  setIsPositionSaved: (saved: boolean) => void;
}

export const TableLayout = ({ 
  tables, 
  onUpdatePositions,
  isPositionSaved,
  setIsPositionSaved
}: TableLayoutProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const [updatedTables, setUpdatedTables] = useState<TableData[]>(tables);
  const [activeTable, setActiveTable] = useState<HTMLElement | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  // Update local tables when prop changes
  useEffect(() => {
    setUpdatedTables(tables);
  }, [tables]);

  // Initialize drag operation
  const handleTableDragStart = (e: React.MouseEvent | React.TouchEvent, tableId: string, element: HTMLDivElement) => {
    setActiveTable(element);
    setDraggedTable(tableId);
    setIsDragging(true);
    
    // Determine event type and get coordinates
    const isTouchEvent = 'touches' in e;
    const clientX = isTouchEvent ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = isTouchEvent ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    
    // Calculate offset from the element's corner to the pointer
    const rect = element.getBoundingClientRect();
    setOffsetX(clientX - rect.left);
    setOffsetY(clientY - rect.top);
    
    e.preventDefault();
    
    // Mark positions as unsaved when tables are moved
    if (isPositionSaved) {
      setIsPositionSaved(false);
    }
  };

  // Handle drag movement
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !draggedTable || !layoutRef.current || !activeTable) return;
    
    e.preventDefault();
    
    // Determine event type and get current coordinates
    const isTouchEvent = 'touches' in e;
    const clientX = isTouchEvent ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = isTouchEvent ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    
    // Get container boundaries
    const containerRect = layoutRef.current.getBoundingClientRect();
    
    // Calculate new position relative to the container
    let newX = clientX - containerRect.left - offsetX;
    let newY = clientY - containerRect.top - offsetY;
    
    // Get element dimensions
    const tableRect = activeTable.getBoundingClientRect();
    
    // Constrain within container boundaries
    newX = Math.max(0, newX);
    newY = Math.max(0, newY);
    newX = Math.min(newX, containerRect.width - tableRect.width);
    newY = Math.min(newY, containerRect.height - tableRect.height);
    
    // Convert to percentages of container width and height
    const percentX = Math.max(0, Math.min(100, (newX / containerRect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (newY / containerRect.height) * 100));
    
    // Update the table position in state
    const newTables = updatedTables.map(table => 
      table.id === draggedTable 
        ? { ...table, position_x: percentX, position_y: percentY }
        : table
    );
    
    setUpdatedTables(newTables);
  };

  // End drag operation
  const handleMouseUp = () => {
    if (!isDragging || !draggedTable) return;
    setIsDragging(false);
    setDraggedTable(null);
    setActiveTable(null);
  };

  // Save all table positions
  const handleSaveAllPositions = async () => {
    try {
      await onUpdatePositions(updatedTables);
      toast({
        title: "Başarılı",
        description: "Masa konumları başarıyla kaydedildi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Masa konumları kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
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
          className="border-2 border-dashed border-gray-400 p-8 rounded-lg min-h-[500px] relative bg-slate-50"
          ref={layoutRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          onTouchCancel={handleMouseUp}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white px-3 py-1 text-xs border border-gray-400 rounded-md">
            Giriş/Çıkış
          </div>
          
          <div className="w-full h-full relative">
            {updatedTables.map((table) => {
              const typeClass = table.type === 'window' ? "bg-blue-100 border-blue-300" :
                               table.type === 'center' ? "bg-green-100 border-green-300" :
                               table.type === 'corner' ? "bg-yellow-100 border-yellow-300" :
                               table.type === 'booth' ? "bg-purple-100 border-purple-300" :
                               "bg-red-100 border-red-300";
              
              const sizeClass = table.size <= 2 ? "w-16 h-16" :
                               table.size <= 4 ? "w-20 h-20" : 
                               table.size <= 6 ? "w-24 h-24" : "w-28 h-28";
              
              const draggingClass = table.id === draggedTable ? "ring-2 ring-primary shadow-md scale-105 z-10" : "shadow-sm";
              
              return (
                <div
                  key={table.id}
                  className={`absolute flex items-center justify-center rounded-md border-2 ${typeClass} ${sizeClass} ${draggingClass} ${!table.is_active ? 'opacity-40' : ''} cursor-move transition-all duration-100`}
                  style={{ 
                    left: `${table.position_x}%`, 
                    top: `${table.position_y}%`,
                    transform: 'translate(-50%, -50%)',
                    touchAction: 'none',
                    userSelect: 'none',
                  }}
                  onMouseDown={(e) => table.id && handleTableDragStart(e, table.id, e.currentTarget)}
                  onTouchStart={(e) => table.id && handleTableDragStart(e, table.id, e.currentTarget)}
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
  );
};
