// resources/js/store/index.js

import { createStore } from 'vuex'
import auth from './modules/auth'
import dashboard from './modules/dashboard'


export default createStore({
    modules: {
        auth,
        dashboard,
        articles
    },
    // State global jika diperlukan
    state: {},
    // Mutations global jika diperlukan
    mutations: {},
    // Actions global jika diperlukan
    actions: {}
})
