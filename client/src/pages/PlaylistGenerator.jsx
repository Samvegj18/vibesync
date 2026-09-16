/**
 * Playlist Generator — AI generates smart playlists from mood + activity + language
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Music, Clock, ListMusic, RefreshCw, Play, Globe } from 'lucide-react'
import API from '../api/axios'
import MusicPlayer from '../components/MusicPlayer'
import { useAuth } from '../context/AuthContext'

const presets = [
  { label: '💔 Heartbreak', m: 'heartbreak breakup crying miss you', a: 'alone at night', v: 'sad', lang: 'both' },
  { label: '💪 Gym', m: 'gym workout lifting beast mode', a: 'workout', v: 'aggressive', lang: 'english' },
  { label: '💻 Coding', m: 'coding programming debugging', a: 'late night', v: 'focus', lang: 'english' },
  { label: '🎉 Party', m: 'party dance celebration hype lit', a: 'friday night', v: 'hype', lang: 'both' },
  { label: '💕 Romantic', m: 'love romance crush in love', a: 'date night', v: 'soft', lang: 'both' },
  { label: '😌 Chill', m: 'chill relax calm vibing lazy', a: 'relaxing sunday', v: 'mellow', lang: 'both' },
  { label: '📚 Study', m: 'study exam focus concentration', a: 'studying', v: 'calm', lang: 'english' },
  { label: '🌙 Late Night', m: '3am midnight insomnia sleepless overthinking', a: 'late night', v: 'dark', lang: 'both' },
  { label: '🎵 Bollywood', m: 'romantic love dil', a: 'relaxing', v: 'filmy', lang: 'hindi' },
  { label: '😢 Sad', m: 'sad depressed unhappy tears empty inside', a: 'alone', v: 'emotional', lang: 'both' },
  { label: '😊 Happy', m: 'happy joy excited amazing blessed feeling good', a: 'celebrating', v: 'upbeat', lang: 'english' },
  { label: '😤 Rage', m: 'angry rage furious mad pissed', a: 'venting', v: 'aggressive', lang: 'english' },
]

export default function PlaylistGenerator() {
  const { refreshUser } = useAuth()
  const [mood, setMood] = useState('')
  const [activity, setActivity] = useState('')
  const [vibe, setVibe] = useState('')
  const [language, setLanguage] = useState('both')
  const [count, setCount] = useState(12)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(-1)

  const generate = async () => {
    if (!mood.trim()) return
    setLoading(true)
    try {
      const res = await API.post('/ai/generate-playlist', { mood, activity, vibe, language, count })
      setResult(res.data.generatedPlaylist)
      setCurrentTrack(null)
      setCurrentIndex(-1)
    } catch { setResult(null) }
    setLoading(false)
  }

  const playSong = (song, idx) => {
    setCurrentIndex(idx)
    setCurrentTrack({
      title: song.title,
      artist: song.artist_name,
      cover_image: song.cover_image,
      youtube_id: song.youtube_id || null,
    })
    API.post('/history/track-play', { songId: song.song_id }).then(() => refreshUser()).catch(() => {})
  }

  const formatDuration = (secs) => {
    if (!secs) return '—'
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const formatTotal = (secs) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  const applyPreset = (p) => {
    setMood(p.m); setActivity(p.a); setVibe(p.v); setLanguage(p.lang)
  }

  return (
    <div className={`min-h-screen pt-24 px-4 ${currentTrack ? 'pb-28' : 'pb-12'} relative`}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-blue-400 mb-4">
            <Wand2 size={16} /> AI Playlist Generator
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            Generate <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Playlist</span>
          </h1>
          <p className="text-gray-400">Describe your mood and let AI build the perfect playlist — English, Bollywood, or both</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="rounded-3xl p-8 border border-white/10" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>

              {/* Quick Presets */}
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Quick presets</p>
              <div className="flex flex-wrap gap-2 mb-7">
                {presets.map((p, i) => (
                  <button key={i} onClick={() => applyPreset(p)}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-gray-300 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition">
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {/* Mood input */}
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">How are you feeling? *</label>
                  <textarea
                    value={mood} onChange={e => setMood(e.target.value)} rows={2}
                    placeholder="e.g., heartbreak and missing someone, gym mode beast, coding late night, feeling happy and excited..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Activity (optional)</label>
                    <input value={activity} onChange={e => setActivity(e.target.value)}
                      placeholder="e.g., workout, driving, studying"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Vibe (optional)</label>
                    <input value={vibe} onChange={e => setVibe(e.target.value)}
                      placeholder="e.g., calm, intense, romantic"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Language selector */}
                  <div>
                    <label className="text-sm text-gray-400 mb-1 flex items-center gap-1.5 block">
                      <Globe size={13} /> Language
                    </label>
                    <select value={language} onChange={e => setLanguage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 transition">
                      <option value="both" className="bg-gray-900">🌐 Both</option>
                      <option value="hindi" className="bg-gray-900">🇮🇳 Bollywood / Hindi</option>
                      <option value="english" className="bg-gray-900">🌍 English</option>
                    </select>
                  </div>

                  {/* Song count */}
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Songs: {count}</label>
                    <input type="range" min={6} max={20} value={count} onChange={e => setCount(Number(e.target.value))}
                      className="w-full h-2 mt-4 accent-purple-500 cursor-pointer" />
                  </div>
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={generate} disabled={loading || !mood.trim()}
                className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-40 transition">
                {loading
                  ? <><span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> Generating...</>
                  : <><Wand2 size={20} /> Generate Playlist</>}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl p-8 border border-white/10" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>

              {/* Playlist Header */}
              <div className="flex items-start gap-5 mb-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <ListMusic size={36} className="text-white/60" />
                </div>
                <div>
                  <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">AI Generated</p>
                  <h2 className="text-2xl sm:text-3xl font-bold">{result.title}</h2>
                  <p className="text-gray-400 text-sm mt-1">{result.description}</p>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Music size={11} /> {result.songCount} songs</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {formatTotal(result.totalDuration)}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 capitalize">{result.mood}</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">{result.language}</span>
                  </div>
                </div>
              </div>

              {/* Songs List */}
              <div className="space-y-1 mb-6">
                {result.songs?.map((song, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => playSong(song, i)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition group ${currentIndex === i ? 'bg-purple-500/20 border border-purple-500/30' : 'hover:bg-white/5'}`}>
                    <span className="text-sm text-gray-600 w-6 text-right flex-shrink-0">{i + 1}</span>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden ${song.cover_image?.startsWith('http') ? '' : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20'}`}>
                      {song.cover_image?.startsWith('http') ? (
                        <img src={song.cover_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Music size={14} className="text-white/40" />
                      )}
                      <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition ${currentIndex === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <Play size={12} className="text-white ml-0.5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${currentIndex === i ? 'text-purple-300' : 'text-white'}`}>{song.title}</p>
                      <p className="text-xs text-gray-500 truncate">{song.artist_name}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {song.youtube_id && (
                        <span className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition">▶ Full</span>
                      )}
                      <span className="text-xs text-gray-600">{formatDuration(song.duration)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {!result.songs?.length && (
                <div className="text-center py-8 text-gray-500">
                  <Music size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No songs found for this combination. Try a different mood!</p>
                </div>
              )}

              <motion.button whileHover={{ scale: 1.02 }} onClick={() => { setResult(null); setCurrentTrack(null); setCurrentIndex(-1) }}
                className="w-full py-3 rounded-xl border border-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/5 transition">
                <RefreshCw size={16} /> Generate Another
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {currentTrack && (
        <MusicPlayer
          track={currentTrack}
          onClose={() => { setCurrentTrack(null); setCurrentIndex(-1) }}
          onNext={() => { if (currentIndex < (result?.songs?.length || 0) - 1) playSong(result.songs[currentIndex + 1], currentIndex + 1) }}
          onPrev={() => { if (currentIndex > 0) playSong(result.songs[currentIndex - 1], currentIndex - 1) }}
        />
      )}
    </div>
  )
}
