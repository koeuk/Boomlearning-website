import type { Course } from './course'

export interface Enrollment {
  id: number
  enrollment_date: string
  status: 'active' | 'completed' | 'dropped' | 'expired'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  progress_percentage: number
  course: Course
}
