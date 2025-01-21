// resources/js/store/modules/notifications.js

const state = {
    notifications: [],
    unreadCount: 0,
    isLoading: false
}

const getters = {
    allNotifications: state => state.notifications,
    unreadCount: state => state.unreadCount
}

const mutations = {
    SET_NOTIFICATIONS(state, notifications) {
        state.notifications = notifications
    },

    ADD_NOTIFICATION(state, notification) {
        state.notifications.unshift(notification)
        if (!notification.read_at) {
            state.unreadCount++
        }
    },

    MARK_AS_READ(state, notificationId) {
        const notification = state.notifications.find(n => n.id === notificationId)
        if (notification && !notification.read_at) {
            notification.read_at = new Date().toISOString()
            state.unreadCount--
        }
    },

    MARK_ALL_AS_READ(state) {
        state.notifications.forEach(notification => {
            if (!notification.read_at) {
                notification.read_at = new Date().toISOString()
            }
        })
        state.unreadCount = 0
    },

    SET_LOADING(state, status) {
        state.isLoading = status
    },

    SET_UNREAD_COUNT(state, count) {
        state.unreadCount = count
    }
}

const actions = {
    async fetch({ commit }, { page = 1 } = {}) {
        commit('SET_LOADING', true)
        try {
            const response = await axios.get(`/api/notifications?page=${page}`)

            if (page === 1) {
                commit('SET_NOTIFICATIONS', response.data.data)
                commit('SET_UNREAD_COUNT', response.data.unread_count)
            }

            return response.data
        } catch (error) {
            console.error('Error fetching notifications:', error)
            throw error
        } finally {
            commit('SET_LOADING', false)
        }
    },

    async markAsRead({ commit }, notificationId) {
        try {
            await axios.post(`/api/notifications/${notificationId}/read`)
            commit('MARK_AS_READ', notificationId)
        } catch (error) {
            console.error('Error marking notification as read:', error)
            throw error
        }
    },

    async markAllAsRead({ commit }) {
        try {
            await axios.post('/api/notifications/mark-all-read')
            commit('MARK_ALL_AS_READ')
        } catch (error) {
            console.error('Error marking all notifications as read:', error)
            throw error
        }
    },

    receiveNotification({ commit }, notification) {
        commit('ADD_NOTIFICATION', notification)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
