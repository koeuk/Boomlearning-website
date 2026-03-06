# Changes Summary

## 1. Script Setup Reorder
Moved `<script setup>` blocks below `<template>` in **114 Vue files** across the project.

## 2. Type Definitions — Aligned with Implementation Guide

All `id` fields changed from `number` to `string` (UUID) across all types.

### types/course.ts
- `id: number` → `id: string` (Course, Module, Lesson, Document)
- Added: `image_url`, `pricing_type`, `is_free`, `status`, `created_at`, `updated_at`, `lessons` (CourseLessonSummary[])
- Added: `CourseLessonSummary` interface
- Added: `LessonQuiz` interface (replaces raw Quiz ref on Lesson)
- Lesson: added `image_url`, `formatted_duration`, `file_name` on Document
- Lesson: `content` now `string | null`, `lesson_type` includes `'document'`
- Removed inline `LessonProgress` (moved to `types/progress.ts`)

### types/category.ts
- `id: number` → `id: string`
- `image` → `image_url`
- Added: `is_active`

### types/user.ts
- `id: number` → `id: string`
- `updated_at` now required (was optional)

### types/enrollment.ts
- `id: number` → `id: string`
- Added: `completion_date`, `certificate_issued`, `last_accessed`

### types/quiz.ts
- `id: number` → `id: string` (Quiz, Question, QuizOption, QuizAttempt)
- Added: `randomize_questions`, `question_order`, `option_order`
- QuizAttempt: renamed fields to match guide (`attempt_number`, `score_percentage`, `max_points`, `time_taken_minutes`)

### types/payment.ts
- `id: number` → `id: string`
- `course` changed from full `Course` to nested object `{ id, course_name, course_code, thumbnail }`

### types/certificate.ts
- `id: number` → `id: string`
- Added: `verification_url`, `download_url`
- Added: nested `course` object `{ id, course_name, course_code, category, thumbnail }`
- Kept: `student_name`, `instructor_name` (used in templates)

### types/review.ts
- `id: number` → `id: string`
- `student` → `user` (with `id` field added)
- `course` now includes `image_url`
- Added: `updated_at`

### types/notification.ts
- `id: number` → `id: string`
- Removed: `related_type` (not in guide)

### types/slide.ts
- `id: number` → `id: string`
- `description` → `subtitle`
- `image` → `image_url`
- `link` → `button_url`
- Added: `button_text`
- Removed: `is_active` (not in guide)

### types/progress.ts (NEW)
- `LessonProgress` with full fields: `progress_percentage`, `video_last_position`, `scroll_position`, `first_accessed`, `last_accessed`, `completed_at`
- `LessonProgressSummary` interface

## 3. Missing Files Created

### Composables
- `composables/useAuth.ts` — Auth helper with `requireAuth()`
- `composables/useTheme.ts` — Dark mode toggle
- `composables/usePagination.ts` — Generic pagination composable

### Stores
- `stores/cart.ts` — Enrollment/payment cart store

### Components
- `components/layout/SearchBar.vue` — Reusable search bar
- `components/certificate/CertificateCard.vue` — Certificate list card
- `components/review/ReviewForm.vue` — Review submission form

### Utils
- `utils/validators.ts` — Added `isMaxLength`, `isPasswordStrong`, `isValidPhone`

## 4. Component & Page Fixes

- `ReviewCard.vue`: `review.student` → `review.user`
- `CourseReviews.vue`: `courseId: number` → `courseId: string`
- `CategoryCard.vue`: `category.image` → `category.image_url`, hash-based index for UUID
- `CertificateViewer.vue`: `certificate.course_name` → `certificate.course.course_name`
- `pages/certificates/[id].vue`: Updated to use nested `certificate.course`
- `pages/index.vue`: `slide.image` → `slide.image_url`, `slide.description` → `slide.subtitle`, `slide.link` → `slide.button_url`
- `stores/notifications.ts`: `id: number` → `id: string` in method params
- All pages: Removed `Number(route.params.id)` → `route.params.id as string`
