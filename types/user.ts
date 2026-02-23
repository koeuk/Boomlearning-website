export interface User {
  id: number
  username: string
  email: string
  full_name: string
  phone: string | null
  date_of_birth: string | null
  gender: string | null
  address: string | null
  image_url: string | null
  user_type: string
  status: string
  created_at: string
  updated_at?: string
}

export interface LoginRequest {
  login: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  password_confirmation: string
  full_name: string
  phone?: string
  date_of_birth?: string
  gender?: string
  profile_picture?: File
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

export interface UpdateProfileRequest {
  full_name?: string
  phone?: string
  date_of_birth?: string
  gender?: string
  address?: string
  profile_picture?: File
}
