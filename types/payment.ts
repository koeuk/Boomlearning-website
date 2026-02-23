import type { Course } from './course'

export interface Payment {
  id: number
  transaction_id: string
  amount: string
  payment_method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_date: string
  course: Course
}
