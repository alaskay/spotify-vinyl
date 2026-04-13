import { useState } from 'react'

interface DiscProps {
  albumName: string
  artist: string
  coverUrl?: string
}

const SIZE = 120
const COVER = 72
const LABEL = 28
const HOLE = 5

const RINGS = [48, 38, 29] // radii for concentric rings (inside the vinyl, outside the cover)

export default function Disc({ albumName, artist, coverUrl }: DiscProps) {
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Vinyl disc */}
      <div
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: '50%',
          backgroundColor: '#1C1B1B',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          transition: 'transform 200ms ease-out, box-shadow 200ms ease-out',
          transform: hovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: hovered
            ? '0 20px 40px rgba(0,0,0,0.7), 0 8px 16px rgba(0,0,0,0.5)'
            : '0 4px 12px rgba(0,0,0,0.4)',
          cursor: 'pointer',
        }}
      >
        {/* Concentric rings */}
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          {RINGS.map((r) => (
            <circle
              key={r}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          ))}
        </svg>

        {/* Album cover circle */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: COVER,
            height: COVER,
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: '#2a2a2a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {coverUrl && !imgError ? (
            <img
              src={coverUrl}
              alt={albumName}
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            /* Musical note placeholder */
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18V5l12-2v13"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="6" cy="18" r="3" fill="rgba(255,255,255,0.25)" />
              <circle cx="18" cy="16" r="3" fill="rgba(255,255,255,0.25)" />
            </svg>
          )}
        </div>

        {/* Golden label circle */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: LABEL,
            height: LABEL,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #D4A843, #8B6914)',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* Center hole */}
          <div
            style={{
              width: HOLE,
              height: HOLE,
              borderRadius: '50%',
              backgroundColor: '#1C1B1B',
            }}
          />
        </div>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(26, 26, 31, 0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '8px 12px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 10,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              color: '#F0EEF5',
              marginBottom: '2px',
            }}
          >
            {albumName}
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              color: '#b7b4c7',
            }}
          >
            {artist}
          </div>
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(255,255,255,0.1)',
            }}
          />
        </div>
      )}
    </div>
  )
}
