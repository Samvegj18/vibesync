/**
 * Mood Analyzer — AI detects mood from text input
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Sparkles, Music, Quote, Send, RefreshCw } from 'lucide-react'
import API from '../api/axios'

const moodBgColors = {
  heartbreak: 'from-red-500/10 to-pink-500/10',
  gym: 'from-red-600/10 to-orange-500/10',
  lonely: 'from-purple-600/10 to-indigo-500/10',
  study: 'from-blue-500/10 to-cyan-500/10',
  coding: 'from-cyan-500/10 to-teal-500/10',
  'late night': 'from-indigo-600/10 to-purple-900/10',
  romantic: 'from-pink-500/10 to-rose-500/10',
  party: 'from-yellow-500/10 to-amber-500/10',
  rage: 'from-red-700/10 to-red-500/10',
  chill: 'from-emerald-500/10 to-green-500/10',
  sad: 'from-slate-500/10 to-gray-500/10',
  happy: 'from-pink-400/10 to-fuchsia-500/10',
}

export default function MoodAnalyzer() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await API.post('/ai/analyze-mood', { text })
      setResult(res.data.analysis)
    } catch { setResult(null) }
    setLoading(false)
  }

  const reset = () => { setResult(null); setText('') }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-neon-purple/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-neon-pink/10 rounded-full blur-[150px]" />

      <div className="max-w-3xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-neon-purple mb-4">
            <Brain size={16} /> AI-Powered Analysis
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-family-display)] mb-3">
            Mood <span className="gradient-text">Analyzer</span>
          </h1>
          <p className="text-gray-400">Tell us how you feel. Our AI will detect your mood and suggest the perfect music.</p>
        </motion.div>

        {/* Input Section */}
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="glass-strong rounded-3xl p-8">
              <textarea
                value={text} onChange={e => setText(e.target.value)}
                placeholder={"How are you feeling right now?\n\nExamples:\nI feel lonely after exams\nGym mode, need aggressive beats\nCan't sleep, it's 3am"}
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 outline-none focus:border-neon-purple/50 transition resize-none text-lg"
              />
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={analyze} disabled={loading || !text.trim()}
                className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-40 transition">
                {loading ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  : <><Sparkles size={20} /> Analyze My Mood</>}
              </motion.button>
            </motion.div>
          ) : (
            /* Results Section */
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`glass-strong rounded-3xl p-8 bg-gradient-to-br ${moodBgColors[result.detectedMood] || 'from-purple-500/10 to-blue-500/10'}`}>

              {/* Detected Mood */}
              <div className="text-center mb-8">
                <p className="text-sm text-gray-400 mb-2">Detected Mood</p>
                <h2 className="text-4xl font-bold font-[family-name:var(--font-family-display)] mb-2" style={{ color: result.moodInfo?.mood_color }}>
                  {result.vibeCategory}
                </h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: `${result.moodInfo?.mood_color}20`, color: result.moodInfo?.mood_color }}>
                  <Sparkles size={14} /> {result.detectedMood}
                </div>
              </div>

              {/* Quote */}
              <div className="glass rounded-2xl p-5 mb-6 text-center">
                <Quote size={20} className="mx-auto mb-2 text-neon-purple opacity-50" />
                <p className="text-gray-300 italic text-lg">"{result.quote}"</p>
              </div>

              {/* Suggested Playlist */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Music size={18} className="text-neon-purple" /> Suggested Playlist</h3>
                <p className="text-neon-purple font-bold text-xl">{result.suggestedPlaylist}</p>
              </div>

              {/* Suggested Songs */}
              {result.suggestedSongs?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3">Recommended Songs</h3>
                  <div className="space-y-2">
                    {result.suggestedSongs.map((song, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-purple/30 to-neon-pink/30 flex items-center justify-center flex-shrink-0">
                          <Music size={16} className="text-white/60" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{song.title}</p>
                          <p className="text-xs text-gray-500">{song.artist_name}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <motion.button whileHover={{ scale: 1.02 }} onClick={reset}
                className="w-full py-3 rounded-xl glass text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition">
                <RefreshCw size={16} /> Analyze Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
