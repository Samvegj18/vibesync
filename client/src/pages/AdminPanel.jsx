/**
 * AdminPanel — Full platform management dashboard (Admin-only)
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigate } from 'react-router-dom'
import {
  Shield, Users, Music, Palette, Mic2, Trash2, Plus, X,
  TrendingUp, Heart, MessageCircle, Search, AlertTriangle, Lock
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const TABS = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'songs', label: 'Songs', icon: Music },
  { id: 'artists', label: 'Artists', icon: Mic2 },
  { id: 'moods', label: 'Moods', icon: Palette },
]

export default function AdminPanel() {
  const { user, loading } = useAuth()

  // Block non-admin users
  if (loading) return null
  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-10 text-center max-w-md">
          <Lock size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400">You need admin privileges to access this page. Please log in with an admin account.</p>
        </motion.div>
      </div>
    )
  }

  const [tab, setTab] = useState('users')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [songs, setSongs] = useState([])
  const [artists, setArtists] = useState([])
  const [moods, setMoods] = useState([])
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadStats = () => API.get('/admin/stats').then(r => setStats(r.data.stats)).catch(() => {})
  const loadUsers = () => API.get('/admin/users').then(r => setUsers(r.data.users)).catch(() => {})
  const loadSongs = () => API.get('/admin/songs').then(r => setSongs(r.data.songs)).catch(() => {})
  const loadArtists = () => API.get('/admin/artists').then(r => setArtists(r.data.artists)).catch(() => {})
  const loadMoods = () => API.get('/admin/moods').then(r => setMoods(r.data.moods)).catch(() => {})

  useEffect(() => {
    loadStats()
    loadUsers()
    loadSongs()
    loadArtists()
    loadMoods()
  }, [])

  const handleDelete = async (type, id) => {
    try {
      await API.delete(`/admin/${type}/${id}`)
      showToast(`Deleted successfully`)
      setDeleteConfirm(null)
      if (type === 'users') loadUsers()
      if (type === 'songs') loadSongs()
      if (type === 'artists') loadArtists()
      if (type === 'moods') loadMoods()
      loadStats()
    } catch {
      showToast('Delete failed', 'error')
    }
  }

  const filterData = (data, keys) => {
    if (!search) return data
    const q = search.toLowerCase()
    return data.filter(item => keys.some(k => String(item[k] || '').toLowerCase().includes(q)))
  }

  const statCards = [
    { label: 'Users', value: stats?.users, icon: Users, color: '#a855f7' },
    { label: 'Songs', value: stats?.songs, icon: Music, color: '#3b82f6' },
    { label: 'Artists', value: stats?.artists, icon: Mic2, color: '#ec4899' },
    { label: 'Moods', value: stats?.moods, icon: Palette, color: '#10b981' },
    { label: 'Plays', value: stats?.total_plays ? `${(stats.total_plays / 1000).toFixed(0)}k` : '0', icon: TrendingUp, color: '#f59e0b' },
    { label: 'Likes', value: stats?.likes, icon: Heart, color: '#f43f5e' },
    { label: 'Comments', value: stats?.comments, icon: MessageCircle, color: '#06b6d4' },
    { label: 'Playlists', value: stats?.playlists, icon: Music, color: '#8b5cf6' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center">
              <Shield size={22} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold font-[family-name:var(--font-family-display)]">
              Admin <span className="gradient-text">Panel</span>
            </h1>
          </div>
          <p className="text-gray-400 mt-1 ml-[52px]">Manage your platform — users, songs, artists & moods</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-xl p-3 text-center hover:bg-white/[0.08] transition-all cursor-default">
              <s.icon size={18} className="mx-auto mb-1.5" style={{ color: s.color }} />
              <p className="text-xl font-bold">{s.value ?? '—'}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tab Bar + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-1 p-1 rounded-xl glass">
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setSearch('') }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${tab === t.id ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <t.icon size={15} /> {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${tab}...`}
                className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-neon-purple/50 transition" />
            </div>
            {tab !== 'users' && (
              <button onClick={() => setShowAdd(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white text-sm font-semibold hover:opacity-90 transition whitespace-nowrap">
                <Plus size={16} /> Add {tab.slice(0, -1)}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden">
          {tab === 'users' && <UsersTable data={filterData(users, ['username', 'email'])} onDelete={id => setDeleteConfirm({ type: 'users', id, label: 'user' })} />}
          {tab === 'songs' && <SongsTable data={filterData(songs, ['title', 'artist_name'])} onDelete={id => setDeleteConfirm({ type: 'songs', id, label: 'song' })} />}
          {tab === 'artists' && <ArtistsTable data={filterData(artists, ['name'])} onDelete={id => setDeleteConfirm({ type: 'artists', id, label: 'artist' })} />}
          {tab === 'moods' && <MoodsTable data={filterData(moods, ['mood_name'])} onDelete={id => setDeleteConfirm({ type: 'moods', id, label: 'mood' })} />}
        </motion.div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <AddModal tab={tab} artists={artists} onClose={() => setShowAdd(false)}
            onAdded={() => { setShowAdd(false); loadSongs(); loadArtists(); loadMoods(); loadStats() }}
            showToast={showToast} />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-strong rounded-2xl p-6 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
              <AlertTriangle size={40} className="text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-2">Delete {deleteConfirm.label}?</h3>
              <p className="text-gray-400 text-sm mb-6">This action cannot be undone. All related data will be removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition font-medium">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm.type, deleteConfirm.id)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition font-medium">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl
              ${toast.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'}`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ============ SUB-COMPONENTS ============ */

function UsersTable({ data, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-white/10 text-left text-gray-500 text-xs uppercase">
          <th className="p-4">User</th><th className="p-4">Email</th><th className="p-4 text-center">Score</th>
          <th className="p-4 text-center">Streak</th><th className="p-4 text-center">Playlists</th><th className="p-4">Joined</th><th className="p-4"></th>
        </tr></thead>
        <tbody>
          {data.map(u => (
            <tr key={u.user_id} className="border-b border-white/5 hover:bg-white/[0.03] transition">
              <td className="p-4"><div className="flex items-center gap-3">
                <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                <span className="font-medium">{u.username}</span>
              </div></td>
              <td className="p-4 text-gray-400">{u.email}</td>
              <td className="p-4 text-center"><span className="text-neon-purple font-bold">{u.vibe_score}</span></td>
              <td className="p-4 text-center">{u.listening_streak}🔥</td>
              <td className="p-4 text-center">{u.playlist_count}</td>
              <td className="p-4 text-gray-500 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
              <td className="p-4">
                <button onClick={() => onDelete(u.user_id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition">
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-500">No users found</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function SongsTable({ data, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-white/10 text-left text-gray-500 text-xs uppercase">
          <th className="p-4">Song</th><th className="p-4">Artist</th><th className="p-4 text-center">Duration</th>
          <th className="p-4 text-center">Plays</th><th className="p-4"></th>
        </tr></thead>
        <tbody>
          {data.map(s => (
            <tr key={s.song_id} className="border-b border-white/5 hover:bg-white/[0.03] transition">
              <td className="p-4"><div className="flex items-center gap-3">
                <img src={s.cover_image} alt="" className="w-10 h-10 rounded-lg object-cover" onError={e => { e.target.src = 'https://via.placeholder.com/40' }} />
                <span className="font-medium truncate max-w-[200px]">{s.title}</span>
              </div></td>
              <td className="p-4 text-gray-400">{s.artist_name}</td>
              <td className="p-4 text-center text-gray-400">{Math.floor(s.duration / 60)}:{String(s.duration % 60).padStart(2, '0')}</td>
              <td className="p-4 text-center"><span className="text-neon-blue font-bold">{(s.play_count / 1000).toFixed(1)}k</span></td>
              <td className="p-4">
                <button onClick={() => onDelete(s.song_id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition">
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No songs found</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function ArtistsTable({ data, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-white/10 text-left text-gray-500 text-xs uppercase">
          <th className="p-4">Artist</th><th className="p-4">Bio</th><th className="p-4 text-center">Songs</th>
          <th className="p-4 text-center">Total Plays</th><th className="p-4"></th>
        </tr></thead>
        <tbody>
          {data.map(a => (
            <tr key={a.artist_id} className="border-b border-white/5 hover:bg-white/[0.03] transition">
              <td className="p-4"><div className="flex items-center gap-3">
                <img src={a.avatar} alt="" className="w-8 h-8 rounded-full object-cover" onError={e => { e.target.src = 'https://via.placeholder.com/32' }} />
                <span className="font-medium">{a.name}</span>
              </div></td>
              <td className="p-4 text-gray-400 truncate max-w-[200px]">{a.bio || '—'}</td>
              <td className="p-4 text-center"><span className="text-neon-pink font-bold">{a.song_count}</span></td>
              <td className="p-4 text-center text-gray-400">{(a.total_plays / 1000).toFixed(1)}k</td>
              <td className="p-4">
                <button onClick={() => onDelete(a.artist_id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition">
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No artists found</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function MoodsTable({ data, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-white/10 text-left text-gray-500 text-xs uppercase">
          <th className="p-4">Mood</th><th className="p-4">Color</th><th className="p-4">Icon</th>
          <th className="p-4 text-center">Songs</th><th className="p-4"></th>
        </tr></thead>
        <tbody>
          {data.map(m => (
            <tr key={m.mood_id} className="border-b border-white/5 hover:bg-white/[0.03] transition">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.mood_color }} />
                  <span className="font-medium" style={{ color: m.mood_color }}>{m.mood_name}</span>
                </div>
              </td>
              <td className="p-4"><code className="text-xs bg-white/5 px-2 py-1 rounded">{m.mood_color}</code></td>
              <td className="p-4 text-gray-400">{m.mood_icon}</td>
              <td className="p-4 text-center font-bold">{m.song_count}</td>
              <td className="p-4">
                <button onClick={() => onDelete(m.mood_id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition">
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No moods found</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

/* ============ ADD MODAL ============ */
function AddModal({ tab, artists, onClose, onAdded, showToast }) {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const submit = async () => {
    setLoading(true)
    try {
      if (tab === 'songs') {
        if (!form.title || !form.artist_id) { showToast('Title and artist required', 'error'); setLoading(false); return }
        await API.post('/admin/songs', form)
      } else if (tab === 'artists') {
        if (!form.name) { showToast('Artist name required', 'error'); setLoading(false); return }
        await API.post('/admin/artists', form)
      } else if (tab === 'moods') {
        if (!form.mood_name) { showToast('Mood name required', 'error'); setLoading(false); return }
        await API.post('/admin/moods', form)
      }
      showToast('Added successfully!')
      onAdded()
    } catch {
      showToast('Failed to add', 'error')
    }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="glass-strong rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold">Add {tab.slice(0, -1)}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition"><X size={18} /></button>
        </div>

        <div className="space-y-3">
          {tab === 'songs' && <>
            <Input label="Title *" value={form.title || ''} onChange={v => set('title', v)} placeholder="Song title" />
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Artist *</label>
              <select value={form.artist_id || ''} onChange={e => set('artist_id', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-neon-purple/50 transition">
                <option value="">Select artist</option>
                {artists.map(a => <option key={a.artist_id} value={a.artist_id}>{a.name}</option>)}
              </select>
            </div>
            <Input label="Duration (sec)" value={form.duration || ''} onChange={v => set('duration', v)} placeholder="180" type="number" />
            <Input label="Cover Image URL" value={form.cover_image || ''} onChange={v => set('cover_image', v)} placeholder="https://..." />
            <Input label="Audio URL" value={form.audio_url || ''} onChange={v => set('audio_url', v)} placeholder="https://..." />
          </>}

          {tab === 'artists' && <>
            <Input label="Name *" value={form.name || ''} onChange={v => set('name', v)} placeholder="Artist name" />
            <Input label="Bio" value={form.bio || ''} onChange={v => set('bio', v)} placeholder="Short bio" />
            <Input label="Avatar URL" value={form.avatar || ''} onChange={v => set('avatar', v)} placeholder="https://..." />
          </>}

          {tab === 'moods' && <>
            <Input label="Name *" value={form.mood_name || ''} onChange={v => set('mood_name', v)} placeholder="e.g. Romantic" />
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.mood_color || '#a855f7'} onChange={e => set('mood_color', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0" />
                <code className="text-sm text-gray-400">{form.mood_color || '#a855f7'}</code>
              </div>
            </div>
            <Input label="Icon name" value={form.mood_icon || ''} onChange={v => set('mood_icon', v)} placeholder="e.g. heart, star, flame" />
          </>}
        </div>

        <button onClick={submit} disabled={loading}
          className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-semibold hover:opacity-90 transition disabled:opacity-50">
          {loading ? 'Adding...' : 'Add'}
        </button>
      </motion.div>
    </motion.div>
  )
}

function Input({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-neon-purple/50 transition" />
    </div>
  )
}
