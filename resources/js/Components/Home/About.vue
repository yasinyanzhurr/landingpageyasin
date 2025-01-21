<!-- resources/js/Components/Home/About.vue -->
<template>
  <section id="about" class="bg-secondary py-20">
    <div class="section-container">
      <!-- Section Header -->
      <div class="text-center mb-16 animate-fade-in">
        <h2 class="mb-4">About Me</h2>
        <div class="w-24 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      <!-- Content Grid -->
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <!-- Left Column: Image -->
        <div class="relative group">
          <!-- Image Placeholder (Replace with your image) -->
          <div class="aspect-w-4 aspect-h-5 rounded-lg overflow-hidden">
            <div class="w-full h-full bg-secondary-light animate-pulse">
              <!-- Placeholder content -->
              <div class="flex items-center justify-center h-full">
                <svg class="w-20 h-20 text-primary opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Decorative Elements -->
          <div class="absolute -inset-4 border-2 border-primary rounded-lg -z-10
                      transform rotate-3 transition-transform group-hover:rotate-0"></div>
        </div>

        <!-- Right Column: Content -->
        <div class="space-y-6">
          <div v-for="(item, index) in aboutItems"
               :key="index"
               class="transform hover:translate-x-2 transition-transform duration-300">
            <h3 class="text-xl font-semibold mb-2">{{ item.title }}</h3>
            <p class="text-primary-light">{{ item.description }}</p>
          </div>

          <!-- Skills Tags -->
          <div class="pt-6">
            <h4 class="text-lg font-semibold mb-4">Skills & Expertise</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="(skill, index) in skills"
                    :key="index"
                    class="px-4 py-2 bg-secondary-light rounded-full text-primary-light
                           hover:bg-primary hover:text-secondary transition-colors duration-300">
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Social Links -->
          <div class="pt-6 flex space-x-4">
            <a v-for="(social, index) in socialLinks"
               :key="index"
               :href="social.url"
               target="_blank"
               class="text-primary-light hover:text-primary transition-colors duration-300">
              <i :class="social.icon" class="text-2xl"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      aboutItems: [
        {
          title: 'Educational Background',
          description: 'Passionate educator with expertise in mathematics, languages, and technology.'
        },
        {
          title: 'Vision',
          description: 'Bridging knowledge gaps through innovative digital learning solutions.'
        },
        {
          title: 'Mission',
          description: 'Creating accessible educational content that empowers learners of all levels.'
        }
      ],
      skills: [
        'Mathematics', 'English', 'Arabic', 'Frontend Development',
        'Backend Development', 'Education Technology', 'Content Creation',
        'Business Development'
      ],
      socialLinks: [
        { icon: 'fab fa-github', url: 'https://github.com/yasinyanzhurr' },
        { icon: 'fab fa-linkedin', url: '#' },
        { icon: 'fab fa-twitter', url: '#' },
        { icon: 'fab fa-instagram', url: '#' }
      ]
    }
  }
}
</script>
