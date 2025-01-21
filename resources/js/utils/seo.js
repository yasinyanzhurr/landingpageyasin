// resources/js/utils/seo.js

export const seoOptimizer = {
    updateMetaTags(data) {
        document.title = data.title

        this.updateMetaTag('description', data.description)
        this.updateMetaTag('keywords', data.keywords)

        // Open Graph tags
        this.updateMetaTag('og:title', data.title)
        this.updateMetaTag('og:description', data.description)
        this.updateMetaTag('og:image', data.image)

        // Twitter Card tags
        this.updateMetaTag('twitter:card', 'summary_large_image')
        this.updateMetaTag('twitter:title', data.title)
        this.updateMetaTag('twitter:description', data.description)
        this.updateMetaTag('twitter:image', data.image)
    },

    updateMetaTag(name, content) {
        if (!content) return

        let meta = document.querySelector(`meta[name="${name}"]`)
        if (!meta) {
            meta = document.createElement('meta')
            meta.name = name
            document.head.appendChild(meta)
        }
        meta.content = content
    }
}
