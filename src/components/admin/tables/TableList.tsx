
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2, Coffee } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableDialog } from "./TableDialog";
import { TableData } from "./types";
import { useToast } from "@/hooks/use-toast";

interface TableListProps {
  tables: TableData[];
  loading: boolean;
  onEdit: (table: TableData) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export const TableList = ({ tables, loading, onEdit, onDelete, onAddNew }: TableListProps) => {
  const { toast } = useToast();
  
  const getTypeColorClass = (type: string) => {
    switch (type) {
      case 'window': return 'text-blue-600 bg-blue-100';
      case 'center': return 'text-green-600 bg-green-100';
      case 'corner': return 'text-yellow-600 bg-yellow-100';
      case 'booth': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeTranslation = (type: string) => {
    switch (type) {
      case 'window': return 'Pencere Kenarı';
      case 'center': return 'Orta Alan';
      case 'corner': return 'Köşe';
      case 'booth': return 'Loca';
      default: return type;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Masalar</CardTitle>
        <Button onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Masa
        </Button>
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
                          onClick={() => table.id && onEdit(table)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => table.id && onDelete(table.id)}
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
};
