/**
 * Axios API Client
 * Configured to talk to our Express backend at localhost:5000
 */
import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
})

// Automatically attach JWT token to every request if logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('vibesync_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API
