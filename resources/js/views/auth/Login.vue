<!-- resources/js/views/auth/Login.vue -->
<template>
  <div class="w-full">
    <!-- Header -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-primary">Sign In</h2>
      <p class="mt-2 text-primary-light/80">
        Access your account to start writing
      </p>
    </div>

    <!-- Login Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Alert for errors -->
      <div v-if="error"
           class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p class="text-red-500 text-sm">{{ error }}</p>
      </div>

      <!-- Email Field -->
      <div class="space-y-2">
        <label for="email" class="block text-sm font-medium text-primary-light">
          Email Address
        </label>
        <div class="relative">
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="auth-input pl-10"
            :class="{ 'border-red-500': errors.email }"
            @blur="validateField('email')"
          >
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-light/50">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
        <p v-if="errors.email" class="text-red-500 text-xs mt-1">
          {{ errors.email }}
        </p>
      </div>

      <!-- Password Field -->
      <div class="space-y-2">
        <label for="password" class="block text-sm font-medium text-primary-light">
          Password
        </label>
        <div class="relative">
          <input
            id="password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            required
            class="auth-input pl-10 pr-10"
            :class="{ 'border-red-500': errors.password }"
            @blur="validateField('password')"
          >
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-light/50">
            <i class="fas fa-lock"></i>
          </span>
          <!-- Toggle Password Visibility -->
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-primary-light/50 hover:text-primary"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
        <p v-if="errors.password" class="text-red-500 text-xs mt-1">
          {{ errors.password }}
        </p>
      </div>

      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember"
            v-model="formData.remember"
            type="checkbox"
            class="h-4 w-4 rounded border-primary-light/20 text-primary focus:ring-primary"
          >
          <label for="remember" class="ml-2 block text-sm text-primary-light">
            Remember me
          </label>
        </div>

        <router-link
          to="/forgot-password"
          class="text-sm text-primary hover:text-primary-light transition-colors"
        >
          Forgot password?
        </router-link>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="btn-primary w-full flex items-center justify-center space-x-2"
        :disabled="isLoading"
      >
        <i v-if="isLoading" class="fas fa-circle-notch fa-spin"></i>
        <span>{{ isLoading ? 'Signing in...' : 'Sign in' }}</span>
      </button>

      <!-- Register Link -->
      <p class="text-center text-sm text-primary-light">
        Want to become a writer?
        <router-link
          to="/register"
          class="text-primary hover:text-primary-light transition-colors font-medium"
        >
          Register here
        </router-link>
      </p>

      <!-- Social Login (Optional) -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-primary-light/10"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-secondary-dark text-primary-light/60">
            Or continue with
          </span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <button
          type="button"
          class="btn-secondary flex items-center justify-center space-x-2"
          @click="socialLogin('google')"
        >
          <i class="fab fa-google"></i>
          <span>Google</span>
        </button>

        <button
          type="button"
          class="btn-secondary flex items-center justify-center space-x-2"
          @click="socialLogin('github')"
        >
          <i class="fab fa-github"></i>
          <span>GitHub</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { validator } from '@/utils/validator'

export default {
  name: 'Login',

  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    // Reactive state
    const formData = reactive({
      email: '',
      password: '',
      remember: false
    })

    const errors = reactive({})
    const error = ref(null)
    const isLoading = ref(false)
    const showPassword = ref(false)

    // Validation
    const validateField = (field) => {
      const value = formData[field]
      let fieldError = null

      switch (field) {
        case 'email':
          fieldError = validator.required(value) || validator.email(value)
          break
        case 'password':
          fieldError = validator.required(value) || validator.minLength(value, 6)
          break
      }

      if (fieldError === true) {
        delete errors[field]
      } else {
        errors[field] = fieldError
      }
    }

    // Form submission
    const handleSubmit = async () => {
      // Validate all fields
      ['email', 'password'].forEach(validateField)

      // Check for validation errors
      if (Object.keys(errors).length > 0) return

      isLoading.value = true
      error.value = null

      try {
        // Login action
        const role = await store.dispatch('auth/login', formData)

        // Redirect based on role or intended destination
        const redirectPath = route.query.redirect || getRoleDefaultPath(role)
        router.push(redirectPath)
      } catch (err) {
        error.value = err.message
      } finally {
        isLoading.value = false
      }
    }

    // Social login handler
    const socialLogin = async (provider) => {
      try {
        window.location.href = `/auth/${provider}`
      } catch (err) {
        error.value = 'Social login failed. Please try again.'
      }
    }

    // Helper function
    const getRoleDefaultPath = (role) => {
      const paths = {
        admin: '/admin',
        editor: '/editor',
        writer: '/writer'
      }
      return paths[role] || '/'
    }

    return {
      formData,
      errors,
      error,
      isLoading,
      showPassword,
      validateField,
      handleSubmit,
      socialLogin
    }
  }
}
</script>

<style scoped>
.auth-input {
  @apply appearance-none rounded-lg relative block w-full px-4 py-3 border
         border-primary/20 placeholder-primary-light/50 text-primary-light
         bg-secondary focus:outline-none focus:ring-2 focus:ring-primary
         focus:border-transparent transition-all duration-300;
}

.btn-secondary {
  @apply py-2.5 px-4 rounded-lg border border-primary/20 text-primary-light
         hover:bg-primary/10 transition-all duration-300 focus:outline-none
         focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary-dark;
}
</style>
