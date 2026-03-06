import type { Category } from './category'
import type { Enrollment } from './enrollment'
import type { Quiz } from './quiz'
import type { LessonProgress } from './progress'

export interface Course {
  id: string
  course_name: string
  course_code: string
  description: string
  image_url: string | null
  level: 'beginner' | 'intermediate' | 'advanced'
  duration_hours: number
  pricing_type: 'free' | 'paid'
  is_free: boolean
  price: string
  instructor_name: string
  is_featured: boolean
  thumbnail: string | null
  enrollment_limit: number | null
  status: string
  category: Category | null
  enrollments_count: number
  reviews_count: number
  average_rating: number
  is_enrolled: boolean
  enrollment: Enrollment | null
  modules?: Module[]
  lessons?: CourseLessonSummary[]
  total_lessons?: number
  created_at: string
  updated_at: string
}

export interface Module {
  id: string
  module_title: string
  module_order: number
  description: string
  lessons_count: number
  lessons?: Lesson[]
}

export interface CourseLessonSummary {
  id: string
  lesson_title: string
  lesson_type: 'video' | 'text' | 'quiz' | 'document'
  lesson_order: number
  description: string
  duration_minutes: number
  is_mandatory: boolean
}

export interface Lesson {
  id: string
  lesson_title: string
  lesson_type: 'video' | 'text' | 'quiz' | 'document'
  lesson_order: number
  description: string
  content: string | null
  image_url: string | null
  video_url: string | null
  video_duration: number | null
  formatted_duration: string | null
  thumbnail: string | null
  duration_minutes: number
  is_mandatory: boolean
  documents: Document[]
  module: Module
  quiz: LessonQuiz | null
  progress: LessonProgress | null
}

export interface LessonQuiz {
  id: string
  quiz_title: string
  instructions: string
  time_limit_minutes: number | null
  passing_score: number
  max_attempts: number | null
  total_questions: number
}

export interface Document {
  id: string
  name: string
  file_name: string
  mime_type: string
  size: number
  url: string
}
