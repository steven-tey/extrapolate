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
      data: {
        Row: {
          created_at: string
          failed: boolean | null
          id: string
          input: string
          output: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          failed?: boolean | null
          id: string
          input?: string
          output?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          failed?: boolean | null
          id?: string
          input?: string
          output?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          billing_scheme: string | null
          created: number | null
          currency: string | null
          custom_unit_amount: Json | null
          id: string
          livemode: boolean | null
          lookup_key: string | null
          metadata: Json | null
          nickname: string | null
          object: string | null
          product: string | null
          recurring: Json | null
          tax_behavior: string | null
          tiers_mode: string | null
          transform_quantity: Json | null
          type: string | null
          unit_amount: number | null
          unit_amount_decimal: string | null
        }
        Insert: {
          active?: boolean | null
          billing_scheme?: string | null
          created?: number | null
          currency?: string | null
          custom_unit_amount?: Json | null
          id: string
          livemode?: boolean | null
          lookup_key?: string | null
          metadata?: Json | null
          nickname?: string | null
          object?: string | null
          product?: string | null
          recurring?: Json | null
          tax_behavior?: string | null
          tiers_mode?: string | null
          transform_quantity?: Json | null
          type?: string | null
          unit_amount?: number | null
          unit_amount_decimal?: string | null
        }
        Update: {
          active?: boolean | null
          billing_scheme?: string | null
          created?: number | null
          currency?: string | null
          custom_unit_amount?: Json | null
          id?: string
          livemode?: boolean | null
          lookup_key?: string | null
          metadata?: Json | null
          nickname?: string | null
          object?: string | null
          product?: string | null
          recurring?: Json | null
          tax_behavior?: string | null
          tiers_mode?: string | null
          transform_quantity?: Json | null
          type?: string | null
          unit_amount?: number | null
          unit_amount_decimal?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          attributes: Json | null
          created: number | null
          default_price: string | null
          description: string | null
          id: string
          images: Json | null
          livemode: boolean | null
          marketing_features: Json | null
          metadata: Json | null
          name: string | null
          object: string | null
          package_dimensions: Json | null
          shippable: boolean | null
          statement_descriptor: string | null
          tax_code: string | null
          type: string | null
          unit_label: string | null
          updated: number | null
          url: string | null
        }
        Insert: {
          active?: boolean | null
          attributes?: Json | null
          created?: number | null
          default_price?: string | null
          description?: string | null
          id: string
          images?: Json | null
          livemode?: boolean | null
          marketing_features?: Json | null
          metadata?: Json | null
          name?: string | null
          object?: string | null
          package_dimensions?: Json | null
          shippable?: boolean | null
          statement_descriptor?: string | null
          tax_code?: string | null
          type?: string | null
          unit_label?: string | null
          updated?: number | null
          url?: string | null
        }
        Update: {
          active?: boolean | null
          attributes?: Json | null
          created?: number | null
          default_price?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          livemode?: boolean | null
          marketing_features?: Json | null
          metadata?: Json | null
          name?: string | null
          object?: string | null
          package_dimensions?: Json | null
          shippable?: boolean | null
          statement_descriptor?: string | null
          tax_code?: string | null
          type?: string | null
          unit_label?: string | null
          updated?: number | null
          url?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          credits: number
          email: string
          id: string
          image: string | null
          name: string
          stripe_id: string | null
          stripe_id_dev: string | null
        }
        Insert: {
          credits?: number
          email: string
          id?: string
          image?: string | null
          name: string
          stripe_id?: string | null
          stripe_id_dev?: string | null
        }
        Update: {
          credits?: number
          email?: string
          id?: string
          image?: string | null
          name?: string
          stripe_id?: string | null
          stripe_id_dev?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_products: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          price_id: string
          name: string
          description: string
          price: number
          credits: number
        }[]
      }
      get_products_dev: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          price_id: string
          name: string
          description: string
          price: number
          credits: number
        }[]
      }
      update_credits: {
        Args: {
          user_id: string
          credit_amount: number
        }
        Returns: number
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
