<!-- resources/js/views/articles/EditArticle.vue -->
<template>
  <div class="max-w-5xl mx-auto">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-primary">
        <i class="fas fa-circle-notch fa-spin fa-3x"></i>
      </div>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-primary mb-2">Edit Article</h1>
            <p class="text-primary-light">
              Last updated: {{ formatDate(article.updated_at) }}
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <span :class="getStatusClass(article.status)"
                  class="px-3 py-1 rounded-full text-sm">
              {{ article.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div class="space-y-2">
          <label for="title" class="block text-sm font-medium text-primary-light">
            Article Title
          </label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            class="form-input w-full"
            :class="{ 'border-red-500': errors.title }"
            @blur="validateField('title')"
          >
          <p v-if="errors.title" class="text-red-500 text-xs mt-1">
            {{ errors.title }}
          </p>
        </div>

        <!-- Category -->
        <div class="space-y-2">
          <label for="category" class="block text-sm font-medium text-primary-light">
            Category
          </label>
          <select
            id="category"
            v-model="formData.category_id"
            required
            class="form-select w-full"
            :class="{ 'border-red-500': errors.category_id }"
            @blur="validateField('category_id')"
          >
            <option value="">Select a category</option>
            <option v-for="category in categories"
                    :key="category.id"
                    :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <p v-if="errors.category_id" class="text-red-500 text-xs mt-1">
            {{ errors.category_id }}
          </p>
        </div>

        <!-- Thumbnail -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-primary-light">
            Article Thumbnail
          </label>
          <div class="flex items-center space-x-4">
            <!-- Current Thumbnail -->
            <div v-if="article.thumbnail || thumbnailPreview"
                 class="relative h-32 w-32 group">
              <img
                :src="thumbnailPreview || article.thumbnail"
                alt="Thumbnail"
                class="h-full w-full object-cover rounded-lg"
              >
              <button
                type="button"
                @click="removeThumbnail"
                class="absolute inset-0 bg-black/50 flex items-center justify-center
                       text-white opacity-0 group-hover:opacity-100 transition-opacity
                       rounded-lg"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>

            <!-- Upload New Thumbnail -->
            <div class="flex-1">
              <div class="relative">
                <input
                  type="file"
                  ref="thumbnailInput"
                  class="hidden"
                  accept="image/*"
                  @change="handleThumbnailChange"
                >
                <button
                  type="button"
                  @click="$refs.thumbnailInput.click()"
                  class="w-full px-4 py-2 border-2 border-dashed border-primary/20
                         rounded-lg text-primary-light hover:border-primary
                         transition-colors duration-300"
                >
                  <i class="fas fa-cloud-upload-alt mr-2"></i>
                  {{ article.thumbnail ? 'Change Image' : 'Upload Image' }}
                </button>
              </div>
            </div>
          </div>
          <p v-if="errors.thumbnail" class="text-red-500 text-xs mt-1">
            {{ errors.thumbnail }}
          </p>
        </div>

        <!-- Content Editor -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-primary-light">
            Content
          </label>
          <div class="border border-primary/20 rounded-lg overflow-hidden">
            <!-- Editor Toolbar -->
            <div class="bg-secondary-dark border-b border-primary/20 p-2
                      flex items-center space-x-2">
              <button
                v-for="tool in editorTools"
                :key="tool.command"
                type="button"
                class="p-2 rounded hover:bg-primary/10 text-primary-light"
                :title="tool.title"
                @click="applyFormatting(tool.command)"
              >
                <i :class="tool.icon"></i>
              </button>
            </div>

            <!-- Content Area -->
            <textarea
              v-model="formData.content"
              rows="12"
              required
              class="w-full bg-secondary p-4 text-primary-light focus:outline-none"
              :class="{ 'border-red-500': errors.content }"
              @blur="validateField('content')"
            ></textarea>
          </div>
          <p v-if="errors.content" class="text-red-500 text-xs mt-1">
            {{ errors.content }}
          </p>
        </div>

        <!-- Tags -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-primary-light">
            Tags
          </label>
          <div class="flex flex-wrap items-center gap-2">
            <div v-for="tag in formData.tags"
                 :key="tag"
                 class="px-3 py-1 rounded-full bg-primary/10 text-primary-light
                        flex items-center space-x-2">
              <span>{{ tag }}</span>
              <button type="button" @click="removeTag(tag)">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <input
              v-model="newTag"
              type="text"
              class="form-input flex-1"
              placeholder="Add tags (press Enter)"
              @keydown.enter.prevent="addTag"
            >
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between pt-6 border-t border-primary/10">
          <!-- Delete Button -->
          <button
            type="button"
            @click="confirmDelete"
            class="btn-danger"
            :disabled="isLoading"
          >
            <i class="fas fa-trash mr-2"></i>
            Delete Article
          </button>

          <div class="flex items-center space-x-4">
            <!-- Preview Button -->
            <button
              type="button"
              @click="previewArticle"
              class="btn-secondary"
              :disabled="isLoading"
            >
              <i class="fas fa-eye mr-2"></i>
              Preview
            </button>

            <!-- Save Button -->
            <button
              type="submit"
              class="btn-primary"
              :disabled="isLoading || !isFormValid"
            >
              <template v-if="isLoading">
                <i class="fas fa-circle-notch fa-spin mr-2"></i>
                Saving...
              </template>
              <template v-else>
                <i class="fas fa-save mr-2"></i>
                Save Changes
              </template>
            </button>
          </div>
        </div>
      </form>
    </template>

    <!-- Preview Modal -->
    <modal v-if="showPreview" @close="showPreview = false">
      <template #header>
        <h3 class="text-xl font-semibold text-primary">Article Preview</h3>
      </template>

      <template #body>
        <div class="prose prose-invert max-w-none">
          <h1>{{ formData.title }}</h1>
          <div v-html="renderedContent"></div>
        </div>
      </template>
    </modal>

    <!-- Delete Confirmation Modal -->
    <modal v-if="showDeleteModal"
           @close="showDeleteModal = false"
           :closeOnBackdrop="false">
      <template #header>
        <h3 class="text-xl font-semibold text-primary">Delete Article</h3>
      </template>

      <template #body>
        <p class="text-primary-light">
          Are you sure you want to delete this article? This action cannot be undone.
        </p>
      </template>

      <template #footer>
        <button
          @click="showDeleteModal = false"
          class="btn-secondary"
        >
          Cancel
        </button>
        <button
          @click="deleteArticle"
          class="btn-danger"
          :disabled="isLoading"
        >
          <template v-if="isLoading">
            <i class="fas fa-circle-notch fa-spin mr-2"></i>
            Deleting...
          </template>
          <template v-else>
            <i class="fas fa-trash mr-2"></i>
            Delete
          </template>
        </button>
      </template>
    </modal>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { marked } from 'marked'
import Modal from '@/components/Modal.vue'

export default {
  name: 'EditArticle',

  components: {
    Modal
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    // Article ID from route
    const articleId = route.params.id

    // Refs
    const thumbnailInput = ref(null)
    const article = ref(null)
    const isLoading = ref(false)
    const showPreview = ref(false)
    const showDeleteModal = ref(false)
    const thumbnailPreview = ref(null)
    const newTag = ref('')

    // Form data
    const formData = reactive({
      title: '',
      category_id: '',
      content: '',
      thumbnail: null,
      tags: []
    })

    // Errors
    const errors = reactive({})

    // Editor tools
    const editorTools = [
      { icon: 'fas fa-bold', command: 'bold', title: 'Bold' },
      { icon: 'fas fa-italic', command: 'italic', title: 'Italic' },
      { icon: 'fas fa-heading', command: 'heading', title: 'Heading' },
      { icon: 'fas fa-list-ul', command: 'bullet', title: 'Bullet List' },
      { icon: 'fas fa-list-ol', command: 'number', title: 'Numbered List' },
      { icon: 'fas fa-quote-right', command: 'quote', title: 'Quote' },
      { icon: 'fas fa-link', command: 'link', title: 'Link' },
      { icon: 'fas fa-image', command: 'image', title: 'Image' }
    ]

    // Computed
    const categories = computed(() => store.state.categories.list)

    const isFormValid = computed(() => {
      return formData.title &&
             formData.category_id &&
             formData.content &&
             !Object.keys(errors).length
    })

    const renderedContent = computed(() => {
      return marked(formData.content)
    })

    // Methods
    const fetchArticle = async () => {
      isLoading.value = true
      try {
        const response = await store.dispatch('articles/fetchArticle', articleId)
        article.value = response
        // Populate form data
        Object.keys(formData).forEach(key => {
          if (response[key]) {
            formData[key] = response[key]
          }
        })
        formData.category_id = response.category.id
      } catch (error) {
        console.error('Error fetching article:', error)
      } finally {
        isLoading.value = false
      }
    }

    const validateField = (field) => {
      const value = formData[field]
      let fieldError = null

      switch (field) {
        case 'title':
          fieldError = !value ? 'Title is required' :
                      value.length < 5 ? 'Title must be at least 5 characters' :
                      value.length > 100 ? 'Title must not exceed 100 characters' :
                      null
          break
        case 'category_id':
          fieldError = !value ? 'Please select a category' : null
          break
        case 'content':
          fieldError = !value ? 'Content is required' :
                      value.length < 100 ? 'Content must be at least 100 characters' :
                      null
          break
      }

      if (fieldError) {
        errors[field] = fieldError
      } else {
        delete errors[field]
      }
    }

    const handleThumbnailChange = (event) => {
      const file = event.target.files[0]
      if (file) {
        formData.thumbnail = file
        thumbnailPreview.value = URL.createObjectURL(file)
      }
    }

    const removeThumbnail = () => {
      formData.thumbnail = null
      thumbnailPreview.value = null
      if (thumbnailInput.value) {
        thumbnailInput.value.value = ''
      }
    }

    const addTag = () => {
      const tag = newTag.value.trim()
      if (tag && !formData.tags.includes(tag)) {
        formData.tags.push(tag)
      }
      newTag.value = ''
    }

    const removeTag = (tag) => {
      formData.tags = formData.tags.filter(t => t !== tag)
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleString()
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

    const applyFormatting = (command) => {
      // Implement formatting logic here
      console.log('Applying format:', command)
    }

    const previewArticle = () => {
      showPreview.value = true
    }

    const confirmDelete = () => {
      showDeleteModal.value = true
    }

    const deleteArticle = async () => {
      try {
        isLoading.value = true
        await store.dispatch('articles/deleteArticle', articleId)
        router.push('/dashboard')
      } catch (error) {
        console.error('Error deleting article:', error)
      } finally {
        isLoading.value = false
        showDeleteModal.value = false
      }
    }

    const handleSubmit = async () => {
      // Validate all fields
      ['title', 'category_id', 'content'].forEach(validateField)

      if (!isFormValid.value) return

      try {
        isLoading.value = true
        await store.dispatch('articles/updateArticle', {
          id: articleId,
          articleData: formData
        })
        router.push('/dashboard')
      } catch (error) {
        console.error('Error updating article:', error)
      } finally {
        isLoading.value = false
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      fetchArticle()
    })

    return {
      article,
      formData,
      errors,
      isLoading,
      thumbnailInput,
      thumbnailPreview,
      newTag,
      showPreview,
      showDeleteModal,
      editorTools,
      categories,
      isFormValid,
      renderedContent,
      validateField,
      handleThumbnailChange,
      removeThumbnail,
      addTag,
      removeTag,
      formatDate,
      getStatusClass,
      applyFormatting,
      previewArticle,
      confirmDelete,
      deleteArticle,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.form-input {
  @apply appearance-none rounded-lg relative block w-full px-4 py-2 border
         border-primary/20 placeholder-primary-light/50 text-primary-light
         bg-secondary focus:outline-none focus:ring-2 focus:ring-primary
         focus:border-transparent transition-all duration-300;
}

.form-select {
  @apply appearance-none rounded-lg relative block w-full px-4 py-2 border
         border-primary/20 text-primary-light bg-secondary
         focus:outline-none focus:ring-2 focus:ring-primary
         focus:border-transparent transition-all duration-300;
}

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

.btn-danger {
  @apply py-2 px-4 rounded-lg bg-red-500 text-white font-medium
         hover:bg-red-600 transition-all duration-300
         focus:outline-none focus:ring-2 focus:ring-red-500
         focus:ring-offset-2 focus:ring-offset-secondary-dark
         disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Markdown Editor Styles */
.prose {
  @apply text-primary-light;
}

.prose h1 {
  @apply text-3xl font-bold mb-4 text-primary;
}

.prose h2 {
  @apply text-2xl font-bold mb-3 text-primary;
}

.prose h3 {
  @apply text-xl font-bold mb-2 text-primary;
}

.prose p {
  @apply mb-4;
}

.prose ul {
  @apply list-disc list-inside mb-4;
}

.prose ol {
  @apply list-decimal list-inside mb-4;
}

.prose blockquote {
  @apply border-l-4 border-primary/20 pl-4 italic my-4;
}

.prose a {
  @apply text-blue-400 hover:text-blue-300 underline;
}

.prose img {
  @apply max-w-full rounded-lg my-4;
}
</style>
