
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTablesByAvailability } from '@/services/tableService';
import { Table } from './types/reservationTypes';
import { Coffee, WineOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Table as UITable, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

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
  const isMobile = useIsMobile();

  // Query tables from Supabase
  const { data: tables = [], isLoading, error } = useQuery({
    queryKey: ['tables', date?.toISOString(), time, guestCount],
    queryFn: () => fetchTablesByAvailability(date, time, guestCount),
    enabled: !!date && !!time && !isNaN(guestCount),
  });

  // Convert Supabase data for frontend
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
    // Reset selected table if no tables are available
    if (tables.length === 0 && selectedTable) {
      onSelectTable(null);
    }
    
    // Check if selected table is still available
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

  // Function to get table type name
  function getTableTypeName(type: string): string {
    switch (type) {
      case 'window': return 'Pencere Kenarı';
      case 'center': return 'Orta Alan';
      case 'corner': return 'Köşe';
      case 'booth': return 'Loca';
      default: return 'Masa';
    }
  }

  // Function to get badge color class based on table type
  function getTableTypeClass(type: string): string {
    switch (type) {
      case 'window': return 'bg-blue-100 text-blue-800';
      case 'center': return 'bg-green-100 text-green-800';
      case 'corner': return 'bg-yellow-100 text-yellow-800';
      case 'booth': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const handleTableClick = (table: Table) => {
    if (table.available && table.size >= guestCount) {
      onSelectTable(table);
    }
  };

  // Check for console errors
  useEffect(() => {
    if (error) {
      console.error("Error fetching tables:", error);
    }
  }, [error]);

  // Error display
  if (error) {
    return (
      <div className="py-4 md:py-6 text-center text-red-500">
        <p>Masa bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.</p>
        <p className="text-sm mt-2">Hata detayı: {String(error)}</p>
      </div>
    );
  }

  return (
    <div className="py-4 md:py-6">
      <div className="pb-4 md:pb-6">
        <h3 className="text-lg font-semibold mb-2">Masa Seçimi</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          {date && time ? 
            `${date.toLocaleDateString('tr-TR')} tarihinde ${time} saati için ${guests} kişilik müsait masalar aşağıda gösterilmektedir.` :
            "Lütfen önce rezervasyon tarih ve saatini seçin."
          }
        </p>
      </div>

      <div className="mb-4 md:mb-6 flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-1 md:gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-100 border border-blue-300 rounded-sm"></div>
          <span>Pencere</span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-green-100 border border-green-300 rounded-sm"></div>
          <span>Orta</span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-100 border border-yellow-300 rounded-sm"></div>
          <span>Köşe</span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-purple-100 border border-purple-300 rounded-sm"></div>
          <span>Loca</span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 border border-gray-300 rounded-sm opacity-40"></div>
          <span>Dolu</span>
        </div>
      </div>

      <Card className="p-3 md:p-6">
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-8 md:py-12">
            <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
            <div className="space-y-2 ml-4">
              <Skeleton className="h-4 w-[150px] md:w-[200px]" />
              <Skeleton className="h-4 w-[120px] md:w-[160px]" />
            </div>
          </div>
        )}
        
        {/* No data state */}
        {!isLoading && convertedTables.length === 0 && date && (
          <div className="text-center py-8 md:py-12">
            <WineOff className="mx-auto h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Masa Bulunamadı</h3>
            <p className="text-muted-foreground text-sm">
              Seçtiğiniz tarih ve saatte müsait masa bulunmamaktadır. Lütfen farklı bir tarih veya saat seçiniz.
            </p>
          </div>
        )}
        
        {/* Empty state - need date and time */}
        {!date && (
          <div className="text-center py-8 md:py-12">
            <Coffee className="mx-auto h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Tarih ve Saat Seçimi Gerekli</h3>
            <p className="text-muted-foreground text-sm">
              Müsait masaları görmek için lütfen önce bir tarih ve saat seçiniz.
            </p>
          </div>
        )}
        
        {/* Tables list view */}
        {!isLoading && date && convertedTables.length > 0 && (
          <div className="overflow-x-auto">
            <UITable>
              <TableHeader>
                <TableRow>
                  <TableHead>Masa</TableHead>
                  <TableHead className={isMobile ? "hidden" : ""}>Tür</TableHead>
                  <TableHead>Kapasite</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {convertedTables.map((table) => (
                  <TableRow 
                    key={table.id}
                    className={selectedTable?.id === table.id ? 'bg-primary/10' : ''}
                  >
                    <TableCell className="font-medium">{table.name}</TableCell>
                    <TableCell className={isMobile ? "hidden" : ""}>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTableTypeClass(table.type)}`}>
                        {getTableTypeName(table.type)}
                      </span>
                    </TableCell>
                    <TableCell>{table.size} Kişi</TableCell>
                    <TableCell>
                      {table.available && table.size >= guestCount ? (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          Müsait
                        </span>
                      ) : table.available ? (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Yetersiz
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                          Dolu
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={table.available && table.size >= guestCount ? "default" : "outline"}
                        size="sm"
                        disabled={!table.available || table.size < guestCount}
                        onClick={() => handleTableClick(table)}
                      >
                        {selectedTable?.id === table.id ? "Seçili" : "Seç"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </UITable>
          </div>
        )}
      </Card>

      <div className="mt-4 md:mt-6">
        {selectedTable ? (
          <div className="bg-primary/10 rounded-lg p-3 md:p-4 border border-primary/20">
            <h4 className="font-medium">Seçilen Masa:</h4>
            <p className="text-sm md:text-base">{selectedTable.label}</p>
          </div>
        ) : (
          <div className="text-muted-foreground italic text-center p-3 md:p-4 text-sm">
            Lütfen yukarıdan bir masa seçin
          </div>
        )}
      </div>
    </div>
  );
};

export default TableSelection;
