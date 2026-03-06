export interface Category {
  id: string
  category_name: string
  description: string | null
  icon: string | null
  image_url: string | null
  is_active: boolean
  courses_count: number
}
