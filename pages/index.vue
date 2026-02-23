<script setup lang="ts">
import { BookOpen, GraduationCap, Award, Users, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-vue-next'
import type { ApiResponse } from '~/types/api'
import type { Slide } from '~/types/slide'
import type { Category } from '~/types/category'
import type { Course } from '~/types/course'

useHead({ title: 'BoomLearning - Learn, Grow, Succeed' })

const auth = useAuthStore()
const { apiFetch } = useApi()

// Fetch slides
const { data: slidesData } = await useAsyncData('home-slides', () =>
  apiFetch<ApiResponse<Slide[]>>('/slides')
)
const slides = computed(() => slidesData.value?.data ?? [])

// Fetch categories
const { data: categoriesData } = await useAsyncData('home-categories', () =>
  apiFetch<ApiResponse<Category[]>>('/categories')
)
const categories = computed(() => categoriesData.value?.data ?? [])

// Fetch featured courses
const { data: featuredData, status: featuredStatus } = await useAsyncData('home-featured', () =>
  apiFetch<ApiResponse<Course[]>>('/courses', { params: { 'filter[is_featured]': true } })
)
const featuredCourses = computed(() => featuredData.value?.data ?? [])

// Slide carousel
const currentSlide = ref(0)
const slideCount = computed(() => slides.value.length)

function nextSlide() {
  if (slideCount.value > 0) {
    currentSlide.value = (currentSlide.value + 1) % slideCount.value
  }
}

function prevSlide() {
  if (slideCount.value > 0) {
    currentSlide.value = (currentSlide.value - 1 + slideCount.value) % slideCount.value
  }
}

// Auto-advance slides
let slideInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (slideCount.value > 1) {
    slideInterval = setInterval(nextSlide, 5000)
  }
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})
</script>

<template>
  <div>
    <!-- Hero / Slides Carousel -->
    <section v-if="slides.length > 0" class="relative bg-gray-900 overflow-hidden">
      <div class="relative h-[300px] sm:h-[400px] md:h-[480px]">
        <template v-for="(slide, index) in slides" :key="slide.id">
          <div
            class="absolute inset-0 transition-opacity duration-700"
            :class="index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          >
            <img
              :src="resolveImageUrl(slide.image)!"
              :alt="slide.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div class="absolute inset-0 flex items-center">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div class="max-w-lg">
                  <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                    {{ slide.title }}
                  </h2>
                  <p v-if="slide.description" class="text-sm sm:text-base text-gray-200 mb-6">
                    {{ slide.description }}
                  </p>
                  <NuxtLink
                    v-if="slide.link"
                    :to="slide.link"
                    class="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    Learn More
                    <ArrowRight class="w-4 h-4" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Carousel Controls -->
      <template v-if="slides.length > 1">
        <button
          @click="prevSlide"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        <button
          @click="nextSlide"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <button
            v-for="(_, index) in slides"
            :key="index"
            class="w-2.5 h-2.5 rounded-full transition-colors"
            :class="index === currentSlide ? 'bg-white' : 'bg-white/40'"
            @click="currentSlide = index"
          />
        </div>
      </template>
    </section>

    <!-- Fallback Hero (no slides) -->
    <section v-else class="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div class="max-w-2xl">
          <h1 class="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Learn, Grow, Succeed
          </h1>
          <p class="text-lg text-primary-100 mb-8">
            Explore our courses and start your learning journey today. Gain new skills, earn certificates, and advance your career.
          </p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="/courses"
              class="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <BookOpen class="w-5 h-5" />
              Browse Courses
            </NuxtLink>
            <NuxtLink
              v-if="!auth.isAuthenticated"
              to="/register"
              class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg transition-colors backdrop-blur"
            >
              Get Started
            </NuxtLink>
            <NuxtLink
              v-else
              to="/enrollments"
              class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg transition-colors backdrop-blur"
            >
              Continue Learning
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <BookOpen class="w-8 h-8 text-primary-500 mx-auto mb-2" />
            <div class="text-2xl font-bold text-gray-900">50+</div>
            <div class="text-sm text-gray-500">Courses</div>
          </div>
          <div class="text-center">
            <Users class="w-8 h-8 text-primary-500 mx-auto mb-2" />
            <div class="text-2xl font-bold text-gray-900">500+</div>
            <div class="text-sm text-gray-500">Students</div>
          </div>
          <div class="text-center">
            <GraduationCap class="w-8 h-8 text-primary-500 mx-auto mb-2" />
            <div class="text-2xl font-bold text-gray-900">200+</div>
            <div class="text-sm text-gray-500">Graduates</div>
          </div>
          <div class="text-center">
            <Award class="w-8 h-8 text-primary-500 mx-auto mb-2" />
            <div class="text-2xl font-bold text-gray-900">100+</div>
            <div class="text-sm text-gray-500">Certificates</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section v-if="categories.length > 0" class="bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Browse Categories</h2>
            <p class="text-gray-500 mt-1">Find courses in your area of interest</p>
          </div>
          <NuxtLink
            to="/categories"
            class="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <CategoryCard v-for="cat in categories.slice(0, 10)" :key="cat.id" :category="cat" />
        </div>
        <div class="mt-6 text-center sm:hidden">
          <NuxtLink
            to="/categories"
            class="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All Categories
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Courses -->
    <section class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Featured Courses</h2>
            <p class="text-gray-500 mt-1">Handpicked courses to help you get started</p>
          </div>
          <NuxtLink
            to="/courses"
            class="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>
        <CourseGrid
          :courses="featuredCourses"
          :loading="featuredStatus === 'pending'"
          empty-message="No featured courses available yet."
        />
        <div class="mt-6 text-center sm:hidden">
          <NuxtLink
            to="/courses"
            class="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Browse All Courses
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Ready to Start Learning?</h2>
        <p class="text-gray-500 mb-8 max-w-lg mx-auto">
          Join thousands of students who are already learning and growing with BoomLearning.
        </p>
        <NuxtLink
          to="/courses"
          class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-8 py-3 rounded-lg transition-colors"
        >
          Explore Courses
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
