// Tipos do schema public (supabase/migrations).
// Regenerar com: npx supabase gen types typescript --project-id <ref> > types/database.ts

export type UserRole = 'admin' | 'member'

export type ProjectStage =
  | 'new_lead'
  | 'contacted'
  | 'proposal_sent'
  | 'negotiation'
  | 'won'
  | 'lost'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: UserRole
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: UserRole
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: UserRole
          created_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          id: string
          name: string | null
          email: string | null
          phone: string | null
          source: string | null
          type: string | null
          notes: string | null
          session_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          source?: string | null
          type?: string | null
          notes?: string | null
          session_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          source?: string | null
          type?: string | null
          notes?: string | null
          session_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          contact_id: string
          title: string | null
          event_type: string | null
          event_date: string | null
          venue: string | null
          guest_count: number | null
          proposal_total: number | null
          stage: ProjectStage
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contact_id: string
          title?: string | null
          event_type?: string | null
          event_date?: string | null
          venue?: string | null
          guest_count?: number | null
          proposal_total?: number | null
          stage?: ProjectStage
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contact_id?: string
          title?: string | null
          event_type?: string | null
          event_date?: string | null
          venue?: string | null
          guest_count?: number | null
          proposal_total?: number | null
          stage?: ProjectStage
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'projects_contact_id_fkey'
            columns: ['contact_id']
            referencedRelation: 'contacts'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: {
      user_role: UserRole
      project_stage: ProjectStage
    }
    CompositeTypes: Record<never, never>
  }
}

export type Contact = Database['public']['Tables']['contacts']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
