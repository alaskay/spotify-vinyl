import Disc from '@/components/Disc'

const DISCS_PER_ROW = 8

const PLANK_GRADIENT = 'linear-gradient(180deg, #D4B896 0%, #B8936A 35%, #9A7A52 70%, #8B6F47 100%)'
const SUPPORT_GRADIENT = 'linear-gradient(90deg, #7A6040 0%, #C4A07A 45%, #A88050 100%)'

interface ShelfAlbum {
  id: string
  name: string
  artist: string
  coverUrl: string
}

interface ShelfProps {
  albums: ShelfAlbum[]
  onAddClick: () => void
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size))
  return result
}

function Support({ height }: { height: number }) {
  return (
    <div style={{
      width: '22px',
      height,
      background: SUPPORT_GRADIENT,
      borderRadius: '3px 3px 0 0',
      flexShrink: 0,
      boxShadow: '1px 0 3px rgba(0,0,0,0.25), -1px 0 3px rgba(0,0,0,0.15)',
    }} />
  )
}

function Plank() {
  return (
    <div style={{
      height: '16px',
      background: PLANK_GRADIENT,
      borderRadius: '2px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.2)',
    }}>
      {/* Wood grain overlay */}
      <div style={{
        height: '100%',
        borderRadius: '2px',
        backgroundImage: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 8px,
          rgba(0,0,0,0.04) 8px,
          rgba(0,0,0,0.04) 9px
        )`,
      }} />
    </div>
  )
}

function ShelfRow({ discs }: { discs: ShelfAlbum[] }) {
  const DISC_H = 120
  const PADDING_TOP = 24
  const SUPPORT_H = DISC_H + PADDING_TOP

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0' }}>
        <Support height={SUPPORT_H} />
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
          gap: '16px',
          paddingTop: PADDING_TOP,
          paddingLeft: '16px',
          paddingRight: '16px',
        }}>
          {discs.map((album) => (
            <Disc
              key={album.id}
              albumName={album.name}
              artist={album.artist}
              coverUrl={album.coverUrl}
            />
          ))}
        </div>
        <Support height={SUPPORT_H} />
      </div>
      <Plank />
    </div>
  )
}

function EmptyState({ onAddClick }: { onAddClick: () => void }) {
  const SUPPORT_H = 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, paddingTop: '80px' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Support height={SUPPORT_H} />
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: SUPPORT_H,
            gap: '14px',
          }}>
            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '13px',
              color: '#9A8060',
              letterSpacing: '0.05em',
            }}>
              Your shelf is empty
            </p>
            <button
              onClick={onAddClick}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '11px',
                color: '#FF4D8F',
                background: 'transparent',
                border: '1px solid rgba(255,77,143,0.35)',
                borderRadius: '20px',
                padding: '8px 22px',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,77,143,0.06)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              + Add your first record
            </button>
          </div>
          <Support height={SUPPORT_H} />
        </div>
        <Plank />
      </div>
    </div>
  )
}

export default function Shelf({ albums, onAddClick }: ShelfProps) {
  if (albums.length === 0) return <EmptyState onAddClick={onAddClick} />

  const rows = chunkArray(albums, DISCS_PER_ROW)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px', width: '100%' }}>
      {rows.map((row, i) => (
        <ShelfRow key={i} discs={row} />
      ))}
    </div>
  )
}
