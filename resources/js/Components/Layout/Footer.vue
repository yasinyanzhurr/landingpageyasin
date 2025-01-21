<!-- resources/js/Components/Layout/Footer.vue -->
<template>
  <footer class="bg-secondary-dark text-primary-light">
    <!-- Main Footer -->
    <div class="section-container py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <!-- Brand Section -->
        <div class="space-y-6">
          <div class="flex items-center">
            <!-- Logo -->
            <h2 class="text-2xl font-bold gradient-text">Yasin Portfolio</h2>
          </div>

          <p class="text-primary-light/80">
            Empowering minds through education, technology, and innovation. Join our community of lifelong learners.
          </p>

          <!-- Social Links -->
          <div class="flex space-x-4">
            <a v-for="social in socialLinks"
               :key="social.name"
               :href="social.url"
               :aria-label="social.name"
               class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center
                      hover:bg-primary hover:text-secondary transition-colors duration-300"
               target="_blank"
               rel="noopener noreferrer">
              <i :class="social.icon"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-xl font-semibold mb-6">Quick Links</h3>
          <ul class="space-y-4">
            <li v-for="link in quickLinks" :key="link.name">
              <a :href="link.url"
                 class="hover:text-primary transition-colors duration-300 flex items-center">
                <i :class="link.icon" class="mr-2 text-sm"></i>
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h3 class="text-xl font-semibold mb-6">Categories</h3>
          <ul class="space-y-4">
            <li v-for="category in categories" :key="category.name">
              <a :href="category.url"
                 class="hover:text-primary transition-colors duration-300 flex items-center">
                <i :class="category.icon" class="mr-2 text-sm"></i>
                {{ category.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="text-xl font-semibold mb-6">Stay Updated</h3>
          <p class="mb-4">Subscribe to our newsletter for the latest updates and exclusive content.</p>

          <form @submit.prevent="subscribeNewsletter" class="space-y-4">
            <div class="relative">
              <input type="email"
                     v-model="newsletterEmail"
                     placeholder="Enter your email"
                     class="w-full px-4 py-3 bg-secondary rounded-lg text-primary-light
                            placeholder-primary-light/50 focus:outline-none focus:ring-2
                            focus:ring-primary">
            </div>

            <button type="submit"
                    class="w-full btn-primary flex items-center justify-center space-x-2"
                    :disabled="isSubscribing">
              <i class="fas fa-paper-plane"></i>
              <span>{{ isSubscribing ? 'Subscribing...' : 'Subscribe' }}</span>
            </button>
          </form>

          <!-- Newsletter Success Message -->
          <transition name="fade">
            <p v-if="subscriptionSuccess"
               class="mt-2 text-sm text-primary flex items-center">
              <i class="fas fa-check-circle mr-2"></i>
              Thank you for subscribing!
            </p>
          </transition>
        </div>
      </div>
    </div>

    <!-- Bottom Footer -->
    <div class="border-t border-primary/10">
      <div class="section-container py-8">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <!-- Copyright -->
          <div class="text-center md:text-left">
            <p>&copy; {{ currentYear }} Yasin Portfolio. All rights reserved.</p>
          </div>

          <!-- Additional Links -->
          <div class="flex space-x-6">
            <a v-for="link in legalLinks"
               :key="link.name"
               :href="link.url"
               class="text-sm hover:text-primary transition-colors duration-300">
              {{ link.name }}
            </a>
          </div>
        </div>

        <!-- Credits -->
        <div class="mt-4 text-center text-sm text-primary-light/60">
          <p>Last updated: {{ lastUpdated }}</p>
          <p>Created with <i class="fas fa-heart text-primary"></i> by {{ authorName }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      currentYear: new Date().getFullYear(),
      authorName: 'Yasin Yanzhurr',
      lastUpdated: '2024-01-21',
      newsletterEmail: '',
      isSubscribing: false,
      subscriptionSuccess: false,
      socialLinks: [
        {
          name: 'GitHub',
          url: '<https://github.com/yasinyanzhurr>',
          icon: 'fab fa-github'
        },
        {
          name: 'LinkedIn',
          url: '#',
          icon: 'fab fa-linkedin'
        },
        {
          name: 'Twitter',
          url: '#',
          icon: 'fab fa-twitter'
        },
        {
          name: 'Instagram',
          url: '#',
          icon: 'fab fa-instagram'
        }
      ],
      quickLinks: [
        { name: 'Home', url: '#', icon: 'fas fa-home' },
        { name: 'About', url: '#about', icon: 'fas fa-user' },
        { name: 'Products', url: '#products', icon: 'fas fa-shopping-bag' },
        { name: 'Blog', url: '#blog', icon: 'fas fa-blog' },
        { name: 'Testimonials', url: '#testimonials', icon: 'fas fa-star' },
        { name: 'Contact', url: '#contact', icon: 'fas fa-envelope' }
      ],
      categories: [
        { name: 'Mathematics', url: '#', icon: 'fas fa-square-root-alt' },
        { name: 'Languages', url: '#', icon: 'fas fa-language' },
        { name: 'Business', url: '#', icon: 'fas fa-briefcase' },
        { name: 'Technology', url: '#', icon: 'fas fa-laptop-code' },
        { name: 'All Courses', url: '#', icon: 'fas fa-graduation-cap' }
      ],
      legalLinks: [
        { name: 'Privacy Policy', url: '#' },
        { name: 'Terms of Service', url: '#' },
        { name: 'Cookie Policy', url: '#' }
      ]
    }
  },
  methods: {
    async subscribeNewsletter() {
      if (!this.newsletterEmail) return

      this.isSubscribing = true

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        this.subscriptionSuccess = true
        this.newsletterEmail = ''

        // Reset success message after 3 seconds
        setTimeout(() => {
          this.subscriptionSuccess = false
        }, 3000)
      } catch (error) {
        console.error('Newsletter subscription failed:', error)
      } finally {
        this.isSubscribing = false
      }
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
