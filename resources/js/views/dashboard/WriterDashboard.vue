<!-- resources/js/views/dashboard/WriterDashboard.vue -->
<template>
  <div>
    <!-- Welcome Message -->
    <div class="bg-secondary rounded-lg border border-primary/10 p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-primary">
            Welcome back, {{ user.name }}!
          </h1>
          <p class="mt-1 text-primary-light">
            Last login: {{ formatDate(user.last_login) }}
          </p>
        </div>
        <button
          @click="createNewArticle"
          class="btn-primary flex items-center space-x-2"
        >
          <i class="fas fa-plus"></i>
          <span>New Article</span>
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
      </div>

      <!-- Published Articles -->
      <div class="bg-secondary rounded-lg p-6 border border-primary/10">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-primary-light text-sm">Published</p>
            <h3 class="text-2xl font-bold text-green-500 mt-1">{{ stats.publishedArticles }}</h3>
          </div>
          <div class="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
            <i class="fas fa-check-circle text-green-500"></i>
          </div>
        </div>
      </div>

      <!-- Pending Articles -->
      <div class="bg-secondary rounded-lg p-6 border border-primary/10">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-primary-light text-sm">Pending Review</p>
            <h3 class="text-2xl font-bold text-yellow-500 mt-1">{{ stats.pendingArticles }}</h3>
          </div>
          <div class="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <i class="fas fa-clock text-yellow-500"></i>
          </div>
        </div>
      </div>

      <!-- Total Views -->
      <div class="bg-secondary rounded-lg p-6 border border-primary/10">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-primary-light text-sm">Total Views</p>
            <h3 class="text-2xl font-bold text-blue-500 mt-1">{{ stats.totalViews }}</h3>
          </div>
          <div class="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <i class="fas fa-eye text-blue-500"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Article Management -->
    <div class="bg-secondary rounded-lg border border-primary/10">
      <div class="p-6 border-b border-primary/10 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-primary">My Articles</h2>
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search articles..."
              class="bg-secondary-dark border border-primary/20 rounded-lg pl-10 pr-4 py-2
                     text-primary-light placeholder-primary-light/50 focus:outline-none
                     focus:border-primary"
            >
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-primary-light/50"></i>
          </div>
          <!-- Filter -->
          <select
            v-model="filterStatus"
            class="bg-secondary-dark border border-primary/20 rounded-lg px-4 py-2
                   text-primary-light focus:outline-none focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending Review</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <!-- Articles Table -->
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-primary-light text-sm">
                <th class="pb-4">Title</th>
                <th class="pb-4">Category</th>
                <th class="pb-4">Status</th>
                <th class="pb-4">Views</th>
                <th class="pb-4">Last Updated</th>
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
                  <span class="px-3 py-1 rounded-full text-xs"
                        :class="getCategoryClass(article.category)">
                    {{ article.category }}
                  </span>
                </td>
                <td class="py-4">
                  <span class="px-3 py-1 rounded-full text-xs"
                        :class="getStatusClass(article.status)">
                    {{ article.status }}
                  </span>
                </td>
                <td class="py-4 text-primary-light">
                  {{ article.views }}
                </td>
                <td class="py-4 text-primary-light">
                  {{ formatDate(article.updated_at) }}
                </td>
                <td class="py-4">
                  <div class="flex items-center space-x-2">
                    <button v-if="article.status === 'published'"
                            class="text-blue-500 hover:text-blue-600"
                            @click="viewArticle(article.id)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button v-if="canEdit(article.status)"
                            class="text-yellow-500 hover:text-yellow-600"
                            @click="editArticle(article.id)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button v-if="article.status === 'draft'"
                            class="text-green-500 hover:text-green-600"
                            @click="submitForReview(article.id)">
                      <i class="fas fa-paper-plane"></i>
                    </button>
                    <button v-if="canDelete(article.status)"
                            class="text-red-500 hover:text-red-600"
                            @click="deleteArticle(article.id)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredArticles.length === 0"
             class="text-center py-12">
          <div class="h-20 w-20 mx-auto mb-4 text-primary-light/30">
            <i class="fas fa-newspaper text-5xl"></i>
          </div>
          <h3 class="text-primary font-medium mb-2">No Articles Found</h3>
          <p class="text-primary-light/60">
            {{ searchQuery ? 'Try different search terms' : 'Start writing your first article' }}
          </p>
          <button
            @click="createNewArticle"
            class="btn-primary mt-4"
          >
            Create New Article
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="filteredArticles.length > 0"
             class="mt-6 flex items-center justify-between">
          <p class="text-sm text-primary-light">
            Showing {{ paginationInfo.from }}-{{ paginationInfo.to }}
            of {{ paginationInfo.total }} articles
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
  name: 'WriterDashboard',

  setup() {
    const store = useStore()
    const router = useRouter()

    // User data
    const user = computed(() => store.getters['auth/currentUser'])

    // Reactive state
    const stats = ref({
      totalArticles: 0,
      publishedArticles: 0,
      pendingArticles: 0,
      totalViews: 0
    })

    const articles = ref([])
    const searchQuery = ref('')
    const filterStatus = ref('all')
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
          article.category.toLowerCase().includes(query)
        )
      }

      return filtered
    })

    // Methods
    const fetchDashboardData = async () => {
      try {
        const response = await store.dispatch('dashboard/fetchWriterStats')
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

    const getStatusClass = (status) => {
      const classes = {
        draft: 'bg-primary/10 text-primary-light',
        pending: 'bg-yellow-500/10 text-yellow-500',
        published: 'bg-green-500/10 text-green-500',
        rejected: 'bg-red-500/10 text-red-500'
      }
      return classes[status.toLowerCase()]
    }

    const getCategoryClass = (category) => {
      return 'bg-blue-500/10 text-blue-500'
    }

    const canEdit = (status) => {
      return ['draft', 'rejected'].includes(status.toLowerCase())
    }

    const canDelete = (status) => {
      return ['draft', 'rejected'].includes(status.toLowerCase())
    }

    // Actions
    const createNewArticle = () => {
      router.push('/articles/create')
    }

    const viewArticle = (id) => {
      router.push(`/articles/${id}`)
    }

    const editArticle = (id) => {
      router.push(`/articles/${id}/edit`)
    }

    const submitForReview = async (id) => {
      if (confirm('Are you sure you want to submit this article for review?')) {
        try {
          await store.dispatch('articles/submitForReview', id)
          await fetchDashboardData()
        } catch (error) {
          console.error('Error submitting article:', error)
        }
      }
    }

    const deleteArticle = async (id) => {
      if (confirm('Are you sure you want to delete this article?')) {
        try {
          await store.dispatch('articles/deleteArticle', id)
          await fetchDashboardData()
        } catch (error) {
          console.error('Error deleting article:', error)
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
      user,
      stats,
      articles,
      filteredArticles,
      searchQuery,
      filterStatus,
      currentPage,
      paginationInfo,
      formatDate,
      getStatusClass,
      getCategoryClass,
      canEdit,
      canDelete,
      createNewArticle,
      viewArticle,
      editArticle,
      submitForReview,
      deleteArticle,
      changePage
    }
  }
}
</script>

<style scoped>
.btn-primary {
  @apply py-2 px-4 rounded-lg bg-primary text-white font-medium
         hover:bg-primary-dark transition-all duration-300
         focus:outline-none focus:ring-2 focus:ring-primary
         focus:ring-offset-2 focus:ring-offset-secondary-dark
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply py-2 px-4 rounded-lg border border-primary/20 text-primary-light
         hover:bg-primary/10 transition-all duration-300
         focus:outline-none focus:ring-2 focus:ring-primary
         focus:ring-offset-2 focus:ring-offset-secondary-dark
         disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
