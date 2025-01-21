// resources/js/utils/performance.js

export const performanceMonitor = {
    metrics: {},

    startTracking(metricName) {
        this.metrics[metricName] = performance.now()
    },

    endTracking(metricName) {
        if (this.metrics[metricName]) {
            const duration = performance.now() - this.metrics[metricName]
            delete this.metrics[metricName]
            return duration
        }
        return null
    },

    trackPageLoad() {
        window.addEventListener('load', () => {
            const navigationTiming = performance.getEntriesByType('navigation')[0]
            const paintTiming = performance.getEntriesByType('paint')

            const metrics = {
                loadTime: navigationTiming.loadEventEnd - navigationTiming.startTime,
                firstPaint: paintTiming.find(t => t.name === 'first-paint')?.startTime,
                firstContentfulPaint: paintTiming.find(t => t.name === 'first-contentful-paint')?.startTime
            }

            // Send metrics to analytics service
            this.logMetrics(metrics)
        })
    },

    logMetrics(metrics) {
        // Implement your analytics service here
        console.log('Performance Metrics:', metrics)
    }
}
