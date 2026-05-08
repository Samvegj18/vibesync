/**
 * Landing Page — Cinematic hero with mood cards, features, and testimonials
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Music, Brain, Users, Zap, Heart, Dumbbell, Moon, BookOpen, Code, PartyPopper, Flame, Cloud, SmilePlus, HeartCrack, Car } from 'lucide-react'
import API from '../api/axios'

const moodIcons = {
  'heart-crack': HeartCrack, 'dumbbell': Dumbbell, 'cloud-rain': Cloud,
  'book-open': BookOpen, 'code': Code, 'moon': Moon, 'heart': Heart,
  'party-popper': PartyPopper, 'flame': Flame, 'leaf': Sparkles,
  'cloud': Cloud, 'smile': SmilePlus, 'music': Music
}

export default function Landing() {
  const [moods, setMoods] = useState([])
  const [quote, setQuote] = useState('')

  useEffect(() => {
    API.get('/moods').then(r => setMoods(r.data.moods)).catch(() => {})
    API.get('/ai/quote').then(r => setQuote(r.data.quote)).catch(() => {})
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-neon-purple/20 rounded-full blur-[128px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-pink/20 rounded-full blur-[128px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-blue/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-neon-purple mb-6">
              <Sparkles size={14} className="animate-pulse" />
              AI-Powered Music Discovery
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-[family-name:var(--font-family-display)] leading-tight mb-6">
              Feel The
              <span className="block gradient-text glow-text">Music</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Discover songs that match your mood. Let AI understand your vibes
              and create the perfect playlist for every moment.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold text-lg glow-purple hover:shadow-2xl transition-all"
                >
                  🎵 Find Your Vibe
                </motion.button>
              </Link>
              <Link to="/mood-analyzer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 rounded-2xl glass text-white font-semibold text-lg hover:bg-white/10 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Brain size={20} />
                    AI Mood Analyzer
                  </span>
                </motion.button>
              </Link>
            </div>

            {/* Quote */}
            {quote && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-gray-500 italic text-sm max-w-md mx-auto"
              >
                "{quote}"
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ===== MOOD CARDS SECTION ===== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-family-display)] mb-4">
              What's Your <span className="gradient-text">Vibe</span>?
            </h2>
            <p className="text-gray-400 text-lg">Select your mood and discover music that gets you</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {moods.map((mood, i) => {
              const IconComp = moodIcons[mood.mood_icon] || Music
              return (
                <motion.div
                  key={mood.mood_id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Link to={`/explore?mood=${mood.mood_id}`}>
                    <div
                      className="glass rounded-2xl p-6 text-center cursor-pointer group transition-all duration-300 hover:border-white/20"
                      style={{ boxShadow: `0 0 30px ${mood.mood_color}15` }}
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${mood.mood_color}20` }}
                      >
                        <IconComp size={24} style={{ color: mood.mood_color }} />
                      </div>
                      <h3 className="font-bold text-white mb-1">{mood.mood_name}</h3>
                      <p className="text-xs text-gray-500">{mood.song_count} songs</p>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-family-display)] mb-4">
              Why <span className="gradient-text">VibeSync</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: 'AI Mood Detection', desc: 'Tell us how you feel and our AI instantly detects your mood and suggests the perfect playlist.', color: '#a855f7' },
              { icon: Zap, title: 'Instant Playlists', desc: 'Generate custom playlists based on mood, activity, and vibe in seconds. No searching needed.', color: '#3b82f6' },
              { icon: Users, title: 'Social Listening', desc: 'Follow friends, share playlists, see what everyone is vibing to in real-time.', color: '#ec4899' },
              { icon: Music, title: 'Smart Discovery', desc: 'Discover trending songs across 12 mood categories. From heartbreak to hype.', color: '#10b981' },
              { icon: Sparkles, title: 'VibeBot Chat', desc: 'Chat with our AI assistant for instant song recommendations any time of day.', color: '#06b6d4' },
              { icon: Heart, title: 'Mood Analytics', desc: 'Track your listening patterns, mood heatmaps, vibe scores, and streaks.', color: '#f43f5e' },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-6 group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${feat.color}15` }}>
                  <feat.icon size={22} style={{ color: feat.color }} />
                </div>
                <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center font-[family-name:var(--font-family-display)] mb-16">
            What Users <span className="gradient-text">Say</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Arjun', text: 'VibeSync literally reads my mind. The AI mood analyzer is scary accurate! 🔥', avatar: 'A' },
              { name: 'Priya', text: 'Finally a music app that understands my late-night coding sessions.', avatar: 'P' },
              { name: 'Rahul', text: 'The gym playlists are insane. This replaced Spotify for me.', avatar: 'R' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass rounded-2xl p-6"
              >
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink flex items-center justify-center text-xs font-bold">
                    {t.avatar}
                  </div>
                  <span className="text-sm font-semibold">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
              <Music size={16} />
            </div>
            <span className="font-bold gradient-text">VibeSync</span>
          </div>
          <p className="text-gray-500 text-sm">© 2024 VibeSync. Built with ❤️ for DBMS Mini Project.</p>
          <div className="flex gap-4 text-gray-500 text-sm">
            <span>React</span>
            <span>•</span>
            <span>Node.js</span>
            <span>•</span>
            <span>MySQL</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
