<!-- resources/js/views/auth/ForgotPassword.vue -->
<template>
  <div class="w-full">
    <!-- Header -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-primary">Reset Password</h2>
      <p class="mt-2 text-primary-light/80">
        Enter your email address to receive a password reset link
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
            Reset Link Sent
          </h3>
          <div class="mt-2 text-sm text-green-500/80">
            <p>We've sent a password reset link to your email address.
               Please check your inbox and follow the instructions.</p>
          </div>
          <div class="mt-4">
            <router-link
              to="/login"
              class="text-sm font-medium text-green-500 hover:text-green-400"
            >
              Return to login
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
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
            placeholder="Enter your registered email"
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

      <!-- Submit Button -->
      <button
        type="submit"
        class="btn-primary w-full flex items-center justify-center space-x-2"
        :disabled="isLoading"
      >
        <template v-if="isLoading">
          <i class="fas fa-circle-notch fa-spin"></i>
          <span>Sending Reset Link...</span>
        </template>
        <template v-else>
          <i class="fas fa-paper-plane"></i>
          <span>Send Reset Link</span>
        </template>
      </button>

      <!-- Back to Login -->
      <div class="flex items-center justify-center space-x-4">
        <router-link
          to="/login"
          class="text-sm text-primary-light hover:text-primary transition-colors"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Back to login
        </router-link>
      </div>

      <!-- Help Text -->
      <div class="mt-6 text-center">
        <p class="text-sm text-primary-light/60">
          Haven't received the email? Check your spam folder or
          <button
            type="button"
            class="text-primary hover:text-primary-light transition-colors"
            :disabled="isLoading || !canResend"
            @click="handleSubmit"
          >
            try again
          </button>
        </p>
        <p v-if="!canResend" class="text-xs text-primary-light/40 mt-2">
          You can request another reset link in {{ resendTimeout }} seconds
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { validator } from '@/utils/validator'

export default {
  name: 'ForgotPassword',

  setup() {
    const store = useStore()

    // Reactive state
    const formData = reactive({
      email: ''
    })

    const errors = reactive({})
    const error = ref(null)
    const isLoading = ref(false)
    const isSuccess = ref(false)
    const canResend = ref(true)
    const resendTimeout = ref(0)

    // Validation
    const validateField = (field) => {
      const value = formData[field]
      let fieldError = null

      switch (field) {
        case 'email':
          fieldError = validator.required(value) || validator.email(value)
          break
      }

      if (fieldError === true) {
        delete errors[field]
      } else {
        errors[field] = fieldError
      }
    }

    // Start resend timeout
    const startResendTimeout = () => {
      canResend.value = false
      resendTimeout.value = 60

      const timer = setInterval(() => {
        resendTimeout.value--
        if (resendTimeout.value <= 0) {
          canResend.value = true
          clearInterval(timer)
        }
      }, 1000)
    }

    // Form submission
    const handleSubmit = async () => {
      if (!canResend.value) return

      // Validate email
      validateField('email')

      // Check for validation errors
      if (Object.keys(errors).length > 0) return

      isLoading.value = true
      error.value = null

      try {
        await store.dispatch('auth/forgotPassword', formData.email)
        isSuccess.value = true
        startResendTimeout()
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
      isSuccess,
      canResend,
      resendTimeout,
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
