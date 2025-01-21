<!-- resources/js/components/ContactForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <BaseInput
      v-model="formData.name"
      :error="errors.name"
      label="Name"
      required
      @blur="validateField('name')"
    />

    <BaseInput
      v-model="formData.email"
      :error="errors.email"
      label="Email"
      type="email"
      required
      @blur="validateField('email')"
    />

    <BaseInput
      v-model="formData.message"
      :error="errors.message"
      label="Message"
      type="textarea"
      required
      @blur="validateField('message')"
    />

    <BaseButton
      type="submit"
      :loading="isSubmitting"
      :disabled="hasErrors"
    >
      Send Message
    </BaseButton>
  </form>
</template>

<script>
import { validator } from '@/utils/validator'
import api from '@/services/api'

export default {
  name: 'ContactForm',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        message: ''
      },
      errors: {},
      isSubmitting: false
    }
  },
  computed: {
    hasErrors() {
      return Object.keys(this.errors).length > 0
    }
  },
  methods: {
    validateField(field) {
      const value = this.formData[field]
      let error = null

      switch (field) {
        case 'name':
          error = validator.required(value)
          break
        case 'email':
          error = validator.required(value) || validator.email(value)
          break
        case 'message':
          error = validator.required(value) ||
                 validator.minLength(value, 10)
          break
      }

      if (error === true) {
        delete this.errors[field]
      } else {
        this.errors[field] = error
      }
    },

    async handleSubmit() {
      // Validate all fields
      Object.keys(this.formData).forEach(this.validateField)

      if (this.hasErrors) return

      this.isSubmitting = true

      try {
        await api.post('/contact', this.formData)
        this.$emit('success')
        this.resetForm()
      } catch (error) {
        console.error('Form submission error:', error)
        this.$emit('error', error)
      } finally {
        this.isSubmitting = false
      }
    },

    resetForm() {
      this.formData = {
        name: '',
        email: '',
        message: ''
      }
      this.errors = {}
    }
  }
}
</script>
