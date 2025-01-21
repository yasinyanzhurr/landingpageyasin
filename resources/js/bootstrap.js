// resources/js/bootstrap.js atau file konfigurasi axios Anda

import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000'; // Ganti https menjadi http
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true; // Penting untuk authentication
