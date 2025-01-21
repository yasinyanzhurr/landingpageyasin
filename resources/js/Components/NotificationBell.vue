<!-- resources/js/components/NotificationBell.vue -->
<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="relative p-2 text-primary-light hover:text-primary
             transition-colors duration-200"
      :class="{ 'text-primary': showDropdown }"
    >
      <i class="fas fa-bell"></i>
      <span v-if="unreadCount"
            class="absolute -top-1 -right-1 h-5 w-5 bg-red-500
                   rounded-full text-white text-xs flex items-center
                   justify-center">
        {{ unreadCount }}
      </span>
    </button>

    <!-- Notifications Dropdown -->
    <div v-if="showDropdown"
         class="absolute right-0 mt-2 w-80 max-h-[480px] overflow-y-auto
                bg-secondary-dark border border-primary/20 rounded-lg
                shadow-lg z-50">
      <!-- Header -->
      <div class="p-4 border-b border-primary/20 flex items-center justify-between">
        <h3 class="text-lg font-medium text-primary">
          Notifications
        </h3>
        <button
          v-if="hasUnread"
          @click="markAllAsRead"
          class="text-sm text-primary-light hover:text-primary"
        >
          Mark all as read
        </button>
      </div>

      <!-- Notification List -->
      <div v-if="notifications.length" class="divide-y divide-primary/10">
        <div v-for="notification in notifications"
             :key="notification.id"
             class="p-4 hover:bg-primary/5 transition-colors
                    cursor-pointer"
             :class="{ 'bg-primary/10': !notification.read_at }"
             @click="handleNotificationClick(notification)"
        >
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 rounded-full bg-primary/20
                          flex items-center justify-center">
                <i class="fas fa-comment text-primary"></i>
              </div>
            </div>
            <div class="flex-grow">
              <p class="text-primary-light">
                <span class="font-medium">
                  {{ notification.data.user_name }}
                </span>
                commented on your article
              </p>
              <p class="text-sm text-primary-light/70 mt-1">
                {{ notification.data.content }}
              </p>
              <p class="text-xs text-primary-light/50 mt-2">
                {{ formatDate(notification.created_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="p-8 text-center">
        <div class="h-16 w-16 mx-auto mb-4">
          <i class="fas fa-bell-slash text-4xl text-primary-light/30"></i>
        </div>
        <p class="text-primary-light">No notifications yet</p>
      </div>

      <!-- Load More -->
      <div v-if="hasMoreNotifications"
           class="p-4 border-t border-primary/20 text-center">
        <button
          @click="loadMoreNotifications"
          class="text-sm text-primary-light hover:text-primary"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'NotificationBell',

  setup() {
    const store = useStore()
    const router = useRouter()

    // State
    const showDropdown = ref(false)
    const notifications = ref([])
    const currentPage = ref(1)
    const lastPage = ref(1)
    const isLoading = ref(false)

    // Computed
    const unreadCount = computed(() => {
      return notifications.value.filter(n => !n.read_at).length
    })

    const hasUnread = computed(() => unreadCount.value > 0)

    const hasMoreNotifications = computed(() => {
      return currentPage.value < lastPage.value
    })

    // Methods
    const fetchNotifications = async (page = 1) => {
      try {
        isLoading.value = true
        const response = await store.dispatch('notifications/fetch', { page })

        if (page === 1) {
          notifications.value = response.data
        } else {
          notifications.value.push(...response.data)
        }

        currentPage.value = response.current_page
        lastPage.value = response.last_page
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        isLoading.value = false
      }
    }

    const loadMoreNotifications = () => {
      fetchNotifications(currentPage.value + 1)
    }

    const markAsRead = async (notificationId) => {
      try {
        await store.dispatch('notifications/markAsRead', notificationId)
        const notification = notifications.value.find(n => n.id === notificationId)
        if (notification) {
          notification.read_at = new Date().toISOString()
        }
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    }

    const markAllAsRead = async () => {
      try {
        await store.dispatch('notifications/markAllAsRead')
        notifications.value.forEach(notification => {
          if (!notification.read_at) {
            notification.read_at = new Date().toISOString()
          }
        })
      } catch (error) {
        console.error('Error marking all notifications as read:', error)
      }
    }

    const handleNotificationClick = async (notification) => {
      if (!notification.read_at) {
        await markAsRead(notification.id)
      }

      // Navigate to the article with the comment
      router.push({
        name: 'article.show',
        params: { id: notification.data.article_id },
        hash: `#comment-${notification.data.comment_id}`
      })

      showDropdown.value = false
    }

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
      if (showDropdown.value) {
        fetchNotifications()
      }
    }

    const formatDate = (date) => {
      const now = new Date()
      const notifDate = new Date(date)
      const diffTime = Math.abs(now - notifDate)
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
      const diffMinutes = Math.floor(diffTime / (1000 * 60))

      if (diffMinutes < 1) {
        return 'Just now'
      } else if (diffMinutes < 60) {
        return `${diffMinutes}m ago`
      } else if (diffHours < 24) {
        return `${diffHours}h ago`
      } else if (diffDays === 1) {
        return 'Yesterday'
      } else {
        return notifDate.toLocaleDateString()
      }
    }

    // Click outside handler
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-bell')) {
        showDropdown.value = false
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      showDropdown,
      notifications,
      isLoading,
      unreadCount,
      hasUnread,
      hasMoreNotifications,
      toggleDropdown,
      loadMoreNotifications,
      markAllAsRead,
      handleNotificationClick,
      formatDate
    }
  }
}
</script>

