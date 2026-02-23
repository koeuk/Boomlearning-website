import type { Category } from './category'
import type { Enrollment } from './enrollment'
import type { Quiz } from './quiz'

export interface Course {
  id: number
  course_name: string
  course_code: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration_hours: number
  price: string
  instructor_name: string
  is_featured: boolean
  thumbnail: string | null
  enrollment_limit: number | null
  category: Category
  enrollments_count: number
  reviews_count: number
  average_rating: number
  is_enrolled: boolean
  enrollment: Enrollment | null
  modules?: Module[]
  total_lessons?: number
}

export interface Module {
  id: number
  module_title: string
  module_order: number
  description: string
  lessons_count: number
  lessons?: Lesson[]
}

export interface Lesson {
  id: number
  lesson_title: string
  lesson_type: 'video' | 'text' | 'quiz'
  lesson_order: number
  description: string
  content: string
  video_url: string | null
  video_duration: number | null
  thumbnail: string | null
  duration_minutes: number
  is_mandatory: boolean
  documents: Document[]
  module: Module
  quiz: Quiz | null
  progress: LessonProgress | null
}

export interface LessonProgress {
  id: number
  status: string
  time_spent_minutes: number
  completed_at: string | null
}

export interface Document {
  id: number
  name: string
  url: string
  mime_type: string
  size: number
}
