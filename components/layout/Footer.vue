<script setup lang="ts">
import { BookOpen, Mail, Phone, MapPin } from 'lucide-vue-next'

const currentYear = new Date().getFullYear()

const quickLinks = [
  { label: 'Courses', to: '/courses' },
  { label: 'Categories', to: '/categories' },
  { label: 'Verify Certificate', to: '/certificates/verify' },
]

const accountLinks = [
  { label: 'My Learning', to: '/enrollments' },
  { label: 'Certificates', to: '/certificates' },
  { label: 'Profile', to: '/profile' },
]
</script>

<template>
  <footer class="bg-primary-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <BookOpen class="w-6 h-6 text-accent-400" />
            <span class="text-lg font-bold">BoomLearning</span>
          </div>
          <p class="text-primary-200 text-sm leading-relaxed">
            Empowering learners with quality education. Explore courses, earn certificates, and advance your career.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-primary-300 mb-4">Explore</h3>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.to">
              <NuxtLink :to="link.to" class="text-sm text-primary-200 hover:text-white transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Account -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-primary-300 mb-4">Account</h3>
          <ul class="space-y-2">
            <li v-for="link in accountLinks" :key="link.to">
              <NuxtLink :to="link.to" class="text-sm text-primary-200 hover:text-white transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-primary-300 mb-4">Contact</h3>
          <ul class="space-y-3">
            <li class="flex items-center gap-2 text-sm text-primary-200">
              <Mail class="w-4 h-4 shrink-0" />
              <span>support@boomlearning.com</span>
            </li>
            <li class="flex items-center gap-2 text-sm text-primary-200">
              <Phone class="w-4 h-4 shrink-0" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li class="flex items-start gap-2 text-sm text-primary-200">
              <MapPin class="w-4 h-4 shrink-0 mt-0.5" />
              <span>123 Learning Street, Education City</span>
            </li>
          </ul>
        </div>
      </div>

      <hr class="my-8 border-primary-700" />

      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-sm text-primary-300">
          &copy; {{ currentYear }} BoomLearning. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
