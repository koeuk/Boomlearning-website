export interface Slide {
  id: string
  title: string
  subtitle: string | null
  button_text: string | null
  button_url: string | null
  image_url: string | null
  order: number
}
