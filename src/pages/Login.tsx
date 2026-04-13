import { useState, useEffect } from 'react'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  function handleLogin() {
    setLoading(true)
    // TODO M1: redirecionar para o Spotify OAuth
  }

  return (
    <div className="relative w-full h-screen flex overflow-hidden">
      <style>{`
        .bg-blur {
          position: absolute;
          inset: 0;
          background-image: url('/background.jpg');
          background-size: cover;
          background-position: center;
          filter: blur(8px);
          transform: scale(1.05);
          z-index: 0;
        }
        .bg-overlay {
          position: absolute;
          inset: 0;
          background: rgba(26, 26, 31, 0.3);
          z-index: 1;
        }

        @keyframes spin-vinyl {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-vinyl { opacity: 0; animation: fade-up 800ms ease-out forwards; animation-delay: 0ms; }
        .anim-logo  { opacity: 0; animation: fade-up 600ms ease-out forwards; animation-delay: 100ms; }
        .anim-tag   { opacity: 0; animation: fade-up 600ms ease-out forwards; animation-delay: 200ms; }
        .anim-card  { opacity: 0; animation: fade-up 600ms ease-out forwards; animation-delay: 300ms; }

        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-left: 1px solid rgba(255, 255, 255, 0.08);
        }

        .btn-spotify {
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }
        .btn-spotify:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 8px 24px rgba(29, 185, 84, 0.35);
        }
        .btn-spotify:active:not(:disabled) { transform: scale(0.98); }
        .btn-spotify:disabled { opacity: 0.7; cursor: not-allowed; }

        @keyframes spinner {
          to { transform: rotate(360deg); }
        }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spinner 0.7s linear infinite;
        }
      `}</style>

      <div className="bg-blur" />
      <div className="bg-overlay" />

      <div className="relative z-10 w-full flex items-center">

        {/* ── LADO ESQUERDO — vinil + branding ── */}
        {visible && (
          <div
            className="flex flex-col items-center justify-center gap-8"
            style={{ width: '50%', height: '100vh' }}
          >
            <div className="anim-vinyl">
              <img
                src="/vinyl.png"
                alt="vinyl disc"
                style={{
                  width: '420px',
                  height: '420px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  animation: 'spin-vinyl 16s linear infinite',
                  mixBlendMode: 'lighten',
                  filter: 'drop-shadow(0 0 40px rgba(255,77,143,0.2))',
                }}
              />
            </div>

            <div className="flex flex-col items-center gap-2">
              <h1
                className="anim-logo text-center"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '52px',
                  fontStyle: 'italic',
                  fontWeight: 700,
                  color: '#F0EEF5',
                  lineHeight: 1,
                }}
              >
                VinylShelf
              </h1>
              <p
                className="anim-tag text-center"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px',
                  color: '#b7b4c7',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                your records, your way
              </p>
            </div>
          </div>
        )}

        {/* ── LADO DIREITO — card de login ── */}
        {visible && (
          <div
            className="glass-card anim-card flex flex-col items-center justify-center gap-8"
            style={{ width: '50%', height: '100vh', padding: '48px 64px' }}
          >

            {/* Ícone disco */}
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(255,77,143,0.1)',
                border: '1px solid rgba(255,77,143,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="36" height="36" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="15" fill="#1A1A1F" />
                {[13, 11, 9].map(r => (
                  <circle key={r} cx="16" cy="16" r={r} fill="none" stroke="#FF4D8F" strokeWidth="0.5" opacity="0.4" />
                ))}
                <circle cx="16" cy="16" r="4" fill="#FF4D8F" opacity="0.6" />
                <circle cx="16" cy="16" r="1.5" fill="#1A1A1F" />
              </svg>
            </div>

            {/* Título */}
            <div className="flex flex-col items-center gap-2">
              <h2
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#F0EEF5',
                }}
              >
                Welcome back
              </h2>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px',
                  color: '#b7b4c7',
                  textAlign: 'center',
                  lineHeight: 1.7,
                  maxWidth: '280px',
                }}
              >
                Connect your Spotify account to access your vinyl shelf
              </p>
            </div>

            {/* Divider */}
            <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.06)' }} />

            {/* Botão Spotify */}
            <button
              className="btn-spotify flex items-center justify-center gap-2"
              style={{
                width: '100%',
                maxWidth: '320px',
                height: '52px',
                backgroundColor: '#1DB954',
                borderRadius: '26px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <div className="spinner" />
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'white',
                    }}
                  >
                    Sign in with Spotify
                  </span>
                </>
              )}
            </button>

            {/* Nota legal */}
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px',
                color: 'rgba(240, 238, 245, 0.2)',
                textAlign: 'center',
                lineHeight: 1.7,
              }}
            >
              Requires Spotify Premium account for playback
            </p>

          </div>
        )}

      </div>
    </div>
  )
}