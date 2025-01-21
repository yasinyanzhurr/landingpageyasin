<!-- resources/js/layouts/DashboardLayout.vue -->
<template>
  <div class="min-h-screen bg-secondary-dark">
    <!-- Sidebar Mobile Overlay -->
    <div v-if="isSidebarOpen"
         class="fixed inset-0 z-20 bg-black/50 lg:hidden"
         @click="toggleSidebar">
    </div>

    <!-- Sidebar -->
    <aside :class="[
      'fixed inset-y-0 left-0 z-30 w-64 bg-secondary-dark border-r border-primary/10',
      'transform transition-transform duration-300 ease-in-out lg:translate-x-0',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <!-- Sidebar Header -->
      <div class="h-16 flex items-center justify-between px-4 border-b border-primary/10">
        <router-link to="/" class="flex items-center space-x-3">
          <img src="/logo.svg" alt="Logo" class="h-8 w-8">
          <span class="text-xl font-bold text-primary">Yasin Blog</span>
        </router-link>
        <button @click="toggleSidebar" class="lg:hidden text-primary-light hover:text-primary">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- User Info -->
      <div class="p-4 border-b border-primary/10">
        <div class="flex items-center space-x-3">
          <div class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span class="text-primary font-medium">{{ userInitials }}</span>
          </div>
          <div>
            <p class="text-primary font-medium">{{ user.name }}</p>
            <p class="text-sm text-primary-light">{{ user.role }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="p-4 space-y-1">
        <template v-for="(item, index) in navigationItems" :key="index">
          <!-- Menu Item -->
          <router-link
            v-if="showMenuItem(item)"
            :to="item.path"
            :class="[
              'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
              isCurrentRoute(item.path)
                ? 'bg-primary text-white'
                : 'text-primary-light hover:bg-primary/10'
            ]"
          >
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </router-link>
        </template>
      </nav>
    </aside>

    <!-- Main Content -->
    <div :class="[
      'flex-1 transition-all duration-300 ease-in-out',
      'lg:ml-64'
    ]">
      <!-- Top Header -->
      <header class="h-16 bg-secondary-dark border-b border-primary/10">
        <div class="h-full px-4 flex items-center justify-between">
          <!-- Mobile Menu Button -->
          <button @click="toggleSidebar" class="lg:hidden text-primary-light hover:text-primary">
            <i class="fas fa-bars"></i>
          </button>

          <!-- Search Bar -->
          <div class="hidden md:flex flex-1 max-w-xl mx-4">
            <div class="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                class="w-full bg-secondary border border-primary/20 rounded-lg pl-10 pr-4 py-2
                       text-primary-light placeholder-primary-light/50 focus:outline-none
                       focus:border-primary focus:ring-1 focus:ring-primary"
              >
              <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-primary-light/50"></i>
            </div>
          </div>

          <!-- User Menu -->
          <div class="relative" v-click-outside="closeUserMenu">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-3 text-primary-light hover:text-primary"
            >
              <span class="hidden sm:block">{{ user.name }}</span>
              <div class="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span class="text-primary text-sm">{{ userInitials }}</span>
              </div>
            </button>

            <!-- Dropdown Menu -->
            <div v-if="isUserMenuOpen"
                 class="absolute right-0 mt-2 w-48 bg-secondary-dark border border-primary/10
                        rounded-lg shadow-lg py-1 z-50">
              <router-link to="/profile"
                          class="block px-4 py-2 text-primary-light hover:bg-primary/10">
                <i class="fas fa-user-circle mr-2"></i>
                Profile
              </router-link>
              <router-link to="/settings"
                          class="block px-4 py-2 text-primary-light hover:bg-primary/10">
                <i class="fas fa-cog mr-2"></i>
                Settings
              </router-link>
              <div class="border-t border-primary/10 my-1"></div>
              <button @click="handleLogout"
                      class="w-full text-left px-4 py-2 text-red-500 hover:bg-primary/10">
                <i class="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'DashboardLayout',

  setup() {
    const store = useStore()
    const router = useRouter()

    const isSidebarOpen = ref(false)
    const isUserMenuOpen = ref(false)

    // Get user from store
    const user = computed(() => store.getters['auth/currentUser'])

    // User initials for avatar
    const userInitials = computed(() => {
      if (!user.value?.name) return ''
      return user.value.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    })

    // Navigation items based on user role
    const navigationItems = [
      // Common Items
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'fas fa-home',
        roles: ['admin', 'editor', 'writer']
      },
      {
        name: 'Articles',
        path: '/articles',
        icon: 'fas fa-newspaper',
        roles: ['admin', 'editor', 'writer']
      },
      // Admin Only Items
      {
        name: 'Users',
        path: '/users',
        icon: 'fas fa-users',
        roles: ['admin']
      },
      {
        name: 'Categories',
        path: '/categories',
        icon: 'fas fa-tags',
        roles: ['admin']
      },
      // Editor Items
      {
        name: 'Reviews',
        path: '/reviews',
        icon: 'fas fa-check-circle',
        roles: ['editor']
      },
      // Writer Items
      {
        name: 'My Articles',
        path: '/my-articles',
        icon: 'fas fa-pen-fancy',
        roles: ['writer']
      },
      // Settings (Common)
      {
        name: 'Settings',
        path: '/settings',
        icon: 'fas fa-cog',
        roles: ['admin', 'editor', 'writer']
      }
    ]

    // Methods
    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value
    }

    const toggleUserMenu = () => {
      isUserMenuOpen.value = !isUserMenuOpen.value
    }

    const closeUserMenu = () => {
      isUserMenuOpen.value = false
    }

    const showMenuItem = (item) => {
      return item.roles.includes(user.value?.role)
    }

    const isCurrentRoute = (path) => {
      return router.currentRoute.value.path === path
    }

    const handleLogout = async () => {
      try {
        await store.dispatch('auth/logout')
        router.push('/login')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    return {
      user,
      userInitials,
      navigationItems,
      isSidebarOpen,
      isUserMenuOpen,
      toggleSidebar,
      toggleUserMenu,
      closeUserMenu,
      showMenuItem,
      isCurrentRoute,
      handleLogout
    }
  }
}
</script>

<style scoped>
/* Add any additional styles here */
</style>
