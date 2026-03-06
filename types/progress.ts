export interface LessonProgress {
  id: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress_percentage: number
  time_spent_minutes: number
  video_last_position: number | null
  scroll_position: number | null
  first_accessed: string | null
  last_accessed: string | null
  completed_at: string | null
}

export interface LessonProgressSummary {
  status: 'not_started' | 'in_progress' | 'completed'
  progress_percentage: number
  completed_at: string | null
}
