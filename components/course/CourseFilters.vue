<template>
  <div class="space-y-4">
    <!-- Search + Filter Row -->
    <div class="flex gap-3">
      <div class="relative flex-1">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Search courses..."
          class="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
        />
      </div>
      <!-- Mobile filter button -->
      <Sheet v-model:open="sheetOpen">
        <SheetTrigger as-child>
          <Button variant="outline" class="md:hidden shrink-0 rounded-xl gap-2">
            <SlidersHorizontal class="w-4 h-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" class="max-h-[80vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Filter and sort courses</SheetDescription>
          </SheetHeader>
          <div class="space-y-5 py-4">
            <div>
              <label class="text-sm font-medium text-gray-700 mb-2 block">Level</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="l in levels"
                  :key="l.value"
                  @click="level = l.value"
                  class="px-4 py-2 text-sm rounded-lg border transition-colors"
                  :class="level === l.value
                    ? 'bg-primary-50 border-primary-200 text-primary-700 font-medium'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
                >
                  {{ l.label }}
                </button>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <select
                v-model="categoryId"
                class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                <option v-for="cat in categories" :key="cat.id" :value="String(cat.id)">{{ cat.category_name }}</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
              <select
                v-model="sort"
                class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option v-for="s in sortOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" class="rounded-xl" @click="clearFilters(); sheetOpen = false">Clear All</Button>
            <SheetClose as-child>
              <Button class="rounded-xl">Apply Filters</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>

    <!-- Desktop Filters -->
    <div class="hidden md:flex items-center gap-3">
      <!-- Level pills -->
      <div class="flex items-center gap-2">
        <button
          v-for="l in levels"
          :key="l.value"
          @click="level = level === l.value ? '' : l.value"
          class="px-3.5 py-1.5 text-sm rounded-lg border transition-all"
          :class="level === l.value
            ? 'bg-primary-50 border-primary-200 text-primary-700 font-medium shadow-sm'
            : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'"
        >
          {{ l.label }}
        </button>
      </div>

      <div class="w-px h-6 bg-gray-200" />

      <select
        v-model="categoryId"
        class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
      >
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="String(cat.id)">{{ cat.category_name }}</option>
      </select>

      <select
        v-model="sort"
        class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
      >
        <option v-for="s in sortOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
      </select>

      <button
        v-if="hasFilters"
        @click="clearFilters"
        class="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X class="w-3.5 h-3.5" />
        Clear filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, SlidersHorizontal, X } from 'lucide-vue-next'
import type { Category } from '~/types/category'

const props = defineProps<{
  categories: Category[]
}>()

const search = defineModel<string>('search', { default: '' })
const level = defineModel<string>('level', { default: '' })
const categoryId = defineModel<string>('categoryId', { default: '' })
const sort = defineModel<string>('sort', { default: '' })

const sheetOpen = ref(false)

const levels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

const sortOptions = [
  { value: '', label: 'Sort by' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

const hasFilters = computed(() => level.value || categoryId.value || sort.value)

function clearFilters() {
  level.value = ''
  categoryId.value = ''
  sort.value = ''
}
</script>
