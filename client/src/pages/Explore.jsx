/**
 * Explore Page — Browse songs by mood, search, and play with Spotify
 */
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Music, Compass, Play, Flame, Heart, HeartCrack, Dumbbell, Moon, BookOpen, Code, PartyPopper, Cloud, SmilePlus, Sparkles, Headphones } from 'lucide-react'
import API from '../api/axios'
import MusicPlayer from '../components/MusicPlayer'
import { useAuth } from '../context/AuthContext'

const moodIcons = {
  'heart-crack': HeartCrack, 'dumbbell': Dumbbell, 'cloud-rain': Cloud,
  'book-open': BookOpen, 'code': Code, 'moon': Moon, 'heart': Heart,
  'party-popper': PartyPopper, 'flame': Flame, 'leaf': Sparkles,
  'cloud': Cloud, 'smile': SmilePlus, 'music': Music
}

export default function Explore() {
  const { refreshUser } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [songs, setSongs] = useState([])
  const [moods, setMoods] = useState([])
  const [activeMood, setActiveMood] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [moodInfo, setMoodInfo] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [playerLoading, setPlayerLoading] = useState(false)

  useEffect(() => {
    API.get('/moods').then(r => setMoods(r.data.moods)).catch(() => {})
    const moodParam = searchParams.get('mood')
    if (moodParam) loadMoodSongs(parseInt(moodParam))
    else API.get('/songs').then(r => setSongs(r.data.songs)).catch(() => {})
  }, [])

  const loadMoodSongs = async (moodId) => {
    setActiveMood(moodId)
    try {
      const res = await API.get(`/moods/${moodId}/songs`)
      setSongs(res.data.songs)
      setMoodInfo(res.data.mood)
    } catch {}
  }

  const loadAll = () => {
    setActiveMood(null)
    setMoodInfo(null)
    setSearchParams({})
    API.get('/songs').then(r => setSongs(r.data.songs)).catch(() => {})
  }

  const search = async () => {
    if (!searchQuery.trim()) return
    try {
      const res = await API.get(`/songs/search?q=${searchQuery}`)
      setSongs(res.data.songs)
      setActiveMood(null)
      setMoodInfo(null)
    } catch {}
  }

  const playSong = async (song, index) => {
    setCurrentIndex(index)
    setPlayerLoading(true)
    try {
      const res = await API.get(`/spotify/preview/${song.song_id}`)
      setCurrentTrack({
        title: song.title,
        artist: song.artist_name,
        cover_image: res.data.cover_image || song.cover_image,
        preview_url: res.data.preview_url,
        spotify_url: res.data.spotify_url,
      })
      // Record play in database (updates listening_history + play_count via trigger)
      API.post('/history/track-play', { songId: song.song_id }).then(() => refreshUser()).catch(() => {})
    } catch {
      setCurrentTrack({
        title: song.title,
        artist: song.artist_name,
        cover_image: song.cover_image,
        preview_url: null,
        spotify_url: null,
      })
    }
    setPlayerLoading(false)
  }

  const playNext = () => {
    if (currentIndex < songs.length - 1) {
      playSong(songs[currentIndex + 1], currentIndex + 1)
    }
  }

  const playPrev = () => {
    if (currentIndex > 0) {
      playSong(songs[currentIndex - 1], currentIndex - 1)
    }
  }

  const formatDuration = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className={`min-h-screen pt-24 px-4 ${currentTrack ? 'pb-28' : 'pb-12'}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold font-[family-name:var(--font-family-display)] flex items-center gap-3">
            <Compass size={32} className="text-neon-purple" /> Explore
          </h1>
          <p className="text-gray-400 mt-1">Discover songs across 12 mood categories — click any song to play</p>
        </motion.div>

        {/* Search */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Search songs or artists..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-neon-purple/50 transition" />
          </div>
          <button onClick={search} className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-semibold hover:opacity-90 transition">
            Search
          </button>
        </div>

        {/* Mood Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          <button onClick={loadAll}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition ${!activeMood ? 'bg-neon-purple text-white' : 'glass text-gray-400 hover:text-white'}`}>
            All Songs
          </button>
          {moods.map(mood => {
            const Icon = moodIcons[mood.mood_icon] || Music
            return (
              <button key={mood.mood_id} onClick={() => loadMoodSongs(mood.mood_id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${activeMood === mood.mood_id ? 'text-white' : 'glass text-gray-400 hover:text-white'}`}
                style={activeMood === mood.mood_id ? { backgroundColor: `${mood.mood_color}30`, color: mood.mood_color } : {}}>
                <Icon size={14} /> {mood.mood_name}
              </button>
            )
          })}
        </div>

        {/* Active Mood Header */}
        {moodInfo && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 mb-8" style={{ borderLeftWidth: 4, borderLeftColor: moodInfo.mood_color }}>
            <h2 className="text-2xl font-bold" style={{ color: moodInfo.mood_color }}>{moodInfo.mood_name}</h2>
            <p className="text-gray-400 text-sm">{songs.length} songs in this mood</p>
          </motion.div>
        )}

        {/* Songs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {songs.map((song, i) => (
            <motion.div key={song.song_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }} whileHover={{ y: -3 }}
              onClick={() => playSong(song, i)}
              className={`glass rounded-2xl p-4 group cursor-pointer hover:bg-white/10 transition ${currentIndex === i ? 'ring-2 ring-neon-purple bg-white/10' : ''}`}>
              <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 flex items-center justify-center mb-3 relative overflow-hidden">
                {song.cover_image?.startsWith('http') ? (
                  <img src={song.cover_image} alt={song.title} className="w-full h-full object-cover" />
                ) : (
                  <Music size={32} className="text-white/20" />
                )}
                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition ${currentIndex === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <div className="w-12 h-12 rounded-full bg-neon-purple flex items-center justify-center">
                    {currentIndex === i && playerLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : currentIndex === i ? (
                      <Headphones size={20} />
                    ) : (
                      <Play size={20} className="ml-0.5" />
                    )}
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-sm truncate">{song.title}</h3>
              <p className="text-xs text-gray-500 truncate">{song.artist_name}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                <span>{formatDuration(song.duration)}</span>
                <span className="flex items-center gap-1"><Flame size={10} className="text-orange-500" /> {(song.play_count / 1000).toFixed(1)}k</span>
              </div>
            </motion.div>
          ))}
        </div>

        {songs.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Music size={48} className="mx-auto mb-4 opacity-30" />
            <p>No songs found. Try a different search or mood.</p>
          </div>
        )}
      </div>

      {/* Floating Music Player */}
      {currentTrack && (
        <MusicPlayer
          track={currentTrack}
          onClose={() => { setCurrentTrack(null); setCurrentIndex(-1) }}
          onNext={playNext}
          onPrev={playPrev}
        />
      )}
    </div>
  )
}
