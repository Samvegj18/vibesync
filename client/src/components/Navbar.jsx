/**
 * Navbar — Animated navigation bar with glassmorphism
 */
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Music, Menu, X, LogIn, User, BarChart3, Sparkles, Compass, Home, Database, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: '/mood-analyzer', label: 'Mood AI', icon: Sparkles },
    { path: '/generate', label: 'Generate', icon: Music },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/database', label: 'DB Explorer', icon: Database },
    ...(user?.isAdmin ? [{ path: '/admin', label: 'Admin', icon: Shield }] : []),
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center group-hover:scale-110 transition-transform">
              <Music size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-family-display)] gradient-text">
              VibeSync
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${location.pathname === link.path
                    ? 'bg-white/10 text-white glow-purple'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition">
                  <img src={user.avatar} alt="" className="w-7 h-7 rounded-full" />
                  <span className="text-sm font-medium">{user.username}</span>
                </Link>
                <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-400 hover:text-white transition px-3 py-2">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white text-sm font-semibold hover:opacity-90 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-strong border-t border-white/5"
        >
          <div className="px-4 py-4 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition"
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-neon-purple font-semibold">
                <LogIn size={18} /> Login / Sign Up
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
