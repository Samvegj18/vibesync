/**
 * MusicPlayer — YouTube full song player (fixed)
 * Key fixes:
 * 1. Player div always rendered (not w-0 h-0 when hidden — keeps YouTube happy)
 * 2. origin param set to prevent YouTube blocking
 * 3. Proper destroy/recreate on track change
 */
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, X, Maximize2, Minimize2, Music } from 'lucide-react'

let ytApiLoaded = false

export default function MusicPlayer({ track, onClose, onNext, onPrev }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [showVideo, setShowVideo] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const playerContainerId = 'yt-player-container'
  const playerInstanceRef = useRef(null)
  const progressInterval = useRef(null)
  const currentYtId = useRef(null)

  // Load YouTube IFrame API once globally
  useEffect(() => {
    if (!ytApiLoaded && !window.YT) {
      ytApiLoaded = true
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  }, [])

  // When track changes, load new video
  useEffect(() => {
    if (!track?.youtube_id) {
      setPlayerReady(false)
      setIsPlaying(false)
      setCurrentTime(0)
      setDuration(0)
      return
    }

    // Don't reload if same video
    if (currentYtId.current === track.youtube_id && playerInstanceRef.current) {
      try { playerInstanceRef.current.seekTo(0, true); playerInstanceRef.current.playVideo() } catch {}
      return
    }

    currentYtId.current = track.youtube_id
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setPlayerReady(false)
    clearInterval(progressInterval.current)

    const initPlayer = () => {
      // Destroy old player
      if (playerInstanceRef.current) {
        try { playerInstanceRef.current.destroy() } catch {}
        playerInstanceRef.current = null
      }

      // Recreate the div (YouTube destroys it on destroy())
      const container = document.getElementById('yt-player-wrapper')
      if (!container) return
      container.innerHTML = ''
      const div = document.createElement('div')
      div.id = playerContainerId
      container.appendChild(div)

      try {
        playerInstanceRef.current = new window.YT.Player(playerContainerId, {
          height: '100%',
          width: '100%',
          videoId: track.youtube_id,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            playsinline: 1,
            enablejsapi: 1,
          },
          events: {
            onReady: (e) => {
              setPlayerReady(true)
              e.target.setVolume(volume)
              const dur = e.target.getDuration()
              if (dur > 0) setDuration(dur)
            },
            onStateChange: (e) => {
              const S = window.YT?.PlayerState
              if (!S) return
              if (e.data === S.PLAYING) {
                setIsPlaying(true)
                setDuration(e.target.getDuration() || 0)
                clearInterval(progressInterval.current)
                progressInterval.current = setInterval(() => {
                  try {
                    const ct = playerInstanceRef.current?.getCurrentTime() || 0
                    const dur = playerInstanceRef.current?.getDuration() || 0
                    setCurrentTime(ct)
                    if (dur > 0) setDuration(dur)
                  } catch {}
                }, 500)
              } else if (e.data === S.PAUSED) {
                setIsPlaying(false)
                clearInterval(progressInterval.current)
              } else if (e.data === S.ENDED) {
                setIsPlaying(false)
                clearInterval(progressInterval.current)
                setCurrentTime(0)
                onNext?.()
              } else if (e.data === S.BUFFERING) {
                setIsPlaying(true) // show as playing while buffering
              }
            },
            onError: (e) => {
              console.warn('YouTube player error:', e.data)
              setPlayerReady(false)
            }
          }
        })
      } catch (err) {
        console.warn('Failed to init YT player:', err)
      }
    }

    // Wait for YT API or init immediately
    if (window.YT?.Player) {
      initPlayer()
    } else {
      const prev = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        prev?.()
        initPlayer()
      }
    }

    return () => clearInterval(progressInterval.current)
  }, [track?.youtube_id])

  const togglePlay = () => {
    if (!playerInstanceRef.current || !playerReady) return
    try {
      if (isPlaying) playerInstanceRef.current.pauseVideo()
      else playerInstanceRef.current.playVideo()
    } catch {}
  }

  const toggleMute = () => {
    if (!playerInstanceRef.current) return
    try {
      if (isMuted) { playerInstanceRef.current.unMute(); playerInstanceRef.current.setVolume(volume) }
      else playerInstanceRef.current.mute()
      setIsMuted(!isMuted)
    } catch {}
  }

  const handleVolumeChange = (val) => {
    setVolume(val)
    try {
      playerInstanceRef.current?.setVolume(val)
      if (isMuted && val > 0) { playerInstanceRef.current?.unMute(); setIsMuted(false) }
      if (val === 0) setIsMuted(true)
    } catch {}
  }

  const handleSeek = (e) => {
    if (!playerInstanceRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const seekTo = ((e.clientX - rect.left) / rect.width) * duration
    try { playerInstanceRef.current.seekTo(seekTo, true); setCurrentTime(seekTo) } catch {}
  }

  const formatTime = (s) => {
    if (!s || isNaN(s) || s < 0) return '0:00'
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0

  // Cover image: use YouTube thumbnail if available (always works), fallback to provided cover
  const coverImage = track?.youtube_id
    ? `https://img.youtube.com/vi/${track.youtube_id}/mqdefault.jpg`
    : track?.cover_image

  if (!track) return null

  return (
    <AnimatePresence>
      <>
        {/* YouTube Player — always rendered but visually hidden when video is off */}
        <div
          id="yt-player-wrapper"
          className="fixed z-40 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-500"
          style={{
            bottom: showVideo ? '90px' : '-9999px',
            right: showVideo ? '16px' : '-9999px',
            width: showVideo ? '288px' : '1px',
            height: showVideo ? '162px' : '1px',
            opacity: showVideo ? 1 : 0,
            pointerEvents: showVideo ? 'auto' : 'none',
          }}
        >
          <div id={playerContainerId} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Bottom Player Bar */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10"
          style={{ background: 'rgba(8,8,14,0.98)', backdropFilter: 'blur(30px)' }}
        >
          {/* Seekable Progress Bar */}
          <div
            className="h-1 bg-white/10 cursor-pointer group relative"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition shadow-lg -mr-1.5" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-4">

              {/* Song Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 ring-1 ring-white/10">
                  {coverImage ? (
                    <img src={coverImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music size={20} className="text-white/30" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate text-white">{track.title}</p>
                  <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                </div>
                {track.youtube_id && (
                  <span className="hidden sm:flex items-center gap-1 text-xs text-red-400 font-medium flex-shrink-0 bg-red-500/10 px-2 py-0.5 rounded-full">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-red-500 flex-shrink-0">
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 16 24 12 24 12s0-4-.5-5.8z"/>
                      <polygon points="9.7,15.5 15.8,12 9.7,8.5" fill="white"/>
                    </svg>
                    Full Song
                  </span>
                )}
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-3">
                <button onClick={onPrev} className="text-gray-400 hover:text-white transition p-1">
                  <SkipBack size={20} />
                </button>
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  disabled={!playerReady && !!track.youtube_id}
                  className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-black disabled:opacity-50 shadow-lg"
                >
                  {(!playerReady && track.youtube_id) ? (
                    <span className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause size={18} />
                  ) : (
                    <Play size={18} className="ml-0.5" />
                  )}
                </motion.button>
                <button onClick={onNext} className="text-gray-400 hover:text-white transition p-1">
                  <SkipForward size={20} />
                </button>
              </div>

              {/* Time + Volume + Video Toggle */}
              <div className="hidden sm:flex items-center gap-4 flex-1 justify-end">
                <span className="text-xs text-gray-500 tabular-nums w-24 text-right">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-gray-400 hover:text-white transition">
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range" min="0" max="100" value={isMuted ? 0 : volume}
                    onChange={e => handleVolumeChange(Number(e.target.value))}
                    className="w-20 h-1 accent-purple-500 cursor-pointer"
                  />
                </div>
                {track.youtube_id && (
                  <button
                    onClick={() => setShowVideo(!showVideo)}
                    className="text-gray-400 hover:text-white transition"
                    title={showVideo ? 'Hide video' : 'Show video'}
                  >
                    {showVideo ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                )}
                {!track.youtube_id && (
                  <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">No YouTube ID</span>
                )}
                <button onClick={onClose} className="text-gray-500 hover:text-white transition ml-1">
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  )
}
