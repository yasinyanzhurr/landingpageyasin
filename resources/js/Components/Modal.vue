<!-- resources/js/components/Modal.vue -->
<template>
  <div>
    <!-- Backdrop -->
    <transition name="fade">
      <div v-if="show"
           class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
           @click="handleBackdropClick">
      </div>
    </transition>

    <!-- Modal -->
    <transition name="slide-up">
      <div v-if="show"
           class="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center
                  sm:justify-center z-50">
        <div class="bg-secondary-dark border border-primary/10 rounded-t-lg sm:rounded-lg
                    w-full sm:max-w-lg md:max-w-2xl shadow-xl"
             @click.stop>
          <!-- Header -->
          <div class="px-6 py-4 border-b border-primary/10 flex items-center justify-between">
            <slot name="header">
              <h3 class="text-xl font-semibold text-primary">{{ title }}</h3>
            </slot>
            <button
              @click="$emit('close')"
              class="text-primary-light hover:text-primary transition-colors"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <slot name="body"></slot>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer"
               class="px-6 py-4 border-t border-primary/10 flex items-center justify-end space-x-4">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Modal',

  props: {
    title: {
      type: String,
      default: ''
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    show() {
      return this.$parent.showModal
    }
  },

  methods: {
    handleBackdropClick() {
      if (this.closeOnBackdrop) {
        this.$emit('close')
      }
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@screen sm {
  .slide-up-enter-from,
  .slide-up-leave-to {
    transform: scale(0.95);
  }
}
</style>
