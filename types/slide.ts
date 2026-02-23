export interface Slide {
  id: number
  title: string
  description: string | null
  image: string
  link: string | null
  order: number
  is_active: boolean
}
