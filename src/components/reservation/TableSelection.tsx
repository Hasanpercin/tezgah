
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Define table types
type TableType = 'window' | 'center' | 'corner' | 'booth';
type TableSize = 2 | 4 | 6 | 8;

type Table = {
  id: number;
  type: TableType;
  size: TableSize;
  position: { x: number; y: number };
  available: boolean;
  label: string;
};

type TableSelectionProps = {
  onSelectTable: (table: Table) => void;
  selectedTable: Table | null;
  date: Date | null;
  time: string;
  guests: string;
};

const TableSelection = ({ onSelectTable, selectedTable, date, time, guests }: TableSelectionProps) => {
  // Sample table data - in a real app, this would come from the backend based on date/time/guests
  const [tables] = useState<Table[]>([
    { id: 1, type: 'window', size: 2, position: { x: 10, y: 10 }, available: true, label: 'Pencere Kenarı 2 Kişilik (1)' },
    { id: 2, type: 'window', size: 4, position: { x: 10, y: 30 }, available: true, label: 'Pencere Kenarı 4 Kişilik (2)' },
    { id: 3, type: 'center', size: 4, position: { x: 30, y: 20 }, available: false, label: 'Orta Alan 4 Kişilik (3)' },
    { id: 4, type: 'center', size: 6, position: { x: 50, y: 20 }, available: true, label: 'Orta Alan 6 Kişilik (4)' },
    { id: 5, type: 'corner', size: 4, position: { x: 70, y: 10 }, available: true, label: 'Köşe 4 Kişilik (5)' },
    { id: 6, type: 'booth', size: 6, position: { x: 70, y: 40 }, available: true, label: 'Loca 6 Kişilik (6)' },
    { id: 7, type: 'booth', size: 8, position: { x: 80, y: 70 }, available: false, label: 'Loca 8 Kişilik (7)' },
    { id: 8, type: 'window', size: 2, position: { x: 10, y: 60 }, available: true, label: 'Pencere Kenarı 2 Kişilik (8)' },
    { id: 9, type: 'center', size: 4, position: { x: 30, y: 60 }, available: true, label: 'Orta Alan 4 Kişilik (9)' },
  ]);

  // Filter tables based on guest count
  const guestCount = parseInt(guests, 10);
  const compatibleTables = tables.filter(table => table.available && table.size >= guestCount);

  const handleTableClick = (table: Table) => {
    if (table.available) {
      onSelectTable(table);
    }
  };

  // Function to generate class based on table properties
  const getTableClass = (table: Table) => {
    const baseClass = "relative flex items-center justify-center rounded-md cursor-pointer transition-all";
    
    // Size classes
    const sizeClass = table.size <= 2 ? "w-16 h-16" :
                      table.size <= 4 ? "w-20 h-20" : 
                      table.size <= 6 ? "w-24 h-24" : "w-28 h-28";
    
    // Type/location classes
    const typeClass = table.type === 'window' ? "bg-blue-100 border-blue-300" :
                      table.type === 'center' ? "bg-green-100 border-green-300" :
                      table.type === 'corner' ? "bg-yellow-100 border-yellow-300" :
                      "bg-purple-100 border-purple-300";
    
    // Availability classes
    const availClass = !table.available ? "opacity-40 cursor-not-allowed" : "";
    
    // Selected class
    const selectedClass = selectedTable?.id === table.id ? "ring-2 ring-primary ring-offset-2" : "";
    
    return `${baseClass} ${sizeClass} ${typeClass} ${availClass} ${selectedClass}`;
  };
  
  // Calculate if table is compatible with party size
  const isCompatible = (table: Table) => {
    return table.size >= guestCount;
  };

  return (
    <div className="py-6">
      <div className="pb-6">
        <h3 className="text-lg font-semibold mb-2">Masa Seçimi</h3>
        <p className="text-muted-foreground mb-4">
          {date && time ? 
            `${date.toLocaleDateString('tr-TR')} tarihinde ${time} saati için ${guests} kişilik müsait masalar aşağıda gösterilmektedir.` :
            "Lütfen önce rezervasyon tarih ve saatini seçin."
          }
        </p>
      </div>

      <div className="mb-6 flex gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded-sm"></div>
          <span className="text-sm">Pencere Kenarı</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded-sm"></div>
          <span className="text-sm">Orta Alan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded-sm"></div>
          <span className="text-sm">Köşe</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded-sm"></div>
          <span className="text-sm">Loca</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded-sm opacity-40"></div>
          <span className="text-sm">Müsait Değil</span>
        </div>
      </div>

      <Card className="p-6 relative bg-slate-50 border-dashed">
        <div className="absolute top-4 left-4 text-xs font-medium text-muted-foreground">Restoran Yerleşimi</div>
        
        {/* Restaurant walls */}
        <div className="border-2 border-gray-400 p-8 rounded-lg min-h-[400px] relative">
          {/* Entry/Exit */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white px-3 py-1 text-xs border border-gray-400 rounded-md">
            Giriş/Çıkış
          </div>
          
          {/* Tables layout */}
          <div className="w-full h-full relative">
            {tables.map((table) => (
              <div
                key={table.id}
                className={getTableClass(table)}
                style={{ 
                  position: 'absolute',
                  left: `${table.position.x}%`, 
                  top: `${table.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => table.available && isCompatible(table) && handleTableClick(table)}
                title={table.available ? table.label : `${table.label} (Müsait Değil)`}
              >
                <span className="text-xs font-medium">
                  {`M-${table.id}`}<br/>
                  {`${table.size} kişi`}
                </span>
                
                {!isCompatible(table) && table.available && (
                  <div className="absolute inset-0 bg-red-200 bg-opacity-30 flex items-center justify-center rounded-md">
                    <span className="text-xs text-red-700">Yetersiz</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-6">
        {selectedTable ? (
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <h4 className="font-medium">Seçilen Masa:</h4>
            <p>{selectedTable.label}</p>
          </div>
        ) : (
          <div className="text-muted-foreground italic text-center p-4">
            Lütfen yukarıdan bir masa seçin
          </div>
        )}
      </div>
    </div>
  );
};

export default TableSelection;
