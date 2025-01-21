<!-- resources/js/views/dashboard/EditorDashboard.vue -->
<template>
  <div>
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Pending Reviews -->
      <div class="bg-secondary rounded-lg p-6 border border-primary/10">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-primary-light text-sm">Pending Reviews</p>
            <h3 class="text-2xl font-bold text-primary mt-1">{{ stats.pendingReviews }}</h3>
          </div>
          <div class="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <i class="fas fa-clock text-yellow-500"></i>
          </div>
        </div>
        <div class="mt-4 flex items-center text-xs">
          <span :class="getGrowthClass(stats.pendingReviewsGrowth)">
            <i :class="stats.pendingReviewsGrowth > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-1"></i>
            {{ Math.abs(stats.pendingReviewsGrowth) }}%
          </span>
          <span class="text-primary-light/60 ml-2">vs last week</span>
        </div>
      </div>

      <!-- Approved Articles -->
      <div class="bg-secondary rounded-lg p-6 border border-primary/10">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-primary-light text-sm">Approved Articles</p>
            <h3 class="text-2xl font-bold text-primary mt-1">{{ stats.approvedArticles }}</h3>
          </div>
          <div class="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
            <i class="fas fa-check-circle text-green-500"></i>
          </div>
        </div>
        <div class="mt-4 flex items-center text-xs">
          <span class="text-green-500">
            <i class="fas fa-arrow-up mr-1"></i>
            {{ stats.approvedArticlesGrowth }}%
          </span>
          <span class="text-primary-light/60 ml-2">vs last week</span>
        </div>
      </div>

      <!-- Rejected Articles -->
      <div class="bg-secondary rounded-lg p-6 border border-primary/10">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-primary-light text-sm">Rejected Articles</p>
            <h3 class="text-2xl font-bold text-primary mt-1">{{ stats.rejectedArticles }}</h3>
          </div>
          <div class="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
            <i class="fas fa-times-circle text-red-500"></i>
          </div>
        </div>
        <div class="mt-4 flex items-center text-xs">
          <span class="text-red-500">
            <i class="fas fa-arrow-up mr-1"></i>
            {{ stats.rejectedArticlesGrowth }}%
          </span>
          <span class="text-primary-light/60 ml-2">vs last week</span>
        </div>
      </div>
    </div>

    <!-- Articles Pending Review -->
    <div class="bg-secondary rounded-lg border border-primary/10 mb-6">
      <div class="p-6 border-b border-primary/10 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-primary">Articles Pending Review</h2>
        <div class="flex items-center space-x-2">
          <div class="relative">
            <select
              v-model="filterStatus"
              class="appearance-none bg-secondary-dark border border-primary/20 rounded-lg
                     px-4 py-2 pr-8 text-primary-light focus:outline-none focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="revision">Needs Revision</option>
            </select>
            <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-primary-light/50"></i>
          </div>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search articles..."
            class="bg-secondary-dark border border-primary/20 rounded-lg px-4 py-2
                   text-primary-light placeholder-primary-light/50 focus:outline-none
                   focus:border-primary"
          >
        </div>
      </div>

      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-primary-light text-sm">
                <th class="pb-4">Title</th>
                <th class="pb-4">Author</th>
                <th class="pb-4">Category</th>
                <th class="pb-4">Submitted</th>
                <th class="pb-4">Status</th>
                <th class="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="article in filteredArticles"
                  :key="article.id"
                  class="border-t border-primary/10">
                <td class="py-4">
                  <div class="flex items-center">
                    <img :src="article.thumbnail"
                         :alt="article.title"
                         class="h-10 w-10 rounded object-cover">
                    <div class="ml-3">
                      <p class="text-primary font-medium">{{ article.title }}</p>
                      <p class="text-sm text-primary-light/60">
                        {{ article.excerpt.substring(0, 50) }}...
                      </p>
                    </div>
                  </div>
                </td>
                <td class="py-4">
                  <div class="flex items-center space-x-2">
                    <div class="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span class="text-primary text-sm">{{ getInitials(article.author) }}</span>
                    </div>
                    <span class="text-primary-light">{{ article.author }}</span>
                  </div>
                </td>
                <td class="py-4">
                  <span class="px-3 py-1 rounded-full text-xs"
                        :class="getCategoryClass(article.category)">
                    {{ article.category }}
                  </span>
                </td>
                <td class="py-4 text-primary-light">
                  {{ formatDate(article.submitted_at) }}
                </td>
                <td class="py-4">
                  <span class="px-3 py-1 rounded-full text-xs"
                        :class="getStatusClass(article.status)">
                    {{ article.status }}
                  </span>
                </td>
                <td class="py-4">
                  <div class="flex items-center space-x-2">
                    <button class="text-primary hover:text-primary-dark"
                            @click="reviewArticle(article.id)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-green-500 hover:text-green-600"
                            @click="approveArticle(article.id)">
                      <i class="fas fa-check"></i>
                    </button>
                    <button class="text-yellow-500 hover:text-yellow-600"
                            @click="requestRevision(article.id)">
                      <i class="fas fa-redo"></i>
                    </button>
                    <button class="text-red-500 hover:text-red-600"
                            @click="rejectArticle(article.id)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex items-center justify-between">
          <p class="text-sm text-primary-light">
            Showing {{ paginationInfo.from }}-{{ paginationInfo.to }} of {{ paginationInfo.total }} articles
          </p>
          <div class="flex items-center space-x-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded-lg border border-primary/20 text-primary-light
                     hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === paginationInfo.lastPage"
              class="px-3 py-1 rounded-lg border border-primary/20 text-primary-light
                     hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'EditorDashboard',

  setup() {
    const store = useStore()
    const router = useRouter()

    // Reactive state
    const stats = ref({
      pendingReviews: 0,
      pendingReviewsGrowth: 0,
      approvedArticles: 0,
      approvedArticlesGrowth: 0,
      rejectedArticles: 0,
      rejectedArticlesGrowth: 0
    })

    const articles = ref([])
    const filterStatus = ref('all')
    const searchQuery = ref('')
    const currentPage = ref(1)
    const paginationInfo = ref({
      from: 0,
      to: 0,
      total: 0,
      lastPage: 1
    })

    // Computed
    const filteredArticles = computed(() => {
      let filtered = [...articles.value]

      // Apply status filter
      if (filterStatus.value !== 'all') {
        filtered = filtered.filter(article =>
          article.status.toLowerCase() === filterStatus.value
        )
      }

      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(article =>
          article.title.toLowerCase().includes(query) ||
          article.author.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query)
        )
      }

      return filtered
    })

    // Methods
    const fetchDashboardData = async () => {
      try {
        const response = await store.dispatch('dashboard/fetchEditorStats')
        stats.value = response.stats
        articles.value = response.articles
        paginationInfo.value = response.pagination
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getInitials = (name) => {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    }

    const getStatusClass = (status) => {
      const classes = {
        pending: 'bg-yellow-500/10 text-yellow-500',
        reviewing: 'bg-blue-500/10 text-blue-500',
        revision: 'bg-orange-500/10 text-orange-500',
        approved: 'bg-green-500/10 text-green-500',
        rejected: 'bg-red-500/10 text-red-500'
      }
      return classes[status.toLowerCase()]
    }

    const getCategoryClass = (category) => {
      // Add your category-specific colors here
      return 'bg-primary/10 text-primary-light'
    }

    const getGrowthClass = (growth) => {
      return growth > 0 ? 'text-green-500' : 'text-red-500'
    }

    // Article actions
    const reviewArticle = (id) => {
      router.push(`/articles/${id}/review`)
    }

    const approveArticle = async (id) => {
      try {
        await store.dispatch('articles/approveArticle', id)
        await fetchDashboardData()
      } catch (error) {
        console.error('Error approving article:', error)
      }
    }

    const requestRevision = async (id) => {
      try {
        await store.dispatch('articles/requestRevision', id)
        await fetchDashboardData()
      } catch (error) {
        console.error('Error requesting revision:', error)
      }
    }

    const rejectArticle = async (id) => {
      if (confirm('Are you sure you want to reject this article?')) {
        try {
          await store.dispatch('articles/rejectArticle', id)
          await fetchDashboardData()
        } catch (error) {
          console.error('Error rejecting article:', error)
        }
      }
    }

    const changePage = (page) => {
      currentPage.value = page
      fetchDashboardData()
    }

    // Lifecycle hooks
    onMounted(() => {
      fetchDashboardData()
    })

    return {
      stats,
      articles,
      filteredArticles,
      filterStatus,
      searchQuery,
      currentPage,
      paginationInfo,
      formatDate,
      getInitials,
      getStatusClass,
      getCategoryClass,
      getGrowthClass,
      reviewArticle,
      approveArticle,
      requestRevision,
      rejectArticle,
      changePage
    }
  }
}
</script>
