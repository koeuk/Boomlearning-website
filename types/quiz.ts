export interface Quiz {
  id: number
  quiz_title: string
  instructions: string
  time_limit_minutes: number | null
  passing_score: number
  max_attempts: number | null
  show_correct_answers: boolean
  total_points: number
  total_questions: number
  attempts_used: number
  can_attempt: boolean
  questions: Question[]
}

export interface Question {
  id: number
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'text'
  points: number
  image_url: string | null
  options: QuizOption[]
}

export interface QuizOption {
  id: number
  option_text: string
}

export interface QuizAttempt {
  id: number
  score: number
  total_points: number
  percentage: number
  passed: boolean
  started_at: string
  completed_at: string | null
  time_spent_minutes: number
}
