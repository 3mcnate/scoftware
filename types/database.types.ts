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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
      allowed_trip_participants: {
        Row: {
          approved_by: string
          created_at: string
          trip_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_by?: string
          created_at?: string
          trip_id?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          approved_by?: string
          created_at?: string
          trip_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "allowed_trip_participants_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allowed_trip_participants_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allowed_trip_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      checkout_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          status: Database["public"]["Enums"]["checkout_session_status"]
          stripe_checkout_session_id: string | null
          trip_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          status?: Database["public"]["Enums"]["checkout_session_status"]
          stripe_checkout_session_id?: string | null
          trip_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          status?: Database["public"]["Enums"]["checkout_session_status"]
          stripe_checkout_session_id?: string | null
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkout_sessions_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkout_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_info: {
        Row: {
          affirm_good_condition: boolean
          auto_insurance_company: string
          auto_insurance_policy_number: string
          created_at: string
          drivers_license_expiration: string
          drivers_license_number: string
          drivers_license_state: string
          is_4wd: boolean
          license_plate_number: string
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
          affirm_good_condition: boolean
          auto_insurance_company: string
          auto_insurance_policy_number: string
          created_at?: string
          drivers_license_expiration: string
          drivers_license_number: string
          drivers_license_state: string
          is_4wd: boolean
          license_plate_number: string
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
          affirm_good_condition?: boolean
          auto_insurance_company?: string
          auto_insurance_policy_number?: string
          created_at?: string
          drivers_license_expiration?: string
          drivers_license_number?: string
          drivers_license_state?: string
          is_4wd?: boolean
          license_plate_number?: string
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
      env: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
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
          is_wfr: boolean
          medical_history: string | null
          position: Database["public"]["Enums"]["guide_position"]
          updated_at: string
          user_id: string
          wfr_expiration_date: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          emergency_contact_name: string
          emergency_contact_phone_number: string
          emergency_contact_relationship: string
          guide_class: number
          has_car: boolean
          is_wfr?: boolean
          medical_history?: string | null
          position?: Database["public"]["Enums"]["guide_position"]
          updated_at?: string
          user_id: string
          wfr_expiration_date?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          emergency_contact_name?: string
          emergency_contact_phone_number?: string
          emergency_contact_relationship?: string
          guide_class?: number
          has_car?: boolean
          is_wfr?: boolean
          medical_history?: string | null
          position?: Database["public"]["Enums"]["guide_position"]
          updated_at?: string
          user_id?: string
          wfr_expiration_date?: string | null
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
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_by: string
          created_at?: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_by?: string
          created_at?: string
          notes?: string | null
          updated_at?: string
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
      participant_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participant_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_info: {
        Row: {
          allergies: string
          created_at: string
          degree_path: Database["public"]["Enums"]["degree_path_type"]
          dietary_restrictions: string
          emergency_contact_name: string
          emergency_contact_phone_number: string
          emergency_contact_relationship: string
          graduation_season: Database["public"]["Enums"]["graduation_season_type"]
          graduation_year: number
          health_insurance_bin_number: string
          health_insurance_group_number: string
          health_insurance_member_id: string
          health_insurance_provider: string
          medical_history: string
          medications: string
          updated_at: string
          usc_id: string
          user_id: string
        }
        Insert: {
          allergies: string
          created_at?: string
          degree_path: Database["public"]["Enums"]["degree_path_type"]
          dietary_restrictions: string
          emergency_contact_name: string
          emergency_contact_phone_number: string
          emergency_contact_relationship: string
          graduation_season: Database["public"]["Enums"]["graduation_season_type"]
          graduation_year: number
          health_insurance_bin_number: string
          health_insurance_group_number: string
          health_insurance_member_id: string
          health_insurance_provider: string
          medical_history: string
          medications: string
          updated_at?: string
          usc_id: string
          user_id: string
        }
        Update: {
          allergies?: string
          created_at?: string
          degree_path?: Database["public"]["Enums"]["degree_path_type"]
          dietary_restrictions?: string
          emergency_contact_name?: string
          emergency_contact_phone_number?: string
          emergency_contact_relationship?: string
          graduation_season?: Database["public"]["Enums"]["graduation_season_type"]
          graduation_year?: number
          health_insurance_bin_number?: string
          health_insurance_group_number?: string
          health_insurance_member_id?: string
          health_insurance_provider?: string
          medical_history?: string
          medications?: string
          updated_at?: string
          usc_id?: string
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
          first_name: string
          id: string
          last_name: string
        }
        Insert: {
          avatar?: string | null
          first_name: string
          id?: string
          last_name: string
        }
        Update: {
          avatar?: string | null
          first_name?: string
          id?: string
          last_name?: string
        }
        Relationships: []
      }
      published_trips: {
        Row: {
          activity: string
          created_at: string
          description: string
          difficulty: string
          end_date: string
          guides: Json
          id: string
          location: string
          meet: string
          name: string
          native_land: string
          picture: string
          recommended_prior_experience: string
          return: string
          start_date: string
          trail: string
          updated_at: string
          visible: boolean
          what_to_bring: string[]
        }
        Insert: {
          activity: string
          created_at?: string
          description: string
          difficulty: string
          end_date: string
          guides: Json
          id: string
          location: string
          meet: string
          name: string
          native_land: string
          picture: string
          recommended_prior_experience: string
          return: string
          start_date: string
          trail: string
          updated_at?: string
          visible?: boolean
          what_to_bring: string[]
        }
        Update: {
          activity?: string
          created_at?: string
          description?: string
          difficulty?: string
          end_date?: string
          guides?: Json
          id?: string
          location?: string
          meet?: string
          name?: string
          native_land?: string
          picture?: string
          recommended_prior_experience?: string
          return?: string
          start_date?: string
          trail?: string
          updated_at?: string
          visible?: boolean
          what_to_bring?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "published_trips_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
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
          amount_paid: number
          cancelled: boolean
          cancelled_at: string | null
          created_at: string
          driver_waiver_filepath: string | null
          id: string
          receipt_url: string
          refunded: boolean
          stripe_payment_id: string
          stripe_refund_id: string | null
          trip_id: string
          type: Database["public"]["Enums"]["ticket_type"]
          updated_at: string
          user_id: string
          waiver_filepath: string | null
        }
        Insert: {
          amount_paid: number
          cancelled?: boolean
          cancelled_at?: string | null
          created_at?: string
          driver_waiver_filepath?: string | null
          id?: string
          receipt_url?: string
          refunded?: boolean
          stripe_payment_id: string
          stripe_refund_id?: string | null
          trip_id: string
          type: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string
          user_id: string
          waiver_filepath?: string | null
        }
        Update: {
          amount_paid?: number
          cancelled?: boolean
          cancelled_at?: string | null
          created_at?: string
          driver_waiver_filepath?: string | null
          id?: string
          receipt_url?: string
          refunded?: boolean
          stripe_payment_id?: string
          stripe_refund_id?: string | null
          trip_id?: string
          type?: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string
          user_id?: string
          waiver_filepath?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "published_trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          guide_post_trip_form: string | null
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
          guide_post_trip_form?: string | null
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
          guide_post_trip_form?: string | null
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
      trip_details: {
        Row: {
          activity: string
          created_at: string
          difficulty: string
          location: string
          meet: string
          native_land: string
          prior_experience: string
          return: string
          trail: string
          trip_id: string
          updated_at: string
        }
        Insert: {
          activity: string
          created_at?: string
          difficulty: string
          location: string
          meet: string
          native_land: string
          prior_experience: string
          return: string
          trail: string
          trip_id?: string
          updated_at?: string
        }
        Update: {
          activity?: string
          created_at?: string
          difficulty?: string
          location?: string
          meet?: string
          native_land?: string
          prior_experience?: string
          return?: string
          trail?: string
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_details_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
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
          active: boolean
          amount: number
          archived_at: string | null
          created_at: string
          stripe_price_id: string
          stripe_product_id: string
          ticket_type: Database["public"]["Enums"]["ticket_type"]
          trip_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          amount: number
          archived_at?: string | null
          created_at?: string
          stripe_price_id: string
          stripe_product_id: string
          ticket_type: Database["public"]["Enums"]["ticket_type"]
          trip_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          amount?: number
          archived_at?: string | null
          created_at?: string
          stripe_price_id?: string
          stripe_product_id?: string
          ticket_type?: Database["public"]["Enums"]["ticket_type"]
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_prices_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_waivers: {
        Row: {
          content: string
          created_at: string
          id: string
          template_id: string
          trip_id: string
          type: Database["public"]["Enums"]["ticket_type"]
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          template_id: string
          trip_id: string
          type: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          template_id?: string
          trip_id?: string
          type?: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_waivers_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "waiver_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_waivers_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          access_code: string | null
          created_at: string
          description: string | null
          driver_spots: number
          ends_at: string
          gear_questions: string[] | null
          id: string
          name: string
          participant_spots: number
          picture: string | null
          signup_status: Database["public"]["Enums"]["trip_signup_status"]
          starts_at: string
          updated_at: string
          what_to_bring: string | null
        }
        Insert: {
          access_code?: string | null
          created_at?: string
          description?: string | null
          driver_spots: number
          ends_at: string
          gear_questions?: string[] | null
          id?: string
          name: string
          participant_spots: number
          picture?: string | null
          signup_status?: Database["public"]["Enums"]["trip_signup_status"]
          starts_at: string
          updated_at?: string
          what_to_bring?: string | null
        }
        Update: {
          access_code?: string | null
          created_at?: string
          description?: string | null
          driver_spots?: number
          ends_at?: string
          gear_questions?: string[] | null
          id?: string
          name?: string
          participant_spots?: number
          picture?: string | null
          signup_status?: Database["public"]["Enums"]["trip_signup_status"]
          starts_at?: string
          updated_at?: string
          what_to_bring?: string | null
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
      waiver_events: {
        Row: {
          created_at: string
          event: Database["public"]["Enums"]["waiver_event"]
          file_path: string | null
          id: string
          ip_address: string
          trip_id: string
          user_agent: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event: Database["public"]["Enums"]["waiver_event"]
          file_path?: string | null
          id?: string
          ip_address: string
          trip_id: string
          user_agent?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event?: Database["public"]["Enums"]["waiver_event"]
          file_path?: string | null
          id?: string
          ip_address?: string
          trip_id?: string
          user_agent?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waiver_events_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waiver_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waiver_templates: {
        Row: {
          active: boolean
          content: string
          created_at: string
          id: string
          type: Database["public"]["Enums"]["ticket_type"]
        }
        Insert: {
          active?: boolean
          content: string
          created_at?: string
          id?: string
          type: Database["public"]["Enums"]["ticket_type"]
        }
        Update: {
          active?: boolean
          content?: string
          created_at?: string
          id?: string
          type?: Database["public"]["Enums"]["ticket_type"]
        }
        Relationships: []
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
      get_role_code: {
        Args: { r: Database["public"]["Enums"]["user_role"] }
        Returns: number
      }
      has_trip_ticket: {
        Args: { trip: string; user: string }
        Returns: boolean
      }
    }
    Enums: {
      checkout_session_status: "open" | "complete" | "expired"
      degree_path_type: "undergrad" | "graduate" | "pdp"
      graduation_season_type: "spring" | "fall"
      guide_position: "new_guide" | "guide" | "longboard" | "alum"
      membership_length: "semester" | "year"
      ticket_type: "member" | "nonmember" | "driver"
      trip_signup_status:
        | "open"
        | "closed"
        | "access_code"
        | "select_participants"
        | "waitlist"
        | "full"
      user_role: "participant" | "guide" | "admin" | "superadmin"
      waitlist_status: "waiting" | "notification_sent" | "signed_up" | "expired"
      waiver_event: "user_opened" | "user_signed"
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
      checkout_session_status: ["open", "complete", "expired"],
      degree_path_type: ["undergrad", "graduate", "pdp"],
      graduation_season_type: ["spring", "fall"],
      guide_position: ["new_guide", "guide", "longboard", "alum"],
      membership_length: ["semester", "year"],
      ticket_type: ["member", "nonmember", "driver"],
      trip_signup_status: [
        "open",
        "closed",
        "access_code",
        "select_participants",
        "waitlist",
        "full",
      ],
      user_role: ["participant", "guide", "admin", "superadmin"],
      waitlist_status: ["waiting", "notification_sent", "signed_up", "expired"],
      waiver_event: ["user_opened", "user_signed"],
    },
  },
} as const

