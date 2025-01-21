<!-- resources/js/components/ArticleVersionHistory.vue -->
<template>
  <div class="version-history">
    <!-- Version List -->
    <div class="space-y-4">
      <div v-for="version in versions"
           :key="version.id"
           class="version-item p-4 border border-primary/10 rounded-lg
                  hover:bg-primary/5 transition-colors cursor-pointer"
           :class="{ 'bg-primary/10': selectedVersion?.id === version.id }"
           @click="selectVersion(version)"
      >
        <div class="flex items-center justify-between mb-2">
          <!-- Version Info -->
          <div>
            <p class="text-primary font-medium">
              {{ formatDate(version.created_at) }}
            </p>
            <p class="text-sm text-primary-light">
              by {{ version.user.name }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <button
              @click.stop="previewVersion(version)"
              class="text-primary-light hover:text-primary"
              title="Preview"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              @click.stop="restoreVersion(version)"
              class="text-primary-light hover:text-primary"
              title="Restore this version"
            >
              <i class="fas fa-history"></i>
            </button>
          </div>
        </div>

        <!-- Version Note -->
        <p v-if="version.version_note"
           class="text-sm text-primary-light/70 italic">
          "{{ version.version_note }}"
        </p>

        <!-- Changes Summary -->
        <div class="mt-2 text-sm">
          <p v-if="version.changes?.title" class="text-primary-light">
            <i class="fas fa-pen mr-2"></i>
            Title changed
          </p>
          <p v-if="version.changes?.content" class="text-primary-light">
            <i class="fas fa-file-alt mr-2"></i>
            Content updated
          </p>
          <p v-if="version.changes?.thumbnail" class="text-primary-light">
            <i class="fas fa-image mr-2"></i>
            Thumbnail changed
          </p>
          <p v-if="version.changes?.tags" class="text-primary-light">
            <i class="fas fa-tags mr-2"></i>
            Tags updated
          </p>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <modal v-if="showPreview" @close="closePreview">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-primary">
            Version Preview
          </h3>
          <p class="text-sm text-primary-light">
            {{ formatDate(selectedVersion?.created_at) }}
          </p>
        </div>
      </template>

      <template #body>
        <article-preview :article="selectedVersion" />
      </template>

      <template #footer>
        <button @click="closePreview" class="btn-secondary">
          Close
        </button>
        <button
          @click="restoreVersion(selectedVersion)"
          class="btn-primary"
        >
          Restore This Version
        </button>
      </template>
    </modal>

    <!-- Restore Confirmation Modal -->
    <modal v-if="showRestoreConfirm"
           @close="showRestoreConfirm = false">
      <template #header>
        <h3 class="text-xl font-semibold text-primary">
          Restore Version
        </h3>
      </template>

      <template #body>
        <p class="text-primary-light">
          Are you sure you want to restore this version?
          Current changes will be saved as a new version.
        </p>
      </template>

      <template #footer>
        <button
          @click="showRestoreConfirm = false"
          class="btn-secondary"
        >
          Cancel
        </button>
        <button
          @click="confirmRestore"
          class="btn-primary"
        >
          Restore
        </button>
      </template>
    </modal>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import ArticlePreview from './ArticlePreview.vue'

export default {
  name: 'ArticleVersionHistory',

  components: {
    ArticlePreview
  },

  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },

  emits: ['version-restored'],

  setup(props, { emit }) {
    const store = useStore()

    // State
    const versions = ref([])
    const selectedVersion = ref(null)
    const showPreview = ref(false)
    const showRestoreConfirm = ref(false)
    const isLoading = ref(false)

    // Methods
    const fetchVersions = async () => {
      try {
        isLoading.value = true
        const response = await store.dispatch('articles/fetchVersions', props.articleId)
        versions.value = response
      } catch (error) {
        console.error('Error fetching versions:', error)
      } finally {
        isLoading.value = false
      }
    }

    const selectVersion = (version) => {
      selectedVersion.value = version
    }

    const previewVersion = (version) => {
      selectedVersion.value = version
      showPreview.value = true
    }

    const closePreview = () => {
      showPreview.value = false
      selectedVersion.value = null
    }

    const restoreVersion = (version) => {
      selectedVersion.value = version
      showRestoreConfirm.value = true
    }

    const confirmRestore = async () => {
      try {
        isLoading.value = true
        await store.dispatch('articles/restoreVersion', {
          articleId: props.articleId,
          versionId: selectedVersion.value.id
        })
        emit('version-restored')
        showRestoreConfirm.value = false
        await fetchVersions()
      } catch (error) {
        console.error('Error restoring version:', error)
      } finally {
        isLoading.value = false
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleString()
    }

    // Lifecycle hooks
    onMounted(() => {
      fetchVersions()
    })

    return {
      versions,
      selectedVersion,
      showPreview,
      showRestoreConfirm,
      isLoading,
      selectVersion,
      previewVersion,
      closePreview,
      restoreVersion,
      confirmRestore,
      formatDate
    }
  }
}
</script>
