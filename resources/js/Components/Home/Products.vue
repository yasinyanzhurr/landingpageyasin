<!-- resources/js/Components/Home/Products.vue -->
<template>
  <section id="products" class="bg-secondary py-20">
    <div class="section-container">
      <!-- Section Header -->
      <div class="text-center mb-16 animate-fade-in">
        <h2 class="mb-4">Digital Products</h2>
        <p class="text-primary-light max-w-2xl mx-auto">
          Discover our collection of premium digital products designed to enhance your learning journey
        </p>
        <div class="w-24 h-1 bg-primary mx-auto rounded-full mt-4"></div>
      </div>

      <!-- Product Categories -->
      <div class="mb-12">
        <div class="flex flex-wrap justify-center gap-4">
          <button v-for="category in productCategories"
                  :key="category.id"
                  @click="selectedCategory = category.id"
                  :class="[
                    'px-4 py-2 rounded-full transition-all duration-300',
                    selectedCategory === category.id
                      ? 'bg-primary text-secondary font-bold'
                      : 'bg-secondary-light text-primary-light hover:bg-primary/20'
                  ]">
            <i :class="category.icon" class="mr-2"></i>
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <template v-for="product in filteredProducts" :key="product.id">
          <!-- Product Card -->
          <div class="group">
            <!-- Card Container with Hover Effects -->
            <div class="card overflow-hidden">
              <!-- Product Image -->
              <div class="relative overflow-hidden rounded-t-lg">
                <div class="aspect-w-16 aspect-h-9 bg-secondary-light">
                  <img v-if="product.image"
                       :src="product.image"
                       :alt="product.title"
                       class="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500">
                  <div v-else
                       class="w-full h-full flex items-center justify-center">
                    <i :class="product.icon" class="text-5xl text-primary"></i>
                  </div>
                </div>

                <!-- Price Badge -->
                <div class="absolute top-4 right-4 px-4 py-2 bg-primary text-secondary
                            font-bold rounded-full shadow-lg">
                  {{ formatPrice(product.price) }}
                </div>

                <!-- New Badge if product is new -->
                <div v-if="isNewProduct(product.releaseDate)"
                     class="absolute top-4 left-4 px-4 py-2 bg-secondary text-primary
                            font-bold rounded-full shadow-lg">
                  NEW
                </div>
              </div>

              <!-- Product Content -->
              <div class="p-6 space-y-4">
                <h3 class="text-xl font-semibold group-hover:text-primary transition-colors">
                  {{ product.title }}
                </h3>

                <p class="text-primary-light line-clamp-2">
                  {{ product.description }}
                </p>

                <!-- Features List -->
                <ul class="space-y-2">
                  <li v-for="feature in product.features"
                      :key="feature"
                      class="flex items-center text-primary-light">
                    <i class="fas fa-check-circle text-primary mr-2"></i>
                    {{ feature }}
                  </li>
                </ul>

                <!-- Product Metadata -->
                <div class="flex items-center justify-between pt-4 border-t border-primary/10">
                  <div class="flex items-center space-x-2">
                    <i class="fas fa-users text-primary-light"></i>
                    <span class="text-primary-light">{{ product.students }}+ students</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <i class="fas fa-star text-primary"></i>
                    <span class="text-primary-light">{{ product.rating }}/5</span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4 pt-4">
                  <button @click="previewProduct(product)"
                          class="btn-secondary flex-1">
                    Preview
                  </button>
                  <button @click="purchaseProduct(product)"
                          class="btn-primary flex-1">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Preview Modal -->
      <div v-if="selectedProduct"
           class="fixed inset-0 bg-secondary-dark/80 flex items-center justify-center z-50 p-4">
        <div class="bg-secondary max-w-2xl w-full rounded-lg shadow-xl animate-fade-in">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-2xl font-bold text-primary">{{ selectedProduct.title }}</h3>
              <button @click="selectedProduct = null"
                      class="text-primary-light hover:text-primary">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>

            <!-- Preview Content -->
            <div class="space-y-4">
              <div class="aspect-w-16 aspect-h-9 bg-secondary-light rounded-lg">
                <!-- Preview Video or Image would go here -->
                <div class="flex items-center justify-center">
                  <i :class="selectedProduct.icon" class="text-6xl text-primary"></i>
                </div>
              </div>

              <p class="text-primary-light">{{ selectedProduct.fullDescription }}</p>

              <div class="space-y-2">
                <h4 class="font-semibold text-primary">What you'll learn:</h4>
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li v-for="item in selectedProduct.learningPoints"
                      :key="item"
                      class="flex items-start">
                    <i class="fas fa-check-circle text-primary mt-1 mr-2"></i>
                    <span class="text-primary-light">{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Modal Actions -->
            <div class="flex justify-end mt-6 space-x-4">
              <button @click="selectedProduct = null"
                      class="btn-secondary">
                Close
              </button>
              <button @click="purchaseProduct(selectedProduct)"
                      class="btn-primary">
                Purchase Now - {{ formatPrice(selectedProduct.price) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Products',
  data() {
    return {
      selectedCategory: 'all',
      selectedProduct: null,
      productCategories: [
        { id: 'all', name: 'All Products', icon: 'fas fa-th-large' },
        { id: 'courses', name: 'Online Courses', icon: 'fas fa-graduation-cap' },
        { id: 'ebooks', name: 'E-Books', icon: 'fas fa-book' },
        { id: 'templates', name: 'Templates', icon: 'fas fa-file-alt' }
      ],
      products: [
        {
          id: 1,
          categoryId: 'courses',
          title: 'Complete Mathematics Mastery',
          description: 'Comprehensive math course covering from basic to advanced topics',
          fullDescription: 'Master mathematics from the ground up with our comprehensive course...',
          price: 99.99,
          image: null,
          icon: 'fas fa-square-root-alt',
          features: [
            '100+ video lessons',
            'Practice exercises',
            'Quiz after each section',
            'Certificate of completion'
          ],
          learningPoints: [
            'Master algebraic concepts',
            'Understand calculus fundamentals',
            'Solve complex problems',
            'Apply math in real world'
          ],
          students: 1200,
          rating: 4.8,
          releaseDate: '2024-01-15'
        },
        {
          id: 2,
          categoryId: 'ebooks',
          title: 'English Grammar Guide',
          description: 'Complete guide to English grammar with practical examples',
          fullDescription: 'Perfect your English grammar with this comprehensive guide...',
          price: 29.99,
          image: null,
          icon: 'fas fa-language',
          features: [
            '200+ pages of content',
            'Practice exercises',
            'Common mistakes guide',
            'Digital format (PDF, EPUB)'
          ],
          learningPoints: [
            'Master all tenses',
            'Perfect your punctuation',
            'Enhance writing skills',
            'Avoid common mistakes'
          ],
          students: 850,
          rating: 4.7,
          releaseDate: '2024-01-20'
        },
        // Add more products as needed
      ]
    }
  },
  computed: {
    filteredProducts() {
      if (this.selectedCategory === 'all') {
        return this.products
      }
      return this.products.filter(product => product.categoryId === this.selectedCategory)
    }
  },
  methods: {
    formatPrice(price) {
      return `$${price.toFixed(2)}`
    },
    isNewProduct(releaseDate) {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return new Date(releaseDate) > thirtyDaysAgo
    },
    previewProduct(product) {
      this.selectedProduct = product
    },
    purchaseProduct(product) {
      // Implement purchase logic here
      console.log(`Purchasing ${product.title}`)
      // You could redirect to a checkout page or open a payment modal
    }
  }
}
</script>
