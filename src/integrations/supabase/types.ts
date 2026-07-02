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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      about_albums: {
        Row: {
          created_at: string
          display_order: number
          event_date: string | null
          id: string
          is_active: boolean
          title: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          event_date?: string | null
          id?: string
          is_active?: boolean
          title: string
        }
        Update: {
          created_at?: string
          display_order?: number
          event_date?: string | null
          id?: string
          is_active?: boolean
          title?: string
        }
        Relationships: []
      }
      about_album_photos: {
        Row: {
          album_id: string
          caption: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string
        }
        Insert: {
          album_id: string
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
        }
        Update: {
          album_id?: string
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "about_album_photos_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "about_albums"
            referencedColumns: ["id"]
          }
        ]
      }
      tourism_regions: {
        Row: {
          address: string | null
          contact: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          display_order: number
          email: string | null
          id: string
          information: string | null
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          address?: string | null
          contact?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          email?: string | null
          id?: string
          information?: string | null
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          address?: string | null
          contact?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          email?: string | null
          id?: string
          information?: string | null
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      tourism_region_cities: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
          region_id: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          name: string
          region_id: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          region_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tourism_region_cities_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "tourism_regions"
            referencedColumns: ["id"]
          }
        ]
      }
      tourism_region_city_photos: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          region_city_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          region_city_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          region_city_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tourism_region_city_photos_region_city_id_fkey"
            columns: ["region_city_id"]
            isOneToOne: false
            referencedRelation: "tourism_region_cities"
            referencedColumns: ["id"]
          }
        ]
      }
      tourism_region_documents: {
        Row: {
          category: string
          created_at: string
          display_order: number
          file_url: string
          id: string
          label: string
          region_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          display_order?: number
          file_url: string
          id?: string
          label: string
          region_id: string
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          file_url?: string
          id?: string
          label?: string
          region_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tourism_region_documents_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "tourism_regions"
            referencedColumns: ["id"]
          }
        ]
      }
      banners: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          link_url: string | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          link_url?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          link_url?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          gallery: Json
          id: string
          image_url: string | null
          is_featured: boolean
          name: string
          population: string | null
          presentation_video_url: string | null
          region: string | null
          short_description: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          gallery?: Json
          id?: string
          image_url?: string | null
          is_featured?: boolean
          name: string
          population?: string | null
          presentation_video_url?: string | null
          region?: string | null
          short_description?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          gallery?: Json
          id?: string
          image_url?: string | null
          is_featured?: boolean
          name?: string
          population?: string | null
          presentation_video_url?: string | null
          region?: string | null
          short_description?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      establishment_tags: {
        Row: {
          establishment_id: string
          tag_id: string
        }
        Insert: {
          establishment_id: string
          tag_id: string
        }
        Update: {
          establishment_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "establishment_tags_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "establishment_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      establishments: {
        Row: {
          address: string | null
          amenities: string[] | null
          category_id: string | null
          city_id: string | null
          created_at: string
          description: string | null
          details: Json | null
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          latitude: number | null
          longitude: number | null
          name: string
          owner_id: string | null
          phone: string | null
          rating: number | null
          short_description: string | null
          slug: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          category_id?: string | null
          city_id?: string | null
          created_at?: string
          description?: string | null
          details?: Json | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          owner_id?: string | null
          phone?: string | null
          rating?: number | null
          short_description?: string | null
          slug?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          category_id?: string | null
          city_id?: string | null
          created_at?: string
          description?: string | null
          details?: Json | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          rating?: number | null
          short_description?: string | null
          slug?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establishments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "establishments_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          city_id: string | null
          created_at: string
          description: string | null
          display_order: number
          end_date: string | null
          establishment_id: string | null
          event_type: string | null
          gallery: Json
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          name: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          city_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          end_date?: string | null
          establishment_id?: string | null
          event_type?: string | null
          gallery?: Json
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          city_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          end_date?: string | null
          establishment_id?: string | null
          event_type?: string | null
          gallery?: Json
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          establishment_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          establishment_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          establishment_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "prefeitura" | "anunciante"
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
      app_role: ["admin", "prefeitura", "anunciante"],
    },
  },
} as const
