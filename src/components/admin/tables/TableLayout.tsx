
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Move, Save } from "lucide-react";
import { TableData } from "./types";

interface TableLayoutProps {
  tables: TableData[];
  onUpdatePositions: (updatedTables: TableData[]) => Promise<void>;
  isPositionSaved: boolean;
}

export const TableLayout = ({ 
  tables, 
  onUpdatePositions,
  isPositionSaved 
}: TableLayoutProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const [updatedTables, setUpdatedTables] = useState<TableData[]>(tables);

  const handleTableDragStart = (e: React.MouseEvent, tableId: string) => {
    setDraggedTable(tableId);
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedTable || !layoutRef.current) return;

    const rect = layoutRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    const newTables = updatedTables.map(table => 
      table.id === draggedTable 
        ? { ...table, position_x: percentX, position_y: percentY }
        : table
    );
    
    setUpdatedTables(newTables);
  };

  const handleMouseUp = async () => {
    if (!isDragging || !draggedTable) return;
    setIsDragging(false);
    setDraggedTable(null);
  };

  const handleSaveAllPositions = async () => {
    await onUpdatePositions(updatedTables);
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
          className="border-2 border-gray-400 p-8 rounded-lg min-h-[500px] relative"
          ref={layoutRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white px-3 py-1 text-xs border border-gray-400 rounded-md">
            Giriş/Çıkış
          </div>
          
          <div className="w-full h-full relative">
            {updatedTables.map((table) => {
              const typeClass = table.type === 'window' ? "bg-blue-100 border-blue-300" :
                               table.type === 'center' ? "bg-green-100 border-green-300" :
                               table.type === 'corner' ? "bg-yellow-100 border-yellow-300" :
                               "bg-purple-100 border-purple-300";
              
              const sizeClass = table.size <= 2 ? "w-16 h-16" :
                               table.size <= 4 ? "w-20 h-20" : 
                               table.size <= 6 ? "w-24 h-24" : "w-28 h-28";
              
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
  );
};
