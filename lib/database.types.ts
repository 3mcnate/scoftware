export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          variables?: Json
          extensions?: Json
          query?: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      checkout_sessions: {
        Row: {
          confirmed: boolean
          created_at: string
          expires_at: string
          id: string
          stripe_checkout_session_id: string | null
          trip_id: string
          user_id: string
        }
        Insert: {
          confirmed?: boolean
          created_at?: string
          expires_at?: string
          id?: string
          stripe_checkout_session_id?: string | null
          trip_id: string
          user_id: string
        }
        Update: {
          confirmed?: boolean
          created_at?: string
          expires_at?: string
          id?: string
          stripe_checkout_session_id?: string | null
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_reservations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_reservations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_info: {
        Row: {
          auto_insurance_company: string
          auto_insurance_policy_number: string
          created_at: string
          drivers_license_number: string
          good_condition: boolean
          num_seats: number
          slack_interested: boolean
          updated_at: string
          user_id: string
          vehicle_make_and_model: string
          vehicle_owner_address: string
          vehicle_owner_name: string
          vehicle_year: number
        }
        Insert: {
          auto_insurance_company: string
          auto_insurance_policy_number: string
          created_at?: string
          drivers_license_number: string
          good_condition: boolean
          num_seats: number
          slack_interested: boolean
          updated_at?: string
          user_id: string
          vehicle_make_and_model: string
          vehicle_owner_address: string
          vehicle_owner_name: string
          vehicle_year: number
        }
        Update: {
          auto_insurance_company?: string
          auto_insurance_policy_number?: string
          created_at?: string
          drivers_license_number?: string
          good_condition?: boolean
          num_seats?: number
          slack_interested?: boolean
          updated_at?: string
          user_id?: string
          vehicle_make_and_model?: string
          vehicle_owner_address?: string
          vehicle_owner_name?: string
          vehicle_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "driver_info_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      form_responses: {
        Row: {
          created_at: string
          form_id: string
          id: string
          response: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          form_id?: string
          id?: string
          response: Json
          user_id: string
        }
        Update: {
          created_at?: string
          form_id?: string
          id?: string
          response?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_responses_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string
          form_schema: Json
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          form_schema: Json
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          form_schema?: Json
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      guide_info: {
        Row: {
          active: boolean
          created_at: string
          emergency_contact_name: string
          emergency_contact_phone_number: string
          emergency_contact_relationship: string
          guide_class: number
          has_car: boolean
          medical_history: string | null
          position: Database["public"]["Enums"]["guide_position"]
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          emergency_contact_name: string
          emergency_contact_phone_number: string
          emergency_contact_relationship: string
          guide_class: number
          has_car: boolean
          medical_history?: string | null
          position?: Database["public"]["Enums"]["guide_position"]
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          emergency_contact_name?: string
          emergency_contact_phone_number?: string
          emergency_contact_relationship?: string
          guide_class?: number
          has_car?: boolean
          medical_history?: string | null
          position?: Database["public"]["Enums"]["guide_position"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_info_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hard_trip_participants: {
        Row: {
          approved_by: string
          created_at: string
          notes: string | null
          user_id: string
        }
        Insert: {
          approved_by: string
          created_at?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          approved_by?: string
          created_at?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hard_trip_participants_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hard_trip_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          length: Database["public"]["Enums"]["membership_length"]
          stripe_payment_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          length: Database["public"]["Enums"]["membership_length"]
          stripe_payment_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          length?: Database["public"]["Enums"]["membership_length"]
          stripe_payment_id?: string
          user_id?: string
        }
        Relationships: []
      }
      participant_info: {
        Row: {
          allergies: string
          created_at: string
          dietary_restrictions: string
          emergency_contact_name: string
          emergency_contact_phone_number: string
          emergency_contact_relationship: string
          health_insurance_bin_number: string
          health_insurance_group_number: string
          health_insurance_member_id: string
          health_insurance_provider: string
          medical_history: string
          medications: string
          updated_at: string
          usc_id: number
          user_id: string
        }
        Insert: {
          allergies: string
          created_at?: string
          dietary_restrictions: string
          emergency_contact_name: string
          emergency_contact_phone_number: string
          emergency_contact_relationship: string
          health_insurance_bin_number: string
          health_insurance_group_number: string
          health_insurance_member_id: string
          health_insurance_provider: string
          medical_history: string
          medications: string
          updated_at?: string
          usc_id: number
          user_id: string
        }
        Update: {
          allergies?: string
          created_at?: string
          dietary_restrictions?: string
          emergency_contact_name?: string
          emergency_contact_phone_number?: string
          emergency_contact_relationship?: string
          health_insurance_bin_number?: string
          health_insurance_group_number?: string
          health_insurance_member_id?: string
          health_insurance_provider?: string
          medical_history?: string
          medications?: string
          updated_at?: string
          usc_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participant_info_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone_number: string
        }
        Insert: {
          avatar?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone_number: string
        }
        Update: {
          avatar?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone_number?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          cancelled: boolean
          cancelled_at: string | null
          created_at: string
          id: string
          refunded: boolean
          stripe_payment_id: string
          trip_id: string
          type: Database["public"]["Enums"]["ticket_type"]
          updated_at: string
          user_id: string
          waiver_confirmed: boolean
          waiver_id: string | null
        }
        Insert: {
          cancelled?: boolean
          cancelled_at?: string | null
          created_at?: string
          id?: string
          refunded?: boolean
          stripe_payment_id: string
          trip_id: string
          type: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string
          user_id: string
          waiver_confirmed?: boolean
          waiver_id?: string | null
        }
        Update: {
          cancelled?: boolean
          cancelled_at?: string | null
          created_at?: string
          id?: string
          refunded?: boolean
          stripe_payment_id?: string
          trip_id?: string
          type?: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string
          user_id?: string
          waiver_confirmed?: boolean
          waiver_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_waiver_id_fkey"
            columns: ["waiver_id"]
            isOneToOne: false
            referencedRelation: "waiver_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_budgets: {
        Row: {
          breakfasts: number
          car_mpgs: number[]
          car_rental_price: number
          created_at: string
          dinners: number
          lunches: number
          other: Json | null
          parking_cost: number
          permit_cost: number
          snacks: number
          total_miles: number
          trip_id: string
          updated_at: string
        }
        Insert: {
          breakfasts?: number
          car_mpgs?: number[]
          car_rental_price?: number
          created_at?: string
          dinners?: number
          lunches?: number
          other?: Json | null
          parking_cost?: number
          permit_cost?: number
          snacks?: number
          total_miles?: number
          trip_id: string
          updated_at?: string
        }
        Update: {
          breakfasts?: number
          car_mpgs?: number[]
          car_rental_price?: number
          created_at?: string
          dinners?: number
          lunches?: number
          other?: Json | null
          parking_cost?: number
          permit_cost?: number
          snacks?: number
          total_miles?: number
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_budgets_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_cycles: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          member_signups_start_at: string
          name: string
          nonmember_signups_start_at: string
          range: unknown | null
          starts_at: string
          trip_feedback_form: string | null
          trips_published_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          member_signups_start_at: string
          name: string
          nonmember_signups_start_at: string
          range?: unknown | null
          starts_at: string
          trip_feedback_form?: string | null
          trips_published_at: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          member_signups_start_at?: string
          name?: string
          nonmember_signups_start_at?: string
          range?: unknown | null
          starts_at?: string
          trip_feedback_form?: string | null
          trips_published_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      trip_guides: {
        Row: {
          trip_id: string
          user_id: string
        }
        Insert: {
          trip_id?: string
          user_id?: string
        }
        Update: {
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_guides_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_guides_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_prices: {
        Row: {
          created_at: string
          driver_price: number | null
          member_price: number
          nonmember_price: number
          stripe_driver_price_id: string | null
          stripe_driver_product_id: string | null
          stripe_member_price_id: string
          stripe_nonmember_price_id: string
          stripe_participant_product_id: string
          trip_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          driver_price?: number | null
          member_price: number
          nonmember_price: number
          stripe_driver_price_id?: string | null
          stripe_driver_product_id?: string | null
          stripe_member_price_id: string
          stripe_nonmember_price_id: string
          stripe_participant_product_id: string
          trip_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          driver_price?: number | null
          member_price?: number
          nonmember_price?: number
          stripe_driver_price_id?: string | null
          stripe_driver_product_id?: string | null
          stripe_member_price_id?: string
          stripe_nonmember_price_id?: string
          stripe_participant_product_id?: string
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prices_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_ticket_info: {
        Row: {
          cancelled_driver_tickets: number
          cancelled_participant_tickets: number
          created_at: string
          driver_tickets_sold: number
          participant_tickets_sold: number
          trip_id: string
          updated_at: string
        }
        Insert: {
          cancelled_driver_tickets?: number
          cancelled_participant_tickets?: number
          created_at?: string
          driver_tickets_sold?: number
          participant_tickets_sold?: number
          trip_id: string
          updated_at?: string
        }
        Update: {
          cancelled_driver_tickets?: number
          cancelled_participant_tickets?: number
          created_at?: string
          driver_tickets_sold?: number
          participant_tickets_sold?: number
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_ticket_info_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          created_at: string
          description: string | null
          difficulty: number | null
          driver_spots: number
          ends_at: string
          id: string
          name: string | null
          participant_spots: number
          picture: string | null
          starts_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: number | null
          driver_spots?: number
          ends_at: string
          id?: string
          name?: string | null
          participant_spots?: number
          picture?: string | null
          starts_at: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: number | null
          driver_spots?: number
          ends_at?: string
          id?: string
          name?: string | null
          participant_spots?: number
          picture?: string | null
          starts_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          created_at: string
          id: string
          notification_sent_at: string | null
          open_until: string | null
          status: Database["public"]["Enums"]["waitlist_status"]
          trip_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_sent_at?: string | null
          open_until?: string | null
          status?: Database["public"]["Enums"]["waitlist_status"]
          trip_id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_sent_at?: string | null
          open_until?: string | null
          status?: Database["public"]["Enums"]["waitlist_status"]
          trip_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_signups_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_signups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waiver_uploads: {
        Row: {
          bucket: string
          created_at: string
          id: string
          path: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          bucket?: string
          created_at?: string
          id?: string
          path: string
          ticket_id: string
          user_id: string
        }
        Update: {
          bucket?: string
          created_at?: string
          id?: string
          path?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waivers_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waivers_user_id_fkey"
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
      add_auto_timestamps_triggers: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      authorize: {
        Args: { authorized_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      custom_access_token_hook: {
        Args: { event: Json }
        Returns: Json
      }
      gbt_bit_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bpchar_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bytea_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_inet_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_numeric_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_text_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_timetz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_tstz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      get_role_code: {
        Args: { r: Database["public"]["Enums"]["user_role"] }
        Returns: number
      }
    }
    Enums: {
      guide_position: "new_guide" | "guide" | "longboard" | "alum"
      membership_length: "semester" | "year"
      ticket_type: "member" | "nonmember" | "driver"
      user_role: "participant" | "guide" | "admin" | "superadmin"
      waitlist_status: "waiting" | "notification_sent" | "signed_up" | "expired"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      guide_position: ["new_guide", "guide", "longboard", "alum"],
      membership_length: ["semester", "year"],
      ticket_type: ["member", "nonmember", "driver"],
      user_role: ["participant", "guide", "admin", "superadmin"],
      waitlist_status: ["waiting", "notification_sent", "signed_up", "expired"],
    },
  },
} as const

