export interface Quiz {
  id: string
  quiz_title: string
  instructions: string
  time_limit_minutes: number | null
  passing_score: number
  max_attempts: number | null
  show_correct_answers: boolean
  randomize_questions: boolean
  total_points: number
  total_questions: number
  attempts_used: number
  can_attempt: boolean
  questions: Question[]
}

export interface Question {
  id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'text'
  points: number
  question_order: number
  image_url: string | null
  options: QuizOption[]
}

export interface QuizOption {
  id: string
  option_text: string
  option_order: number
}

export interface QuizAttempt {
  id: string
  attempt_number: number
  score_percentage: number | null
  total_points: number | null
  max_points: number | null
  passed: boolean | null
  started_at: string
  submitted_at: string | null
  time_taken_minutes: number | null
}
