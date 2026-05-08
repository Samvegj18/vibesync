/**
 * MusicPlayer — Spotify-style floating bottom player bar
 * Plays 30-second previews from Spotify API
 */
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, X, ExternalLink } from 'lucide-react'

export default function MusicPlayer({ track, onClose, onNext, onPrev }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (track?.preview_url && audioRef.current) {
      audioRef.current.src = track.preview_url
      audioRef.current.volume = volume
      setLoading(true)
      setProgress(0)
      audioRef.current.play()
        .then(() => { setIsPlaying(true); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [track?.preview_url])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    const current = audioRef.current.currentTime
    const dur = audioRef.current.duration || 30
    setCurrentTime(current)
    setDuration(dur)
    setProgress((current / dur) * 100)
  }

  const handleSeek = (e) => {
    if (!audioRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = pct * (audioRef.current.duration || 30)
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  if (!track) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-white/10"
        style={{ backdropFilter: 'blur(24px)' }}
      >
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => { setIsPlaying(false); onNext?.() }}
          onLoadedData={() => setLoading(false)}
        />

        {/* Progress bar (clickable) */}
        <div className="h-1 bg-white/5 cursor-pointer group" onClick={handleSeek}>
          <motion.div
            className="h-full bg-gradient-to-r from-neon-purple to-neon-pink relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition" />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Song Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                {track.cover_image?.startsWith('http') ? (
                  <img src={track.cover_image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music size={20} className="text-white/30" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{track.title}</p>
                <p className="text-xs text-gray-400 truncate">{track.artist}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button onClick={onPrev} className="text-gray-400 hover:text-white transition">
                <SkipBack size={18} />
              </button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                disabled={loading || !track.preview_url}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause size={18} />
                ) : (
                  <Play size={18} className="ml-0.5" />
                )}
              </motion.button>

              <button onClick={onNext} className="text-gray-400 hover:text-white transition">
                <SkipForward size={18} />
              </button>
            </div>

            {/* Time & Volume */}
            <div className="hidden sm:flex items-center gap-4 flex-1 justify-end">
              <span className="text-xs text-gray-500 w-20 text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <div className="flex items-center gap-2">
                <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-white transition">
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume}
                  onChange={e => { setVolume(parseFloat(e.target.value)); setIsMuted(false) }}
                  className="w-20 h-1 accent-neon-purple cursor-pointer"
                />
              </div>

              {track.spotify_url && (
                <a href={track.spotify_url} target="_blank" rel="noreferrer"
                  className="text-green-500 hover:text-green-400 transition" title="Open in Spotify">
                  <ExternalLink size={16} />
                </a>
              )}

              <button onClick={onClose} className="text-gray-500 hover:text-white transition">
                <X size={16} />
              </button>
            </div>

            {/* No preview message */}
            {!track.preview_url && !loading && (
              <span className="text-xs text-amber-400">No preview available</span>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
