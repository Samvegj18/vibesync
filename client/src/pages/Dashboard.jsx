/**
 * Dashboard — Spotify-inspired main dashboard with music playback
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Music, TrendingUp, Clock, Heart, Sparkles, Play, Flame, Headphones } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import MusicPlayer from '../components/MusicPlayer'

export default function Dashboard() {
  const { user, refreshUser } = useAuth()
  const [trending, setTrending] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [moods, setMoods] = useState([])
  const [quote, setQuote] = useState('')
  const [currentTrack, setCurrentTrack] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(-1)

  useEffect(() => {
    API.get('/songs/trending?limit=8').then(r => setTrending(r.data.songs)).catch(() => {})
    API.get('/playlists').then(r => setPlaylists(r.data.playlists?.slice(0, 6))).catch(() => {})
    API.get('/moods').then(r => setMoods(r.data.moods)).catch(() => {})
    API.get('/ai/quote').then(r => setQuote(r.data.quote)).catch(() => {})
  }, [])

  const playSong = async (song, index) => {
    setCurrentIndex(index)
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
      })
    }
  }

  const playNext = () => {
    if (currentIndex < trending.length - 1) playSong(trending[currentIndex + 1], currentIndex + 1)
  }
  const playPrev = () => {
    if (currentIndex > 0) playSong(trending[currentIndex - 1], currentIndex - 1)
  }

  return (
    <div className={`min-h-screen pt-20 px-4 ${currentTrack ? 'pb-28' : 'pb-12'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-neon-purple/20 to-transparent rounded-full blur-[80px]" />
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-family-display)] mb-2">
              {user ? `Hey, ${user.username}!` : 'Welcome to VibeSync'} <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-gray-400 mb-4">What's your vibe today?</p>
            {quote && <p className="text-sm text-gray-500 italic">✨ "{quote}"</p>}
            {user && (
              <div className="flex gap-6 mt-6">
                <div className="text-center"><p className="text-2xl font-bold text-neon-purple">{user.vibeScore || 0}</p><p className="text-xs text-gray-500">Vibe Score</p></div>
                <div className="text-center"><p className="text-2xl font-bold text-neon-pink">{user.listeningStreak || 0}</p><p className="text-xs text-gray-500">Day Streak</p></div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Mood Selector */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Sparkles size={20} className="text-neon-purple" /> Quick Mood Select</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {moods.map(mood => (
              <Link key={mood.mood_id} to={`/explore?mood=${mood.mood_id}`}>
                <motion.div whileHover={{ scale: 1.05 }}
                  className="flex-shrink-0 px-5 py-3 rounded-2xl glass cursor-pointer hover:bg-white/10 transition"
                  style={{ borderColor: `${mood.mood_color}30`, borderWidth: 1 }}>
                  <span style={{ color: mood.mood_color }} className="font-semibold text-sm">{mood.mood_name}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trending Songs */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-neon-pink" /> Trending Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trending.map((song, i) => (
              <motion.div key={song.song_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }}
                onClick={() => playSong(song, i)}
                className={`glass rounded-2xl p-4 group cursor-pointer hover:bg-white/10 transition ${currentIndex === i ? 'ring-2 ring-neon-purple bg-white/10' : ''}`}>
                <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 flex items-center justify-center mb-3 relative overflow-hidden">
                  {song.cover_image?.startsWith('http') ? (
                    <img src={song.cover_image} alt={song.title} className="w-full h-full object-cover" />
                  ) : (
                    <Music size={32} className="text-white/30" />
                  )}
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition ${currentIndex === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="w-12 h-12 rounded-full bg-neon-purple flex items-center justify-center">
                      {currentIndex === i ? <Headphones size={20} /> : <Play size={20} className="ml-0.5" />}
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-sm truncate">{song.title}</h3>
                <p className="text-xs text-gray-500 truncate">{song.artist_name}</p>
                <p className="text-xs text-gray-600 mt-1 flex items-center gap-1"><Flame size={12} className="text-orange-500" /> {(song.play_count / 1000).toFixed(1)}k plays</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Popular Playlists */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Heart size={20} className="text-red-500" /> Popular Playlists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((pl, i) => (
              <motion.div key={pl.playlist_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }}
                className="glass rounded-2xl p-5 cursor-pointer hover:bg-white/10 transition">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 flex items-center justify-center flex-shrink-0">
                    <Music size={24} className="text-white/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{pl.name}</h3>
                    <p className="text-xs text-gray-500">by {pl.username}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-600">
                      <span>{pl.song_count} songs</span>
                      <span className="flex items-center gap-0.5"><Heart size={10} className="text-red-500" /> {pl.like_count}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Link to="/mood-analyzer">
            <motion.div whileHover={{ scale: 1.02 }} className="glass rounded-2xl p-6 text-center cursor-pointer hover:bg-white/10 transition glow-purple">
              <Sparkles size={28} className="mx-auto mb-3 text-neon-purple" />
              <h3 className="font-bold">AI Mood Analyzer</h3>
              <p className="text-xs text-gray-500 mt-1">Tell us how you feel</p>
            </motion.div>
          </Link>
          <Link to="/generate">
            <motion.div whileHover={{ scale: 1.02 }} className="glass rounded-2xl p-6 text-center cursor-pointer hover:bg-white/10 transition glow-blue">
              <Music size={28} className="mx-auto mb-3 text-neon-blue" />
              <h3 className="font-bold">Generate Playlist</h3>
              <p className="text-xs text-gray-500 mt-1">AI-powered playlists</p>
            </motion.div>
          </Link>
          <Link to="/analytics">
            <motion.div whileHover={{ scale: 1.02 }} className="glass rounded-2xl p-6 text-center cursor-pointer hover:bg-white/10 transition glow-pink">
              <TrendingUp size={28} className="mx-auto mb-3 text-neon-pink" />
              <h3 className="font-bold">View Analytics</h3>
              <p className="text-xs text-gray-500 mt-1">Platform insights</p>
            </motion.div>
          </Link>
        </div>
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
