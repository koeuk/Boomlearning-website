<template>
  <div v-if="course">
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <NuxtLink to="/courses" class="hover:text-primary-600 transition-colors">Courses</NuxtLink>
          <ChevronRight class="w-3.5 h-3.5" />
          <NuxtLink :to="`/categories/${course.category?.id}`" class="hover:text-primary-600 transition-colors">
            {{ course.category?.category_name }}
          </NuxtLink>
          <ChevronRight class="w-3.5 h-3.5" />
          <span class="text-gray-900 truncate">{{ course.course_name }}</span>
        </div>
      </div>
    </div>

    <!-- Course Header -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="lg:grid lg:grid-cols-5 lg:gap-10">
          <!-- Info -->
          <div class="lg:col-span-3">
            <div class="flex items-center gap-2 mb-3">
              <Badge :class="levelColor" variant="secondary" class="capitalize text-xs">{{ course.level }}</Badge>
              <Badge v-if="course.is_featured" class="bg-emerald-50 text-emerald-700 text-xs" variant="secondary">Featured</Badge>
            </div>

            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3">
              {{ course.course_name }}
            </h1>
            <p class="text-gray-500 mb-4 leading-relaxed">{{ course.description }}</p>

            <div class="flex flex-wrap items-center gap-4 text-sm">
              <div class="flex items-center gap-1.5">
                <Star class="w-4 h-4 text-amber-400 fill-amber-400" />
                <span class="font-semibold text-gray-900">{{ course.average_rating.toFixed(1) }}</span>
                <span class="text-gray-400">({{ course.reviews_count }} reviews)</span>
              </div>
              <div class="flex items-center gap-1.5 text-gray-500">
                <Users class="w-4 h-4" />
                {{ course.enrollments_count }} students
              </div>
              <div class="flex items-center gap-1.5 text-gray-500">
                <Clock class="w-4 h-4" />
                {{ course.duration_hours }} hours
              </div>
            </div>

            <div class="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <span class="text-sm font-semibold text-white">{{ course.instructor_name?.[0]?.toUpperCase() }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ course.instructor_name }}</p>
                <p class="text-xs text-gray-400">Course Instructor</p>
              </div>
            </div>
          </div>

          <!-- Enrollment Card -->
          <div class="lg:col-span-2 mt-8 lg:mt-0">
            <div class="lg:sticky lg:top-20">
              <div class="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <!-- Thumbnail -->
                <div class="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
                  <img
                    v-if="thumbnail"
                    :src="thumbnail"
                    :alt="course.course_name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="absolute inset-0 flex items-center justify-center">
                    <PlayCircle class="w-16 h-16 text-primary-300" />
                  </div>
                </div>

                <div class="p-6">
                  <div class="flex items-baseline gap-2 mb-5">
                    <span class="text-3xl font-bold text-gray-900">{{ formatCurrency(course.price) }}</span>
                    <span v-if="course.price === 0" class="text-sm font-medium text-emerald-600">Free</span>
                  </div>

                  <template v-if="course.is_enrolled">
                    <NuxtLink :to="`/enrollments/${course.enrollment?.id}`" class="block">
                      <Button class="w-full h-12 text-base rounded-xl" size="lg">
                        <CheckCircle class="w-5 h-5 mr-2" />
                        Continue Learning
                      </Button>
                    </NuxtLink>
                  </template>
                  <template v-else>
                    <Button class="w-full h-12 text-base rounded-xl" size="lg" @click="handleEnroll">
                      Enroll Now
                    </Button>
                  </template>

                  <div class="mt-5 space-y-3">
                    <div class="flex items-center justify-between text-sm">
                      <span class="flex items-center gap-2 text-gray-500">
                        <Clock class="w-4 h-4" />
                        Duration
                      </span>
                      <span class="font-medium text-gray-900">{{ course.duration_hours }} hours</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="flex items-center gap-2 text-gray-500">
                        <BookOpen class="w-4 h-4" />
                        Lessons
                      </span>
                      <span class="font-medium text-gray-900">{{ totalLessons }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="flex items-center gap-2 text-gray-500">
                        <BarChart3 class="w-4 h-4" />
                        Level
                      </span>
                      <span class="font-medium text-gray-900 capitalize">{{ course.level }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="flex items-center gap-2 text-gray-500">
                        <Award class="w-4 h-4" />
                        Certificate
                      </span>
                      <span class="font-medium text-gray-900">Included</span>
                    </div>
                  </div>

                  <template v-if="course.enrollment_limit">
                    <div class="mt-4 pt-4 border-t border-gray-100">
                      <div class="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                        <span>Seats taken</span>
                        <span>{{ course.enrollments_count }} / {{ course.enrollment_limit }}</span>
                      </div>
                      <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          class="h-full bg-primary-500 rounded-full"
                          :style="{ width: `${(course.enrollments_count / course.enrollment_limit) * 100}%` }"
                        />
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Course Content -->
    <div class="bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="lg:grid lg:grid-cols-5 lg:gap-10">
          <div class="lg:col-span-3 space-y-8">
            <!-- Quick Stats -->
            <div class="grid grid-cols-4 gap-3">
              <div class="bg-white rounded-xl p-4 text-center border border-gray-100">
                <Clock class="w-5 h-5 text-primary-500 mx-auto mb-1.5" />
                <p class="text-lg font-bold text-gray-900">{{ course.duration_hours }}h</p>
                <p class="text-[11px] text-gray-400">Duration</p>
              </div>
              <div class="bg-white rounded-xl p-4 text-center border border-gray-100">
                <BookOpen class="w-5 h-5 text-primary-500 mx-auto mb-1.5" />
                <p class="text-lg font-bold text-gray-900">{{ course.modules?.length ?? 0 }}</p>
                <p class="text-[11px] text-gray-400">Modules</p>
              </div>
              <div class="bg-white rounded-xl p-4 text-center border border-gray-100">
                <PlayCircle class="w-5 h-5 text-primary-500 mx-auto mb-1.5" />
                <p class="text-lg font-bold text-gray-900">{{ totalLessons }}</p>
                <p class="text-[11px] text-gray-400">Lessons</p>
              </div>
              <div class="bg-white rounded-xl p-4 text-center border border-gray-100">
                <BarChart3 class="w-5 h-5 text-primary-500 mx-auto mb-1.5" />
                <p class="text-lg font-bold text-gray-900 capitalize">{{ course.level }}</p>
                <p class="text-[11px] text-gray-400">Level</p>
              </div>
            </div>

            <!-- Tabs -->
            <Tabs default-value="curriculum">
              <TabsList class="bg-white border border-gray-200 rounded-xl p-1">
                <TabsTrigger value="curriculum" class="rounded-lg">Curriculum</TabsTrigger>
                <TabsTrigger value="reviews" class="rounded-lg">
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
          <div class="lg:col-span-2" />
        </div>
      </div>
    </div>
  </div>
</template>

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

const courseId = route.params.id as string

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
    beginner: 'bg-emerald-50 text-emerald-700',
    intermediate: 'bg-blue-50 text-blue-700',
    advanced: 'bg-violet-50 text-violet-700',
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
