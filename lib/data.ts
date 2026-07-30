import { createClient, supabaseConfigured } from './supabase/server'
import type { Project, TeamMember, Testimonial, Category, Opening, SocialMedia } from './supabase/types'

// Public data fetchers. Each returns only PUBLISHED rows for the live site,
// and fails soft (empty array) so the page never crashes if the backend is
// unreachable or not yet configured.

export async function getPublishedProjects(): Promise<Project[]> {
  if (!supabaseConfigured()) return []
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

export async function getPublishedTeam(): Promise<TeamMember[]> {
  if (!supabaseConfigured()) return []
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (!supabaseConfigured()) return null
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single()
    if (error) return null
    return data
  } catch {
    return null
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!supabaseConfigured()) return []
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  if (!supabaseConfigured()) return []
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

export async function getPublishedOpenings(): Promise<Opening[]> {
  if (!supabaseConfigured()) return []
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('openings')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

export async function getOpeningById(id: string): Promise<Opening | null> {
  if (!supabaseConfigured()) return null
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('openings')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single()
    if (error) return null
    return data
  } catch {
    return null
  }
}


export type SocialLinks = { instagram?: string; facebook?: string; youtube?: string; linkedin?: string; email?: string }

export async function getSocialLinks(): Promise<SocialLinks> {
  if (!supabaseConfigured()) return {}
  try {
    const supabase = createClient()
    const { data } = await supabase.from('site_content').select('data').eq('section', 'social_links').limit(1).maybeSingle()
    return (data?.data as SocialLinks) ?? {}
  } catch {
    return {}
  }
}

export async function getPublishedSocial(): Promise<SocialMedia[]> {
  if (!supabaseConfigured()) return []
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('social_media')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}
