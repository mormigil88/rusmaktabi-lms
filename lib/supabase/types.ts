export type Role = 'student' | 'teacher' | 'admin'
export type CourseStatus = 'draft' | 'published' | 'archived'
export type EnrollmentStatus = 'pending' | 'active' | 'expired' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type PaymentProvider = 'payme' | 'yookassa' | 'manual'
export type Currency = 'UZS' | 'RUB' | 'USD'
export type Language = 'ru' | 'uz' | 'en'
export type VideoProvider = 'youtube' | 'bunny'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          name: string
          role: Role
          country: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          price_uzs: number
          price_rub: number
          language: Language
          thumbnail: string | null
          status: CourseStatus
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['courses']['Insert']>
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          order: number
        }
        Insert: Omit<Database['public']['Tables']['modules']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['modules']['Insert']>
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          content_md: string | null
          video_url: string | null
          video_provider: VideoProvider | null
          duration_min: number
          order: number
          is_free: boolean
        }
        Insert: Omit<Database['public']['Tables']['lessons']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['lessons']['Insert']>
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          paid_at: string | null
          amount: number | null
          currency: Currency | null
          status: EnrollmentStatus
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['enrollments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['enrollments']['Insert']>
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed_at: string
        }
        Insert: Omit<Database['public']['Tables']['lesson_progress']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['lesson_progress']['Insert']>
      }
      payments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          amount: number
          currency: Currency
          provider: PaymentProvider
          external_id: string | null
          status: PaymentStatus
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }
    }
  }
}
