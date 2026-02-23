# BoomLearning-Website Implementation Guide

> Implementation guide for the Boom Learning public-facing website using **Nuxt.js 3**, **TypeScript**, and **shadcn-vue**.

---

## Overview

The BoomLearning-Website is a separate frontend project that consumes the BoomlearningSystem REST API (`/api`). It serves as the public-facing student website — course browsing, enrollment, learning, payments, certificates, and profile management.

### Architecture

```
┌─────────────────────┐     ┌──────────────────────────┐
│  BoomlearningSystem  │     │  BoomLearning-Website    │
│  (Laravel Backend)   │◄────│  (Nuxt 3 + TypeScript)   │
│                      │     │                          │
│  • REST API /api     │     │  • SSR/ISR/CSR pages     │
│  • Sanctum Auth      │     │  • shadcn-vue UI         │
│  • Media Storage     │     │  • Pinia state           │
│  • Admin Dashboard   │     │  • Student-facing        │
└──────────────────────┘     └──────────────────────────┘
```

---

## Tech Stack

| Component        | Technology                    |
|------------------|-------------------------------|
| Framework        | Nuxt.js 3                     |
| Language         | TypeScript                    |
| UI Components    | shadcn-vue (reka-ui based)    |
| Styling          | Tailwind CSS 4                |
| Icons            | Lucide Vue Next               |
| State Management | Pinia                         |
| HTTP Client      | `$fetch` via `useApi` composable |
| Auth             | Sanctum token (Bearer) with manual localStorage persistence |
| Charts           | Chart.js + vue-chartjs        |

---

## Project Setup

### 1. Initialize Project

```bash
npx nuxi@latest init BoomLearning-Website
cd BoomLearning-Website
```

### 2. Install Dependencies

```bash
# Core
npm install pinia @pinia/nuxt
npm install lucide-vue-next
npm install chart.js vue-chartjs
npm install @vueuse/core

# shadcn-vue (follow Nuxt setup)
npx shadcn-vue@latest init

# Tailwind CSS 4
npm install tailwindcss @tailwindcss/vite
```

### 3. Configure `nuxt.config.ts`

```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],

  components: [
    {
      path: '~/components',
      extensions: ['.vue'],
    },
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api',
      storageBase: process.env.NUXT_PUBLIC_STORAGE_BASE || 'http://localhost:8000/storage',
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  routeRules: {
    // Public pages — prerender or ISR
    '/': { prerender: true },
    '/courses': { isr: 60 },
    '/courses/**': { isr: 60 },
    '/categories': { isr: 60 },
    '/categories/**': { isr: 60 },
    '/certificates/verify/**': { ssr: true },

    // Auth-required pages — CSR only (no SSR)
    '/dashboard/**': { ssr: false },
    '/profile/**': { ssr: false },
    '/enrollments/**': { ssr: false },
    '/lessons/**': { ssr: false },
    '/quizzes/**': { ssr: false },
    '/payments/**': { ssr: false },
    '/certificates': { ssr: false },
  },

  compatibilityDate: '2025-01-01',
})
```

### 4. Environment Variables

```env
# .env
NUXT_PUBLIC_API_BASE=http://eduplex.test:8001/api
NUXT_PUBLIC_STORAGE_BASE=http://eduplex.test:8001/storage
```

---

## Brand Colors

```css
/* assets/css/main.css */
@import "tailwindcss";

@theme {
  --color-primary-50: #e8f4f8;
  --color-primary-100: #c8e2ed;
  --color-primary-200: #a3cde0;
  --color-primary-300: #7ab5d1;
  --color-primary-400: #4e9abf;
  --color-primary-500: #2980ad;
  --color-primary-600: #1b6b93;
  --color-primary-700: #155a7c;
  --color-primary-800: #104963;
  --color-primary-900: #0b374b;
  --color-primary-950: #062533;

  --color-accent-50: #fff7eb;
  --color-accent-100: #feecd0;
  --color-accent-200: #fdd6a0;
  --color-accent-300: #fbbe6b;
  --color-accent-400: #f9a63b;
  --color-accent-500: #f08c1f;
  --color-accent-600: #d47413;
  --color-accent-700: #b05c10;
  --color-accent-800: #8c4a12;
  --color-accent-900: #6b3a13;
  --color-accent-950: #3d1e07;
}
```

---

## Project Structure

```
BoomLearning-Website/
├── assets/
│   └── css/
│       └── main.css              # Tailwind v4 + brand colors
├── components/
│   ├── ui/                       # shadcn-vue components
│   │   ├── alert/
│   │   ├── avatar/
│   │   ├── badge/
│   │   ├── button/
│   │   ├── card/
│   │   ├── dialog/
│   │   ├── dropdown-menu/
│   │   ├── input/
│   │   ├── label/
│   │   ├── select/
│   │   ├── separator/
│   │   ├── sheet/
│   │   ├── skeleton/
│   │   ├── tabs/
│   │   └── textarea/
│   ├── layout/
│   │   ├── Navbar.vue            # Sticky nav with search, auth, mobile menu
│   │   ├── Footer.vue            # Site footer with links
│   │   └── BottomNav.vue         # Mobile bottom navigation
│   ├── course/
│   │   ├── CourseCard.vue        # Course card with thumbnail, level, rating, price
│   │   ├── CourseGrid.vue        # Grid of CourseCards with skeleton & empty state
│   │   ├── CourseFilters.vue     # Search + level/category/sort filters, mobile Sheet
│   │   ├── CourseModules.vue     # Collapsible accordion of modules & lessons
│   │   └── CourseReviews.vue     # Paginated reviews list with rating summary
│   ├── category/
│   │   ├── CategoryCard.vue      # Category card with image/icon, name, count
│   │   └── CategoryChips.vue     # Horizontal scrollable filter chips
│   ├── learning/
│   │   ├── LessonViewer.vue      # Lesson container (video + text + documents)
│   │   ├── VideoPlayer.vue       # Video player with poster support
│   │   ├── TextContent.vue       # HTML content renderer with prose styling
│   │   ├── QuizPlayer.vue        # Full quiz UI with timer, navigation, submit
│   │   └── ProgressBar.vue       # Reusable progress bar (sm/md/lg)
│   ├── dashboard/
│   │   ├── StatsCards.vue        # Dashboard stat cards with skeleton loading
│   │   ├── ContinueLearning.vue  # In-progress enrollments with progress bars
│   │   └── RecentActivity.vue    # Activity feed with type-based icons
│   ├── certificate/
│   │   └── CertificateViewer.vue # Decorative certificate display card
│   └── review/
│       ├── StarRating.vue        # Star rating display (sm/md/lg, optional value)
│       ├── ReviewCard.vue        # Review with avatar, stars, recommend badge
│       └── RatingSummary.vue     # Average rating + star breakdown bars
├── composables/
│   └── useApi.ts                 # API wrapper using $fetch.create with Bearer token
├── layouts/
│   ├── default.vue               # Navbar + Footer + BottomNav
│   ├── auth.vue                  # Centered card layout for login/register
│   └── learning.vue              # Minimal white layout for lessons/quizzes
├── middleware/
│   ├── auth.ts                   # Redirect to /login if not authenticated
│   └── guest.ts                  # Redirect to / if already authenticated
├── pages/
│   ├── index.vue                 # Home (guest: slides/hero + auth: dashboard)
│   ├── login.vue                 # Login page
│   ├── register.vue              # Registration page
│   ├── forgot-password.vue       # Forgot password
│   ├── reset-password.vue        # Reset password
│   ├── search.vue                # Global search with filters
│   ├── courses/
│   │   ├── index.vue             # Course catalog with filters & pagination
│   │   └── [id].vue              # Course detail with modules, reviews, enrollment
│   ├── categories/
│   │   ├── index.vue             # All categories grid
│   │   └── [id].vue              # Category hero + paginated courses
│   ├── enrollments/
│   │   ├── index.vue             # My Learning list (auth)
│   │   └── [id].vue              # Enrollment detail with module progress (auth)
│   ├── lessons/
│   │   └── [id].vue              # Lesson viewer with mark-complete (auth)
│   ├── quizzes/
│   │   ├── [id].vue              # Quiz info / start page (auth)
│   │   └── [id]/
│   │       ├── take.vue          # Active quiz taking (auth)
│   │       └── results/
│   │           └── [attemptId].vue  # Quiz results (auth)
│   ├── certificates/
│   │   ├── index.vue             # My certificates (auth)
│   │   ├── [id].vue              # Certificate detail (auth)
│   │   └── verify/
│   │       └── [code].vue        # Public certificate verification
│   ├── payments/
│   │   ├── index.vue             # Payment history (auth)
│   │   ├── [id].vue              # Payment detail (auth)
│   │   └── checkout.vue          # Payment checkout (auth)
│   ├── reviews/
│   │   └── index.vue             # My reviews (auth)
│   ├── notifications/
│   │   └── index.vue             # Notifications (auth)
│   ├── profile/
│   │   ├── index.vue             # Profile view (auth)
│   │   ├── edit.vue              # Edit profile (auth)
│   │   └── change-password.vue   # Change password (auth)
│   └── activity/
│       └── index.vue             # Activity log (auth)
├── plugins/
│   └── auth.client.ts            # Initialize auth store from localStorage on mount
├── stores/
│   ├── auth.ts                   # Auth store (manual localStorage persistence)
│   └── notifications.ts          # Notification store
├── types/
│   ├── api.ts                    # ApiResponse, PaginatedResponse, ApiError
│   ├── course.ts                 # Course, Module, Lesson, LessonProgress, Document
│   ├── category.ts               # Category
│   ├── user.ts                   # User, LoginRequest, RegisterRequest, AuthResponse
│   ├── enrollment.ts             # Enrollment
│   ├── quiz.ts                   # Quiz, Question, QuizOption, QuizAttempt
│   ├── payment.ts                # Payment
│   ├── certificate.ts            # Certificate
│   ├── notification.ts           # Notification
│   ├── review.ts                 # Review
│   └── slide.ts                  # Slide
├── utils/
│   ├── formatters.ts             # resolveImageUrl, formatCurrency, formatDate, etc.
│   └── validators.ts             # Validation helpers + parseApiErrors
├── lib/
│   └── utils.ts                  # cn() classname merger for Tailwind
├── nuxt.config.ts
├── components.json               # shadcn-vue configuration
├── package.json
└── tsconfig.json
```

---

## API Integration

### API Client Composable

```typescript
// composables/useApi.ts
import type { ApiResponse, PaginatedResponse } from '~/types/api'

export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase as string,
    onRequest({ options }) {
      const headers = options.headers = new Headers(options.headers)
      headers.set('Accept', 'application/json')
      if (authStore.token) {
        headers.set('Authorization', `Bearer ${authStore.token}`)
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        authStore.clearAuth()
        navigateTo('/login')
      }
    }
  })

  return { apiFetch }
}
```

### API Response Types

```typescript
// types/api.ts
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    current_page: number
    per_page: number
    total: number
    total_pages: number
  }
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string | string[]>
}
```

### Error Parsing

`$fetch` errors store response data at `error.response._data`, not `error.data`:

```typescript
// utils/validators.ts
export function parseApiErrors(error: any): Record<string, string> {
  const errors: Record<string, string> = {}
  const data = error?.response?._data ?? error?.data

  if (data?.errors) {
    for (const [key, value] of Object.entries(data.errors)) {
      errors[key] = Array.isArray(value) ? value[0] : (value as string)
    }
  } else if (data?.message) {
    errors.general = data.message
  } else {
    errors.general = 'An unexpected error occurred. Please try again.'
  }

  return errors
}
```

---

## API Endpoints Reference

All endpoints consumed by the website. Base URL: `/api`

### Public Endpoints (No Auth Required)

| Method | Endpoint                           | Description                |
|--------|------------------------------------|----------------------------|
| POST   | `/auth/register`                   | Register student           |
| POST   | `/auth/login`                      | Login                      |
| POST   | `/auth/forgot-password`            | Forgot password            |
| POST   | `/auth/reset-password`             | Reset password             |
| GET    | `/categories`                      | List categories            |
| GET    | `/categories/{id}`                 | Category detail            |
| GET    | `/categories/{id}/courses`         | Category courses           |
| GET    | `/courses`                         | List/search courses        |
| GET    | `/courses/{id}`                    | Course detail              |
| GET    | `/courses/{id}/reviews`            | Course reviews             |
| GET    | `/slides`                          | Homepage slides            |
| GET    | `/certificates/verify/{code}`      | Verify certificate         |
| GET    | `/data/categories`                 | Categories for dropdowns   |
| GET    | `/data/courses`                    | Courses for dropdowns      |
| GET    | `/data/course-filters`             | Available filter options   |

### Protected Endpoints (Auth Required — Bearer Token)

| Method | Endpoint                                | Description              |
|--------|-----------------------------------------|--------------------------|
| GET    | `/auth/profile`                         | Get profile              |
| PUT    | `/auth/profile`                         | Update profile           |
| PUT    | `/auth/change-password`                 | Change password          |
| POST   | `/auth/logout`                          | Logout                   |
| GET    | `/courses/{id}/lessons`                 | Course lessons (enrolled)|
| POST   | `/courses/{id}/reviews`                 | Add review               |
| GET    | `/enrollments`                          | My enrollments           |
| POST   | `/enrollments`                          | Enroll in course         |
| GET    | `/enrollments/{id}`                     | Enrollment detail        |
| DELETE | `/enrollments/{id}`                     | Drop enrollment          |
| GET    | `/lessons/{id}`                         | Lesson detail            |
| POST   | `/lessons/{id}/progress`                | Update progress          |
| GET    | `/lessons/{id}/progress`                | Get progress             |
| GET    | `/quizzes/{id}`                         | Quiz detail + questions  |
| POST   | `/quizzes/{id}/attempts`                | Start quiz attempt       |
| GET    | `/quizzes/{id}/attempts`                | Quiz attempt history     |
| PUT    | `/quizzes/attempts/{id}`                | Submit quiz              |
| GET    | `/quizzes/attempts/{id}`                | Attempt detail           |
| GET    | `/payments`                             | Payment history          |
| POST   | `/payments`                             | Process payment          |
| GET    | `/payments/{id}`                        | Payment detail           |
| GET    | `/certificates`                         | My certificates          |
| GET    | `/certificates/{id}`                    | Certificate detail       |
| GET    | `/certificates/{id}/download`           | Download PDF             |
| GET    | `/notifications`                        | List notifications       |
| PUT    | `/notifications/{id}/read`              | Mark as read             |
| PUT    | `/notifications/read-all`               | Mark all as read         |
| DELETE | `/notifications/{id}`                   | Delete notification      |
| GET    | `/reviews`                              | My reviews               |
| GET    | `/reviews/{id}`                         | Review detail            |
| PUT    | `/reviews/{id}`                         | Update review            |
| DELETE | `/reviews/{id}`                         | Delete review            |
| GET    | `/dashboard/stats`                      | Dashboard stats          |
| GET    | `/dashboard/recent-activity`            | Recent activity          |
| GET    | `/dashboard/activity-log`               | Activity log             |
| GET    | `/dashboard/continue-learning`          | Continue learning        |
| GET    | `/progress`                             | All lesson progress      |
| GET    | `/progress/completed`                   | Completed lessons        |
| GET    | `/progress/courses/{courseId}`           | Course progress          |
| GET    | `/videos/lessons/{id}/stream`           | Stream lesson video      |

### Query Parameters

```
# Filtering
?filter[level]=beginner&filter[is_featured]=true&filter[search]=python

# Sorting
?sort=price              # Ascending
?sort=-price             # Descending
?sort=course_name,-created_at  # Multiple

# Pagination
?per_page=20&page=2
```

---

## Authentication Flow

### Auth Store

Uses manual localStorage persistence (no plugin required):

```typescript
// stores/auth.ts
import { defineStore } from 'pinia'
import type { User, LoginRequest, AuthResponse } from '~/types/user'
import type { ApiResponse } from '~/types/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    fullName: (state) => state.user?.full_name ?? '',
    avatarUrl: (state) => state.user?.image_url ?? null,
  },

  actions: {
    init() {
      if (import.meta.client) {
        const saved = localStorage.getItem('auth')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            this.token = parsed.token ?? null
            this.user = parsed.user ?? null
          } catch {
            localStorage.removeItem('auth')
          }
        }
      }
    },

    save() {
      if (import.meta.client) {
        localStorage.setItem('auth', JSON.stringify({
          token: this.token,
          user: this.user,
        }))
      }
    },

    async login(credentials: LoginRequest) {
      const { apiFetch } = useApi()
      const res = await apiFetch<ApiResponse<AuthResponse>>('/auth/login', {
        method: 'POST',
        body: credentials,
      })
      this.token = res.data.token
      this.user = res.data.user
      this.save()
    },

    async register(formData: FormData) { /* POST /auth/register */ },
    async fetchProfile() { /* GET /auth/profile */ },
    async logout() { /* POST /auth/logout, clearAuth, navigateTo('/') */ },

    clearAuth() {
      this.token = null
      this.user = null
      if (import.meta.client) {
        localStorage.removeItem('auth')
      }
    },
  },
})
```

### Auth Initialization Plugin

```typescript
// plugins/auth.client.ts
export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  auth.init()
})
```

### Auth Middleware

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
```

### Login Redirect Flow

```typescript
// pages/login.vue
const route = useRoute()

async function handleLogin() {
  await auth.login({ login: form.login, password: form.password })
  const redirect = route.query.redirect as string | undefined
  navigateTo(redirect || '/')
}
```

---

## TypeScript Types

```typescript
// types/user.ts
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

// types/course.ts
export interface Course {
  id: number
  course_name: string
  course_code: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration_hours: number
  price: string
  instructor_name: string
  is_featured: boolean
  thumbnail: string | null
  enrollment_limit: number | null
  category: Category
  enrollments_count: number
  reviews_count: number
  average_rating: number
  is_enrolled: boolean
  enrollment: Enrollment | null
  modules?: Module[]
  total_lessons?: number
}

export interface Module {
  id: number
  module_title: string
  module_order: number
  description: string
  lessons_count: number
  lessons?: Lesson[]
}

export interface Lesson {
  id: number
  lesson_title: string
  lesson_type: 'video' | 'text' | 'quiz'
  lesson_order: number
  description: string
  content: string
  video_url: string | null
  video_duration: number | null
  thumbnail: string | null
  duration_minutes: number
  is_mandatory: boolean
  documents: Document[]
  module: Module
  quiz: Quiz | null
  progress: LessonProgress | null
}

export interface LessonProgress {
  id: number
  status: string
  time_spent_minutes: number
  completed_at: string | null
}

export interface Document {
  id: number
  name: string
  url: string
  mime_type: string
  size: number
}

// types/category.ts
export interface Category {
  id: number
  category_name: string
  description: string | null
  icon: string | null
  image: string | null
  courses_count: number
}

// types/enrollment.ts
export interface Enrollment {
  id: number
  enrollment_date: string
  status: 'active' | 'completed' | 'dropped' | 'expired'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  progress_percentage: number
  course: Course
}

// types/quiz.ts
export interface Quiz {
  id: number
  quiz_title: string
  instructions: string
  time_limit_minutes: number | null
  passing_score: number
  max_attempts: number | null
  show_correct_answers: boolean
  total_points: number
  total_questions: number
  attempts_used: number
  can_attempt: boolean
  questions: Question[]
}

export interface Question {
  id: number
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'text'
  points: number
  image_url: string | null
  options: QuizOption[]
}

export interface QuizOption {
  id: number
  option_text: string
}

export interface QuizAttempt {
  id: number
  score: number
  total_points: number
  percentage: number
  passed: boolean
  started_at: string
  completed_at: string | null
  time_spent_minutes: number
}

// types/certificate.ts
export interface Certificate {
  id: number
  certificate_code: string
  issue_date: string
  student_name: string
  course_name: string
  course_code: string
  instructor_name: string
  certificate_url: string | null
}

// types/payment.ts
export interface Payment {
  id: number
  transaction_id: string
  amount: string
  payment_method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_date: string
  course: Course
}

// types/notification.ts
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

// types/review.ts
export interface Review {
  id: number
  rating: number
  review_text: string | null
  would_recommend: boolean
  student: { full_name: string; profile_picture: string | null }
  course?: { id: number; course_name: string }
  created_at: string
}

// types/slide.ts
export interface Slide {
  id: number
  title: string
  description: string | null
  image: string
  link: string | null
  order: number
  is_active: boolean
}
```

---

## Page Implementation Guide

### Pages with Guest Access (Public)

| Page                        | Route                        | API Endpoint(s)                      |
|-----------------------------|------------------------------|--------------------------------------|
| Home (guest mode)           | `/`                          | `/slides`, `/categories`, `/courses?filter[is_featured]=true` |
| Home (auth mode)            | `/`                          | Above + `/dashboard/stats`, `/dashboard/continue-learning`, `/dashboard/recent-activity` |
| Course Catalog              | `/courses`                   | `/courses`, `/data/categories`       |
| Course Detail               | `/courses/[id]`              | `/courses/{id}`, `/courses/{id}/reviews` |
| Category List               | `/categories`                | `/categories`                        |
| Category Courses            | `/categories/[id]`           | `/categories/{id}`, `/categories/{id}/courses` |
| Certificate Verification    | `/certificates/verify/[code]`| `/certificates/verify/{code}`        |
| Search                      | `/search`                    | `/courses`, `/data/categories`       |

### Pages Requiring Auth (use `middleware: 'auth'`)

| Page                        | Route                              | Layout     | API Endpoint(s)                      |
|-----------------------------|------------------------------------|------------|--------------------------------------|
| My Learning                 | `/enrollments`                     | default    | `/enrollments`                       |
| Enrollment Detail           | `/enrollments/[id]`                | default    | `/enrollments/{id}`                  |
| Lesson Viewer               | `/lessons/[id]`                    | learning   | `/lessons/{id}`, `/lessons/{id}/progress` |
| Quiz Info                   | `/quizzes/[id]`                    | learning   | `/quizzes/{id}`, `/quizzes/{id}/attempts` |
| Quiz Taking                 | `/quizzes/[id]/take`               | learning   | `/quizzes/{id}`, `/quizzes/{id}/attempts` |
| Quiz Results                | `/quizzes/[id]/results/[attemptId]`| learning   | `/quizzes/attempts/{id}`             |
| My Certificates             | `/certificates`                    | default    | `/certificates`                      |
| Certificate Detail          | `/certificates/[id]`               | default    | `/certificates/{id}`                 |
| Payment History             | `/payments`                        | default    | `/payments`                          |
| Payment Detail              | `/payments/[id]`                   | default    | `/payments/{id}`                     |
| Checkout                    | `/payments/checkout`               | default    | `/payments` (POST)                   |
| My Reviews                  | `/reviews`                         | default    | `/reviews`                           |
| Notifications               | `/notifications`                   | default    | `/notifications`                     |
| Profile                     | `/profile`                         | default    | `/auth/profile`                      |
| Edit Profile                | `/profile/edit`                    | default    | `/auth/profile` (PUT)                |
| Change Password             | `/profile/change-password`         | default    | `/auth/change-password`              |
| Activity Log                | `/activity`                        | default    | `/dashboard/activity-log`            |

---

## CORS Configuration (Backend)

The Laravel backend needs to allow cross-origin requests from the website. Update `config/cors.php`:

```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
    ],
    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
```

Add to `.env`:

```env
FRONTEND_URL=http://localhost:3000
```

---

## Implementation Order

### Phase 1: Foundation (Complete)
1. Project setup (Nuxt 3, TypeScript, shadcn-vue, Tailwind)
2. Brand colors and base theme
3. API client composable (`useApi`)
4. Auth store with localStorage persistence and middleware
5. Default layout (Navbar, Footer, BottomNav)
6. Login, Register, Forgot/Reset Password pages
7. Auth client plugin for state restoration

### Phase 2: Public Pages (Complete)
8. Reusable components (StarRating, CourseCard, CourseGrid, CategoryCard, CategoryChips)
9. Home page (guest mode: slides carousel, categories, featured courses)
10. Course catalog with search, filters, sorting, pagination
11. Course detail page (modules accordion, reviews tabs, enrollment card)
12. Category browsing (grid + detail with paginated courses)
13. Search page (reads `?q=` from navbar)
14. Certificate verification (public)

### Phase 3: Student Dashboard (Complete)
15. Dashboard components (StatsCards, ContinueLearning, RecentActivity)
16. Home page (authenticated mode with dashboard)
17. My Learning / Enrollments list with status filters
18. Enrollment detail with module progress and lesson navigation
19. Lesson viewer (video + text + documents + mark complete)
20. Quiz system (info page, quiz taking with timer, results)
21. Learning components (VideoPlayer, TextContent, QuizPlayer, ProgressBar, LessonViewer)

### Phase 4: Transactions & Certificates (Pending)
22. Enrollment flow (enroll confirmation, payment checkout)
23. Payment history and detail
24. My Certificates list and detail
25. Certificate download (PDF)

### Phase 5: Social & Profile (Pending)
26. Course reviews (write review from course detail)
27. My Reviews management
28. Notifications page
29. Profile view, edit, change password
30. Activity log

### Phase 6: Polish (Pending)
31. Error states (404, 401, 403, 500, network error)
32. Loading skeletons across all pages
33. SEO meta tags (course pages, categories)
34. Responsive design refinements

---

## Key Patterns

### Data Fetching (SSR-compatible)

Use `useAsyncData` + `apiFetch` for all page-level data:

```typescript
const { apiFetch } = useApi()

const { data, status, error } = await useAsyncData('key', () =>
  apiFetch<ApiResponse<Course[]>>('/courses', { params: { page: 1 } })
)
```

### Auth Guard on Action (Login-on-Action)

For actions like "Enroll Now" on a public course page when the user is not logged in:

```typescript
function handleEnroll() {
  if (!auth.isAuthenticated) {
    navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }
  // proceed with enrollment
}
```

### Image URLs

Media URLs from the API may be relative. Use `resolveImageUrl()`:

```typescript
// utils/formatters.ts
export function resolveImageUrl(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith('http')) return url
  const config = useRuntimeConfig()
  return `${config.public.storageBase}/${url}`
}
```

### Component Auto-Import

Nuxt auto-imports components using directory-based prefixes. For example:
- `components/course/CourseCard.vue` → `<CourseCard />`
- `components/review/StarRating.vue` → `<ReviewStarRating />`
- `components/dashboard/StatsCards.vue` → `<DashboardStatsCards />`
- `components/ui/card/Card.vue` → `<Card />`

### Class Utilities

Use `cn()` from `lib/utils.ts` for merging Tailwind classes:

```typescript
import { cn } from '@/lib/utils'
cn('px-4 py-2', isActive && 'bg-primary-500 text-white')
```

---

## Screen Reference

Refer to `Docs/stitch_ui.md` for detailed UI/UX design prompts for every screen. The website pages follow the same design language, adapted from mobile to web layout (responsive, desktop-first with mobile support).

Total pages: **~30 pages** across public browsing, authentication, student dashboard, learning, and profile management.
