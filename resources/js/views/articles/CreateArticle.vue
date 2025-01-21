<!-- resources/js/views/articles/CreateArticle.vue -->
<template>
  <div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-primary mb-2">Create New Article</h1>
      <p class="text-primary-light">
        Share your knowledge and inspire others with your writing
      </p>
    </div>

    <!-- Article Form -->
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
          placeholder="Enter a descriptive title"
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
          v-model="formData.category"
          required
          class="form-select w-full"
          :class="{ 'border-red-500': errors.category }"
          @blur="validateField('category')"
        >
          <option value="">Select a category</option>
          <option v-for="category in categories"
                  :key="category.id"
                  :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <p v-if="errors.category" class="text-red-500 text-xs mt-1">
          {{ errors.category }}
        </p>
      </div>

      <!-- Thumbnail -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-primary-light">
          Article Thumbnail
        </label>
        <div class="flex items-center space-x-4">
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
                Choose Image
              </button>
            </div>
          </div>
          <div v-if="thumbnailPreview" class="h-20 w-20">
            <img
              :src="thumbnailPreview"
              alt="Thumbnail preview"
              class="h-full w-full object-cover rounded-lg"
            >
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
          <div class="bg-secondary-dark border-b border-primary/20 p-2 flex items-center space-x-2">
            <button
              v-for="(tool, index) in editorTools"
              :key="index"
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
            placeholder="Write your article content here..."
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
        <button
          type="button"
          @click="saveDraft"
          class="btn-secondary"
          :disabled="isLoading"
        >
          Save as Draft
        </button>

        <div class="flex items-center space-x-4">
          <button
            type="button"
            @click="previewArticle"
            class="btn-secondary"
            :disabled="isLoading"
          >
            Preview
          </button>
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
              Submit for Review
            </template>
          </button>
        </div>
      </div>
    </form>

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
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Modal from '@/components/Modal.vue'
import { marked } from 'marked'

export default {
  name: 'CreateArticle',

  components: {
    Modal
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const thumbnailInput = ref(null)

    // Form data
    const formData = reactive({
      title: '',
      category: '',
      thumbnail: null,
      content: '',
      tags: []
    })

    // Other reactive state
    const errors = reactive({})
    const isLoading = ref(false)
    const thumbnailPreview = ref(null)
    const newTag = ref('')
    const showPreview = ref(false)

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

    // Categories (fetch from store or API)
    const categories = computed(() => store.state.categories.list)

    // Computed
    const isFormValid = computed(() => {
      return formData.title &&
             formData.category &&
             formData.content &&
             !Object.keys(errors).length
    })

    const renderedContent = computed(() => {
      return marked(formData.content)
    })

    // Methods
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
        case 'category':
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

    const applyFormatting = (command) => {
      // Implement formatting logic here
      console.log('Applying format:', command)
    }

    const saveDraft = async () => {
      try {
        isLoading.value = true
        await store.dispatch('articles/saveDraft', formData)
        router.push('/dashboard')
      } catch (error) {
        console.error('Error saving draft:', error)
      } finally {
        isLoading.value = false
      }
    }

    const previewArticle = () => {
      showPreview.value = true
    }

    const handleSubmit = async () => {
      // Validate all fields
      ['title', 'category', 'content'].forEach(validateField)

      if (!isFormValid.value) return

      try {
        isLoading.value = true
        await store.dispatch('articles/submitArticle', formData)
        router.push('/dashboard')
      } catch (error) {
        console.error('Error submitting article:', error)
      } finally {
        isLoading.value = false
      }
    }

    return {
      formData,
      errors,
      isLoading,
      thumbnailInput,
      thumbnailPreview,
      newTag,
      showPreview,
      editorTools,
      categories,
      isFormValid,
      renderedContent,
      validateField,
      handleThumbnailChange,
      addTag,
      removeTag,
      applyFormatting,
      saveDraft,
      previewArticle,
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
</style>
