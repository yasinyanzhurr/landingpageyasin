// resources/js/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import authGuard from './guards/auth'

// Lazy loading untuk komponen
const Login = () => import('@/views/auth/Login.vue')
const Register = () => import('@/views/auth/Register.vue')
const ForgotPassword = () => import('@/views/auth/ForgotPassword.vue')
const AdminDashboard = () => import('@/views/dashboard/Admin.vue')
const EditorDashboard = () => import('@/views/dashboard/Editor.vue')
const WriterDashboard = () => import('@/views/dashboard/Writer.vue')
const Unauthorized = () => import('@/views/errors/Unauthorized.vue')

const routes = [
    // Public routes
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { guest: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: { guest: true }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
        meta: { guest: true }
    },

    // Protected routes
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: {
            requiresAuth: true,
            role: 'admin'
        }
    },
    {
        path: '/editor',
        name: 'EditorDashboard',
        component: EditorDashboard,
        meta: {
            requiresAuth: true,
            role: 'editor'
        }
    },
    {
        path: '/writer',
        name: 'WriterDashboard',
        component: WriterDashboard,
        meta: {
            requiresAuth: true,
            role: 'writer'
        }
    },

    // Error routes
    {
        path: '/unauthorized',
        name: 'Unauthorized',
        component: Unauthorized
    },

    // 404 route
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/errors/NotFound.vue')
    },

    // Reset Passwords routes
    {
        path: '/reset-password/:token',
        name: 'ResetPassword',
        component: () => import('@/views/auth/ResetPassword.vue'),
        props: true,
        meta: { guest: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Implement auth guard
router.beforeEach(authGuard)

export default router
