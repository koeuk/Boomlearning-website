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
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

const sortOptions = [
  { value: '', label: 'Default' },
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

<template>
  <div class="space-y-4">
    <!-- Search Bar -->
    <div class="flex gap-3">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Search courses..."
          class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      <!-- Mobile filter button -->
      <Sheet v-model:open="sheetOpen">
        <SheetTrigger as-child>
          <Button variant="outline" size="icon" class="md:hidden shrink-0">
            <SlidersHorizontal class="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" class="max-h-[80vh]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Filter and sort courses</SheetDescription>
          </SheetHeader>
          <div class="space-y-4 py-4">
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1.5 block">Level</label>
              <select
                v-model="level"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option v-for="l in levels" :key="l.value" :value="l.value">{{ l.label }}</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1.5 block">Category</label>
              <select
                v-model="categoryId"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                <option v-for="cat in categories" :key="cat.id" :value="String(cat.id)">{{ cat.category_name }}</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1.5 block">Sort By</label>
              <select
                v-model="sort"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option v-for="s in sortOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" @click="clearFilters(); sheetOpen = false">Clear</Button>
            <SheetClose as-child>
              <Button>Apply</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>

    <!-- Desktop Filters -->
    <div class="hidden md:flex items-center gap-3">
      <select
        v-model="level"
        class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option v-for="l in levels" :key="l.value" :value="l.value">{{ l.label }}</option>
      </select>

      <select
        v-model="categoryId"
        class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="String(cat.id)">{{ cat.category_name }}</option>
      </select>

      <select
        v-model="sort"
        class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option v-for="s in sortOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
      </select>

      <button
        v-if="hasFilters"
        @click="clearFilters"
        class="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <X class="w-3.5 h-3.5" />
        Clear
      </button>
    </div>
  </div>
</template>
