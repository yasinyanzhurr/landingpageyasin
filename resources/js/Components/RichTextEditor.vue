<!-- resources/js/components/RichTextEditor.vue -->
<template>
  <div class="rich-text-editor">
    <!-- Toolbar -->
    <div class="editor-toolbar border border-primary/20 rounded-t-lg bg-secondary-dark">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
        <!-- Text Formatting -->
        <div class="flex items-center space-x-1">
          <!-- Heading Dropdown -->
          <div class="relative" v-click-outside="closeHeadingMenu">
            <button
              @click="toggleHeadingMenu"
              class="editor-btn"
              :class="{ 'bg-primary/10': showHeadingMenu }"
            >
              <i class="fas fa-heading"></i>
              <i class="fas fa-chevron-down ml-1 text-xs"></i>
            </button>

            <!-- Heading Menu -->
            <div v-if="showHeadingMenu"
                 class="absolute top-full left-0 mt-1 bg-secondary-dark border
                        border-primary/20 rounded-lg shadow-lg z-10">
              <button v-for="level in [1,2,3,4]"
                      :key="level"
                      @click="applyHeading(level)"
                      class="block w-full px-4 py-2 text-left text-primary-light
                             hover:bg-primary/10">
                H{{ level }}
              </button>
            </div>
          </div>

          <!-- Basic Formatting -->
          <button
            v-for="format in basicFormats"
            :key="format.command"
            @click="applyFormat(format.command)"
            class="editor-btn"
            :class="{ 'bg-primary/10': isFormatActive(format.command) }"
            :title="format.title"
          >
            <i :class="format.icon"></i>
          </button>
        </div>

        <!-- Alignment -->
        <div class="flex items-center space-x-1">
          <button
            v-for="align in alignments"
            :key="align.command"
            @click="applyAlignment(align.command)"
            class="editor-btn"
            :title="align.title"
          >
            <i :class="align.icon"></i>
          </button>
        </div>

        <!-- Lists -->
        <div class="flex items-center space-x-1">
          <button
            v-for="list in lists"
            :key="list.command"
            @click="applyList(list.command)"
            class="editor-btn"
            :title="list.title"
          >
            <i :class="list.icon"></i>
          </button>
        </div>

        <!-- Insert Options -->
        <div class="flex items-center space-x-1">
          <button
            v-for="insert in insertOptions"
            :key="insert.command"
            @click="handleInsert(insert.command)"
            class="editor-btn"
            :title="insert.title"
          >
            <i :class="insert.icon"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Editor Content -->
    <div
      ref="editorContent"
      class="editor-content border border-t-0 border-primary/20 rounded-b-lg
             bg-secondary p-4 min-h-[200px] max-h-[600px] overflow-y-auto"
      contenteditable="true"
      @input="handleInput"
      @paste="handlePaste"
      @keydown="handleKeydown"
    ></div>

    <!-- Link Dialog -->
    <modal v-if="showLinkDialog" @close="closeLinkDialog">
      <template #header>
        <h3 class="text-lg font-medium text-primary">Insert Link</h3>
      </template>

      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-primary-light mb-1">
              Text to display
            </label>
            <input
              v-model="linkForm.text"
              type="text"
              class="form-input w-full"
              placeholder="Link text"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-primary-light mb-1">
              URL
            </label>
            <input
              v-model="linkForm.url"
              type="url"
              class="form-input w-full"
              placeholder="<https://example.com>"
            >
          </div>
        </div>
      </template>

      <template #footer>
        <button @click="closeLinkDialog" class="btn-secondary">
          Cancel
        </button>
        <button @click="insertLink" class="btn-primary">
          Insert
        </button>
      </template>
    </modal>

    <!-- Image Dialog -->
    <modal v-if="showImageDialog" @close="closeImageDialog">
      <template #header>
        <h3 class="text-lg font-medium text-primary">Insert Image</h3>
      </template>

      <template #body>
        <div class="space-y-4">
          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium text-primary-light mb-1">
              Upload Image
            </label>
            <div class="relative">
              <input
                type="file"
                ref="imageInput"
                class="hidden"
                accept="image/*"
                @change="handleImageUpload"
              >
              <button
                @click="$refs.imageInput.click()"
                class="btn-secondary w-full"
              >
                <i class="fas fa-cloud-upload-alt mr-2"></i>
                Choose Image
              </button>
            </div>
          </div>

          <!-- Or URL -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="border-t border-primary/20 w-full"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-2 bg-secondary-dark text-primary-light text-sm">
                OR
              </span>
            </div>
          </div>

          <!-- Image URL -->
          <div>
            <label class="block text-sm font-medium text-primary-light mb-1">
              Image URL
            </label>
            <input
              v-model="imageForm.url"
              type="url"
              class="form-input w-full"
              placeholder="<https://example.com/image.jpg>"
            >
          </div>

          <!-- Alt Text -->
          <div>
            <label class="block text-sm font-medium text-primary-light mb-1">
              Alt Text
            </label>
            <input
              v-model="imageForm.alt"
              type="text"
              class="form-input w-full"
              placeholder="Image description"
            >
          </div>
        </div>
      </template>

      <template #footer>
        <button @click="closeImageDialog" class="btn-secondary">
          Cancel
        </button>
        <button
          @click="insertImage"
          class="btn-primary"
          :disabled="!imageForm.url && !imageForm.file"
        >
          Insert
        </button>
      </template>
    </modal>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'RichTextEditor',

  props: {
    // Initial content untuk editor
    modelValue: {
      type: String,
      default: ''
    },

    // Autosave interval dalam milidetik
    autosaveInterval: {
      type: Number,
      default: 30000 // 30 detik
    }
  },

  emits: ['update:modelValue', 'autosave'],

  setup(props, { emit }) {
    const store = useStore()
    const editorContent = ref(null)

    // State untuk dialog
    const showHeadingMenu = ref(false)
    const showLinkDialog = ref(false)
    const showImageDialog = ref(false)

    // Form state
    const linkForm = ref({ text: '', url: '' })
    const imageForm = ref({ url: '', alt: '', file: null })

    // Autosave timer
    let autosaveTimer = null

    // Format options
    const basicFormats = [
      { command: 'bold', icon: 'fas fa-bold', title: 'Bold' },
      { command: 'italic', icon: 'fas fa-italic', title: 'Italic' },
      { command: 'underline', icon: 'fas fa-underline', title: 'Underline' },
      { command: 'strikethrough', icon: 'fas fa-strikethrough', title: 'Strikethrough' }
    ]

    const alignments = [
      { command: 'justifyLeft', icon: 'fas fa-align-left', title: 'Align Left' },
      { command: 'justifyCenter', icon: 'fas fa-align-center', title: 'Center' },
      { command: 'justifyRight', icon: 'fas fa-align-right', title: 'Align Right' }
    ]

    const lists = [
      { command: 'insertUnorderedList', icon: 'fas fa-list-ul', title: 'Bullet List' },
      { command: 'insertOrderedList', icon: 'fas fa-list-ol', title: 'Numbered List' }
    ]

    const insertOptions = [
      { command: 'link', icon: 'fas fa-link', title: 'Insert Link' },
      { command: 'image', icon: 'fas fa-image', title: 'Insert Image' },
      { command: 'code', icon: 'fas fa-code', title: 'Insert Code' },
      { command: 'quote', icon: 'fas fa-quote-right', title: 'Insert Quote' }
    ]

    // Methods untuk formatting
    const applyFormat = (command) => {
      document.execCommand(command, false, null)
      updateValue()
    }

    const applyHeading = (level) => {
      document.execCommand('formatBlock', false, `h${level}`)
      showHeadingMenu.value = false
      updateValue()
    }

    const applyAlignment = (command) => {
      document.execCommand(command, false, null)
      updateValue()
    }

    const applyList = (command) => {
      document.execCommand(command, false, null)
      updateValue()
    }

    // Handle input dan paste
    const handleInput = () => {
      updateValue()
    }

    const handlePaste = (e) => {
      e.preventDefault()
      const text = e.clipboardData.getData('text/plain')
      document.execCommand('insertText', false, text)
    }

    // Update value dan emit changes
    const updateValue = () => {
      const content = editorContent.value.innerHTML
      emit('update:modelValue', content)
    }

    // Autosave functionality
    const startAutosave = () => {
      autosaveTimer = setInterval(() => {
        emit('autosave', editorContent.value.innerHTML)
      }, props.autosaveInterval)
    }

    // Lifecycle hooks
    onMounted(() => {
      // Set initial content
      if (props.modelValue) {
        editorContent.value.innerHTML = props.modelValue
      }

      // Start autosave
      startAutosave()
    })

    onBeforeUnmount(() => {
      // Clear autosave timer
      if (autosaveTimer) {
        clearInterval(autosaveTimer)
      }
    })

    return {
      editorContent,
      showHeadingMenu,
      showLinkDialog,
      showImageDialog,
      linkForm,
      imageForm,
      basicFormats,
      alignments,
      lists,
      insertOptions,
      applyFormat,
      applyHeading,
      applyAlignment,
      applyList,
      handleInput,
      handlePaste
    }
  }
}
</script>

<style scoped>
.editor-btn {
  @apply p-2 rounded hover:bg-primary/10 text-primary-light
         transition-colors duration-200;
}

.editor-content {
  @apply focus:outline-none prose prose-invert max-w-none;
}

/* Additional styles untuk content yang dapat diedit */
.editor-content[contenteditable=true]:empty:before {
  content: 'Start writing...';
  color: theme('colors.primary.light/50');
}
</style>
