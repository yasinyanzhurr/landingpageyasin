<!-- resources/js/Components/Home/Hero.vue -->
<template>
  <section class="relative h-screen flex items-center bg-secondary-dark overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0"
           style="background-image: url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23FFD700\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
      </div>
    </div>

    <!-- Content Container -->
    <div class="section-container relative z-10">
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <!-- Left Column: Text Content -->
        <div class="space-y-6 animate-fade-in">
          <h1 class="text-shadow">
            Welcome to My Digital Space
          </h1>
          <p class="text-xl text-primary-light">
            Exploring the intersection of Education, Technology, and Innovation
          </p>
          <div class="space-x-4">
            <button class="btn-primary animate-bounce-slow">
              Explore More
            </button>
            <button class="btn-secondary">
              Contact Me
            </button>
          </div>
        </div>

        <!-- Right Column: Animated Decoration -->
        <div class="hidden md:block">
          <div class="relative animate-slide-up">
            <!-- Decorative Elements -->
            <div class="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-dark
                        rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000
                        group-hover:duration-200 animate-pulse">
            </div>
            <div class="relative bg-secondary-light rounded-lg p-8">
              <!-- Code Preview Effect -->
              <pre class="text-primary-light overflow-x-auto">
                <code>
const portfolio = {
  name: "{{ username }}",
  passion: ["Education", "Tech", "Innovation"],
  mission: "Empowering through knowledge"
};
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Hero',
  data() {
    return {
      username: 'Yasin Yanzhurr'
    }
  }
}
</script>
