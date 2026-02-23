export interface Review {
  id: number
  rating: number
  review_text: string | null
  would_recommend: boolean
  student: { full_name: string; profile_picture: string | null }
  course?: { id: number; course_name: string }
  created_at: string
}
