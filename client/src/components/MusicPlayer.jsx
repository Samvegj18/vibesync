/**
 * MusicPlayer — YouTube-based full song player
 * Plays FULL songs via YouTube IFrame API embedded in a modal
 */
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, X, Maximize2, Minimize2, Music } from 'lucide-react'

export default function MusicPlayer({ track, onClose, onNext, onPrev }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [showVideo, setShowVideo] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const playerRef = useRef(null)
  const playerInstanceRef = useRef(null)
  const progressInterval = useRef(null)

  // Load YouTube IFrame API once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  }, [])

  // Create/destroy YouTube player when track changes
  useEffect(() => {
    if (!track?.youtube_id) return
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setPlayerReady(false)
    clearInterval(progressInterval.current)

    const initPlayer = () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy()
        playerInstanceRef.current = null
      }
      if (!playerRef.current) return

      playerInstanceRef.current = new window.YT.Player(playerRef.current, {
        height: '100%',
        width: '100%',
        videoId: track.youtube_id,
        playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, rel: 0, iv_load_policy: 3 },
        events: {
          onReady: (e) => {
            setPlayerReady(true)
            e.target.setVolume(volume)
            setDuration(e.target.getDuration())
          },
          onStateChange: (e) => {
            const YT = window.YT.PlayerState
            if (e.data === YT.PLAYING) {
              setIsPlaying(true)
              progressInterval.current = setInterval(() => {
                if (playerInstanceRef.current) {
                  setCurrentTime(playerInstanceRef.current.getCurrentTime())
                  setDuration(playerInstanceRef.current.getDuration())
                }
              }, 500)
            } else if (e.data === YT.PAUSED) {
              setIsPlaying(false)
              clearInterval(progressInterval.current)
            } else if (e.data === YT.ENDED) {
              setIsPlaying(false)
              clearInterval(progressInterval.current)
              onNext?.()
            }
          }
        }
      })
    }

    if (window.YT?.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }

    return () => clearInterval(progressInterval.current)
  }, [track?.youtube_id])

  const togglePlay = () => {
    if (!playerInstanceRef.current || !playerReady) return
    if (isPlaying) playerInstanceRef.current.pauseVideo()
    else playerInstanceRef.current.playVideo()
  }

  const toggleMute = () => {
    if (!playerInstanceRef.current) return
    if (isMuted) { playerInstanceRef.current.unMute(); playerInstanceRef.current.setVolume(volume) }
    else playerInstanceRef.current.mute()
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (val) => {
    setVolume(val)
    if (playerInstanceRef.current) { playerInstanceRef.current.setVolume(val); setIsMuted(val === 0) }
  }

  const handleSeek = (e) => {
    if (!playerInstanceRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const seekTo = ((e.clientX - rect.left) / rect.width) * duration
    playerInstanceRef.current.seekTo(seekTo, true)
    setCurrentTime(seekTo)
  }

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (!track) return null

  return (
    <AnimatePresence>
      <>
        {/* YouTube Hidden/Visible Player */}
        <div className={`fixed z-40 transition-all duration-500 rounded-2xl overflow-hidden shadow-2xl border border-white/10 ${showVideo ? 'bottom-28 right-6 w-72 h-48' : 'w-0 h-0 opacity-0 pointer-events-none bottom-0 left-0'}`}>
          <div ref={playerRef} className="w-full h-full" />
        </div>

        {/* Player Bar */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10"
          style={{ background: 'rgba(10,10,15,0.97)', backdropFilter: 'blur(30px)' }}
        >
          {/* Progress Bar */}
          <div className="h-1 bg-white/10 cursor-pointer group relative" onClick={handleSeek}>
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 relative transition-all" style={{ width: `${progress}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition shadow-lg" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Song Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 ring-1 ring-white/10">
                  {track.cover_image?.startsWith('http') ? (
                    <img src={track.cover_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Music size={20} className="text-white/30" /></div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate text-white">{track.title}</p>
                  <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                </div>
                {track.youtube_id && (
                  <span className="hidden sm:flex items-center gap-1 text-xs text-red-400 font-medium flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-red-500"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 16 24 12 24 12s0-4-.5-5.8z"/><polygon points="9.7,15.5 15.8,12 9.7,8.5" fill="white"/></svg>
                    Full Song
                  </span>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button onClick={onPrev} className="text-gray-400 hover:text-white transition p-1"><SkipBack size={18} /></button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={togglePlay} disabled={!playerReady}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black disabled:opacity-50">
                  {!playerReady ? <span className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                    : isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </motion.button>
                <button onClick={onNext} className="text-gray-400 hover:text-white transition p-1"><SkipForward size={18} /></button>
              </div>

              {/* Time + Volume + Video Toggle */}
              <div className="hidden sm:flex items-center gap-4 flex-1 justify-end">
                <span className="text-xs text-gray-500 tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</span>
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-gray-400 hover:text-white transition">
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input type="range" min="0" max="100" value={isMuted ? 0 : volume}
                    onChange={e => handleVolumeChange(Number(e.target.value))}
                    className="w-20 h-1 accent-purple-500 cursor-pointer" />
                </div>
                {track.youtube_id && (
                  <button onClick={() => setShowVideo(!showVideo)} className="text-gray-400 hover:text-white transition" title={showVideo ? 'Hide video' : 'Show video'}>
                    {showVideo ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                )}
                <button onClick={onClose} className="text-gray-500 hover:text-white transition"><X size={16} /></button>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  )
}
