export interface Review {
  id: string
  rating: number
  review_text: string | null
  would_recommend: boolean
  course: { id: string; course_name: string; image_url: string | null } | null
  user: { id: string; full_name: string; profile_picture: string | null }
  created_at: string
  updated_at: string
}
