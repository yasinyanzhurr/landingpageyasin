// resources/js/store/modules/dashboard.js

const state = {
    isLoading: false,
    error: null
}

const mutations = {
    SET_LOADING(state, status) {
        state.isLoading = status
    },
    SET_ERROR(state, error) {
        state.error = error
    }
}

const actions = {
    async fetchAdminStats({ commit }) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const response = await api.get('/admin/dashboard/stats')
            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch dashboard data'
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
    mutations,
    actions
}
