<!-- resources/js/Components/Home/BlogPreview.vue -->
<template>
  <section id="blog" class="bg-secondary-light py-20">
    <div class="section-container">
      <!-- Section Header -->
      <div class="text-center mb-16 animate-fade-in">
        <h2 class="mb-4">Latest Articles</h2>
        <p class="text-primary-light max-w-2xl mx-auto">
          Discover knowledge across various fields: Mathematics, Languages,
          Entrepreneurship, and Technology
        </p>
        <div class="w-24 h-1 bg-primary mx-auto rounded-full mt-4"></div>
      </div>

      <!-- Category Navigation -->
      <div class="mb-12">
        <div class="flex flex-wrap justify-center gap-4">
          <button v-for="category in categories"
                  :key="category.id"
                  @click="selectedCategory = category.id"
                  :class="[
                    'px-4 py-2 rounded-full transition-all duration-300',
                    selectedCategory === category.id
                      ? 'bg-primary text-secondary font-bold'
                      : 'bg-secondary text-primary-light hover:bg-primary/20'
                  ]">
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Blog Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <template v-for="article in filteredArticles" :key="article.id">
          <!-- Blog Card -->
          <div class="card group hover:shadow-primary/20 hover:shadow-xl">
            <!-- Article Image -->
            <div class="relative overflow-hidden rounded-lg mb-4">
              <div class="aspect-w-16 aspect-h-9 bg-secondary">
                <img v-if="article.image"
                     :src="article.image"
                     :alt="article.title"
                     class="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                <!-- Placeholder if no image -->
                <div v-else class="w-full h-full flex items-center justify-center bg-secondary-dark">
                  <i :class="getCategoryIcon(article.categoryId)" class="text-4xl text-primary-light"></i>
                </div>
              </div>
              <!-- Category Badge -->
              <div class="absolute top-4 right-4 px-3 py-1 bg-primary text-secondary text-sm font-semibold rounded-full">
                {{ getCategoryName(article.categoryId) }}
              </div>
            </div>

            <!-- Article Content -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {{ article.title }}
              </h3>
              <p class="text-primary-light line-clamp-3">
                {{ article.excerpt }}
              </p>

              <!-- Article Metadata -->
              <div class="flex items-center justify-between pt-4">
                <div class="flex items-center space-x-2 text-sm text-primary-light">
                  <i class="far fa-clock"></i>
                  <span>{{ formatDate(article.date) }}</span>
                </div>
                <a href="#"
                   class="text-primary font-medium hover:text-primary-dark transition-colors inline-flex items-center space-x-1">
                  <span>Read More</span>
                  <i class="fas fa-arrow-right text-sm"></i>
                </a>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- View All Button -->
      <div class="text-center mt-12">
        <button class="btn-secondary inline-flex items-center space-x-2">
          <span>View All Articles</span>
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'BlogPreview',
  data() {
    return {
      selectedCategory: 'all',
      categories: [
        { id: 'all', name: 'All Categories', icon: 'fas fa-th-large' },
        { id: 'math', name: 'Mathematics', icon: 'fas fa-square-root-alt' },
        { id: 'language', name: 'Languages', icon: 'fas fa-language' },
        { id: 'business', name: 'Business', icon: 'fas fa-briefcase' },
        { id: 'tech', name: 'Technology', icon: 'fas fa-laptop-code' }
      ],
      articles: [
        {
          id: 1,
          categoryId: 'math',
          title: 'Understanding Calculus: A Beginner's Guide',
          excerpt: 'Break down complex calculus concepts into simple, digestible pieces...',
          date: '2024-01-20',
          image: null, // Add image URL when available
        },
        {
          id: 2,
          categoryId: 'language',
          title: 'Master English Conversation in 30 Days',
          excerpt: 'Practical tips and techniques for improving your English speaking skills...',
          date: '2024-01-19',
          image: null,
        },
        {
          id: 3,
          categoryId: 'business',
          title: 'Starting Your First Online Business',
          excerpt: 'Step-by-step guide to launching your digital entrepreneurship journey...',
          date: '2024-01-18',
          image: null,
        },
        {
          id: 4,
          categoryId: 'tech',
          title: 'Frontend Development Fundamentals',
          excerpt: 'Essential concepts every aspiring web developer should know...',
          date: '2024-01-17',
          image: null,
        },
        {
          id: 5,
          categoryId: 'math',
          title: 'Algebra Made Simple',
          excerpt: 'Breaking down algebraic concepts for high school students...',
          date: '2024-01-16',
          image: null,
        },
        {
          id: 6,
          categoryId: 'language',
          title: 'Arabic Language Basics',
          excerpt: 'Introduction to Arabic alphabet and essential phrases...',
          date: '2024-01-15',
          image: null,
        }
      ]
    }
  },
  computed: {
    filteredArticles() {
      if (this.selectedCategory === 'all') {
        return this.articles.slice(0, 6) // Limit to 6 articles
      }
      return this.articles
        .filter(article => article.categoryId === this.selectedCategory)
        .slice(0, 6)
    }
  },
  methods: {
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.name : ''
    },
    getCategoryIcon(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.icon : 'fas fa-file'
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>
