<script setup lang="ts">
import {
  Clock, Users, BarChart3, BookOpen, Award, Star,
  ChevronRight, PlayCircle, CheckCircle
} from 'lucide-vue-next'
import type { ApiResponse } from '~/types/api'
import type { Course } from '~/types/course'

const route = useRoute()
const { apiFetch } = useApi()
const auth = useAuthStore()

const courseId = Number(route.params.id)

const { data: courseData, error } = await useAsyncData(
  `course-${courseId}`,
  () => apiFetch<ApiResponse<Course>>(`/courses/${courseId}`)
)

const course = computed(() => courseData.value?.data)

useHead({
  title: computed(() => course.value ? `${course.value.course_name} - BoomLearning` : 'Course - BoomLearning'),
})

if (error.value) {
  throw createError({ statusCode: 404, message: 'Course not found' })
}

const thumbnail = computed(() => course.value ? resolveImageUrl(course.value.thumbnail) : null)

const levelColor = computed(() => {
  if (!course.value) return ''
  return {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700',
  }[course.value.level]
})

const totalLessons = computed(() => {
  if (!course.value?.modules) return 0
  return course.value.modules.reduce((sum, m) => sum + m.lessons_count, 0)
})

function handleEnroll() {
  if (!auth.isAuthenticated) {
    navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }
  // TODO: Phase 3 enrollment logic
}
</script>

<template>
  <div v-if="course">
    <!-- Hero Banner -->
    <div class="bg-gradient-to-r from-primary-800 to-primary-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div class="flex items-center gap-2 text-primary-200 text-sm mb-4">
          <NuxtLink to="/courses" class="hover:text-white">Courses</NuxtLink>
          <ChevronRight class="w-4 h-4" />
          <NuxtLink :to="`/categories/${course.category?.id}`" class="hover:text-white">
            {{ course.category?.category_name }}
          </NuxtLink>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-3">
          {{ course.course_name }}
        </h1>
        <p class="text-primary-100 max-w-2xl mb-4">{{ course.description }}</p>
        <div class="flex flex-wrap items-center gap-4 text-sm text-primary-100">
          <Badge :class="levelColor" variant="secondary">{{ course.level }}</Badge>
          <span class="flex items-center gap-1">
            <Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
            {{ course.average_rating.toFixed(1) }} ({{ course.reviews_count }} reviews)
          </span>
          <span class="flex items-center gap-1">
            <Users class="w-4 h-4" />
            {{ course.enrollments_count }} students
          </span>
          <span>by <strong class="text-white">{{ course.instructor_name }}</strong></span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:grid lg:grid-cols-3 lg:gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Course Info Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <Clock class="w-5 h-5 text-primary-500 mx-auto mb-1" />
              <p class="text-lg font-bold text-gray-900">{{ course.duration_hours }}h</p>
              <p class="text-xs text-gray-500">Duration</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <BookOpen class="w-5 h-5 text-primary-500 mx-auto mb-1" />
              <p class="text-lg font-bold text-gray-900">{{ course.modules?.length ?? 0 }}</p>
              <p class="text-xs text-gray-500">Modules</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <PlayCircle class="w-5 h-5 text-primary-500 mx-auto mb-1" />
              <p class="text-lg font-bold text-gray-900">{{ totalLessons }}</p>
              <p class="text-xs text-gray-500">Lessons</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <BarChart3 class="w-5 h-5 text-primary-500 mx-auto mb-1" />
              <p class="text-lg font-bold text-gray-900 capitalize">{{ course.level }}</p>
              <p class="text-xs text-gray-500">Level</p>
            </div>
          </div>

          <!-- Tabs: Curriculum / Reviews -->
          <Tabs default-value="curriculum">
            <TabsList>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({{ course.reviews_count }})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum" class="mt-4">
              <CourseModules :modules="course.modules ?? []" />
            </TabsContent>

            <TabsContent value="reviews" class="mt-4">
              <CourseReviews
                :course-id="course.id"
                :average-rating="course.average_rating"
                :reviews-count="course.reviews_count"
              />
            </TabsContent>
          </Tabs>
        </div>

        <!-- Sidebar - Enrollment Card (sticky) -->
        <div class="mt-8 lg:mt-0">
          <div class="lg:sticky lg:top-24">
            <Card>
              <!-- Thumbnail -->
              <div class="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-t-lg overflow-hidden">
                <img
                  v-if="thumbnail"
                  :src="thumbnail"
                  :alt="course.course_name"
                  class="w-full h-full object-cover"
                />
              </div>

              <CardContent class="pt-6">
                <div class="text-3xl font-bold text-gray-900 mb-4">
                  {{ formatCurrency(course.price) }}
                </div>

                <template v-if="course.is_enrolled">
                  <NuxtLink
                    :to="`/enrollments/${course.enrollment?.id}`"
                    class="w-full"
                  >
                    <Button class="w-full" size="lg">
                      <CheckCircle class="w-5 h-5 mr-2" />
                      Continue Learning
                    </Button>
                  </NuxtLink>
                </template>
                <template v-else>
                  <Button class="w-full" size="lg" @click="handleEnroll">
                    Enroll Now
                  </Button>
                </template>

                <Separator class="my-4" />

                <ul class="space-y-3 text-sm text-gray-600">
                  <li class="flex items-center gap-2">
                    <Clock class="w-4 h-4 text-gray-400" />
                    {{ course.duration_hours }} hours of content
                  </li>
                  <li class="flex items-center gap-2">
                    <BookOpen class="w-4 h-4 text-gray-400" />
                    {{ totalLessons }} lessons
                  </li>
                  <li class="flex items-center gap-2">
                    <BarChart3 class="w-4 h-4 text-gray-400" />
                    {{ course.level }} level
                  </li>
                  <li class="flex items-center gap-2">
                    <Award class="w-4 h-4 text-gray-400" />
                    Certificate of completion
                  </li>
                </ul>

                <template v-if="course.enrollment_limit">
                  <Separator class="my-4" />
                  <p class="text-xs text-gray-500 text-center">
                    {{ course.enrollments_count }} / {{ course.enrollment_limit }} seats taken
                  </p>
                </template>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
