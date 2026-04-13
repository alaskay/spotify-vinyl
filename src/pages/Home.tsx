import { useState, useEffect } from 'react'
import { Home as HomeIcon, Search, Library, Settings, LogOut, Plus, User } from 'lucide-react'
import { logout } from '@/services/spotify-auth'
import { fetchCurrentUser } from '@/services/spotify-api'
import { useAppStore } from '@/store/useAppStore'
import Shelf from '@/components/Shelf'
import SearchModal from '@/components/SearchModal'

const NAV_ITEMS = [
  { name: 'My Shelf',  icon: HomeIcon },
  { name: 'Search',    icon: Search   },
  { name: 'Library',   icon: Library  },
  { name: 'Settings',  icon: Settings },
] as const

export default function Home() {
  const [activeNav, setActiveNav] = useState<string>('My Shelf')
  const [searchOpen, setSearchOpen] = useState(false)

  const spotifyUser  = useAppStore((s) => s.spotifyUser)
  const setSpotifyUser = useAppStore((s) => s.setSpotifyUser)
  const shelfAlbums  = useAppStore((s) => s.shelfAlbums)

  useEffect(() => {
    if (!spotifyUser) {
      fetchCurrentUser().then(setSpotifyUser).catch(() => undefined)
    }
  }, [spotifyUser, setSpotifyUser])

  // Cmd/Ctrl+K global shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const avatarUrl   = spotifyUser?.images?.[0]?.url
  const displayName = spotifyUser?.display_name ?? '…'
  const handle      = spotifyUser?.email ?? ''

  return (
    <div
      style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Space Mono', monospace" }}
    >
      {/* ── Sidebar ── */}
      <aside style={{
        width: '260px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#22222A',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}>
        {/* User profile */}
        <div style={{ padding: '24px 24px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px', height: '48px',
              borderRadius: '50%',
              backgroundColor: '#FF4D8F',
              flexShrink: 0,
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {avatarUrl
                ? <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <User size={24} color="#F0EEF5" />
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#F0EEF5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {displayName}
              </div>
              <div style={{ fontSize: '12px', color: '#6B6880', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {handle}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 12px' }}>
          {NAV_ITEMS.map(({ name, icon: Icon }) => {
            const isActive = activeNav === name
            return (
              <button
                key={name}
                onClick={() => setActiveNav(name)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  marginBottom: '4px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                  borderLeft: isActive ? '3px solid #FF4D8F' : '3px solid transparent',
                  color: isActive ? '#F0EEF5' : '#6B6880',
                  cursor: 'pointer',
                  border: 'none',
                  borderLeftWidth: '3px',
                  borderLeftStyle: 'solid',
                  borderLeftColor: isActive ? '#FF4D8F' : 'transparent',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '13px',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                <Icon size={18} />
                {name}
              </button>
            )
          })}
        </nav>

        {/* Sign out */}
        <div style={{ padding: '16px' }}>
          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '13px', color: '#FF4D8F',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'Space Mono', monospace",
              opacity: 1, transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#F5F0E8',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ padding: '48px 48px 40px' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: '38px',
            color: '#2A2118',
            margin: '0 0 6px',
            lineHeight: 1.1,
          }}>
            {spotifyUser ? `Welcome back, ${displayName.split(' ')[0]}` : 'Your Shelf'}
          </h1>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: '#9A8060', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
            {shelfAlbums.length === 0
              ? 'no records yet'
              : `${shelfAlbums.length} record${shelfAlbums.length !== 1 ? 's' : ''} on your shelf`
            }
          </p>
        </div>

        {/* Shelf */}
        <div style={{ flex: 1, padding: '0 48px 120px' }}>
          <Shelf albums={shelfAlbums} onAddClick={() => setSearchOpen(true)} />
        </div>
      </main>

      {/* ── Search modal ── */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── FAB ── */}
      <button
        onClick={() => setSearchOpen(true)}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF4D8F 0%, #E8458A 100%)',
          boxShadow: '0 4px 16px rgba(255,77,143,0.45)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s, box-shadow 0.2s',
          zIndex: 20,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,77,143,0.6)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,77,143,0.45)' }}
      >
        <Plus size={24} color="#F0EEF5" strokeWidth={2.5} />
      </button>
    </div>
  )
}
