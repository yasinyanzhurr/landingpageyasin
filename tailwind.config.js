import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            colors: {
                // Warna Utama
                primary: {
                    DEFAULT: '#FFD700', // Kuning terang
                    dark: '#F2C94C',    // Kuning gelap
                    light: '#FFE566',   // Kuning terang
                },
                // Warna Sekunder
                secondary: {
                    DEFAULT: '#1A1A1A', // Hitam soft
                    dark: '#000000',    // Hitam pekat
                    light: '#333333',   // Hitam abu
                },
                // Warna Aksen
                accent: {
                    DEFAULT: '#2D2D2D', // Warna aksen untuk teks
                    hover: '#FFE97F',   // Warna hover
                }
            },
            // Konfigurasi animasi
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-up': 'slideUp 0.5s ease-out',
                'bounce-slow': 'bounce 3s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
