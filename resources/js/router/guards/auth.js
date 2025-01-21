// resources/js/router/guards/auth.js

export default function authGuard(to, from, next) {
    // Ambil token dari localStorage
    const token = localStorage.getItem('auth_token')

    // Ambil user role dari localStorage
    const userRole = localStorage.getItem('user_role')

    // Daftar route yang membutuhkan autentikasi
    const authRequired = to.matched.some(record => record.meta.requiresAuth)

    // Daftar route yang membutuhkan role spesifik
    const requiredRole = to.meta.role

    if (authRequired && !token) {
        // Jika route membutuhkan auth tapi tidak ada token
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    } else if (requiredRole && userRole !== requiredRole) {
        // Jika user tidak memiliki role yang sesuai
        next({ path: '/unauthorized' })
    } else {
        next()
    }
}
