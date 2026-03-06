# Script Setup Reorder - Summary

Moved `<script setup>` blocks below `<template>` in **114 Vue files** across the project.

## Files Updated

### Pages (28 files)
- `pages/index.vue`
- `pages/login.vue`
- `pages/register.vue`
- `pages/forgot-password.vue`
- `pages/reset-password.vue`
- `pages/search.vue`
- `pages/courses/index.vue`
- `pages/courses/[id].vue`
- `pages/categories/index.vue`
- `pages/categories/[id].vue`
- `pages/enrollments/index.vue`
- `pages/enrollments/[id].vue`
- `pages/lessons/[id].vue`
- `pages/quizzes/[id].vue`
- `pages/quizzes/[id]/take.vue`
- `pages/quizzes/[id]/results/[attemptId].vue`
- `pages/certificates/index.vue`
- `pages/certificates/[id].vue`
- `pages/certificates/verify/[code].vue`
- `pages/payments/index.vue`
- `pages/payments/[uuid].vue`
- `pages/payments/checkout.vue`
- `pages/profile/index.vue`
- `pages/profile/edit.vue`
- `pages/profile/change-password.vue`
- `pages/reviews/index.vue`
- `pages/notifications/index.vue`
- `pages/activity/index.vue`

### Components - Layout (3 files)
- `components/layout/Navbar.vue`
- `components/layout/Footer.vue`
- `components/layout/BottomNav.vue`

### Components - Dashboard (3 files)
- `components/dashboard/RecentActivity.vue`
- `components/dashboard/ContinueLearning.vue`
- `components/dashboard/StatsCards.vue`

### Components - Learning (5 files)
- `components/learning/QuizPlayer.vue`
- `components/learning/LessonViewer.vue`
- `components/learning/ProgressBar.vue`
- `components/learning/VideoPlayer.vue`
- `components/learning/TextContent.vue`

### Components - Domain (10 files)
- `components/course/CourseCard.vue`
- `components/course/CourseGrid.vue`
- `components/course/CourseFilters.vue`
- `components/course/CourseModules.vue`
- `components/course/CourseReviews.vue`
- `components/category/CategoryChips.vue`
- `components/category/CategoryCard.vue`
- `components/review/StarRating.vue`
- `components/review/RatingSummary.vue`
- `components/review/ReviewCard.vue`

### Components - Certificate (1 file)
- `components/certificate/CertificateViewer.vue`

### Components - UI / shadcn-vue (64 files)
- `components/ui/alert/` (3 files)
- `components/ui/avatar/` (3 files)
- `components/ui/badge/` (1 file)
- `components/ui/button/` (1 file)
- `components/ui/card/` (6 files)
- `components/ui/dialog/` (9 files)
- `components/ui/dropdown-menu/` (14 files)
- `components/ui/input/` (1 file)
- `components/ui/label/` (1 file)
- `components/ui/select/` (11 files)
- `components/ui/separator/` (1 file)
- `components/ui/sheet/` (8 files)
- `components/ui/skeleton/` (1 file)
- `components/ui/tabs/` (4 files)
- `components/ui/textarea/` (1 file)

## Before / After

**Before:**
```vue
<script setup lang="ts">
// ...
</script>

<template>
  <!-- ... -->
</template>
```

**After:**
```vue
<template>
  <!-- ... -->
</template>

<script setup lang="ts">
// ...
</script>
```
