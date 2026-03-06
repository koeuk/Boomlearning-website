# BoomLearning-Website Implementation Guide

> Implementation guide for building the Boom Learning public-facing website using **Nuxt.js 3**, **TypeScript**, and **shadcn-vue**.

---

## Overview

The BoomLearning-Website is a separate frontend project that consumes the BoomlearningSystem REST API (`/api`). It serves as the public-facing student website — course browsing, enrollment, learning, payments, certificates, and profile management.

### Architecture

```
┌─────────────────────┐     ┌──────────────────────────┐
│  BoomlearningSystem      │     │  BoomLearning-Website         │
│  (Laravel Backend)  │◄────│  (Nuxt 3 + TypeScript)   │
│                     │     │                          │
│  • REST API /api    │     │  • SSR/SSG pages         │
│  • Sanctum Auth     │     │  • shadcn-vue UI         │
│  • Media Storage    │     │  • Pinia state           │
│  • Admin Dashboard  │     │  • Student-facing        │
└─────────────────────┘     └──────────────────────────┘
```

---

## Tech Stack

| Component        | Technology                    |
|------------------|-------------------------------|
| Framework        | Nuxt.js 3                     |
| Language         | TypeScript                    |
| UI Components    | shadcn-vue                    |
| Styling          | Tailwind CSS 4                |
| Icons            | Lucide Vue Next               |
| State Management | Pinia                         |
| HTTP Client      | `$fetch` / `useFetch` (Nuxt)  |
| Auth             | Sanctum token (Bearer)        |
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

# shadcn-vue (follow Nuxt setup)
npx shadcn-vue@latest init

# Tailwind CSS 4
npm install tailwindcss @tailwindcss/vite
```

### 3. Configure `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://eduplex.test:8001/api',
      storageBase: process.env.NUXT_PUBLIC_STORAGE_BASE || 'http://eduplex.test:8001/storage',
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  routeRules: {
    // Public pages — SSG or ISR
    '/': { prerender: true },
    '/courses': { isr: 60 },
    '/courses/**': { isr: 60 },
    '/categories': { isr: 60 },
    '/categories/**': { isr: 60 },
    '/certificates/verify/**': { ssr: true },

    // Auth-required pages — CSR only
    '/dashboard/**': { ssr: false },
    '/profile/**': { ssr: false },
    '/enrollments/**': { ssr: false },
    '/payments/**': { ssr: false },
    '/certificates': { ssr: false },
  }
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

Apply the same brand colors from the BoomlearningSystem dashboard.

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
│       └── main.css
├── components/
│   ├── ui/                     # shadcn-vue components
│   │   ├── button/
│   │   ├── card/
│   │   ├── badge/
│   │   ├── input/
│   │   ├── dialog/
│   │   ├── skeleton/
│   │   ├── toast/
│   │   └── ...
│   ├── layout/
│   │   ├── Navbar.vue
│   │   ├── Footer.vue
│   │   ├── BottomNav.vue       # Mobile bottom navigation
│   │   └── SearchBar.vue
│   ├── course/
│   │   ├── CourseCard.vue
│   │   ├── CourseGrid.vue
│   │   ├── CourseFilters.vue
│   │   ├── CourseModules.vue
│   │   └── CourseReviews.vue
│   ├── category/
│   │   ├── CategoryCard.vue
│   │   └── CategoryChips.vue
│   ├── learning/
│   │   ├── LessonViewer.vue
│   │   ├── VideoPlayer.vue
│   │   ├── TextContent.vue
│   │   ├── QuizPlayer.vue
│   │   └── ProgressBar.vue
│   ├── dashboard/
│   │   ├── StatsCards.vue
│   │   ├── ContinueLearning.vue
│   │   └── RecentActivity.vue
│   ├── certificate/
│   │   ├── CertificateCard.vue
│   │   └── CertificateViewer.vue
│   └── review/
│       ├── ReviewCard.vue
│       ├── ReviewForm.vue
│       └── RatingSummary.vue
├── composables/
│   ├── useApi.ts               # API wrapper around $fetch
│   ├── useAuth.ts              # Auth state & guards
│   └── useTheme.ts             # Dark mode toggle
├── layouts/
│   ├── default.vue             # Navbar + Footer + BottomNav
│   ├── auth.vue                # Minimal layout for login/register
│   └── learning.vue            # Immersive layout (no nav) for lessons/quizzes
├── middleware/
│   ├── auth.ts                 # Redirect to /login if not authenticated
│   └── guest.ts                # Redirect to / if already authenticated
├── pages/
│   ├── index.vue               # Home / Dashboard (guest + auth modes)
│   ├── login.vue               # Login page
│   ├── register.vue            # Registration page
│   ├── forgot-password.vue     # Forgot password
│   ├── reset-password.vue      # Reset password
│   ├── courses/
│   │   ├── index.vue           # Course catalog (public)
│   │   └── [id].vue            # Course detail (public)
│   ├── categories/
│   │   ├── index.vue           # All categories (public)
│   │   └── [id].vue            # Category courses (public)
│   ├── enrollments/
│   │   ├── index.vue           # My Learning (auth)
│   │   └── [id].vue            # Enrollment detail (auth)
│   ├── lessons/
│   │   └── [id].vue            # Lesson viewer (auth)
│   ├── quizzes/
│   │   ├── [id].vue            # Quiz info / start (auth)
│   │   └── [id]/
│   │       ├── take.vue        # Active quiz taking (auth)
│   │       └── results/
│   │           └── [attemptId].vue  # Quiz results (auth)
│   ├── certificates/
│   │   ├── index.vue           # My certificates (auth)
│   │   ├── [id].vue            # Certificate detail (auth)
│   │   └── verify/
│   │       └── [code].vue      # Public verification (public)
│   ├── payments/
│   │   ├── index.vue           # Payment history (auth)
│   │   ├── [id].vue            # Payment detail (auth)
│   │   └── checkout.vue        # Payment checkout (auth)
│   ├── reviews/
│   │   └── index.vue           # My reviews (auth)
│   ├── notifications/
│   │   └── index.vue           # Notifications (auth)
│   ├── profile/
│   │   ├── index.vue           # Profile view (auth)
│   │   ├── edit.vue            # Edit profile (auth)
│   │   └── change-password.vue # Change password (auth)
│   ├── activity/
│   │   └── index.vue           # Activity log (auth)
│   └── search.vue              # Global search (public)
├── plugins/
│   └── api.ts                  # Global API plugin
├── stores/
│   ├── auth.ts                 # Auth store (user, token, login/logout)
│   ├── cart.ts                 # Enrollment/payment cart
│   └── notifications.ts       # Notification store
├── types/
│   ├── api.ts                  # API response types
│   ├── course.ts               # Course, Module, Lesson types
│   ├── user.ts                 # User, Student types
│   ├── enrollment.ts           # Enrollment types
│   ├── quiz.ts                 # Quiz, Question, Attempt types
│   ├── payment.ts              # Payment types
│   ├── certificate.ts          # Certificate types
│   ├── notification.ts         # Notification types
│   └── review.ts               # Review types
├── utils/
│   ├── formatters.ts           # Date, currency, duration formatters
│   └── validators.ts           # Form validation helpers
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

---

## API Integration

### API Client Composable

```typescript
// composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    headers: computed(() => ({
      'Accept': 'application/json',
      ...(auth.token ? { 'Authorization': `Bearer ${auth.token}` } : {}),
    })),
    onResponseError({ response }) {
      if (response.status === 401) {
        auth.logout()
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
```

---

## API Endpoints Reference

All endpoints consumed by the website. Base URL: `/api`

> **Note:** All `{uuid}` parameters are UUID strings (e.g. `026f8e16-b4c8-432a-a68b-7193c1162b93`). All `id` fields in API responses are UUIDs. The API uses UUID-based route model binding for all resources.

### Public Endpoints (No Auth Required)

| Method | Endpoint                              | Description                |
|--------|---------------------------------------|----------------------------|
| POST   | `/auth/register`                      | Register student           |
| POST   | `/auth/login`                         | Login                      |
| POST   | `/auth/forgot-password`               | Forgot password            |
| POST   | `/auth/reset-password`                | Reset password             |
| GET    | `/categories`                         | List categories            |
| GET    | `/categories/{uuid}`                  | Category detail            |
| GET    | `/categories/{uuid}/courses`          | Category courses           |
| GET    | `/courses`                            | List/search courses        |
| GET    | `/courses/{uuid}`                     | Course detail              |
| GET    | `/courses/{uuid}/reviews`             | Course reviews             |
| GET    | `/slides`                             | Homepage slides            |
| GET    | `/certificates/verify/{code}`         | Verify certificate         |
| GET    | `/data/categories`                    | Categories for dropdowns   |
| GET    | `/data/courses`                       | Courses for dropdowns      |
| GET    | `/data/course-filters`                | Available filter options   |

### Protected Endpoints (Auth Required — Bearer Token)

| Method | Endpoint                                   | Description              |
|--------|---------------------------------------------|--------------------------|
| GET    | `/auth/profile`                             | Get profile              |
| PUT    | `/auth/profile`                             | Update profile           |
| PUT    | `/auth/change-password`                     | Change password          |
| POST   | `/auth/logout`                              | Logout                   |
| GET    | `/courses/{uuid}/lessons`                   | Course lessons (enrolled) |
| POST   | `/courses/{uuid}/reviews`                   | Add review               |
| GET    | `/reviews`                                  | My reviews               |
| GET    | `/reviews/{uuid}`                           | Review detail            |
| POST   | `/reviews/courses/{uuid}`                   | Add review (alt)         |
| GET    | `/reviews/courses/{uuid}`                   | Reviews by course        |
| PUT    | `/reviews/{uuid}`                           | Update review            |
| DELETE | `/reviews/{uuid}`                           | Delete review            |
| GET    | `/enrollments`                              | My enrollments           |
| POST   | `/enrollments`                              | Enroll in course         |
| GET    | `/enrollments/{uuid}`                       | Enrollment detail        |
| DELETE | `/enrollments/{uuid}`                       | Drop enrollment          |
| GET    | `/lessons/{uuid}`                           | Lesson detail            |
| POST   | `/lessons/{uuid}/progress`                  | Update progress          |
| GET    | `/lessons/{uuid}/progress`                  | Get progress             |
| GET    | `/quizzes/{uuid}`                           | Quiz detail + questions  |
| POST   | `/quizzes/{uuid}/attempts`                  | Start quiz attempt       |
| GET    | `/quizzes/{uuid}/attempts`                  | Quiz attempt history     |
| PUT    | `/quizzes/attempts/{uuid}`                  | Submit quiz              |
| GET    | `/quizzes/attempts/{uuid}`                  | Attempt detail           |
| GET    | `/payments`                                 | Payment history          |
| POST   | `/payments`                                 | Process payment          |
| GET    | `/payments/{uuid}`                          | Payment detail           |
| GET    | `/certificates`                             | My certificates          |
| GET    | `/certificates/{uuid}`                      | Certificate detail       |
| GET    | `/certificates/{uuid}/download`             | Download PDF             |
| GET    | `/notifications`                            | List notifications       |
| PUT    | `/notifications/{uuid}/read`                | Mark as read             |
| PUT    | `/notifications/read-all`                   | Mark all as read         |
| DELETE | `/notifications/{uuid}`                     | Delete notification      |
| GET    | `/dashboard/stats`                          | Dashboard stats          |
| GET    | `/dashboard/recent-activity`                | Recent activity          |
| GET    | `/dashboard/activity-log`                   | Activity log             |
| GET    | `/dashboard/continue-learning`              | Continue learning        |
| GET    | `/progress`                                 | All lesson progress      |
| GET    | `/progress/completed`                       | Completed lessons        |
| GET    | `/progress/courses/{courseId}`               | Course progress          |
| GET    | `/progress/lessons/{uuid}`                  | Lesson progress detail   |
| PUT    | `/progress/lessons/{uuid}`                  | Update lesson progress   |
| GET    | `/videos/config`                            | Video upload config      |
| GET    | `/videos/list`                              | List videos              |
| POST   | `/videos/upload`                            | Upload video             |
| POST   | `/videos/metadata`                          | Get video metadata       |
| DELETE | `/videos/delete`                            | Delete video             |
| POST   | `/videos/lessons/{uuid}/upload`             | Upload lesson video      |
| DELETE | `/videos/lessons/{uuid}`                    | Delete lesson video      |
| GET    | `/videos/lessons/{uuid}/stream`             | Stream lesson video      |

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

```typescript
// stores/auth.ts
import { defineStore } from 'pinia'
import type { User } from '~/types/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(email: string, password: string) {
      const { apiFetch } = useApi()
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      this.token = res.data.token
      this.user = res.data.user
    },

    async register(formData: FormData) {
      const { apiFetch } = useApi()
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: formData,
      })
      this.token = res.data.token
      this.user = res.data.user
    },

    async fetchProfile() {
      const { apiFetch } = useApi()
      const res = await apiFetch('/auth/profile')
      this.user = res.data
    },

    async logout() {
      const { apiFetch } = useApi()
      try { await apiFetch('/auth/logout', { method: 'POST' }) } catch {}
      this.token = null
      this.user = null
      navigateTo('/')
    },
  },

  persist: true, // requires @pinia-plugin-persistedstate/nuxt
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
const redirect = route.query.redirect as string | undefined

async function handleLogin() {
  await auth.login(form.email, form.password)
  navigateTo(redirect || '/')
}
```

---

## TypeScript Types

```typescript
// types/course.ts
export interface Course {
  id: string                    // UUID
  course_name: string
  course_code: string
  description: string
  image_url: string | null
  level: 'beginner' | 'intermediate' | 'advanced'
  duration_hours: number
  pricing_type: 'free' | 'paid'
  is_free: boolean
  price: string
  instructor_name: string
  is_featured: boolean
  enrollment_limit: number | null
  status: string
  category: Category | null
  lessons?: CourseLessonSummary[]
  total_lessons?: number
  enrollments_count: number
  reviews_count: number
  average_rating: number
  is_enrolled: boolean
  enrollment: Enrollment | null
  created_at: string
  updated_at: string
}

export interface CourseLessonSummary {
  id: string                    // UUID
  lesson_title: string
  lesson_type: 'video' | 'text' | 'quiz' | 'document'
  lesson_order: number
  description: string
  duration_minutes: number
  is_mandatory: boolean
}

export interface Category {
  id: string                    // UUID
  category_name: string
  description: string | null
  icon: string | null
  image_url: string | null
  is_active: boolean
  courses_count: number
}

export interface Lesson {
  id: string                    // UUID
  lesson_title: string
  lesson_type: 'video' | 'text' | 'quiz' | 'document'
  lesson_order: number
  description: string
  content: string | null
  image_url: string | null
  video_url: string | null
  video_duration: number | null
  formatted_duration: string | null
  thumbnail: string | null      // video thumbnail
  duration_minutes: number
  is_mandatory: boolean
  documents: Document[]
  quiz: LessonQuiz | null
  progress: LessonProgress | null
}

export interface LessonQuiz {
  id: string                    // UUID
  quiz_title: string
  instructions: string
  time_limit_minutes: number | null
  passing_score: number
  max_attempts: number | null
  total_questions: number
}

export interface Document {
  id: string                    // UUID (Spatie Media)
  name: string
  file_name: string
  mime_type: string
  size: number
  url: string
}

// types/user.ts
export interface User {
  id: string                    // UUID
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
  updated_at: string
}

// types/enrollment.ts
export interface Enrollment {
  id: string                    // UUID
  enrollment_date: string
  completion_date: string | null
  status: 'active' | 'completed' | 'dropped' | 'expired'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  progress_percentage: number
  certificate_issued: boolean
  last_accessed: string | null
  course: Course
}

// types/quiz.ts
export interface Quiz {
  id: string                    // UUID
  quiz_title: string
  instructions: string
  time_limit_minutes: number | null
  passing_score: number
  max_attempts: number | null
  show_correct_answers: boolean
  randomize_questions: boolean
  total_points: number
  total_questions: number
  attempts_used: number
  can_attempt: boolean
  questions: Question[]
}

export interface Question {
  id: string                    // UUID
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'text'
  points: number
  question_order: number
  image_url: string | null
  options: QuizOption[]
}

export interface QuizOption {
  id: string                    // UUID
  option_text: string
  option_order: number
}

export interface QuizAttempt {
  id: string                    // UUID
  attempt_number: number
  score_percentage: number | null
  total_points: number | null
  max_points: number | null
  passed: boolean | null
  started_at: string
  submitted_at: string | null
  time_taken_minutes: number | null
}

// types/certificate.ts
export interface Certificate {
  id: string                    // UUID
  certificate_code: string
  issue_date: string
  verification_url: string
  download_url: string
  course: {
    id: string                  // UUID
    course_name: string
    course_code: string
    category: string | null
    thumbnail: string | null
  }
}

// types/payment.ts
export interface Payment {
  id: string                    // UUID
  transaction_id: string
  amount: string
  payment_method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_date: string
  course: {
    id: string                  // UUID
    course_name: string
    course_code: string
    thumbnail: string | null
  }
}

// types/notification.ts
export interface Notification {
  id: string                    // UUID
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'enrollment' | 'completion' | 'reminder'
  related_id: number | null
  is_read: boolean
  created_at: string
}

// types/review.ts
export interface Review {
  id: string                    // UUID
  rating: number
  review_text: string | null
  would_recommend: boolean
  course: { id: string; course_name: string; image_url: string | null } | null
  user: { id: string; full_name: string; profile_picture: string | null }
  created_at: string
  updated_at: string
}

// types/progress.ts
export interface LessonProgress {
  id: string                    // UUID
  status: 'not_started' | 'in_progress' | 'completed'
  progress_percentage: number
  time_spent_minutes: number
  video_last_position: number | null
  scroll_position: number | null
  first_accessed: string | null
  last_accessed: string | null
  completed_at: string | null
}

// Compact progress (returned in course lessons list)
export interface LessonProgressSummary {
  status: 'not_started' | 'in_progress' | 'completed'
  progress_percentage: number
  completed_at: string | null
}

// types/slide.ts
export interface Slide {
  id: string                    // UUID
  title: string
  subtitle: string | null
  button_text: string | null
  button_url: string | null
  image_url: string | null
  order: number
}
```

---

## Page Implementation Guide

### Pages with Guest Access (Public)

| Page                        | Route                        | API Endpoint(s)                      |
|-----------------------------|------------------------------|--------------------------------------|
| Home                        | `/`                          | `/slides`, `/courses?featured`, `/dashboard/stats` (if auth) |
| Course Catalog              | `/courses`                   | `/courses`, `/data/course-filters`   |
| Course Detail               | `/courses/[id]`              | `/courses/{uuid}`, `/courses/{uuid}/reviews` |
| Category List               | `/categories`                | `/categories`                        |
| Category Courses            | `/categories/[id]`           | `/categories/{uuid}/courses`         |
| Certificate Verification    | `/certificates/verify/[code]`| `/certificates/verify/{code}`        |
| Search                      | `/search`                    | `/courses?filter[search]=...`        |

### Pages Requiring Auth (use `middleware: 'auth'`)

| Page                        | Route                        | API Endpoint(s)                      |
|-----------------------------|------------------------------|--------------------------------------|
| My Learning                 | `/enrollments`               | `/enrollments`                       |
| Enrollment Detail           | `/enrollments/[id]`          | `/enrollments/{uuid}`, `/courses/{uuid}/lessons` |
| Lesson Viewer               | `/lessons/[id]`              | `/lessons/{uuid}`, `/lessons/{uuid}/progress` |
| Quiz Info                   | `/quizzes/[id]`              | `/quizzes/{uuid}`, `/quizzes/{uuid}/attempts` |
| Quiz Taking                 | `/quizzes/[id]/take`         | `/quizzes/{uuid}` (questions)        |
| Quiz Results                | `/quizzes/[id]/results/[attemptId]` | `/quizzes/attempts/{uuid}`    |
| My Certificates             | `/certificates`              | `/certificates`                      |
| Certificate Detail          | `/certificates/[id]`         | `/certificates/{uuid}`               |
| Payment History             | `/payments`                  | `/payments`                          |
| Payment Detail              | `/payments/[id]`             | `/payments/{uuid}`                   |
| Checkout                    | `/payments/checkout`         | `/payments` (POST)                   |
| My Reviews                  | `/reviews`                   | `/reviews`                           |
| Notifications               | `/notifications`             | `/notifications`                     |
| Profile                     | `/profile`                   | `/auth/profile`                      |
| Edit Profile                | `/profile/edit`              | `/auth/profile` (PUT)                |
| Change Password             | `/profile/change-password`   | `/auth/change-password`              |
| Activity Log                | `/activity`                  | `/dashboard/activity-log`            |
| Dashboard Stats             | `/` (auth mode)              | `/dashboard/stats`, `/dashboard/continue-learning`, `/dashboard/recent-activity` |

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

### Phase 1: Foundation
1. Project setup (Nuxt 3, TypeScript, shadcn-vue, Tailwind)
2. Brand colors and base theme
3. API client composable (`useApi`)
4. Auth store and middleware
5. Default layout (Navbar, Footer)
6. Login and Register pages

### Phase 2: Public Pages
7. Home page (guest mode with slides, categories, featured courses)
8. Course catalog with search, filters, and sorting
9. Course detail page (public info, reviews, modules preview)
10. Category browsing
11. Search page
12. Certificate verification (public)

### Phase 3: Student Dashboard
13. Home page (authenticated mode with stats, continue learning, activity)
14. My Learning / Enrollments list
15. Enrollment detail with course modules and progress
16. Lesson viewer (video + text + documents)
17. Quiz system (info, taking, results)

### Phase 4: Transactions & Certificates
18. Enrollment flow (enroll confirmation, payment checkout)
19. Payment history and detail
20. My Certificates list and detail
21. Certificate download (PDF)

### Phase 5: Social & Profile
22. Course reviews (read public, write auth)
23. My Reviews management
24. Notifications
25. Profile view, edit, change password
26. Activity log

### Phase 6: Polish
27. Error states (404, 401, 403, 500, network error)
28. Loading skeletons
29. SEO meta tags (course pages, categories)
30. Responsive design refinements
31. Dark mode support

---

## Key Patterns

### Auth Guard on Action (Login-on-Action)

For actions like "Enroll Now" on a public course page when the user is not logged in:

```vue
<!-- pages/courses/[id].vue -->
<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()

function handleEnroll() {
  if (!auth.isAuthenticated) {
    navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }
  // proceed with enrollment
}
</script>
```

### Image URLs

Media URLs from the API may be relative. Prefix with the storage base:

```typescript
// utils/formatters.ts
export function resolveImageUrl(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith('http')) return url
  const config = useRuntimeConfig()
  return `${config.public.storageBase}/${url}`
}
```

### Pagination Composable

```typescript
// composables/usePagination.ts
export function usePagination<T>(endpoint: string, filters?: Ref<Record<string, any>>) {
  const items = ref<T[]>([])
  const page = ref(1)
  const hasMore = ref(true)
  const loading = ref(false)

  async function loadMore() {
    if (loading.value || !hasMore.value) return
    loading.value = true
    const { apiFetch } = useApi()
    const res = await apiFetch(endpoint, {
      params: { page: page.value, per_page: 20, ...filters?.value }
    })
    items.value.push(...res.data)
    hasMore.value = page.value < res.pagination.total_pages
    page.value++
    loading.value = false
  }

  return { items, loading, hasMore, loadMore }
}
```

---

## Screen Reference

Refer to `Docs/stitch_ui.md` for detailed UI/UX design prompts for every screen. The website pages should follow the same design language described there, adapted from mobile to web layout (responsive, desktop-first with mobile support).

Total estimated pages: **~30 pages** across public browsing, authentication, student dashboard, learning, and profile management.
