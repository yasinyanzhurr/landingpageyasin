<!-- resources/js/layouts/AuthLayout.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-secondary-dark to-secondary">
    <!-- Background Pattern -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex min-h-screen">
      <!-- Left Side - Branding -->
      <div class="hidden lg:flex lg:w-1/2 bg-secondary-dark p-12 flex-col justify-between">
        <div>
          <!-- Logo -->
          <div class="mb-12">
            <h1 class="text-4xl font-bold gradient-text">Yasin Portfolio</h1>
          </div>

          <!-- Welcome Text -->
          <div class="space-y-6 text-primary-light">
            <h2 class="text-3xl font-semibold">Welcome to Our Platform</h2>
            <p class="text-xl opacity-80">Share your knowledge and inspire others through your articles.</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-primary-light/60 text-sm">
          <p>&copy; {{ currentYear }} Yasin Portfolio. All rights reserved.</p>
        </div>
      </div>

      <!-- Right Side - Auth Forms -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div class="w-full max-w-md">
          <!-- Router View untuk form auth -->
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.bg-grid-pattern {
  background-image:
    linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light;
}
</style>
