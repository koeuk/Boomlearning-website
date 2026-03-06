<template>
  <div>
    <!-- Authenticated Welcome Hero -->
    <section v-if="auth.isAuthenticated" class="bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 rounded-2xl p-8 md:p-10">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {{ auth.user?.full_name?.split(' ')[0] }}!
          </h1>
          <p class="text-gray-500 max-w-xl mb-6">
            You're doing great! Ready to dive back into your learning journey? Pick up where you left off.
          </p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="/enrollments"
              class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Continue Learning
            </NuxtLink>
            <NuxtLink
              to="/profile"
              class="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-2.5 rounded-lg border border-gray-200 transition-colors"
            >
              View Progress
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Guest Hero with Slideshow -->
    <section v-else>
      <!-- Slides Carousel -->
      <div v-if="slides.length > 0" class="relative bg-gray-900 overflow-hidden">
        <div class="relative h-[250px] sm:h-[350px] md:h-[420px]">
          <template v-for="(slide, index) in slides" :key="slide.id">
            <div
              class="absolute inset-0 transition-opacity duration-700"
              :class="index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'"
            >
              <img
                :src="resolveImageUrl(slide.image_url)!"
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
                    <p v-if="slide.subtitle" class="text-sm sm:text-base text-gray-200 mb-6">
                      {{ slide.subtitle }}
                    </p>
                    <NuxtLink
                      v-if="slide.button_url"
                      :to="slide.button_url"
                      class="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                    >
                      {{ slide.button_text || 'Learn More' }}
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
      </div>

      <!-- Fallback Hero (no slides) -->
      <div v-else class="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div class="max-w-2xl">
            <h1 class="text-3xl md:text-4xl font-bold leading-tight mb-4">
              Learn, Grow, Succeed
            </h1>
            <p class="text-base text-primary-100 mb-6">
              Explore our courses and start your learning journey today.
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
                to="/register"
                class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg transition-colors backdrop-blur"
              >
                Get Started
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Browse Categories -->
    <section v-if="categories.length > 0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Browse Categories</h2>
          <NuxtLink
            to="/categories"
            class="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            See all
          </NuxtLink>
        </div>
        <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <CategoryCardCompact
            v-for="cat in categories.slice(0, 8)"
            :key="cat.id"
            :category="cat"
            class="shrink-0"
          />
        </div>
      </div>
    </section>

    <!-- Featured Courses -->
    <section class="bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Featured Courses</h2>
          <NuxtLink
            to="/courses"
            class="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All
          </NuxtLink>
        </div>
        <CourseGrid
          :courses="featuredCourses"
          :loading="featuredStatus === 'pending'"
          empty-message="No featured courses available yet."
        />
      </div>
    </section>

    <!-- CTA (guest only) -->
    <section v-if="!auth.isAuthenticated" class="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800">
      <div class="absolute inset-0">
        <div class="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5" />
        <div class="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-white/5" />
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Start Learning?</h2>
        <p class="text-primary-200 mb-6 max-w-lg mx-auto text-sm">
          Join thousands of students who are already learning and growing with BoomLearning.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink
            to="/courses"
            class="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-lg shadow-primary-900/20"
          >
            Explore Courses
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-primary-900/20"
          >
            Get Started Free
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-vue-next'
import type { ApiResponse } from '~/types/api'
import type { Slide } from '~/types/slide'
import type { Category } from '~/types/category'
import type { Course } from '~/types/course'

useHead({ title: 'BoomLearning - Learn, Grow, Succeed' })

const auth = useAuthStore()
const { apiFetch } = useApi()

// Public data (always loaded)
const { data: slidesData } = await useAsyncData('home-slides', () =>
  apiFetch<ApiResponse<Slide[]>>('/slides')
)
const slides = computed(() => slidesData.value?.data ?? [])

const { data: categoriesData } = await useAsyncData('home-categories', () =>
  apiFetch<ApiResponse<Category[]>>('/categories')
)
const categories = computed(() => categoriesData.value?.data ?? [])

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
