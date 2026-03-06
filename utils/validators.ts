export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isMinLength(value: string, min: number): boolean {
  return value.length >= min
}

export function isMaxLength(value: string, max: number): boolean {
  return value.length <= max
}

export function isRequired(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0
}

export function isPasswordStrong(password: string): boolean {
  return password.length >= 8
}

export function passwordsMatch(password: string, confirmation: string): boolean {
  return password === confirmation
}

export function isValidPhone(phone: string): boolean {
  return /^[+]?[\d\s()-]{7,15}$/.test(phone)
}

export function parseApiErrors(error: any): Record<string, string> {
  const errors: Record<string, string> = {}

  // $fetch errors store response data in error.response._data
  const data = error?.response?._data ?? error?.data

  if (data?.errors) {
    const apiErrors = data.errors
    for (const [key, value] of Object.entries(apiErrors)) {
      errors[key] = Array.isArray(value) ? value[0] : (value as string)
    }
  } else if (data?.message) {
    errors.general = data.message
  } else {
    errors.general = 'An unexpected error occurred. Please try again.'
  }

  return errors
}
