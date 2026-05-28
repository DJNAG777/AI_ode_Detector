import axios from 'axios'

const API_URL = '/api'

const api = axios.create({ baseURL: API_URL, timeout: 60000 })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

export const detectAPI = {
  single: (data) => api.post('/detect/single', data),
  compare: (data) => api.post('/detect/compare', data),
  upload: (formData) => api.post('/detect/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
  }),
}

export const reportsAPI = {
  getUser: (params) => api.get('/reports/user', { params }),
  getStats: () => api.get('/reports/stats'),
  toggleFavorite: (id) => api.patch(`/reports/${id}/favorite`),
  delete: (id) => api.delete(`/reports/${id}`),
}

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
}

export default api
