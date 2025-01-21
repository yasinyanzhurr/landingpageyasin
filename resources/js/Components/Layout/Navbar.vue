<!-- resources/js/Components/Layout/Navbar.vue -->
<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-secondary-dark/95 backdrop-blur-md border-b border-primary/10"
       :class="{ 'shadow-lg': isScrolled }">
    <div class="section-container">
      <div class="flex justify-between items-center h-20">
        <!-- Logo Section -->
        <div class="flex-shrink-0 flex items-center">
          <!-- Optional: Add your logo image here -->
          <!-- <img src="path-to-your-logo.png" class="h-10 w-auto" alt="Logo"> -->

          <h1 class="text-2xl font-bold">
            <a href="#" class="gradient-text flex items-center space-x-2">
              <i class="fas fa-graduation-cap"></i>
              <span>{{ siteName }}</span>
            </a>
          </h1>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <template v-for="item in menuItems" :key="item.name">
            <!-- Regular Menu Items -->
            <template v-if="!item.hasSubmenu">
              <a :href="item.href"
                 :class="[
                   'px-4 py-2 rounded-lg text-base font-medium transition-all duration-300',
                   isActiveLink(item.href)
                     ? 'text-primary bg-secondary'
                     : 'text-primary-light hover:text-primary hover:bg-secondary/50'
                 ]"
                 @click="scrollToSection(item.href)">
                <i :class="item.icon" class="mr-2"></i>
                {{ item.name }}
              </a>
            </template>

            <!-- Dropdown Menus -->
            <div v-else
                 class="relative group"
                 @mouseenter="item.isOpen = true"
                 @mouseleave="item.isOpen = false">
              <button class="px-4 py-2 rounded-lg text-base font-medium transition-all duration-300
                           text-primary-light hover:text-primary hover:bg-secondary/50
                           flex items-center"
                      @click="toggleDropdown(item)">
                <i :class="item.icon" class="mr-2"></i>
                {{ item.name }}
                <i class="fas fa-chevron-down ml-2 text-xs transition-transform duration-300"
                   :class="{ 'rotate-180': item.isOpen }"></i>
              </button>

              <!-- Dropdown Content -->
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1">
                <div v-show="item.isOpen"
                     class="absolute left-0 mt-2 w-48 rounded-lg bg-secondary-dark border border-primary/10
                            shadow-lg py-2">
                  <a v-for="subItem in item.submenu"
                     :key="subItem.name"
                     :href="subItem.href"
                     class="block px-4 py-2 text-sm text-primary-light hover:text-primary
                            hover:bg-secondary/50 transition-colors duration-300">
                    <i :class="subItem.icon" class="mr-2"></i>
                    {{ subItem.name }}
                  </a>
                </div>
              </transition>
            </div>
          </template>

          <!-- Action Button -->
          <button class="btn-primary ml-4" @click="handleCTAClick">
            <i class="fas fa-rocket mr-2"></i>
            Get Started
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen"
                  class="p-2 rounded-lg text-primary-light hover:text-primary
                         hover:bg-secondary/50 transition-colors duration-300
                         focus:outline-none focus:ring-2 focus:ring-primary">
            <span class="sr-only">Open main menu</span>
            <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"
               class="text-xl"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition-opacity ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-show="isMobileMenuOpen"
           class="md:hidden bg-secondary-dark/95 backdrop-blur-md border-b border-primary/10">
        <div class="px-4 py-4 space-y-1">
          <template v-for="item in menuItems" :key="item.name">
            <!-- Regular Mobile Menu Items -->
            <template v-if="!item.hasSubmenu">
              <a :href="item.href"
                 :class="[
                   'block px-4 py-2 rounded-lg text-base font-medium transition-all duration-300',
                   isActiveLink(item.href)
                     ? 'text-primary bg-secondary'
                     : 'text-primary-light hover:text-primary hover:bg-secondary/50'
                 ]"
                 @click="handleMobileMenuClick(item.href)">
                <i :class="item.icon" class="mr-2"></i>
                {{ item.name }}
              </a>
            </template>

            <!-- Mobile Dropdown -->
            <div v-else class="space-y-1">
              <button @click="toggleMobileDropdown(item)"
                      class="w-full px-4 py-2 rounded-lg text-base font-medium
                             text-primary-light hover:text-primary hover:bg-secondary/50
                             transition-all duration-300 flex items-center justify-between">
                <span class="flex items-center">
                  <i :class="item.icon" class="mr-2"></i>
                  {{ item.name }}
                </span>
                <i class="fas fa-chevron-down text-xs transition-transform duration-300"
                   :class="{ 'rotate-180': item.isOpen }"></i>
              </button>

              <div v-show="item.isOpen" class="pl-4">
                <a v-for="subItem in item.submenu"
                   :key="subItem.name"
                   :href="subItem.href"
                   class="block px-4 py-2 rounded-lg text-sm text-primary-light
                          hover:text-primary hover:bg-secondary/50 transition-colors duration-300">
                  <i :class="subItem.icon" class="mr-2"></i>
                  {{ subItem.name }}
                </a>
              </div>
            </div>
          </template>

          <!-- Mobile CTA -->
          <button class="w-full btn-primary mt-4" @click="handleCTAClick">
            <i class="fas fa-rocket mr-2"></i>
            Get Started
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      siteName: 'Yasin Portfolio',
      isScrolled: false,
      isMobileMenuOpen: false,
      activeSection: '',
      menuItems: [
        {
          name: 'Home',
          href: '#',
          icon: 'fas fa-home',
          hasSubmenu: false
        },
        {
          name: 'About',
          href: '#about',
          icon: 'fas fa-user',
          hasSubmenu: false
        },
        {
          name: 'Products',
          href: '#products',
          icon: 'fas fa-shopping-bag',
          hasSubmenu: true,
          isOpen: false,
          submenu: [
            {
              name: 'Online Courses',
              href: '#courses',
              icon: 'fas fa-graduation-cap'
            },
            {
              name: 'E-Books',
              href: '#ebooks',
              icon: 'fas fa-book'
            },
            {
              name: 'Templates',
              href: '#templates',
              icon: 'fas fa-file-alt'
            }
          ]
        },
        {
          name: 'Blog',
          href: '#blog',
          icon: 'fas fa-blog',
          hasSubmenu: true,
          isOpen: false,
          submenu: [
            {
              name: 'Mathematics',
              href: '#math',
              icon: 'fas fa-square-root-alt'
            },
            {
              name: 'Languages',
              href: '#languages',
              icon: 'fas fa-language'
            },
            {
              name: 'Business',
              href: '#business',
              icon: 'fas fa-briefcase'
            },
            {
              name: 'Technology',
              href: '#tech',
              icon: 'fas fa-laptop-code'
            }
          ]
        },
        {
          name: 'Testimonials',
          href: '#testimonials',
          icon: 'fas fa-star',
          hasSubmenu: false
        }
      ]
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleResize)
    this.observeSections()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 20
      this.updateActiveSection()
    },
    handleResize() {
      if (window.innerWidth >= 768) {
        this.isMobileMenuOpen = false
      }
    },
    toggleDropdown(item) {
      item.isOpen = !item.isOpen
    },
    toggleMobileDropdown(item) {
      item.isOpen = !item.isOpen
    },
    handleMobileMenuClick(href) {
      this.scrollToSection(href)
      this.isMobileMenuOpen = false
    },
    scrollToSection(href) {
      const targetId = href.replace('#', '')
      if (!targetId) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        const offset = 80 // Height of fixed navbar
        const targetPosition = targetElement.offsetTop - offset
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    },
    observeSections() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.activeSection = '#' + entry.target.id
            }
          })
        },
        {
          rootMargin: '-50% 0px -50% 0px'
        }
      )

      this.menuItems.forEach(item => {
        if (item.href !== '#') {
          const element = document.querySelector(item.href)
          if (element) observer.observe(element)
        }
      })
    },
    isActiveLink(href) {
      return this.activeSection === href
    },
    handleCTAClick() {
      // Implement your CTA action here
      console.log('CTA clicked')
    }
  }
}
</script>
