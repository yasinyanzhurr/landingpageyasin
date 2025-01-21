<!-- resources/js/views/dashboard/AdminDashboard.vue -->
<template>
  <div>
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Total Articles -->
      <div class="bg-secondary rounded-lg p-6 border border-primary/10">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-primary-light text-sm">Total Articles</p>
            <h3 class="text-2xl font-bold text-primary mt-1">{{ stats.totalArticles }}</h3>
          </div>
          <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <i class="fas fa-newspaper text-primary"></i>
          </div>
        </div>
        <div class="mt-4 flex items-center text-xs">
          <span class="text-green-500">
            <i class="fas fa-arrow-up mr-1"></i>
            {{ stats.articlesGrowth }}%
          </span>
          <span class="text-primary-light/60 ml-2">vs last month</span>
        </div>
      </div>

      <!-- Total Users -->
      <div class="bg-secondary rounded-lg p-6 border border-primary/10">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-primary-light text-sm">Total Users</p>
            <h3 class="text-2xl font-bold text-primary mt-1">{{ stats.totalUsers }}</h3>
          </div>
          <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <i class="fas fa-users text-primary"></i>
          </div>
        </div>
        <div class="mt-4 flex items-center text-xs">
          <span class="text-green-500">
            <i class="fas fa-arrow-up mr-1"></i>
            {{ stats.usersGrowth }}%
          </span>
          <span class="text-primary-light/60 ml-2">vs last month</span>
        </div>
      </div>

      <!-- Pending Reviews -->
      <div class="bg-secondary rounded-lg p-6 border border-primary/10">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-primary-light text-sm">Pending Reviews</p>
            <h3 class="text-2xl font-bold text-primary mt-1">{{ stats.pendingReviews }}</h3>
          </div>
          <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <i class="fas fa-clock text-primary"></i>
          </div>
        </div>
        <div class="mt-4 flex items-center text-xs">
          <span class="text-red-500">
            <i class="fas fa-arrow-up mr-1"></i>
            {{ stats.reviewsGrowth }}%
          </span>
          <span class="text-primary-light/60 ml-2">vs last month</span>
        </div>
      </div>

      <!-- Total Views -->
      <div class="bg-secondary rounded-lg p-6 border border-primary/10">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-primary-light text-sm">Total Views</p>
            <h3 class="text-2xl font-bold text-primary mt-1">{{ stats.totalViews }}</h3>
          </div>
          <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <i class="fas fa-eye text-primary"></i>
          </div>
        </div>
        <div class="mt-4 flex items-center text-xs">
          <span class="text-green-500">
            <i class="fas fa-arrow-up mr-1"></i>
            {{ stats.viewsGrowth }}%
          </span>
          <span class="text-primary-light/60 ml-2">vs last month</span>
        </div>
      </div>
    </div>

    <!-- Recent Articles -->
    <div class="bg-secondary rounded-lg border border-primary/10 mb-6">
      <div class="p-6 border-b border-primary/10">
        <h2 class="text-xl font-semibold text-primary">Recent Articles</h2>
      </div>
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-primary-light text-sm">
                <th class="pb-4">Title</th>
                <th class="pb-4">Author</th>
                <th class="pb-4">Status</th>
                <th class="pb-4">Date</th>
                <th class="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody class="text-primary-light">
              <tr v-for="article in recentArticles"
                  :key="article.id"
                  class="border-t border-primary/10">
                <td class="py-4">
                  <div class="flex items-center">
                    <img :src="article.thumbnail"
                         :alt="article.title"
                         class="h-10 w-10 rounded object-cover">
                    <span class="ml-3">{{ article.title }}</span>
                  </div>
                </td>
                <td class="py-4">{{ article.author }}</td>
                <td class="py-4">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs',
                    getStatusClass(article.status)
                  ]">
                    {{ article.status }}
                  </span>
                </td>
                <td class="py-4">{{ formatDate(article.created_at) }}</td>
                <td class="py-4">
                  <div class="flex items-center space-x-2">
                    <button class="text-primary hover:text-primary-dark"
                            @click="viewArticle(article.id)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-yellow-500 hover:text-yellow-600"
                            @click="editArticle(article.id)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-500 hover:text-red-600"
                            @click="deleteArticle(article.id)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Latest Activities -->
    <div class="bg-secondary rounded-lg border border-primary/10">
      <div class="p-6 border-b border-primary/10">
        <h2 class="text-xl font-semibold text-primary">Latest Activities</h2>
      </div>
      <div class="p-6">
        <div class="space-y-6">
          <div v-for="activity in activities"
               :key="activity.id"
               class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <i :class="getActivityIcon(activity.type)" class="text-primary"></i>
              </div>
            </div>
            <div>
              <p class="text-primary">{{ activity.description }}</p>
              <p class="text-sm text-primary-light/60">{{ formatDate(activity.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'AdminDashboard',

  setup() {
    const store = useStore()
    const router = useRouter()

    // Stats data
    const stats = ref({
      totalArticles: 0,
      articlesGrowth: 0,
      totalUsers: 0,
      usersGrowth: 0,
      pendingReviews: 0,
      reviewsGrowth: 0,
      totalViews: 0,
      viewsGrowth: 0
    })

    // Recent articles
    const recentArticles = ref([])

    // Activities
    const activities = ref([])

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await store.dispatch('dashboard/fetchAdminStats')
        stats.value = response.stats
        recentArticles.value = response.recentArticles
        activities.value = response.activities
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    // Format date
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Get status class
    const getStatusClass = (status) => {
      const classes = {
        published: 'bg-green-500/10 text-green-500',
        pending: 'bg-yellow-500/10 text-yellow-500',
        rejected: 'bg-red-500/10 text-red-500',
        draft: 'bg-primary/10 text-primary-light'
      }
      return classes[status.toLowerCase()] || classes.draft
    }

    // Get activity icon
    const getActivityIcon = (type) => {
      const icons = {
        article: 'fas fa-newspaper',
        user: 'fas fa-user',
        review: 'fas fa-check-circle',
        comment: 'fas fa-comment'
      }
      return icons[type] || 'fas fa-info-circle'
    }

    // Article actions
    const viewArticle = (id) => {
      router.push(`/articles/${id}`)
    }

    const editArticle = (id) => {
      router.push(`/articles/${id}/edit`)
    }

    const deleteArticle = async (id) => {
      if (confirm('Are you sure you want to delete this article?')) {
        try {
          await store.dispatch('articles/deleteArticle', id)
          await fetchDashboardData() // Refresh data
        } catch (error) {
          console.error('Error deleting article:', error)
        }
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      fetchDashboardData()
    })

    return {
      stats,
      recentArticles,
      activities,
      formatDate,
      getStatusClass,
      getActivityIcon,
      viewArticle,
      editArticle,
      deleteArticle
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
