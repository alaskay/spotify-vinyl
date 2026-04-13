import { useState, useEffect } from 'react'
import { Home as HomeIcon, Search, Library, Settings, LogOut, Plus, User } from 'lucide-react'
import { logout } from '@/services/spotify-auth'
import { fetchCurrentUser } from '@/services/spotify-api'
import { useAppStore } from '@/store/useAppStore'

const NAV_ITEMS = [
  { name: 'My Shelf',  icon: HomeIcon },
  { name: 'Search',    icon: Search   },
  { name: 'Library',   icon: Library  },
  { name: 'Settings',  icon: Settings },
] as const

export default function Home() {
  const [activeNav, setActiveNav] = useState<string>('My Shelf')
  const spotifyUser = useAppStore((s) => s.spotifyUser)
  const setSpotifyUser = useAppStore((s) => s.setSpotifyUser)

  useEffect(() => {
    if (!spotifyUser) {
      fetchCurrentUser().then(setSpotifyUser).catch(() => undefined)
    }
  }, [spotifyUser, setSpotifyUser])

  const avatarUrl = spotifyUser?.images?.[0]?.url
  const displayName = spotifyUser?.display_name ?? '…'
  const handle = spotifyUser?.email ?? ''

  return (
    <div
      className="size-full flex overflow-hidden relative"
      style={{ fontFamily: "'Space Mono', monospace" }}
    >
      {/* ── Background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/background.jpg')",
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(26, 26, 31, 0.55)' }}
      />

      {/* ── Sidebar ── */}
      <aside
        className="relative z-10 flex flex-col h-full"
        style={{
          width: '260px',
          backgroundColor: 'rgba(34, 34, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* User profile */}
        <div className="p-6 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
              style={{ width: '48px', height: '48px', backgroundColor: '#FF4D8F' }}
            >
              {avatarUrl
                ? <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <User size={24} color="#F0EEF5" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-base truncate" style={{ color: '#F0EEF5' }}>
                {displayName}
              </div>
              <div className="text-sm truncate" style={{ color: '#6B6880' }}>
                {handle}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3">
          {NAV_ITEMS.map(({ name, icon: Icon }) => {
            const isActive = activeNav === name
            return (
              <button
                key={name}
                onClick={() => setActiveNav(name)}
                className="w-full flex items-center gap-3 px-3 py-3 mb-1 rounded-lg transition-all"
                style={{
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  borderLeft: isActive ? '3px solid #FF4D8F' : '3px solid transparent',
                  color: isActive ? '#F0EEF5' : '#6B6880',
                  cursor: 'pointer',
                }}
              >
                <Icon size={18} />
                <span className="text-sm">{name}</span>
              </button>
            )
          })}
        </nav>

        {/* Sign out */}
        <div className="p-4">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
            style={{ color: '#FF4D8F', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="relative z-10 flex-1 flex flex-col p-12 overflow-auto">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="font-bold mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: '40px',
              color: '#F0EEF5',
            }}
          >
            Welcome back{spotifyUser ? `, ${displayName.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm" style={{ color: '#6B6880' }}>
            Your vinyl shelf is waiting
          </p>
        </div>

        {/* Vinyl shelf */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <div
              className="relative h-32 rounded-lg overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #2A2520 0%, #1F1B17 100%)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              {/* Wood grain */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 2px,
                    rgba(0,0,0,0.1) 2px,
                    rgba(0,0,0,0.1) 4px
                  )`,
                }}
              />

              {/* Empty state */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="rounded-lg px-8 py-6 text-center"
                  style={{
                    border: '2px dashed rgba(255,255,255,0.15)',
                  }}
                >
                  <p className="text-sm" style={{ color: '#6B6880' }}>
                    Add your first record
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── FAB ── */}
      <button
        className="fixed bottom-8 right-8 rounded-full flex items-center justify-center transition-all hover:scale-105"
        style={{
          width: '56px',
          height: '56px',
          background: 'linear-gradient(135deg, #FF4D8F 0%, #E8458A 100%)',
          boxShadow: '0 4px 16px rgba(255,77,143,0.4)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <Plus size={24} color="#F0EEF5" strokeWidth={2.5} />
      </button>
    </div>
  )
}
