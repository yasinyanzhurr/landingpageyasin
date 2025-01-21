// resources/js/store/modules/articles.js

import api from '@/services/api'

const state = {
    articles: [],
    article: null,
    drafts: [],
    isLoading: false,
    error: null,
    pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: 0
    }
}

const getters = {
    // Get all articles
    getAllArticles: (state) => state.articles,

    // Get single article
    getArticle: (state) => state.article,

    // Get all drafts
    getDrafts: (state) => state.drafts,

    // Get loading state
    isLoading: (state) => state.isLoading,

    // Get error state
    getError: (state) => state.error,

    // Get pagination info
    getPagination: (state) => state.pagination
}

const mutations = {
    SET_ARTICLES(state, articles) {
        state.articles = articles
    },

    SET_ARTICLE(state, article) {
        state.article = article
    },

    SET_DRAFTS(state, drafts) {
        state.drafts = drafts
    },

    ADD_ARTICLE(state, article) {
        state.articles.unshift(article)
    },

    UPDATE_ARTICLE(state, updatedArticle) {
        const index = state.articles.findIndex(article => article.id === updatedArticle.id)
        if (index !== -1) {
            state.articles.splice(index, 1, updatedArticle)
        }
    },

    REMOVE_ARTICLE(state, articleId) {
        state.articles = state.articles.filter(article => article.id !== articleId)
    },

    SET_LOADING(state, status) {
        state.isLoading = status
    },

    SET_ERROR(state, error) {
        state.error = error
    },

    SET_PAGINATION(state, pagination) {
        state.pagination = pagination
    }
}

const actions = {
    // Fetch articles with pagination
    async fetchArticles({ commit }, { page = 1, filters = {} } = {}) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const response = await api.get('/articles', {
                params: {
                    page,
                    ...filters
                }
            })

            commit('SET_ARTICLES', response.data.data)
            commit('SET_PAGINATION', {
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                perPage: response.data.per_page,
                total: response.data.total
            })

            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch articles'
            commit('SET_ERROR', errorMessage)
            throw new Error(errorMessage)
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // Fetch single article
    async fetchArticle({ commit }, id) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const response = await api.get(`/articles/${id}`)
            commit('SET_ARTICLE', response.data)
            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch article'
            commit('SET_ERROR', errorMessage)
            throw new Error(errorMessage)
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // Fetch versions
    async fetchVersions({ commit }, articleId) {
        commit('SET_LOADING', true)
        try {
            const response = await api.get(`/articles/${articleId}/versions`)
            return response.data
        } catch (error) {
            throw error
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // Restore version
    async restoreVersion({ commit }, { articleId, versionId }) {
        commit('SET_LOADING', true)
        try {
            const response = await api.post(`/articles/${articleId}/versions/${versionId}/restore`)
            commit('UPDATE_ARTICLE', response.data)
            return response.data
        } catch (error) {
            throw error
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // Save article as draft
    async saveDraft({ commit }, articleData) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const formData = new FormData()

            // Append article data to FormData
            Object.keys(articleData).forEach(key => {
                if (key === 'tags') {
                    formData.append(key, JSON.stringify(articleData[key]))
                } else if (key === 'thumbnail' && articleData[key] instanceof File) {
                    formData.append(key, articleData[key])
                } else {
                    formData.append(key, articleData[key])
                }
            })

            const response = await api.post('/articles/draft', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            commit('ADD_ARTICLE', response.data)
            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to save draft'
            commit('SET_ERROR', errorMessage)
            throw new Error(errorMessage)
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // Submit article for review
    async submitArticle({ commit }, articleData) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const formData = new FormData()

            Object.keys(articleData).forEach(key => {
                if (key === 'tags') {
                    formData.append(key, JSON.stringify(articleData[key]))
                } else if (key === 'thumbnail' && articleData[key] instanceof File) {
                    formData.append(key, articleData[key])
                } else {
                    formData.append(key, articleData[key])
                }
            })

            const response = await api.post('/articles', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            commit('ADD_ARTICLE', response.data)
            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to submit article'
            commit('SET_ERROR', errorMessage)
            throw new Error(errorMessage)
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // Update article
    async updateArticle({ commit }, { id, articleData }) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const formData = new FormData()

            Object.keys(articleData).forEach(key => {
                if (key === 'tags') {
                    formData.append(key, JSON.stringify(articleData[key]))
                } else if (key === 'thumbnail' && articleData[key] instanceof File) {
                    formData.append(key, articleData[key])
                } else {
                    formData.append(key, articleData[key])
                }
            })

            formData.append('_method', 'PUT')

            const response = await api.post(`/articles/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            commit('UPDATE_ARTICLE', response.data)
            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update article'
            commit('SET_ERROR', errorMessage)
            throw new Error(errorMessage)
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // Delete article
    async deleteArticle({ commit }, id) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            await api.delete(`/articles/${id}`)
            commit('REMOVE_ARTICLE', id)
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete article'
            commit('SET_ERROR', errorMessage)
            throw new Error(errorMessage)
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // Submit for review
    async submitForReview({ commit }, id) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
            const response = await api.post(`/articles/${id}/submit`)
            commit('UPDATE_ARTICLE', response.data)
            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to submit for review'
            commit('SET_ERROR', errorMessage)
            throw new Error(errorMessage)
        } finally {
            commit('SET_LOADING', false)
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
