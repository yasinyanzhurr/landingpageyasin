// resources/js/main.js

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { performanceMonitor } from './utils/performance'
import LazyLoad from './directives/LazyLoad'

const app = createApp(App)

// Register global directives
app.directive('lazy', LazyLoad)

// Start performance monitoring
performanceMonitor.trackPageLoad()

// Global error handler
app.config.errorHandler = (err, vm, info) => {
    console.error('Global error:', err)
    // Implement error reporting service here
}

// Register global components
import BaseButton from './components/base/Button.vue'
import BaseInput from './components/base/Input.vue'
import BaseCard from './components/base/Card.vue'

app.component('BaseButton', BaseButton)
app.component('BaseInput', BaseInput)
app.component('BaseCard', BaseCard)

app.use(router)
app.mount('#app')
