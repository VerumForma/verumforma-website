// Database row types for the VerumForma Supabase schema.

export type Project = {
  id: string
  title: string
  category: string | null
  location: string | null
  year: string | null
  description: string | null
  cover_image: string | null
  images: string[]
  featured: boolean
  sort_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export type TeamMember = {
  id: string
  name: string
  role: string | null
  bio: string | null
  photo: string | null
  sort_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export type Testimonial = {
  id: string
  quote: string
  author_name: string
  author_role: string | null
  project: string | null
  sort_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export type ContactSubmission = {
  id: string
  name: string
  email: string
  project_type: string | null
  message: string | null
  locale: string | null
  status: 'new' | 'read' | 'handled' | 'archived'
  created_at: string
}

export type Category = {
  id: string
  name: string
  sort_order: number
  created_at: string
}

export type SiteContent = {
  id: string
  section: string
  locale: string
  data: Record<string, unknown>
  updated_at: string
}

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  role: 'admin' | 'staff'
  created_at: string
}

// Minimal typing so the supabase client returns our row shapes.
// The Views/Functions/Enums/CompositeTypes keys must be present (even if empty)
// or supabase-js type helpers resolve table types to `never`.
export type Database = {
  __InternalSupabase: { PostgrestVersion: '12' }
  public: {
    Tables: {
      projects: { Row: Project; Insert: Partial<Project>; Update: Partial<Project>; Relationships: [] }
      team_members: { Row: TeamMember; Insert: Partial<TeamMember>; Update: Partial<TeamMember>; Relationships: [] }
      testimonials: { Row: Testimonial; Insert: Partial<Testimonial>; Update: Partial<Testimonial>; Relationships: [] }
      contact_submissions: { Row: ContactSubmission; Insert: Partial<ContactSubmission>; Update: Partial<ContactSubmission>; Relationships: [] }
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile>; Relationships: [] }
      categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category>; Relationships: [] }
      site_content: { Row: SiteContent; Insert: Partial<SiteContent>; Update: Partial<SiteContent>; Relationships: [] }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
