export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string | null
          id: string
          password_hash: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          password_hash: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          password_hash?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fixed_menu_items: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string
          package_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id: string
          package_id: string
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string
          package_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "fixed_menu_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixed_menu_items_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "fixed_menu_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      fixed_menu_packages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_path: string | null
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_path?: string | null
          is_active?: boolean
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_path?: string | null
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      loyalty_points: {
        Row: {
          created_at: string
          id: string
          level: string
          points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          level?: string
          points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          allergens: string | null
          category_id: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_path: string | null
          ingredients: string | null
          is_featured: boolean | null
          is_gluten_free: boolean | null
          is_in_stock: boolean
          is_spicy: boolean | null
          is_vegan: boolean | null
          is_vegetarian: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          allergens?: string | null
          category_id: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_path?: string | null
          ingredients?: string | null
          is_featured?: boolean | null
          is_gluten_free?: boolean | null
          is_in_stock?: boolean
          is_spicy?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          allergens?: string | null
          category_id?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_path?: string | null
          ingredients?: string | null
          is_featured?: boolean | null
          is_gluten_free?: boolean | null
          is_in_stock?: boolean
          is_spicy?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      point_history: {
        Row: {
          created_at: string
          description: string
          id: string
          points: number
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          points: number
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          phone?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      reservation_fixed_menus: {
        Row: {
          created_at: string
          fixed_menu_id: string
          id: string
          quantity: number
          reservation_id: string
        }
        Insert: {
          created_at?: string
          fixed_menu_id: string
          id?: string
          quantity?: number
          reservation_id: string
        }
        Update: {
          created_at?: string
          fixed_menu_id?: string
          id?: string
          quantity?: number
          reservation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservation_fixed_menus_fixed_menu_id_fkey"
            columns: ["fixed_menu_id"]
            isOneToOne: false
            referencedRelation: "fixed_menu_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_fixed_menus_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_menu_items: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string
          quantity: number
          reservation_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id: string
          quantity?: number
          reservation_id: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string
          quantity?: number
          reservation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservation_menu_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_menu_items_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          is_prepayment: boolean
          payment_status: string
          reservation_id: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          is_prepayment?: boolean
          payment_status?: string
          reservation_id: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          is_prepayment?: boolean
          payment_status?: string
          reservation_id?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservation_payments_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_tables: {
        Row: {
          created_at: string
          id: string
          reservation_id: string
          table_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reservation_id: string
          table_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reservation_id?: string
          table_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservation_tables_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_tables_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string
          date: string
          email: string | null
          guests: number
          has_prepayment: boolean | null
          id: string
          name: string | null
          notes: string | null
          occasion: string | null
          phone: string | null
          selected_items: Json | null
          status: string
          time: string
          total_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          email?: string | null
          guests: number
          has_prepayment?: boolean | null
          id?: string
          name?: string | null
          notes?: string | null
          occasion?: string | null
          phone?: string | null
          selected_items?: Json | null
          status?: string
          time: string
          total_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          email?: string | null
          guests?: number
          has_prepayment?: boolean | null
          id?: string
          name?: string | null
          notes?: string | null
          occasion?: string | null
          phone?: string | null
          selected_items?: Json | null
          status?: string
          time?: string
          total_amount?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          position_x: number
          position_y: number
          size: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          position_x: number
          position_y: number
          size: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          position_x?: number
          position_y?: number
          size?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      website_content: {
        Row: {
          created_at: string
          id: string
          image_path: string | null
          key: string
          section: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_path?: string | null
          key: string
          section: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          image_path?: string | null
          key?: string
          section?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_table_availability: {
        Args: { p_table_id: string; p_date: string; p_time: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
