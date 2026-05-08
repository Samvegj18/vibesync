/**
 * Analytics Dashboard — Charts and stats (DBMS showcase)
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Users, Music, Heart, MessageCircle, TrendingUp, Activity, Flame } from 'lucide-react'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import API from '../api/axios'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function Analytics() {
  const [overview, setOverview] = useState(null)
  const [topMoods, setTopMoods] = useState([])
  const [topSongs, setTopSongs] = useState([])
  const [topPlaylists, setTopPlaylists] = useState([])
  const [activeUsers, setActiveUsers] = useState([])
  const [engagement, setEngagement] = useState(null)

  useEffect(() => {
    API.get('/analytics/overview').then(r => setOverview(r.data.overview)).catch(() => {})
    API.get('/analytics/top-moods').then(r => setTopMoods(r.data.moods)).catch(() => {})
    API.get('/analytics/top-songs?limit=8').then(r => setTopSongs(r.data.songs)).catch(() => {})
    API.get('/analytics/top-playlists').then(r => setTopPlaylists(r.data.playlists)).catch(() => {})
    API.get('/analytics/active-users').then(r => setActiveUsers(r.data.users)).catch(() => {})
    API.get('/analytics/engagement').then(r => setEngagement(r.data.engagement)).catch(() => {})
  }, [])

  const moodChartData = {
    labels: engagement?.songsPerMood?.map(m => m.mood_name) || [],
    datasets: [{
      data: engagement?.songsPerMood?.map(m => m.count) || [],
      backgroundColor: engagement?.songsPerMood?.map(m => m.mood_color + '99') || [],
      borderWidth: 0,
    }]
  }

  const artistChartData = {
    labels: engagement?.avgPerArtist?.map(a => a.name) || [],
    datasets: [{
      label: 'Avg Plays',
      data: engagement?.avgPerArtist?.map(a => a.avg_plays) || [],
      backgroundColor: 'rgba(168, 85, 247, 0.5)',
      borderColor: 'rgba(168, 85, 247, 1)',
      borderWidth: 1,
      borderRadius: 8,
    }]
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#9ca3af', font: { size: 11 } } } },
    scales: {
      x: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  }

  const statCards = [
    { label: 'Total Users', value: overview?.total_users, icon: Users, color: '#a855f7' },
    { label: 'Total Songs', value: overview?.total_songs, icon: Music, color: '#3b82f6' },
    { label: 'Total Playlists', value: overview?.total_playlists, icon: Activity, color: '#ec4899' },
    { label: 'Total Plays', value: overview?.total_plays ? `${(overview.total_plays / 1000).toFixed(0)}k` : '0', icon: TrendingUp, color: '#10b981' },
    { label: 'Total Likes', value: overview?.total_likes, icon: Heart, color: '#f43f5e' },
    { label: 'Total Comments', value: overview?.total_comments, icon: MessageCircle, color: '#06b6d4' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold font-[family-name:var(--font-family-display)] flex items-center gap-3">
            <BarChart3 size={32} className="text-neon-purple" /> Analytics
          </h1>
          <p className="text-gray-400 mt-1">Platform insights powered by SQL aggregate queries</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {statCards.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 text-center">
              <stat.icon size={24} className="mx-auto mb-2" style={{ color: stat.color }} />
              <p className="text-2xl font-bold">{stat.value ?? '—'}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Flame size={18} className="text-neon-pink" /> Songs Per Mood</h3>
            <div className="max-w-xs mx-auto">
              <Doughnut data={moodChartData} options={{ plugins: { legend: { labels: { color: '#9ca3af', font: { size: 10 } }, position: 'bottom' } } }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-neon-purple" /> Avg Plays Per Artist</h3>
            <Bar data={artistChartData} options={chartOptions} />
          </motion.div>
        </div>

        {/* Tables Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Songs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Music size={18} className="text-neon-blue" /> Top Songs</h3>
            <div className="space-y-2">
              {topSongs.map((s, i) => (
                <div key={s.song_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition">
                  <span className="text-sm font-bold text-gray-500 w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{s.title}</p>
                    <p className="text-xs text-gray-500">{s.artist_name}</p>
                  </div>
                  <span className="text-xs text-gray-500">{(s.play_count / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Moods */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Heart size={18} className="text-neon-pink" /> Mood Popularity</h3>
            <div className="space-y-3">
              {topMoods.map(m => {
                const maxPlays = topMoods[0]?.total_plays || 1
                const pct = Math.round((m.total_plays / maxPlays) * 100)
                return (
                  <div key={m.mood_id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium" style={{ color: m.mood_color }}>{m.mood_name}</span>
                      <span className="text-gray-500">{m.song_count} songs • {(m.total_plays / 1000).toFixed(0)}k plays</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full" style={{ backgroundColor: m.mood_color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Active Users & Top Playlists */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Users size={18} className="text-neon-green" /> Active Users</h3>
            <div className="space-y-2">
              {activeUsers.map((u, i) => (
                <div key={u.user_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition">
                  <span className="text-sm font-bold text-gray-500 w-5">{i + 1}</span>
                  <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <div className="flex-1"><p className="font-semibold text-sm">{u.username}</p></div>
                  <span className="text-xs text-neon-purple font-bold">{u.vibe_score} pts</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="glass rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-amber-500" /> Top Playlists</h3>
            <div className="space-y-2">
              {topPlaylists.map((p, i) => (
                <div key={p.playlist_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition">
                  <span className="text-sm font-bold text-gray-500 w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">by {p.creator}</p>
                  </div>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-0.5"><Heart size={10} className="text-red-500" /> {p.like_count}</span>
                    <span className="flex items-center gap-0.5"><MessageCircle size={10} /> {p.comment_count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
