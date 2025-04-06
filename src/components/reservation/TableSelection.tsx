
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTablesByAvailability } from '@/services/tableService';
import { Table } from './types/reservationTypes';
import { Coffee, WineOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type TableSelectionProps = {
  onSelectTable: (table: Table | null) => void;
  selectedTable: Table | null;
  date: Date | null;
  time: string;
  guests: string;
};

const TableSelection = ({ onSelectTable, selectedTable, date, time, guests }: TableSelectionProps) => {
  const { toast } = useToast();
  const guestCount = parseInt(guests, 10);

  // Masa verisini Supabase'den çekme
  const { data: tables = [], isLoading, error } = useQuery({
    queryKey: ['tables', date?.toISOString(), time, guestCount],
    queryFn: () => fetchTablesByAvailability(date, time, guestCount),
    enabled: !!date && !!time && !isNaN(guestCount),
  });

  // Supabase verileri frontend için hazırla
  const convertedTables: Table[] = tables.map(table => ({
    id: table.id,
    type: table.type as 'window' | 'center' | 'corner' | 'booth',
    size: table.size,
    position_x: table.position_x,
    position_y: table.position_y,
    position: { x: table.position_x, y: table.position_y },
    available: table.available,
    label: `${getTableTypeName(table.type)} ${table.size} Kişilik (${table.name})`,
    name: table.name
  }));

  useEffect(() => {
    // Eğer seçili masa varsa ve müsait değilse veya yeni guestCount için uygun değilse seçimi temizle
    if (selectedTable) {
      const currentTable = convertedTables.find(t => t.id === selectedTable.id);
      if (!currentTable || !currentTable.available || currentTable.size < guestCount) {
        onSelectTable(null);
        
        if (currentTable && !currentTable.available) {
          toast({
            title: "Masa artık müsait değil",
            description: "Seçtiğiniz masa başka bir müşteri tarafından rezerve edildi. Lütfen başka bir masa seçin.",
            variant: "destructive",
          });
        } else if (currentTable && currentTable.size < guestCount) {
          toast({
            title: "Masa kapasitesi yetersiz",
            description: "Seçtiğiniz masa kişi sayınız için uygun değil. Lütfen daha büyük bir masa seçin.",
            variant: "destructive",
          });
        }
      }
    }
  }, [convertedTables, selectedTable, guestCount, onSelectTable, toast]);

  // Masa türü adını döndürür
  function getTableTypeName(type: string): string {
    switch (type) {
      case 'window': return 'Pencere Kenarı';
      case 'center': return 'Orta Alan';
      case 'corner': return 'Köşe';
      case 'booth': return 'Loca';
      default: return 'Masa';
    }
  }

  const handleTableClick = (table: Table) => {
    if (table.available && table.size >= guestCount) {
      onSelectTable(table);
    }
  };

  // Function to generate class based on table properties
  const getTableClass = (table: Table) => {
    const baseClass = "relative flex items-center justify-center rounded-md cursor-pointer transition-all border-2";
    
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

  // Error gösterimi
  if (error) {
    return (
      <div className="py-6 text-center text-red-500">
        <p>Masa bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.</p>
      </div>
    );
  }

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
          
          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="text-center">
                <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            </div>
          )}
          
          {/* No data state */}
          {!isLoading && convertedTables.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6 max-w-sm">
                <WineOff className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Masa Bulunamadı</h3>
                <p className="text-muted-foreground text-sm">
                  Seçtiğiniz tarih ve saatte müsait masa bulunmamaktadır. Lütfen farklı bir tarih veya saat seçiniz.
                </p>
              </div>
            </div>
          )}
          
          {/* Empty state - need date and time */}
          {!date && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6 max-w-sm">
                <Coffee className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Tarih ve Saat Seçimi Gerekli</h3>
                <p className="text-muted-foreground text-sm">
                  Müsait masaları görmek için lütfen önce bir tarih ve saat seçiniz.
                </p>
              </div>
            </div>
          )}
          
          {/* Tables layout */}
          {!isLoading && (
            <div className="w-full h-full relative">
              {convertedTables.map((table) => (
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
                    {table.name}<br/>
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
          )}
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
