import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Plus, Check } from 'lucide-react'
import { searchAlbums, type SpotifyAlbumResult } from '@/services/spotify-api'
import { useAppStore } from '@/store/useAppStore'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
      <div style={{ width: '100%', aspectRatio: '1', borderRadius: 6, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div className="vs-shimmer" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="vs-shimmer" style={{ height: 10, width: '70%', borderRadius: 3 }} />
      <div className="vs-shimmer" style={{ height: 9, width: '50%', borderRadius: 3 }} />
    </div>
  )
}

// ── Result card ───────────────────────────────────────────────────────────────

function ResultCard({ album, onAdd, alreadyOnShelf }: { album: SpotifyAlbumResult; onAdd: () => void; alreadyOnShelf: boolean }) {
  const [hovered, setHovered] = useState(false)
  const coverUrl = album.images[0]?.url
  const artist = album.artists.map((a) => a.name).join(', ')
  const year = album.release_date.slice(0, 4)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 8,
        padding: 12, borderRadius: 8, position: 'relative',
        background: hovered ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
        transition: 'background 0.15s', cursor: 'default',
      }}
    >
      {/* Cover */}
      <div style={{ width: '100%', aspectRatio: '1', borderRadius: 6, overflow: 'hidden', background: '#2a2a2a', flexShrink: 0 }}>
        {coverUrl && (
          <img
            src={coverUrl}
            alt={album.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
      </div>

      {/* Text */}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
          color: '#F0EEF5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {album.name}
        </div>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#b7b4c7',
          marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {artist}
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#6B6880', marginTop: 2 }}>
          {year}
        </div>
      </div>

      {/* Add button — appears on hover */}
      {hovered && (
        <button
          onClick={alreadyOnShelf ? undefined : onAdd}
          style={{
            position: 'absolute', top: 8, right: 8,
            width: 28, height: 28, borderRadius: '50%',
            background: alreadyOnShelf ? 'rgba(29,185,84,0.15)' : 'rgba(255,77,143,0.15)',
            border: `1px solid ${alreadyOnShelf ? 'rgba(29,185,84,0.4)' : 'rgba(255,77,143,0.4)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: alreadyOnShelf ? 'default' : 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { if (!alreadyOnShelf) e.currentTarget.style.background = 'rgba(255,77,143,0.3)' }}
          onMouseLeave={(e) => { if (!alreadyOnShelf) e.currentTarget.style.background = 'rgba(255,77,143,0.15)' }}
        >
          {alreadyOnShelf
            ? <Check size={12} color="#1DB954" />
            : <Plus size={12} color="#FF4D8F" />
          }
        </button>
      )}
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SpotifyAlbumResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const shelfAlbums = useAppStore((s) => s.shelfAlbums)
  const addToShelf = useAppStore((s) => s.addToShelf)
  const shelfIds = new Set(shelfAlbums.map((a) => a.id))

  // Auto-focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // Escape to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // 400ms debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(() => {
      searchAlbums(query)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false))
    }, 400)
    return () => clearTimeout(timer)
  }, [query])

  function handleAdd(album: SpotifyAlbumResult) {
    addToShelf({
      id: album.id,
      name: album.name,
      artist: album.artists.map((a) => a.name).join(', '),
      coverUrl: album.images[0]?.url ?? '',
      addedAt: Date.now(),
      uri: album.uri,
    })
  }

  const showSkeletons = loading
  const showEmpty = !loading && query.trim() !== '' && results.length === 0
  const showResults = !loading && results.length > 0

  return (
    <>
      <style>{`
        @keyframes vs-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .vs-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: vs-shimmer 1.4s ease-in-out infinite;
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.65)',
                zIndex: 40,
                backdropFilter: 'blur(4px)',
              }}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%', maxWidth: 640,
                maxHeight: '75vh',
                display: 'flex', flexDirection: 'column',
                background: 'rgba(22, 22, 28, 0.98)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
                zIndex: 50,
                overflow: 'hidden',
              }}
            >
              {/* Search input row */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                flexShrink: 0,
              }}>
                <Search size={16} color="#6B6880" style={{ flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search albums or artists…"
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    fontFamily: "'Space Mono', monospace", fontSize: 14, color: '#F0EEF5',
                  }}
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: '#6B6880' }}
                  >
                    <X size={14} />
                  </button>
                )}
                <div style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#6B6880',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4,
                  padding: '3px 6px', letterSpacing: '0.05em', flexShrink: 0,
                }}>
                  ESC
                </div>
              </div>

              {/* Results area */}
              <div style={{ overflowY: 'auto', padding: '16px 20px', flex: 1 }}>

                {/* Idle state */}
                {!query.trim() && (
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#6B6880', textAlign: 'center', padding: '32px 0', letterSpacing: '0.05em' }}>
                    Type to search Spotify's catalogue
                  </p>
                )}

                {/* Skeleton grid */}
                {showSkeletons && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                )}

                {/* Empty state */}
                {showEmpty && (
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#6B6880', textAlign: 'center', padding: '32px 0', letterSpacing: '0.05em' }}>
                    No results for "{query}"
                  </p>
                )}

                {/* Results grid */}
                {showResults && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {results.map((album) => (
                      <ResultCard
                        key={album.id}
                        album={album}
                        alreadyOnShelf={shelfIds.has(album.id)}
                        onAdd={() => handleAdd(album)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
