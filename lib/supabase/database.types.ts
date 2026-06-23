export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      carts: {
        Row: {
          id: string
          menu_item_id: string | null
          quantity: number | null
          user_id: string | null
        }
        Insert: {
          id?: string
          menu_item_id?: string | null
          quantity?: number | null
          user_id?: string | null
        }
        Update: {
          id?: string
          menu_item_id?: string | null
          quantity?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_agents: {
        Row: {
          hostel: string | null
          id: string
          matric_number: string | null
          rating: number | null
          student_id_image: string | null
          total_deliveries: number | null
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          hostel?: string | null
          id?: string
          matric_number?: string | null
          rating?: number | null
          student_id_image?: string | null
          total_deliveries?: number | null
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          hostel?: string | null
          id?: string
          matric_number?: string | null
          rating?: number | null
          student_id_image?: string | null
          total_deliveries?: number | null
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_agents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      food_categories: {
        Row: {
          id: string
          image: string | null
          name: string
        }
        Insert: {
          id?: string
          image?: string | null
          name: string
        }
        Update: {
          id?: string
          image?: string | null
          name?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          available: boolean | null
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string | null
          price: number | null
          vendor_id: string | null
        }
        Insert: {
          available?: boolean | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          price?: number | null
          vendor_id?: string | null
        }
        Update: {
          available?: boolean | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          price?: number | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "food_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          menu_item_id: string | null
          order_id: string | null
          quantity: number | null
          unit_price: number | null
        }
        Insert: {
          id?: string
          menu_item_id?: string | null
          order_id?: string | null
          quantity?: number | null
          unit_price?: number | null
        }
        Update: {
          id?: string
          menu_item_id?: string | null
          order_id?: string | null
          quantity?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          delivery_agent_id: string | null
          delivery_fee: number | null
          delivery_pin: string | null
          delivery_stage: string | null
          hostel: string | null
          id: string
          landmark: string | null
          pin_attempts: number
          pin_locked: boolean
          school_id: string
          status: string | null
          total_amount: number | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_agent_id?: string | null
          delivery_fee?: number | null
          delivery_pin?: string | null
          delivery_stage?: string | null
          hostel?: string | null
          id?: string
          landmark?: string | null
          pin_attempts?: number
          pin_locked?: boolean
          school_id: string
          status?: string | null
          total_amount?: number | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_agent_id?: string | null
          delivery_fee?: number | null
          delivery_pin?: string | null
          delivery_stage?: string | null
          hostel?: string | null
          id?: string
          landmark?: string | null
          pin_attempts?: number
          pin_locked?: boolean
          school_id?: string
          status?: string | null
          total_amount?: number | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_delivery_agent_id_fkey"
            columns: ["delivery_agent_id"]
            isOneToOne: false
            referencedRelation: "delivery_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          hostel: string | null
          id: string
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          school: string | null
          school_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          hostel?: string | null
          id: string
          phone_number?: string | null
          role: Database["public"]["Enums"]["user_role"]
          school?: string | null
          school_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          hostel?: string | null
          id?: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          school?: string | null
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          agent_id: string | null
          id: string
          rating: number | null
          review: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          agent_id?: string | null
          id?: string
          rating?: number | null
          review?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          agent_id?: string | null
          id?: string
          rating?: number | null
          review?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "delivery_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          short_name: string
          slug: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          short_name: string
          slug: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          short_name?: string
          slug?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          order_id: string | null
          status: string | null
          transaction_type: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          status?: string | null
          transaction_type?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          status?: string | null
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          banner_image: string | null
          business_name: string | null
          cac_number: string | null
          created_at: string | null
          delivery_fee: number | null
          description: string | null
          id: string
          logo: string | null
          opening_hours: Json | null
          rating: number | null
          tags: string[] | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          banner_image?: string | null
          business_name?: string | null
          cac_number?: string | null
          created_at?: string | null
          delivery_fee?: number | null
          description?: string | null
          id?: string
          logo?: string | null
          opening_hours?: Json | null
          rating?: number | null
          tags?: string[] | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          banner_image?: string | null
          business_name?: string | null
          cac_number?: string | null
          created_at?: string | null
          delivery_fee?: number | null
          description?: string | null
          id?: string
          logo?: string | null
          opening_hours?: Json | null
          rating?: number | null
          tags?: string[] | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      agent_has_related_order: { Args: { agent_id: string }; Returns: boolean }
      approve_agent: {
        Args: { p_agent_id: string; p_approved?: boolean }
        Returns: {
          hostel: string | null
          id: string
          matric_number: string | null
          rating: number | null
          student_id_image: string | null
          total_deliveries: number | null
          user_id: string | null
          verification_status: string | null
        }
        SetofOptions: {
          from: "*"
          to: "delivery_agents"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      claim_order: {
        Args: { p_order_id: string }
        Returns: {
          created_at: string | null
          delivery_agent_id: string | null
          delivery_fee: number | null
          delivery_pin: string | null
          delivery_stage: string | null
          hostel: string | null
          id: string
          landmark: string | null
          pin_attempts: number
          pin_locked: boolean
          school_id: string
          status: string | null
          total_amount: number | null
          user_id: string | null
          vendor_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      complete_delivery: {
        Args: { p_order_id: string; p_pin: string }
        Returns: {
          attempts_remaining: number
          locked: boolean
          message: string
          success: boolean
        }[]
      }
      create_order: {
        Args: {
          p_hostel: string
          p_items: Json
          p_landmark: string
          p_vendor_id: string
        }
        Returns: {
          id: string
          total_amount: number
        }[]
      }
      current_agent_id: { Args: never; Returns: string }
      current_vendor_id: { Args: never; Returns: string }
      get_order_pin: { Args: { p_order_id: string }; Returns: string }
      get_vendor_daily_stats: {
        Args: { days_back?: number }
        Returns: {
          day: string
          order_count: number
          revenue: number
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_verified_agent: { Args: never; Returns: boolean }
      profile_related_via_order: {
        Args: { p_profile_id: string }
        Returns: boolean
      }
      unlock_order_pin: {
        Args: { p_order_id: string }
        Returns: {
          created_at: string | null
          delivery_agent_id: string | null
          delivery_fee: number | null
          delivery_pin: string | null
          delivery_stage: string | null
          hostel: string | null
          id: string
          landmark: string | null
          pin_attempts: number
          pin_locked: boolean
          school_id: string
          status: string | null
          total_amount: number | null
          user_id: string | null
          vendor_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      vendor_has_customer: { Args: { customer_id: string }; Returns: boolean }
    }
    Enums: {
      user_role: "ADMIN" | "USER" | "VENDOR" | "DELIVERY_AGENT"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["ADMIN", "USER", "VENDOR", "DELIVERY_AGENT"],
    },
  },
} as const
