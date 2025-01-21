<!-- resources/js/views/auth/ResetPassword.vue -->
<template>
  <div class="w-full">
    <!-- Header -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-primary">Set New Password</h2>
      <p class="mt-2 text-primary-light/80">
        Create a new secure password for your account
      </p>
    </div>

    <!-- Success Message -->
    <div v-if="isSuccess"
         class="p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-6">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <i class="fas fa-check-circle text-green-500"></i>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-green-500">
            Password Reset Successful
          </h3>
          <div class="mt-2 text-sm text-green-500/80">
            <p>Your password has been successfully reset. You can now log in with your new password.</p>
          </div>
          <div class="mt-4">
            <router-link
              to="/login"
              class="text-sm font-medium text-green-500 hover:text-green-400"
            >
              Continue to login
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset Password Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Alert for errors -->
      <div v-if="error"
           class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p class="text-red-500 text-sm">{{ error }}</p>
      </div>

      <!-- Email Field (disabled) -->
      <div class="space-y-2">
        <label for="email" class="block text-sm font-medium text-primary-light">
          Email Address
        </label>
        <div class="relative">
          <input
            id="email"
            v-model="email"
            type="email"
            disabled
            class="auth-input pl-10 opacity-75 cursor-not-allowed"
          >
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-light/50">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
      </div>

      <!-- New Password Field -->
      <div class="space-y-2">
        <label for="password" class="block text-sm font-medium text-primary-light">
          New Password
        </label>
        <div class="relative">
          <input
            id="password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            required
            class="auth-input pl-10 pr-10"
            :class="{ 'border-red-500': errors.password }"
            placeholder="Enter your new password"
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
        <!-- Password Requirements -->
        <div class="mt-2 space-y-1">
          <p class="text-xs text-primary-light/60">Password must contain:</p>
          <ul class="text-xs space-y-1">
            <li v-for="(met, req) in passwordRequirements"
                :key="req"
                :class="met ? 'text-green-500' : 'text-primary-light/40'"
            >
              <i :class="met ? 'fas fa-check' : 'fas fa-times'" class="mr-1"></i>
              {{ req }}
            </li>
          </ul>
        </div>
        <p v-if="errors.password" class="text-red-500 text-xs mt-1">
          {{ errors.password }}
        </p>
      </div>

      <!-- Confirm Password Field -->
      <div class="space-y-2">
        <label for="password_confirmation" class="block text-sm font-medium text-primary-light">
          Confirm New Password
        </label>
        <div class="relative">
          <input
            id="password_confirmation"
            v-model="formData.password_confirmation"
            :type="showConfirmPassword ? 'text' : 'password'"
            required
            class="auth-input pl-10 pr-10"
            :class="{ 'border-red-500': errors.password_confirmation }"
            placeholder="Confirm your new password"
            @blur="validateField('password_confirmation')"
          >
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-light/50">
            <i class="fas fa-lock"></i>
          </span>
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-primary-light/50 hover:text-primary"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
        <p v-if="errors.password_confirmation" class="text-red-500 text-xs mt-1">
          {{ errors.password_confirmation }}
        </p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="btn-primary w-full flex items-center justify-center space-x-2"
        :disabled="isLoading || !isFormValid"
      >
        <template v-if="isLoading">
          <i class="fas fa-circle-notch fa-spin"></i>
          <span>Resetting Password...</span>
        </template>
        <template v-else>
          <i class="fas fa-key"></i>
          <span>Reset Password</span>
        </template>
      </button>

      <!-- Back to Login -->
      <div class="flex items-center justify-center">
        <router-link
          to="/login"
          class="text-sm text-primary-light hover:text-primary transition-colors"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Back to login
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { validator } from '@/utils/validator'

export default {
  name: 'ResetPassword',

  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    // Get token and email from URL
    const token = route.params.token
    const email = ref(route.query.email || '')

    // Reactive state
    const formData = reactive({
      password: '',
      password_confirmation: ''
    })

    const errors = reactive({})
    const error = ref(null)
    const isLoading = ref(false)
    const isSuccess = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)

    // Password requirements check
    const passwordRequirements = computed(() => ({
      'At least 8 characters': formData.password.length >= 8,
      'One uppercase letter': /[A-Z]/.test(formData.password),
      'One lowercase letter': /[a-z]/.test(formData.password),
      'One number': /[0-9]/.test(formData.password),
      'One special character': /[!@#$%^&*]/.test(formData.password)
    }))

    // Check if form is valid
    const isFormValid = computed(() => {
      return Object.values(passwordRequirements.value).every(Boolean) &&
             formData.password === formData.password_confirmation
    })

    // Validation
    const validateField = (field) => {
      const value = formData[field]
      let fieldError = null

      switch (field) {
        case 'password':
          fieldError = validator.required(value) ||
                      validator.password(value)
          break
        case 'password_confirmation':
          fieldError = validator.required(value) ||
                      value !== formData.password ? 'Passwords do not match' : true
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
        await store.dispatch('auth/resetPassword', {
          token,
          email: email.value,
          ...formData
        })

        isSuccess.value = true
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } catch (err) {
        error.value = err.message
      } finally {
        isLoading.value = false
      }
    }

    return {
      email,
      formData,
      errors,
      error,
      isLoading,
      isSuccess,
      showPassword,
      showConfirmPassword,
      passwordRequirements,
      isFormValid,
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

.btn-primary {
  @apply py-3 px-4 rounded-lg bg-primary text-white font-medium
         hover:bg-primary-dark transition-all duration-300
         focus:outline-none focus:ring-2 focus:ring-primary
         focus:ring-offset-2 focus:ring-offset-secondary-dark
         disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
