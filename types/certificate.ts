export interface Certificate {
  id: string
  certificate_code: string
  issue_date: string
  student_name: string
  instructor_name: string
  verification_url: string
  download_url: string
  course: {
    id: string
    course_name: string
    course_code: string
    category: string | null
    thumbnail: string | null
  }
}
