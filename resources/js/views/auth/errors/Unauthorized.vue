<!-- resources/js/views/errors/Unauthorized.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-secondary-dark">
        <div class="text-center">
            <h1 class="text-6xl font-bold text-primary mb-4">403</h1>
            <h2 class="text-2xl font-semibold text-primary-light mb-4">
                Unauthorized Access
            </h2>
            <p class="text-primary-light/80 mb-8">
                Sorry, you don't have permission to access this page.
            </p>
            <router-link
                to="/"
                class="btn-primary inline-flex items-center">
                <i class="fas fa-home mr-2"></i>
                Back to Home
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Unauthorized'
}
</script>
