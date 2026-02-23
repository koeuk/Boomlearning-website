export interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'enrollment' | 'completion' | 'reminder'
  is_read: boolean
  related_id: number | null
  related_type: string | null
  created_at: string
}
