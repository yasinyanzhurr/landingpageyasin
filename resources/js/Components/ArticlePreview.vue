<!-- resources/js/components/ArticlePreview.vue -->
<template>
  <div class="bg-secondary-dark">
    <!-- Article Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-primary mb-4">{{ article.title }}</h1>

      <div class="flex items-center justify-between">
        <!-- Author Info -->
        <div class="flex items-center space-x-4">
          <div class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span class="text-primary font-medium">{{ authorInitials }}</span>
          </div>
          <div>
            <p class="text-primary font-medium">{{ article.author?.name }}</p>
            <p class="text-sm text-primary-light">
              {{ formatDate(article.created_at) }}
            </p>
          </div>
        </div>

        <!-- Category -->
        <span :class="getCategoryClass(article.category?.name)"
              class="px-3 py-1 rounded-full text-sm">
          {{ article.category?.name }}
        </span>
      </div>
    </div>

    <!-- Featured Image -->
    <div v-if="article.thumbnail" class="mb-8">
      <img :src="article.thumbnail"
           :alt="article.title"
           class="w-full rounded-lg object-cover max-h-96">
    </div>

    <!-- Article Content -->
    <div class="prose prose-lg prose-invert max-w-none">
      <div v-html="renderedContent"></div>
    </div>

    <!-- Tags -->
    <div v-if="article.tags?.length" class="mt-8 pt-8 border-t border-primary/10">
      <div class="flex flex-wrap gap-2">
        <span v-for="tag in article.tags"
              :key="tag"
              class="px-3 py-1 rounded-full bg-primary/10 text-primary-light text-sm">
          #{{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { marked } from 'marked'

export default {
  name: 'ArticlePreview',

  props: {
    article: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const authorInitials = computed(() => {
      if (!props.article.author?.name) return ''
      return props.article.author.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    })

    const renderedContent = computed(() => {
      return marked(props.article.content || '')
    })

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getCategoryClass = (category) => {
      // Add your category-specific colors here
      return 'bg-blue-500/10 text-blue-500'
    }

    return {
      authorInitials,
      renderedContent,
      formatDate,
      getCategoryClass
    }
  }
}
</script>

<style scoped>
.prose {
  @apply text-primary-light;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  @apply text-primary font-bold;
}

.prose a {
  @apply text-blue-400 hover:text-blue-300;
}

.prose blockquote {
  @apply border-l-4 border-primary/20 pl-4 italic;
}

.prose code {
  @apply bg-primary/10 px-1 py-0.5 rounded text-primary-light;
}

.prose pre {
  @apply bg-secondary p-4 rounded-lg overflow-x-auto;
}

.prose img {
  @apply rounded-lg;
}

.prose ul,
.prose ol {
  @apply space-y-2;
}
</style>
