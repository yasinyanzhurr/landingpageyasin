// resources/js/utils/validator.js

export const validator = {
    required: value => !!value || 'This field is required',

    email: value => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(value) || 'Invalid email address'
    },

    minLength: (value, min) => {
        return value.length >= min || `Minimum length is ${min} characters`
    },

    maxLength: (value, max) => {
        return value.length <= max || `Maximum length is ${max} characters`
    },

    phone: value => {
        const pattern = /^\+?[\d\s-]{10,}$/
        return pattern.test(value) || 'Invalid phone number'
    },

    url: value => {
        try {
            new URL(value)
            return true
        } catch {
            return 'Invalid URL'
        }
    }
}
