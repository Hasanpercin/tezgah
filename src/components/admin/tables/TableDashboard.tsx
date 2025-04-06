
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TableDashboardProps {
  tablesCount: number;
  activeTablesCount: number;
  totalCapacity: number;
}

export const TableDashboard = ({ tablesCount, activeTablesCount, totalCapacity }: TableDashboardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Masa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tablesCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Aktif Masa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeTablesCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Kapasite</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalCapacity} kişi
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
