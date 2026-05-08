/**
 * Database Explorer — Showcase DBMS concepts for viva
 * Shows: Schema, Views, Triggers, Procedures, ER Diagram, Live Query Runner
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, Table, Eye, Zap, Code, Play, Terminal, GitBranch, ChevronDown, ChevronRight, Check, AlertCircle, Layers } from 'lucide-react'
import API from '../api/axios'

const tabs = [
  { id: 'schema', label: 'Schema', icon: Table, color: '#a855f7' },
  { id: 'views', label: 'Views', icon: Eye, color: '#3b82f6' },
  { id: 'triggers', label: 'Triggers', icon: Zap, color: '#f59e0b' },
  { id: 'procedures', label: 'Procedures', icon: Code, color: '#10b981' },
  { id: 'er', label: 'ER Diagram', icon: GitBranch, color: '#ec4899' },
  { id: 'query', label: 'Query Runner', icon: Terminal, color: '#06b6d4' },
]

export default function DatabaseExplorer() {
  const [activeTab, setActiveTab] = useState('schema')
  const [tables, setTables] = useState([])
  const [views, setViews] = useState([])
  const [triggers, setTriggers] = useState(null)
  const [procedures, setProcedures] = useState([])
  const [erData, setErData] = useState([])
  const [expandedTable, setExpandedTable] = useState(null)
  const [query, setQuery] = useState('SELECT * FROM vw_trending_songs LIMIT 10;')
  const [queryResult, setQueryResult] = useState(null)
  const [queryError, setQueryError] = useState('')
  const [queryLoading, setQueryLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'schema' && tables.length === 0)
      API.get('/database/tables').then(r => setTables(r.data.tables)).catch(() => {})
    if (activeTab === 'views' && views.length === 0)
      API.get('/database/views').then(r => setViews(r.data.views)).catch(() => {})
    if (activeTab === 'triggers' && !triggers)
      API.get('/database/triggers').then(r => setTriggers(r.data)).catch(() => {})
    if (activeTab === 'procedures' && procedures.length === 0)
      API.get('/database/procedures').then(r => setProcedures(r.data.procedures)).catch(() => {})
    if (activeTab === 'er' && erData.length === 0)
      API.get('/database/er-diagram').then(r => setErData(r.data.relationships)).catch(() => {})
  }, [activeTab])

  const runQuery = async () => {
    setQueryLoading(true)
    setQueryError('')
    setQueryResult(null)
    try {
      const res = await API.post('/database/query', { query })
      setQueryResult(res.data)
    } catch (err) {
      setQueryError(err.response?.data?.message || 'Query failed')
    }
    setQueryLoading(false)
  }

  const presetQueries = [
    { label: 'Trending Songs (VIEW)', q: 'SELECT * FROM vw_trending_songs LIMIT 10;' },
    { label: 'Mood Popularity (VIEW)', q: 'SELECT * FROM vw_mood_popularity;' },
    { label: 'User Stats (VIEW)', q: 'SELECT * FROM vw_user_stats;' },
    { label: 'Songs + Artists (JOIN)', q: 'SELECT s.title, a.name AS artist, s.play_count FROM songs s INNER JOIN artists a ON s.artist_id = a.artist_id ORDER BY s.play_count DESC LIMIT 10;' },
    { label: 'Songs Per Mood (GROUP BY)', q: 'SELECT m.mood_name, COUNT(sm.song_id) as song_count FROM moods m LEFT JOIN song_mood sm ON m.mood_id = sm.mood_id GROUP BY m.mood_id ORDER BY song_count DESC;' },
    { label: 'Playlist Engagement (AGGREGATE)', q: 'SELECT p.name, u.username, COUNT(DISTINCT l.like_id) AS likes, COUNT(DISTINCT c.comment_id) AS comments FROM playlists p JOIN users u ON p.user_id = u.user_id LEFT JOIN likes l ON p.playlist_id = l.playlist_id LEFT JOIN comments c ON p.playlist_id = c.playlist_id GROUP BY p.playlist_id;' },
    { label: 'Top Followers (SELF-JOIN)', q: 'SELECT u.username, COUNT(f.follower_id) AS follower_count FROM users u LEFT JOIN followers f ON u.user_id = f.following_id GROUP BY u.user_id ORDER BY follower_count DESC;' },
    { label: 'SHOW TABLES', q: 'SHOW TABLES;' },
    { label: 'DESCRIBE songs', q: 'DESCRIBE songs;' },
  ]

  const typeColor = (type) => {
    if (type?.includes('int')) return 'text-blue-400'
    if (type?.includes('varchar') || type?.includes('text')) return 'text-green-400'
    if (type?.includes('timestamp')) return 'text-amber-400'
    if (type?.includes('enum')) return 'text-pink-400'
    return 'text-gray-400'
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center">
              <Database size={20} />
            </div>
            <h1 className="text-4xl font-bold font-[family-name:var(--font-family-display)]">
              Database <span className="gradient-text">Explorer</span>
            </h1>
          </div>
          <p className="text-gray-400">Interactive showcase of DBMS concepts — 11 Tables, 5 Views, 4 Triggers, 4 Stored Procedures</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition text-sm ${activeTab === tab.id ? 'text-white' : 'glass text-gray-400 hover:text-white'}`}
              style={activeTab === tab.id ? { backgroundColor: `${tab.color}25`, color: tab.color, borderWidth: 1, borderColor: `${tab.color}40` } : {}}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* ===== SCHEMA TAB ===== */}
          {activeTab === 'schema' && (
            <motion.div key="schema" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid gap-4">
                {tables.map((table, i) => (
                  <motion.div key={table.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }} className="glass rounded-2xl overflow-hidden">
                    <button onClick={() => setExpandedTable(expandedTable === table.name ? null : table.name)}
                      className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition">
                      <div className="flex items-center gap-3">
                        <Table size={18} className="text-neon-purple" />
                        <span className="font-bold text-lg">{table.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple text-xs font-semibold">{table.rowCount} rows</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-400 text-xs">{table.columns.length} columns</span>
                      </div>
                      {expandedTable === table.name ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    {expandedTable === table.name && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t border-white/5">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-white/5 text-gray-400 text-xs uppercase">
                                <th className="px-5 py-3 text-left">Column</th>
                                <th className="px-5 py-3 text-left">Type</th>
                                <th className="px-5 py-3 text-left">Null</th>
                                <th className="px-5 py-3 text-left">Key</th>
                                <th className="px-5 py-3 text-left">Default</th>
                              </tr>
                            </thead>
                            <tbody>
                              {table.columns.map((col, j) => (
                                <tr key={j} className="border-t border-white/5 hover:bg-white/5">
                                  <td className="px-5 py-2.5 font-mono font-semibold text-white">{col.Field}</td>
                                  <td className={`px-5 py-2.5 font-mono text-xs ${typeColor(col.Type)}`}>{col.Type}</td>
                                  <td className="px-5 py-2.5">{col.Null === 'YES' ? '✓' : '✗'}</td>
                                  <td className="px-5 py-2.5">
                                    {col.Key === 'PRI' && <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-xs font-bold">PK</span>}
                                    {col.Key === 'MUL' && <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-bold">FK</span>}
                                    {col.Key === 'UNI' && <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-bold">UQ</span>}
                                  </td>
                                  <td className="px-5 py-2.5 text-gray-500 text-xs">{col.Default ?? '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ===== VIEWS TAB ===== */}
          {activeTab === 'views' && (
            <motion.div key="views" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-6">
                {views.map((view, i) => (
                  <motion.div key={view.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Eye size={18} className="text-blue-400" />
                          <h3 className="font-bold text-lg">{view.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${view.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {view.status === 'active' ? '● Active' : '○ Not Created'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{view.description}</p>
                      </div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 mb-4 font-mono text-xs text-blue-300 overflow-x-auto">
                      {view.query}
                    </div>
                    {view.data.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-white/5 text-gray-400 uppercase">
                              {Object.keys(view.data[0]).map(k => (
                                <th key={k} className="px-3 py-2 text-left whitespace-nowrap">{k}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {view.data.map((row, j) => (
                              <tr key={j} className="border-t border-white/5">
                                {Object.values(row).map((v, k) => (
                                  <td key={k} className="px-3 py-2 whitespace-nowrap text-gray-300 max-w-[200px] truncate">{String(v ?? 'NULL')}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ===== TRIGGERS TAB ===== */}
          {activeTab === 'triggers' && triggers && (
            <motion.div key="triggers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass rounded-2xl p-4 mb-6 flex items-center gap-3">
                <Zap size={20} className="text-amber-400" />
                <span className="text-sm"><strong className="text-amber-400">{triggers.activeCount}</strong> active triggers in database</span>
              </div>
              <div className="space-y-4">
                {triggers.triggers.map((trg, i) => (
                  <motion.div key={trg.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={16} className="text-amber-400" />
                      <h3 className="font-bold">{trg.name}</h3>
                      {triggers.activeTriggers?.includes(trg.name) && (
                        <Check size={14} className="text-green-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{trg.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-mono">{trg.event}</span>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 font-mono text-xs text-amber-200 overflow-x-auto">
                      {trg.sql}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ===== PROCEDURES TAB ===== */}
          {activeTab === 'procedures' && (
            <motion.div key="procedures" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-4">
                {procedures.map((proc, i) => (
                  <motion.div key={proc.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Code size={16} className="text-green-400" />
                      <h3 className="font-bold">{proc.name}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{proc.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs font-mono">Params: {proc.params}</span>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 font-mono text-xs text-green-200 flex items-center justify-between">
                      <span>{proc.sql}</span>
                      <button onClick={() => { setQuery(proc.sql); setActiveTab('query') }}
                        className="ml-2 px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs hover:bg-green-500/30 transition flex-shrink-0">
                        Run ▶
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ===== ER DIAGRAM TAB ===== */}
          {activeTab === 'er' && (
            <motion.div key="er" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <GitBranch size={18} className="text-pink-400" /> Entity Relationships (Foreign Keys)
                </h3>
                <div className="space-y-3">
                  {erData.map((rel, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm">
                      <span className="px-2 py-1 rounded-lg bg-pink-500/20 text-pink-400 font-mono font-bold text-xs">{rel.TABLE_NAME}</span>
                      <span className="text-gray-500 text-xs">.{rel.COLUMN_NAME}</span>
                      <span className="text-gray-600">→</span>
                      <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 font-mono font-bold text-xs">{rel.REFERENCED_TABLE_NAME}</span>
                      <span className="text-gray-500 text-xs">.{rel.REFERENCED_COLUMN_NAME}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Visual ER summary */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Layers size={18} className="text-neon-purple" /> Database Architecture</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {['users', 'artists', 'songs', 'moods', 'song_mood', 'playlists', 'playlist_songs', 'likes', 'comments', 'followers', 'listening_history'].map((t, i) => {
                    const types = { users: '👤', artists: '🎤', songs: '🎵', moods: '💜', song_mood: '🔗', playlists: '📋', playlist_songs: '🔗', likes: '❤️', comments: '💬', followers: '👥', listening_history: '📊' }
                    const junctions = ['song_mood', 'playlist_songs', 'followers']
                    return (
                      <motion.div key={t} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-4 rounded-xl text-center ${junctions.includes(t) ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-white/5 border border-white/10'}`}>
                        <span className="text-2xl">{types[t]}</span>
                        <p className="font-mono text-xs mt-2 font-bold">{t}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{junctions.includes(t) ? 'Junction Table' : 'Entity Table'}</p>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== QUERY RUNNER TAB ===== */}
          {activeTab === 'query' && (
            <motion.div key="query" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Terminal size={18} className="text-cyan-400" /> Live SQL Query Runner
                </h3>
                
                {/* Preset queries */}
                <p className="text-xs text-gray-500 mb-2">Quick presets:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {presetQueries.map((pq, i) => (
                    <button key={i} onClick={() => setQuery(pq.q)}
                      className="px-3 py-1.5 rounded-lg glass text-xs text-gray-300 hover:text-white hover:bg-white/10 transition">
                      {pq.label}
                    </button>
                  ))}
                </div>

                <textarea value={query} onChange={e => setQuery(e.target.value)} rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-sm text-cyan-300 placeholder-gray-600 outline-none focus:border-cyan-500/50 transition resize-none"
                  placeholder="Enter SQL query..." />
                
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-500">⚠️ Only SELECT, SHOW, DESCRIBE, and CALL are allowed</p>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={runQuery} disabled={queryLoading || !query.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center gap-2 disabled:opacity-40 transition text-sm">
                    {queryLoading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      : <><Play size={14} /> Run Query</>}
                  </motion.button>
                </div>
              </div>

              {/* Query Error */}
              {queryError && (
                <div className="glass rounded-2xl p-4 mb-4 bg-red-500/10 border border-red-500/30">
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle size={16} /> {queryError}
                  </div>
                </div>
              )}

              {/* Query Results */}
              {queryResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <Check size={14} className="text-green-400" /> {queryResult.rowCount} rows returned
                    </span>
                  </div>
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    {queryResult.results.length > 0 && (
                      <table className="w-full text-xs">
                        <thead className="sticky top-0 bg-dark-card">
                          <tr className="bg-white/5 text-gray-400 uppercase">
                            {Object.keys(queryResult.results[0]).map(k => (
                              <th key={k} className="px-4 py-3 text-left whitespace-nowrap font-semibold">{k}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryResult.results.map((row, j) => (
                            <tr key={j} className="border-t border-white/5 hover:bg-white/5">
                              {Object.values(row).map((v, k) => (
                                <td key={k} className="px-4 py-2.5 whitespace-nowrap text-gray-300 max-w-[250px] truncate">
                                  {v === null ? <span className="text-gray-600 italic">NULL</span> : String(v)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
