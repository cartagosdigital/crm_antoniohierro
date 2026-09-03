// Gerado a partir do schema do Supabase (projeto uvrychomsrpkwnsapswb).
// Regenerar com: npx supabase gen types typescript --project-id <ref> > types/database.ts
// Os aliases no fim do ficheiro são acrescentados à mão — mantê-los ao regenerar.
//
// PROVISÓRIO: proposals e proposal_language foram escritos à mão a partir de
// supabase/migrations/0009_proposals.sql, sem passar pelo gerador (o conector
// Supabase estava em baixo). Regenerar e confirmar contra o schema real.

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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          notes: string | null
          phone: string | null
          session_id: string | null
          source: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          session_id?: string | null
          source?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          session_id?: string | null
          source?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          body: string
          category: string
          channel: Database["public"]["Enums"]["message_channel"]
          created_at: string
          id: string
          name: string
          stage: Database["public"]["Enums"]["project_stage"] | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          body: string
          category?: string
          channel: Database["public"]["Enums"]["message_channel"]
          created_at?: string
          id?: string
          name: string
          stage?: Database["public"]["Enums"]["project_stage"] | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          category?: string
          channel?: Database["public"]["Enums"]["message_channel"]
          created_at?: string
          id?: string
          name?: string
          stage?: Database["public"]["Enums"]["project_stage"] | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      projects: {
        Row: {
          contact_id: string
          created_at: string
          event_date: string | null
          event_type: string | null
          guest_count: number | null
          id: string
          proposal_total: number | null
          stage: Database["public"]["Enums"]["project_stage"]
          title: string | null
          updated_at: string
          venue: string | null
        }
        Insert: {
          contact_id: string
          created_at?: string
          event_date?: string | null
          event_type?: string | null
          guest_count?: number | null
          id?: string
          proposal_total?: number | null
          stage?: Database["public"]["Enums"]["project_stage"]
          title?: string | null
          updated_at?: string
          venue?: string | null
        }
        Update: {
          contact_id?: string
          created_at?: string
          event_date?: string | null
          event_type?: string | null
          guest_count?: number | null
          id?: string
          proposal_total?: number | null
          stage?: Database["public"]["Enums"]["project_stage"]
          title?: string | null
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          content: Json
          created_at: string
          id: string
          language: Database["public"]["Enums"]["proposal_language"]
          project_id: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          language?: Database["public"]["Enums"]["proposal_language"]
          project_id: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          language?: Database["public"]["Enums"]["proposal_language"]
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      stage_events: {
        Row: {
          changed_at: string
          changed_by: string | null
          from_stage: Database["public"]["Enums"]["project_stage"] | null
          id: string
          project_id: string
          to_stage: Database["public"]["Enums"]["project_stage"]
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          from_stage?: Database["public"]["Enums"]["project_stage"] | null
          id?: string
          project_id: string
          to_stage: Database["public"]["Enums"]["project_stage"]
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          from_stage?: Database["public"]["Enums"]["project_stage"] | null
          id?: string
          project_id?: string
          to_stage?: Database["public"]["Enums"]["project_stage"]
        }
        Relationships: [
          {
            foreignKeyName: "stage_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      message_channel: "email" | "whatsapp"
      project_stage:
        | "diagnostico"
        | "qualificacao"
        | "reuniao_marcada"
        | "negociacao"
        | "quase_fechar"
        | "ganho"
        | "perdido"
      proposal_language: "pt" | "en"
      user_role: "admin" | "member"
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
      message_channel: ["email", "whatsapp"],
      project_stage: [
        "diagnostico",
        "qualificacao",
        "reuniao_marcada",
        "negociacao",
        "quase_fechar",
        "ganho",
        "perdido",
      ],
      proposal_language: ["pt", "en"],
      user_role: ["admin", "member"],
    },
  },
} as const

// ---------- aliases usados pela aplicação (acrescentados à mão) ----------

export type UserRole = Enums<'user_role'>
export type MessageChannel = Enums<'message_channel'>
export type ProjectStage = Enums<'project_stage'>

export type Contact = Tables<'contacts'>
export type Project = Tables<'projects'>
export type MessageTemplate = Tables<'message_templates'>
export type Proposal = Tables<'proposals'>
export type StageEvent = Tables<'stage_events'>
