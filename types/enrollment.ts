import type { Course } from './course'

export interface Enrollment {
  id: string
  enrollment_date: string
  completion_date: string | null
  status: 'active' | 'completed' | 'dropped' | 'expired'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  progress_percentage: number
  certificate_issued: boolean
  last_accessed: string | null
  course: Course
}
