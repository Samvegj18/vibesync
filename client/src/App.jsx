/**
 * App.jsx — Main application with routing
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MoodAnalyzer from './pages/MoodAnalyzer'
import PlaylistGenerator from './pages/PlaylistGenerator'
import Explore from './pages/Explore'
import Analytics from './pages/Analytics'
import DatabaseExplorer from './pages/DatabaseExplorer'
import VibeBot from './components/VibeBot'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-bg text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mood-analyzer" element={<MoodAnalyzer />} />
            <Route path="/generate" element={<PlaylistGenerator />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/database" element={<DatabaseExplorer />} />
          </Routes>
          {/* Floating VibeBot chatbot — visible on all pages */}
          <VibeBot />
        </div>
      </Router>
    </AuthProvider>
  )
}
