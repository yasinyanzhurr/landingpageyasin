<!-- resources/js/components/Comments.vue -->
<template>
  <div class="comments-section">
    <!-- Comment Form -->
    <div class="mb-6">
      <h3 class="text-xl font-semibold text-primary mb-4">
        Comments ({{ totalComments }})
      </h3>

      <div v-if="isLoggedIn">
        <div class="flex space-x-4">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span class="text-primary font-medium">
                {{ userInitials }}
              </span>
            </div>
          </div>
          <div class="flex-grow">
            <textarea
              v-model="newComment"
              rows="3"
              class="w-full rounded-lg bg-secondary border border-primary/20
                     p-3 text-primary-light placeholder-primary-light/50
                     focus:outline-none focus:border-primary resize-none"
              placeholder="Write a comment..."
              @keydown.enter.ctrl="submitComment"
            ></textarea>
            <div class="mt-2 flex justify-between items-center">
              <p class="text-xs text-primary-light">
                Press Ctrl+Enter to submit
              </p>
              <button
                @click="submitComment"
                class="btn-primary"
                :disabled="!newComment.trim()"
              >
                Submit Comment
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-4">
        <p class="text-primary-light mb-2">
          Please login to comment
        </p>
        <router-link to="/login" class="btn-primary">
          Login
        </router-link>
      </div>
    </div>

    <!-- Comments List -->
    <div class="space-y-6">
      <template v-if="comments.length">
        <comment-item
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :current-user="currentUser"
          @reply="handleReply"
          @edit="handleEdit"
          @delete="handleDelete"
          @approve="handleApprove"
        />
      </template>
      <div v-else-if="!isLoading" class="text-center py-8">
        <p class="text-primary-light">No comments yet</p>
      </div>
      <div v-else class="text-center py-8">
        <i class="fas fa-circle-notch fa-spin text-primary"></i>
      </div>
    </div>

    <!-- Load More -->
    <div v-if="hasMoreComments" class="text-center mt-6">
      <button
        @click="loadMoreComments"
        class="btn-secondary"
        :disabled="isLoading"
      >
        <template v-if="isLoading">
          <i class="fas fa-circle-notch fa-spin mr-2"></i>
          Loading...
        </template>
        <template v-else>
          Load More Comments
        </template>
      </button>
    </div>

    <!-- Edit Comment Modal -->
    <modal v-if="showEditModal" @close="closeEditModal">
      <template #header>
        <h3 class="text-lg font-medium text-primary">
          Edit Comment
        </h3>
      </template>

      <template #body>
        <textarea
          v-model="editingComment.content"
          rows="4"
          class="w-full rounded-lg bg-secondary border border-primary/20
                 p-3 text-primary-light placeholder-primary-light/50
                 focus:outline-none focus:border-primary resize-none"
        ></textarea>
      </template>

      <template #footer>
        <button @click="closeEditModal" class="btn-secondary">
          Cancel
        </button>
        <button
          @click="updateComment"
          class="btn-primary"
          :disabled="!editingComment.content.trim()"
        >
          Update
        </button>
      </template>
    </modal>

    <!-- Delete Confirmation Modal -->
    <modal v-if="showDeleteModal" @close="closeDeleteModal">
      <template #header>
        <h3 class="text-lg font-medium text-primary">
          Delete Comment
        </h3>
      </template>

      <template #body>
        <p class="text-primary-light">
          Are you sure you want to delete this comment?
          This action cannot be undone.
        </p>
      </template>

      <template #footer>
        <button @click="closeDeleteModal" class="btn-secondary">
          Cancel
        </button>
        <button
          @click="confirmDelete"
          class="btn-danger"
        >
          Delete
        </button>
      </template>
    </modal>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import CommentItem from './CommentItem.vue'
import Modal from '@/components/Modal.vue'

export default {
  name: 'Comments',

  components: {
    CommentItem,
    Modal
  },

  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },

  setup(props) {
    const store = useStore()

    // State
    const comments = ref([])
    const newComment = ref('')
    const isLoading = ref(false)
    const currentPage = ref(1)
    const lastPage = ref(1)
    const showEditModal = ref(false)
    const showDeleteModal = ref(false)
    const editingComment = ref(null)
    const deletingComment = ref(null)

    // Computed
    const isLoggedIn = computed(() => store.getters['auth/isLoggedIn'])
    const currentUser = computed(() => store.getters['auth/currentUser'])
    const userInitials = computed(() => {
      const user = currentUser.value
      return user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : ''
    })
    const totalComments = computed(() => comments.value.length)
    const hasMoreComments = computed(() => currentPage.value < lastPage.value)

    // Methods
    const fetchComments = async (page = 1) => {
      try {
        isLoading.value = true
        const response = await store.dispatch('comments/fetchComments', {
          articleId: props.articleId,
          page
        })

        if (page === 1) {
          comments.value = response.data
        } else {
          comments.value.push(...response.data)
        }

        currentPage.value = response.current_page
        lastPage.value = response.last_page
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        isLoading.value = false
      }
    }

    const loadMoreComments = () => {
      fetchComments(currentPage.value + 1)
    }

    const submitComment = async () => {
      if (!newComment.value.trim()) return

      try {
        isLoading.value = true
        const response = await store.dispatch('comments/createComment', {
          articleId: props.articleId,
          content: newComment.value
        })

        comments.value.unshift(response)
        newComment.value = ''
      } catch (error) {
        console.error('Error submitting comment:', error)
      } finally {
        isLoading.value = false
      }
    }

    const handleReply = (comment) => {
      newComment.value = `@${comment.user.name} `
      // Scroll to comment form
      document.querySelector('textarea').focus()
    }

    const handleEdit = (comment) => {
      editingComment.value = { ...comment }
      showEditModal.value = true
    }

    const updateComment = async () => {
      if (!editingComment.value.content.trim()) return

      try {
        isLoading.value = true
        const response = await store.dispatch('comments/updateComment', {
          commentId: editingComment.value.id,
          content: editingComment.value.content
        })

        const index = comments.value.findIndex(c => c.id === response.id)
        if (index !== -1) {
          comments.value[index] = response
        }

        closeEditModal()
      } catch (error) {
        console.error('Error updating comment:', error)
      } finally {
        isLoading.value = false
      }
    }

    const handleDelete = (comment) => {
      deletingComment.value = comment
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      try {
        isLoading.value = true
        await store.dispatch('comments/deleteComment', deletingComment.value.id)

        comments.value = comments.value.filter(c => c.id !== deletingComment.value.id)
        closeDeleteModal()
      } catch (error) {
        console.error('Error deleting comment:', error)
      } finally {
        isLoading.value = false
      }
    }

    const handleApprove = async (comment) => {
      try {
        isLoading.value = true
        const response = await store.dispatch('comments/approveComment', comment.id)

        const index = comments.value.findIndex(c => c.id === response.id)
        if (index !== -1) {
          comments.value[index] = response
        }
      } catch (error) {
        console.error('Error approving comment:', error)
      } finally {
        isLoading.value = false
      }
    }

    const closeEditModal = () => {
      showEditModal.value = false
      editingComment.value = null
    }

    const closeDeleteModal = () => {
      showDeleteModal.value = false
      deletingComment.value = null
    }

    // Initialize
    fetchComments()

    return {
      comments,
      newComment,
      isLoading,
      showEditModal,
      showDeleteModal,
      editingComment,
      isLoggedIn,
      currentUser,
      userInitials,
      totalComments,
      hasMoreComments,
      loadMoreComments,
      submitComment,
      handleReply,
      handleEdit,
      handleDelete,
      handleApprove,
      updateComment,
      confirmDelete,
      closeEditModal,
      closeDeleteModal
    }
  }
}
</script>
