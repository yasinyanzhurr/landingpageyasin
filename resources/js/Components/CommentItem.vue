<!-- resources/js/components/CommentItem.vue -->
<template>
  <div class="comment-item" :id="`comment-${comment.id}`">
    <!-- Main Comment -->
    <div class="flex space-x-4">
      <!-- User Avatar -->
      <div class="flex-shrink-0">
        <div class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span class="text-primary font-medium">{{ userInitials }}</span>
        </div>
      </div>

      <!-- Comment Content -->
      <div class="flex-grow">
        <div class="bg-secondary-dark rounded-lg p-4">
          <!-- Comment Header -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <span class="font-medium text-primary">
                {{ comment.user.name }}
              </span>
              <span class="text-xs text-primary-light">
                {{ formatDate(comment.created_at) }}
              </span>
              <span v-if="comment.edited"
                    class="text-xs text-primary-light/70 italic">
                (edited)
              </span>
              <span v-if="!comment.is_approved"
                    class="px-2 py-0.5 rounded-full text-xs bg-yellow-500/10 text-yellow-500">
                Pending Approval
              </span>
            </div>

            <!-- Comment Actions -->
            <div class="flex items-center space-x-2">
              <!-- Reply Button -->
              <button
                v-if="comment.is_approved"
                @click="$emit('reply', comment)"
                class="text-primary-light hover:text-primary"
                title="Reply"
              >
                <i class="fas fa-reply"></i>
              </button>

              <!-- Edit Button -->
              <button
                v-if="canEdit"
                @click="$emit('edit', comment)"
                class="text-primary-light hover:text-primary"
                title="Edit"
              >
                <i class="fas fa-edit"></i>
              </button>

              <!-- Delete Button -->
              <button
                v-if="canDelete"
                @click="$emit('delete', comment)"
                class="text-primary-light hover:text-primary"
                title="Delete"
              >
                <i class="fas fa-trash"></i>
              </button>

              <!-- Approve Button -->
              <button
                v-if="canApprove && !comment.is_approved"
                @click="$emit('approve', comment)"
                class="text-primary-light hover:text-primary"
                title="Approve"
              >
                <i class="fas fa-check"></i>
              </button>
            </div>
          </div>

          <!-- Comment Text -->
          <div class="prose prose-sm prose-invert max-w-none">
            <p class="text-primary-light whitespace-pre-line">
              {{ comment.content }}
            </p>
          </div>
        </div>

        <!-- Reply Form -->
        <div v-if="isReplying" class="mt-4">
          <div class="flex space-x-4">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span class="text-primary font-medium text-sm">
                  {{ currentUserInitials }}
                </span>
              </div>
            </div>
            <div class="flex-grow">
              <textarea
                v-model="replyContent"
                rows="2"
                class="w-full rounded-lg bg-secondary border border-primary/20
                       p-3 text-primary-light placeholder-primary-light/50
                       focus:outline-none focus:border-primary resize-none text-sm"
                placeholder="Write a reply..."
              ></textarea>
              <div class="mt-2 flex justify-end space-x-2">
                <button
                  @click="cancelReply"
                  class="btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  @click="submitReply"
                  class="btn-primary btn-sm"
                  :disabled="!replyContent.trim()"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Replies -->
        <div v-if="comment.replies?.length" class="mt-4 space-y-4">
          <comment-item
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
            :current-user="currentUser"
            class="ml-12"
            @reply="$emit('reply', reply)"
            @edit="$emit('edit', reply)"
            @delete="$emit('delete', reply)"
            @approve="$emit('approve', reply)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'CommentItem',

  props: {
    comment: {
      type: Object,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    }
  },

  emits: ['reply', 'edit', 'delete', 'approve'],

  setup(props) {
    const store = useStore()

    // State
    const isReplying = ref(false)
    const replyContent = ref('')

    // Computed
    const userInitials = computed(() => {
      return props.comment.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    })

    const currentUserInitials = computed(() => {
      return props.currentUser.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    })

    const canEdit = computed(() => {
      return props.currentUser.id === props.comment.user_id ||
             props.currentUser.role === 'admin'
    })

    const canDelete = computed(() => {
      return props.currentUser.id === props.comment.user_id ||
             props.currentUser.role === 'admin'
    })

    const canApprove = computed(() => {
      return ['admin', 'editor'].includes(props.currentUser.role)
    })

    // Methods
    const formatDate = (date) => {
      const now = new Date()
      const commentDate = new Date(date)
      const diffTime = Math.abs(now - commentDate)
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        return 'Today at ' + commentDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      } else if (diffDays === 1) {
        return 'Yesterday at ' + commentDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      } else {
        return commentDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
    }

    const submitReply = async () => {
      if (!replyContent.value.trim()) return

      try {
        await store.dispatch('comments/createComment', {
          articleId: props.comment.article_id,
          parentId: props.comment.id,
          content: replyContent.value
        })

        replyContent.value = ''
        isReplying.value = false

        // Refresh comments
        await store.dispatch('comments/fetchComments', {
          articleId: props.comment.article_id
        })
      } catch (error) {
        console.error('Error submitting reply:', error)
      }
    }

    const cancelReply = () => {
      isReplying.value = false
      replyContent.value = ''
    }

    return {
      isReplying,
      replyContent,
      userInitials,
      currentUserInitials,
      canEdit,
      canDelete,
      canApprove,
      formatDate,
      submitReply,
      cancelReply
    }
  }
}
</script>

<style scoped>
.btn-sm {
  @apply py-1 px-3 text-sm;
}
</style>
