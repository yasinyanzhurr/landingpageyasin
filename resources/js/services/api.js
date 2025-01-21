// resources/js/services/api.js

import axios from 'axios'

const api = axios.create({
    baseURL: process.env.MIX_APP_URL + '/api', // Sesuaikan dengan URL API Anda
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
})

// Request interceptor
api.interceptors.request.use(
    config => {
        // Add CSRF token
        const token = document.head.querySelector('meta[name="csrf-token"]')
        if (token) {
            config.headers['X-CSRF-TOKEN'] = token.content
        }

        // Add auth token if exists
        const authToken = localStorage.getItem('auth_token')
        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`
        }

        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// Response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        // Handle different error status
        switch (error.response?.status) {
            case 401: // Unauthorized
                // Clear auth data and redirect to login
                localStorage.removeItem('auth_token')
                localStorage.removeItem('user')
                localStorage.removeItem('user_role')
                window.location.href = '/login'
                break
            case 403: // Forbidden
                window.location.href = '/unauthorized'
                break
            case 419: // CSRF token mismatch
                // Refresh the page to get new CSRF token
                window.location.reload()
                break
            case 422: // Validation error
                // Return validation errors
                return Promise.reject(error.response.data)
            case 429: // Too many requests
                // Handle rate limiting
                console.error('Rate limit exceeded')
                break
            default:
                // Handle other errors
                console.error('API Error:', error)
        }
        return Promise.reject(error)
    }
)

export default api
