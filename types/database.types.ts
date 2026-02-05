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
      budget_formulas: {
        Row: {
          formulas: string
          updated_at: string
        }
        Insert: {
          formulas: string
          updated_at?: string
        }
        Update: {
          formulas?: string
          updated_at?: string
        }
        Relationships: []
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
      membership_prices: {
        Row: {
          created_at: string
          length: Database["public"]["Enums"]["membership_length"]
          stripe_price_id: string
          unit_amount: number
        }
        Insert: {
          created_at?: string
          length: Database["public"]["Enums"]["membership_length"]
          stripe_price_id: string
          unit_amount: number
        }
        Update: {
          created_at?: string
          length?: Database["public"]["Enums"]["membership_length"]
          stripe_price_id?: string
          unit_amount?: number
        }
        Relationships: []
      }
      memberships: {
        Row: {
          cancelled: boolean
          created_at: string
          expires_at: string
          id: string
          length: Database["public"]["Enums"]["membership_length"]
          receipt_url: string
          stripe_payment_id: string
          user_id: string
        }
        Insert: {
          cancelled?: boolean
          created_at?: string
          expires_at: string
          id?: string
          length: Database["public"]["Enums"]["membership_length"]
          receipt_url: string
          stripe_payment_id: string
          user_id: string
        }
        Update: {
          cancelled?: boolean
          created_at?: string
          expires_at?: string
          id?: string
          length?: Database["public"]["Enums"]["membership_length"]
          receipt_url?: string
          stripe_payment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          dietary_restrictions: string[]
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
          dietary_restrictions: string[]
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
          dietary_restrictions?: string[]
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
          avatar_path: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
        }
        Insert: {
          avatar_path?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string
        }
        Update: {
          avatar_path?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
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
          picture_path: string
          recommended_prior_experience: string
          return: string
          start_date: string
          trail: string
          updated_at: string
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
          picture_path: string
          recommended_prior_experience: string
          return: string
          start_date: string
          trail: string
          updated_at?: string
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
          picture_path?: string
          recommended_prior_experience?: string
          return?: string
          start_date?: string
          trail?: string
          updated_at?: string
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
      stripe_products: {
        Row: {
          created_at: string
          name: string
          stripe_product_id: string
          trip_id: string | null
          type: Database["public"]["Enums"]["participant_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          name: string
          stripe_product_id: string
          trip_id?: string | null
          type: Database["public"]["Enums"]["participant_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          name?: string
          stripe_product_id?: string
          trip_id?: string | null
          type?: Database["public"]["Enums"]["participant_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_products_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
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
          driver_waiver_signed_at: string | null
          id: string
          receipt_url: string
          refunded: boolean
          stripe_payment_id: string
          stripe_refund_id: string | null
          trip_id: string
          type: Database["public"]["Enums"]["ticket_price_type"]
          updated_at: string
          user_id: string
          waiver_filepath: string | null
          waiver_signed_at: string | null
        }
        Insert: {
          amount_paid: number
          cancelled?: boolean
          cancelled_at?: string | null
          created_at?: string
          driver_waiver_filepath?: string | null
          driver_waiver_signed_at?: string | null
          id?: string
          receipt_url?: string
          refunded?: boolean
          stripe_payment_id: string
          stripe_refund_id?: string | null
          trip_id: string
          type: Database["public"]["Enums"]["ticket_price_type"]
          updated_at?: string
          user_id: string
          waiver_filepath?: string | null
          waiver_signed_at?: string | null
        }
        Update: {
          amount_paid?: number
          cancelled?: boolean
          cancelled_at?: string | null
          created_at?: string
          driver_waiver_filepath?: string | null
          driver_waiver_signed_at?: string | null
          id?: string
          receipt_url?: string
          refunded?: boolean
          stripe_payment_id?: string
          stripe_refund_id?: string | null
          trip_id?: string
          type?: Database["public"]["Enums"]["ticket_price_type"]
          updated_at?: string
          user_id?: string
          waiver_filepath?: string | null
          waiver_signed_at?: string | null
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
            foreignKeyName: "tickets_trip_id_fkey1"
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
        ]
      }
      trip_checkout_sessions: {
        Row: {
          created_at: string
          expires_at: string
          price_id: string
          status: Database["public"]["Enums"]["checkout_session_status"]
          stripe_cs_id: string
          trip_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          price_id: string
          status?: Database["public"]["Enums"]["checkout_session_status"]
          stripe_cs_id: string
          trip_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          price_id?: string
          status?: Database["public"]["Enums"]["checkout_session_status"]
          stripe_cs_id?: string
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
          {
            foreignKeyName: "trip_checkout_sessions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "trip_prices"
            referencedColumns: ["stripe_price_id"]
          },
        ]
      }
      trip_cycles: {
        Row: {
          created_at: string
          driver_signups_start_at: string
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
          driver_signups_start_at: string
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
          driver_signups_start_at?: string
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
          ticket_type: Database["public"]["Enums"]["ticket_price_type"]
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
          ticket_type: Database["public"]["Enums"]["ticket_price_type"]
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
          ticket_type?: Database["public"]["Enums"]["ticket_price_type"]
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
          {
            foreignKeyName: "trip_prices_stripe_product_id_fkey"
            columns: ["stripe_product_id"]
            isOneToOne: false
            referencedRelation: "stripe_products"
            referencedColumns: ["stripe_product_id"]
          },
        ]
      }
      trip_settings: {
        Row: {
          allow_signups: boolean
          created_at: string
          driver_signup_date_override: string | null
          enable_driver_waitlist: boolean
          enable_participant_waitlist: boolean
          hide_trip: boolean
          member_signup_date_override: string | null
          nonmember_signup_date_override: string | null
          publish_date_override: string | null
          require_code: boolean
          trip_id: string
          updated_at: string
        }
        Insert: {
          allow_signups?: boolean
          created_at?: string
          driver_signup_date_override?: string | null
          enable_driver_waitlist?: boolean
          enable_participant_waitlist?: boolean
          hide_trip?: boolean
          member_signup_date_override?: string | null
          nonmember_signup_date_override?: string | null
          publish_date_override?: string | null
          require_code?: boolean
          trip_id: string
          updated_at?: string
        }
        Update: {
          allow_signups?: boolean
          created_at?: string
          driver_signup_date_override?: string | null
          enable_driver_waitlist?: boolean
          enable_participant_waitlist?: boolean
          hide_trip?: boolean
          member_signup_date_override?: string | null
          nonmember_signup_date_override?: string | null
          publish_date_override?: string | null
          require_code?: boolean
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_settings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_waivers: {
        Row: {
          content: Json
          created_at: string
          id: string
          template_id: string
          title: string
          trip_id: string
          type: Database["public"]["Enums"]["participant_type"]
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          template_id: string
          title: string
          trip_id: string
          type: Database["public"]["Enums"]["participant_type"]
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          template_id?: string
          title?: string
          trip_id?: string
          type?: Database["public"]["Enums"]["participant_type"]
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
          activity: string | null
          breakfasts: number | null
          budget_confirmed: boolean
          car_mpgs: number[] | null
          created_at: string
          description: string | null
          difficulty: string | null
          dinners: number | null
          driver_price_override: number | null
          driver_spots: number
          end_date: string
          gear_questions: string[] | null
          id: string
          location: string | null
          lunches: number | null
          meet: string | null
          member_price_override: number | null
          name: string
          native_land: string | null
          nonmember_price_override: number | null
          other_expenses: Json | null
          participant_spots: number
          picture_path: string | null
          prior_experience: string | null
          return: string | null
          snacks: number | null
          start_date: string
          total_miles: number | null
          trail: string | null
          updated_at: string
          what_to_bring: string[] | null
        }
        Insert: {
          access_code?: string | null
          activity?: string | null
          breakfasts?: number | null
          budget_confirmed?: boolean
          car_mpgs?: number[] | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          dinners?: number | null
          driver_price_override?: number | null
          driver_spots: number
          end_date: string
          gear_questions?: string[] | null
          id?: string
          location?: string | null
          lunches?: number | null
          meet?: string | null
          member_price_override?: number | null
          name: string
          native_land?: string | null
          nonmember_price_override?: number | null
          other_expenses?: Json | null
          participant_spots: number
          picture_path?: string | null
          prior_experience?: string | null
          return?: string | null
          snacks?: number | null
          start_date: string
          total_miles?: number | null
          trail?: string | null
          updated_at?: string
          what_to_bring?: string[] | null
        }
        Update: {
          access_code?: string | null
          activity?: string | null
          breakfasts?: number | null
          budget_confirmed?: boolean
          car_mpgs?: number[] | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          dinners?: number | null
          driver_price_override?: number | null
          driver_spots?: number
          end_date?: string
          gear_questions?: string[] | null
          id?: string
          location?: string | null
          lunches?: number | null
          meet?: string | null
          member_price_override?: number | null
          name?: string
          native_land?: string | null
          nonmember_price_override?: number | null
          other_expenses?: Json | null
          participant_spots?: number
          picture_path?: string | null
          prior_experience?: string | null
          return?: string | null
          snacks?: number | null
          start_date?: string
          total_miles?: number | null
          trail?: string | null
          updated_at?: string
          what_to_bring?: string[] | null
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          created_at: string
          id: string
          notification_sent_at: string | null
          sign_up_success: boolean
          spot_expires_at: string | null
          ticket_type: Database["public"]["Enums"]["participant_type"]
          trip_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_sent_at?: string | null
          sign_up_success?: boolean
          spot_expires_at?: string | null
          ticket_type?: Database["public"]["Enums"]["participant_type"]
          trip_id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_sent_at?: string | null
          sign_up_success?: boolean
          spot_expires_at?: string | null
          ticket_type?: Database["public"]["Enums"]["participant_type"]
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
          waiver_id: string
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
          waiver_id: string
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
          waiver_id?: string
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
          {
            foreignKeyName: "waiver_events_waiver_id_fkey"
            columns: ["waiver_id"]
            isOneToOne: false
            referencedRelation: "trip_waivers"
            referencedColumns: ["id"]
          },
        ]
      }
      waiver_templates: {
        Row: {
          active: boolean
          content: Json
          created_at: string
          id: string
          title: string
          type: Database["public"]["Enums"]["participant_type"]
        }
        Insert: {
          active?: boolean
          content: Json
          created_at?: string
          id?: string
          title: string
          type?: Database["public"]["Enums"]["participant_type"]
        }
        Update: {
          active?: boolean
          content?: Json
          created_at?: string
          id?: string
          title?: string
          type?: Database["public"]["Enums"]["participant_type"]
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
      is_trip_guide: {
        Args: { u1: string; u2: string }
        Returns: boolean
      }
      is_trip_visible: {
        Args: { trip_id: string }
        Returns: boolean
      }
      trip_has_tickets: {
        Args: { t_id: string }
        Returns: boolean
      }
    }
    Enums: {
      checkout_session_status: "open" | "complete" | "expired"
      degree_path_type: "undergrad" | "graduate" | "pdp"
      graduation_season_type: "spring" | "fall"
      guide_position: "new_guide" | "guide" | "longboard" | "alum"
      membership_length: "semester" | "year"
      participant_type: "participant" | "driver"
      ticket_price_type: "member" | "nonmember" | "driver"
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
      participant_type: ["participant", "driver"],
      ticket_price_type: ["member", "nonmember", "driver"],
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

