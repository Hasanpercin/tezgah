
export interface TableData {
  id?: string;
  name: string;
  type: 'window' | 'center' | 'corner' | 'booth';
  size: number;
  position_x: number;
  position_y: number;
  is_active: boolean;
}
