<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <LayoutNavbar />
    <main class="flex-1 pb-16 md:pb-0">
      <slot />
    </main>
    <LayoutFooter class="hidden md:block" />
    <LayoutBottomNav />
  </div>
</template>
