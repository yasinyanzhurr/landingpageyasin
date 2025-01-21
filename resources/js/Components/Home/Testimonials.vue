<!-- resources/js/Components/Home/Testimonials.vue -->
<template>
  <section id="testimonials" class="bg-secondary-light py-20 overflow-hidden">
    <div class="section-container">
      <!-- Section Header -->
      <div class="text-center mb-16 animate-fade-in">
        <h2 class="mb-4">What Our Students Say</h2>
        <p class="text-primary-light max-w-2xl mx-auto">
          Read what our students and clients have to say about their learning experience
        </p>
        <div class="w-24 h-1 bg-primary mx-auto rounded-full mt-4"></div>
      </div>

      <!-- Testimonial Slider -->
      <div class="relative">
        <!-- Navigation Buttons -->
        <button @click="previousSlide"
                class="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-secondary/80
                       text-primary rounded-full hover:bg-secondary transition-colors
                       focus:outline-none focus:ring-2 focus:ring-primary hidden md:block">
          <i class="fas fa-chevron-left text-xl"></i>
        </button>

        <button @click="nextSlide"
                class="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-secondary/80
                       text-primary rounded-full hover:bg-secondary transition-colors
                       focus:outline-none focus:ring-2 focus:ring-primary hidden md:block">
          <i class="fas fa-chevron-right text-xl"></i>
        </button>

        <!-- Testimonials Container -->
        <div class="relative">
          <div class="flex transition-transform duration-500 ease-out"
               :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <!-- Individual Testimonials -->
            <div v-for="(testimonial, index) in testimonials"
                 :key="index"
                 class="w-full flex-shrink-0 px-4">
              <div class="max-w-4xl mx-auto">
                <!-- Testimonial Card -->
                <div class="card group">
                  <!-- Quote Icon -->
                  <div class="absolute -top-5 -left-5 w-10 h-10 bg-primary rounded-full
                              flex items-center justify-center transform -rotate-12
                              group-hover:rotate-0 transition-transform duration-300">
                    <i class="fas fa-quote-left text-secondary"></i>
                  </div>

                  <!-- Content -->
                  <div class="pt-8 px-8 pb-6">
                    <!-- Rating Stars -->
                    <div class="flex items-center mb-4">
                      <div class="flex text-primary">
                        <i v-for="star in 5"
                           :key="star"
                           :class="[
                             'fas',
                             star <= testimonial.rating ? 'fa-star' : 'fa-star-half-alt'
                           ]">
                        </i>
                      </div>
                      <span class="ml-2 text-primary-light">
                        {{ testimonial.rating.toFixed(1) }}/5.0
                      </span>
                    </div>

                    <!-- Testimonial Text -->
                    <blockquote class="text-lg text-primary-light italic mb-6">
                      "{{ testimonial.content }}"
                    </blockquote>

                    <!-- Author Info -->
                    <div class="flex items-center">
                      <!-- Author Image -->
                      <div class="w-12 h-12 rounded-full overflow-hidden bg-secondary-dark
                                  border-2 border-primary">
                        <img v-if="testimonial.avatar"
                             :src="testimonial.avatar"
                             :alt="testimonial.name"
                             class="w-full h-full object-cover">
                        <div v-else
                             class="w-full h-full flex items-center justify-center bg-secondary">
                          <span class="text-primary text-lg font-bold">
                            {{ getInitials(testimonial.name) }}
                          </span>
                        </div>
                      </div>

                      <!-- Author Details -->
                      <div class="ml-4">
                        <h4 class="font-semibold text-primary">
                          {{ testimonial.name }}
                        </h4>
                        <p class="text-sm text-primary-light">
                          {{ testimonial.title }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Slider Indicators -->
        <div class="flex justify-center mt-8 space-x-2">
          <button v-for="(_, index) in testimonials"
                  :key="index"
                  @click="goToSlide(index)"
                  :class="[
                    'w-3 h-3 rounded-full transition-all duration-300',
                    currentSlide === index
                      ? 'bg-primary w-8'
                      : 'bg-primary/30 hover:bg-primary/50'
                  ]"
                  :aria-label="`Go to slide ${index + 1}`">
          </button>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center mt-16">
        <h3 class="text-2xl font-semibold text-primary mb-6">
          Ready to Start Your Learning Journey?
        </h3>
        <button class="btn-primary animate-bounce-slow">
          Get Started Now
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Testimonials',
  data() {
    return {
      currentSlide: 0,
      autoplayInterval: null,
      testimonials: [
        {
          name: "Sarah Johnson",
          title: "Math Student",
          content: "The mathematics course completely transformed my understanding of calculus. The step-by-step explanations and practical examples made complex concepts easy to grasp.",
          rating: 5.0,
          avatar: null
        },
        {
          name: "Ahmad Hassan",
          title: "Language Learner",
          content: "Learning Arabic through this platform has been an amazing experience. The structured approach and interactive lessons helped me progress much faster than I expected.",
          rating: 4.8,
          avatar: null
        },
        {
          name: "David Chen",
          title: "Business Student",
          content: "The entrepreneurship course provided practical insights that I could immediately apply to my startup. The templates and resources are invaluable.",
          rating: 4.9,
          avatar: null
        },
        {
          name: "Emily Parker",
          title: "Technology Enthusiast",
          content: "The frontend development course is comprehensive and well-structured. I went from knowing nothing about coding to building my own portfolio website.",
          rating: 5.0,
          avatar: null
        }
      ]
    }
  },
  methods: {
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.testimonials.length
    },
    previousSlide() {
      this.currentSlide = this.currentSlide === 0
        ? this.testimonials.length - 1
        : this.currentSlide - 1
    },
    goToSlide(index) {
      this.currentSlide = index
    },
    getInitials(name) {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
    },
    startAutoplay() {
      this.autoplayInterval = setInterval(() => {
        this.nextSlide()
      }, 5000) // Change slide every 5 seconds
    },
    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval)
      }
    }
  },
  mounted() {
    this.startAutoplay()
  },
  beforeDestroy() {
    this.stopAutoplay()
  }
}
</script>

<style scoped>
/* Optional: Add custom transitions for slider */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>
