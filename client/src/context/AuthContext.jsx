/**
 * Auth Context — Global authentication state
 * Provides login/logout/register/refreshUser functions to all components
 */
import { createContext, useContext, useState, useEffect } from 'react'
import API from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('vibesync_token')
    if (token) {
      API.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('vibesync_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password })
    localStorage.setItem('vibesync_token', res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const register = async (username, email, password) => {
    const res = await API.post('/auth/register', { username, email, password })
    localStorage.setItem('vibesync_token', res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('vibesync_token')
    setUser(null)
  }

  // Refresh user data from server (updates vibe_score, listening_streak, etc.)
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('vibesync_token')
      if (token) {
        const res = await API.get('/auth/me')
        setUser(res.data.user)
      }
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
