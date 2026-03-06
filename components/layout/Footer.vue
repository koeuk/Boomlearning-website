<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <div class="flex items-center gap-2 mb-3">
            <BookOpen class="w-5 h-5 text-primary-600" />
            <span class="text-base font-bold text-gray-900">BoomLearning</span>
          </div>
          <p class="text-sm text-gray-500 leading-relaxed">
            Empowering learners worldwide through quality education and expert-led courses.
          </p>
        </div>

        <!-- Platform -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Platform</h3>
          <ul class="space-y-2.5">
            <li v-for="link in platformLinks" :key="link.to">
              <NuxtLink :to="link.to" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Support</h3>
          <ul class="space-y-2.5">
            <li v-for="link in supportLinks" :key="link.label">
              <NuxtLink v-if="link.to" :to="link.to" class="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                {{ link.label }}
              </NuxtLink>
              <span v-else class="text-sm text-gray-500">{{ link.label }}</span>
            </li>
          </ul>
        </div>

        <!-- Connect -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Connect</h3>
          <div class="flex gap-3">
            <a href="#" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <Globe class="w-4 h-4" />
            </a>
            <a href="#" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
              <Mail class="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <hr class="my-8 border-gray-200" />

      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-sm text-gray-400">
          &copy; {{ currentYear }} BoomLearning. All rights reserved.
        </p>
        <div class="flex items-center gap-6">
          <span class="text-sm text-gray-400">English (US)</span>
          <a href="#" class="text-sm text-gray-400 hover:text-primary-600">Contact Support</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { BookOpen, Globe, Mail } from 'lucide-vue-next'

const currentYear = new Date().getFullYear()

const platformLinks = [
  { label: 'Browse Courses', to: '/courses' },
  { label: 'Categories', to: '/categories' },
  { label: 'My Learning', to: '/enrollments' },
  { label: 'Certificates', to: '/certificates' },
]

const supportLinks = [
  { label: 'Help Center', to: null },
  { label: 'Community', to: null },
  { label: 'Terms of Service', to: null },
  { label: 'Privacy Policy', to: null },
]
</script>
