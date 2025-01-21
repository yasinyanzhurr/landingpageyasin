<!-- resources/js/views/auth/Register.vue -->
<template>
  <div class="w-full">
    <!-- Header -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-primary">Become a Writer</h2>
      <p class="mt-2 text-primary-light/80">
        Create your account and start sharing your knowledge
      </p>
    </div>

    <!-- Register Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Alert for errors -->
      <div v-if="error"
           class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p class="text-red-500 text-sm">{{ error }}</p>
      </div>

      <!-- Full Name Field -->
      <div class="space-y-2">
        <label for="name" class="block text-sm font-medium text-primary-light">
          Full Name
        </label>
        <div class="relative">
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            class="auth-input pl-10"
            :class="{ 'border-red-500': errors.name }"
            @blur="validateField('name')"
          >
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-light/50">
            <i class="fas fa-user"></i>
          </span>
        </div>
        <p v-if="errors.name" class="text-red-500 text-xs mt-1">
          {{ errors.name }}
        </p>
      </div>

      <!-- Username Field -->
      <div class="space-y-2">
        <label for="username" class="block text-sm font-medium text-primary-light">
          Username
        </label>
        <div class="relative">
          <input
            id="username"
            v-model="formData.username"
            type="text"
            required
            class="auth-input pl-10"
            :class="{ 'border-red-500': errors.username }"
            @blur="validateField('username')"
          >
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-light/50">
            <i class="fas fa-at"></i>
          </span>
        </div>
        <p v-if="errors.username" class="text-red-500 text-xs mt-1">
          {{ errors.username }}
        </p>
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

      <!-- Password Confirmation Field -->
      <div class="space-y-2">
        <label for="password_confirmation" class="block text-sm font-medium text-primary-light">
          Confirm Password
        </label>
        <div class="relative">
          <input
            id="password_confirmation"
            v-model="formData.password_confirmation"
            :type="showPasswordConfirm ? 'text' : 'password'"
            required
            class="auth-input pl-10 pr-10"
            :class="{ 'border-red-500': errors.password_confirmation }"
            @blur="validateField('password_confirmation')"
          >
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-light/50">
            <i class="fas fa-lock"></i>
          </span>
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-primary-light/50 hover:text-primary"
            @click="showPasswordConfirm = !showPasswordConfirm"
          >
            <i :class="showPasswordConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
        <p v-if="errors.password_confirmation" class="text-red-500 text-xs mt-1">
          {{ errors.password_confirmation }}
        </p>
      </div>

      <!-- Terms and Conditions -->
      <div class="space-y-2">
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="terms"
              v-model="formData.terms"
              type="checkbox"
              required
              class="h-4 w-4 rounded border-primary-light/20 text-primary focus:ring-primary"
            >
          </div>
          <div class="ml-3">
            <label for="terms" class="text-sm text-primary-light">
              I agree to the
              <a href="#" class="text-primary hover:text-primary-light">Terms of Service</a>
              and
              <a href="#" class="text-primary hover:text-primary-light">Privacy Policy</a>
            </label>
          </div>
        </div>
        <p v-if="errors.terms" class="text-red-500 text-xs mt-1">
          {{ errors.terms }}
        </p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="btn-primary w-full flex items-center justify-center space-x-2"
        :disabled="isLoading"
      >
        <i v-if="isLoading" class="fas fa-circle-notch fa-spin"></i>
        <span>{{ isLoading ? 'Creating account...' : 'Create Account' }}</span>
      </button>

      <!-- Login Link -->
      <p class="text-center text-sm text-primary-light">
        Already have an account?
        <router-link
          to="/login"
          class="text-primary hover:text-primary-light transition-colors font-medium"
        >
          Sign in here
        </router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { validator } from '@/utils/validator'

export default {
  name: 'Register',

  setup() {
    const store = useStore()
    const router = useRouter()

    // Reactive state
    const formData = reactive({
      name: '',
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      terms: false
    })

    const errors = reactive({})
    const error = ref(null)
    const isLoading = ref(false)
    const showPassword = ref(false)
    const showPasswordConfirm = ref(false)

    // Validation rules
    const validateField = (field) => {
      const value = formData[field]
      let fieldError = null

      switch (field) {
        case 'name':
          fieldError = validator.required(value) ||
                      validator.minLength(value, 3) ||
                      validator.maxLength(value, 50)
          break

        case 'username':
          fieldError = validator.required(value) ||
                      validator.minLength(value, 3) ||
                      validator.maxLength(value, 20) ||
                      validator.alphanumeric(value)
          break

        case 'email':
          fieldError = validator.required(value) ||
                      validator.email(value)
          break

        case 'password':
          fieldError = validator.required(value) ||
                      validator.minLength(value, 8) ||
                      validator.password(value)
          break

        case 'password_confirmation':
          fieldError = validator.required(value) ||
                      value !== formData.password ? 'Passwords do not match' : true
          break

        case 'terms':
          fieldError = value ? true : 'You must accept the terms and conditions'
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
      Object.keys(formData).forEach(validateField)

      // Check for validation errors
      if (Object.keys(errors).length > 0) return

      isLoading.value = true
      error.value = null

      try {
        await store.dispatch('auth/register', {
          ...formData,
          role: 'writer' // Default role for registration
        })

        // Redirect to writer dashboard after successful registration
        router.push('/writer')
      } catch (err) {
        error.value = err.message
      } finally {
        isLoading.value = false
      }
    }

    return {
      formData,
      errors,
      error,
      isLoading,
      showPassword,
      showPasswordConfirm,
      validateField,
      handleSubmit
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
</style>
