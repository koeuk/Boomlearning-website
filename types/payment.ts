export interface Payment {
  id: string
  transaction_id: string
  amount: string
  payment_method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_date: string
  course: {
    id: string
    course_name: string
    course_code: string
    thumbnail: string | null
  }
}
