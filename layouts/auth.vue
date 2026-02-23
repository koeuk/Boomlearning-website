<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="text-2xl font-bold text-primary-600">
          BoomLearning
        </NuxtLink>
      </div>
      <slot />
    </div>
  </div>
</template>
