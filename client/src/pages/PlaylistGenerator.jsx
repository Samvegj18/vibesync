/**
 * Playlist Generator — AI generates playlists from mood + activity
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Music, Clock, ListMusic, RefreshCw } from 'lucide-react'
import API from '../api/axios'

export default function PlaylistGenerator() {
  const [mood, setMood] = useState('')
  const [activity, setActivity] = useState('')
  const [vibe, setVibe] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!mood.trim()) return
    setLoading(true)
    try {
      const res = await API.post('/ai/generate-playlist', { mood, activity, vibe })
      setResult(res.data.generatedPlaylist)
    } catch { setResult(null) }
    setLoading(false)
  }

  const formatDuration = (secs) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`

  const presets = [
    { m: 'heartbreak', a: 'alone at night', v: 'sad' },
    { m: 'gym', a: 'workout', v: 'aggressive' },
    { m: 'coding', a: 'late night', v: 'focus' },
    { m: 'party', a: 'friday night', v: 'hype' },
    { m: 'romantic', a: 'date night', v: 'soft' },
    { m: 'chill', a: 'relaxing', v: 'calm' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-[150px]" />

      <div className="max-w-3xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-neon-blue mb-4">
            <Wand2 size={16} /> AI Playlist Generator
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-family-display)] mb-3">
            Generate <span className="gradient-text">Playlist</span>
          </h1>
          <p className="text-gray-400">Enter mood + activity + vibe and let AI create the perfect playlist</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="glass-strong rounded-3xl p-8">

              {/* Quick Presets */}
              <p className="text-sm text-gray-500 mb-3">Quick presets:</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {presets.map((p, i) => (
                  <button key={i} onClick={() => { setMood(p.m); setActivity(p.a); setVibe(p.v) }}
                    className="px-3 py-1.5 rounded-lg glass text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition capitalize">
                    {p.m} + {p.a}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Mood *</label>
                  <input value={mood} onChange={e => setMood(e.target.value)} placeholder="e.g., heartbreak, gym, lonely, chill"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-neon-blue/50 transition" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Activity (optional)</label>
                  <input value={activity} onChange={e => setActivity(e.target.value)} placeholder="e.g., workout, studying, driving"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-neon-blue/50 transition" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Vibe (optional)</label>
                  <input value={vibe} onChange={e => setVibe(e.target.value)} placeholder="e.g., aggressive, calm, soft, dark"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-neon-blue/50 transition" />
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={generate} disabled={loading || !mood.trim()}
                className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-40 transition">
                {loading ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  : <><Wand2 size={20} /> Generate Playlist</>}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-strong rounded-3xl p-8">

              {/* Playlist Header */}
              <div className="flex items-start gap-5 mb-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 flex items-center justify-center flex-shrink-0">
                  <ListMusic size={36} className="text-white/50" />
                </div>
                <div>
                  <p className="text-xs text-neon-blue uppercase tracking-wider mb-1">Generated Playlist</p>
                  <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-family-display)]">{result.title}</h2>
                  <p className="text-gray-400 text-sm mt-1">{result.description}</p>
                  <div className="flex gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Music size={12} /> {result.songCount} songs</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {formatDuration(result.totalDuration)}</span>
                  </div>
                </div>
              </div>

              {/* Songs List */}
              <div className="space-y-2 mb-6">
                {result.songs?.map((song, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition group">
                    <span className="text-sm text-gray-600 w-6 text-right">{i + 1}</span>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 flex items-center justify-center">
                      <Music size={14} className="text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{song.title}</p>
                      <p className="text-xs text-gray-500">{song.artist_name}</p>
                    </div>
                    <span className="text-xs text-gray-600">{formatDuration(song.duration)}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button whileHover={{ scale: 1.02 }} onClick={() => setResult(null)}
                className="w-full py-3 rounded-xl glass text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition">
                <RefreshCw size={16} /> Generate Another
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
