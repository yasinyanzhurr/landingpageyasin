// resources/js/store/modules/auth.js

import api from '@/services/api'

const state = {
    // User data & authentication state
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('auth_token') || null,
    role: localStorage.getItem('user_role') || null,
    loading: false,
    error: null
}

const getters = {
    // Check if user is authenticated
    isAuthenticated: (state) => !!state.token,
    // Get current user
    currentUser: (state) => state.user,
    // Get user role
    userRole: (state) => state.role,
    // Check if user has specific role
    hasRole: (state) => (role) => state.role === role,
    // Get loading state
    isLoading: (state) => state.loading,
    // Get error state
    getError: (state) => state.error
}

const mutations = {
    // Set user data
    SET_USER(state, user) {
        state.user = user
        state.role = user?.role
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('user_role', user?.role)
    },

    // Set authentication token
    SET_TOKEN(state, token) {
        state.token = token
        localStorage.setItem('auth_token', token)
    },

    // Set loading state
    SET_LOADING(state, status) {
        state.loading = status
    },

    // Set error state
    SET_ERROR(state, error) {
        state.error = error
    },

    // Clear authentication data
    CLEAR_AUTH(state) {
        state.user = null
        state.token = null
        state.role = null
        state.error = null
        localStorage.removeItem('user')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_role')
    }
}

const actions = {
    // Login action
    async login({ commit }, credentials) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const response = await api.post('/auth/login', credentials)
            const { token, user } = response.data

            commit('SET_TOKEN', token)
            commit('SET_USER', user)

            // Setup default authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            return user.role
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed'
            commit('SET_ERROR', errorMessage)
            throw new Error(errorMessage)
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // Register action
    async register({ commit }, userData) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const response = await api.post('/auth/register', {
                ...userData,
                role: 'writer' // Default role untuk registrasi
            })

            const { token, user } = response.data

            commit('SET_TOKEN', token)
            commit('SET_USER', user)

            // Setup default authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            return user
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed'
            commit('SET_ERROR', errorMessage)
            throw new Error(errorMessage)
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // Logout action
    async logout({ commit }) {
        try {
            await api.post('/auth/logout')
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            // Remove auth header
            delete api.defaults.headers.common['Authorization']
            // Clear auth data
            commit('CLEAR_AUTH')
        }
    },

    // Check auth state (dipanggil saat aplikasi dimuat)
    async checkAuth({ commit, state }) {
        if (!state.token) return false

        try {
            const response = await api.get('/auth/user')
            commit('SET_USER', response.data.user)
            return true
        } catch (error) {
            commit('CLEAR_AUTH')
            return false
        }
    },

    // Update user profile
    async updateProfile({ commit }, userData) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const response = await api.put('/auth/profile', userData)
            commit('SET_USER', response.data.user)
            return response.data.user
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Update failed'
            commit('SET_ERROR', errorMessage)
            throw new Error(errorMessage)
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // Forgot password action
    async resetPassword({ commit }, { token, email, password, password_confirmation }) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const response = await api.post('/auth/reset-password', {
                token,
                email,
                password,
                password_confirmation
            })

            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Password reset failed'
            commit('SET_ERROR', errorMessage)
            throw new Error(errorMessage)
        } finally {
            commit('SET_LOADING', false)
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
