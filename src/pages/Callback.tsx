import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeCodeForTokens } from '@/services/spotify-auth'
import { useAppStore } from '@/store/useAppStore'

type Status = 'loading' | 'error'

export default function Callback() {
  const navigate = useNavigate()
  const setToken = useAppStore((s) => s.setToken)
  const [status, setStatus] = useState<Status>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const error = params.get('error')

    if (error || !code) {
      setErrorMsg(error === 'access_denied' ? 'Access denied — you declined Spotify authorisation.' : 'No authorisation code received.')
      setStatus('error')
      return
    }

    exchangeCodeForTokens(code)
      .then((token) => {
        setToken(token)
        navigate('/', { replace: true })
      })
      .catch((err: Error) => {
        setErrorMsg(err.message)
        setStatus('error')
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        background: '#1A1A1F',
        fontFamily: "'Space Mono', monospace",
      }}
    >
      <style>{`
        @keyframes spinner {
          to { transform: rotate(360deg); }
        }
        .cb-spinner {
          width: 40px; height: 40px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: #1DB954;
          border-radius: 50%;
          animation: spinner 0.8s linear infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cb-content { animation: fade-in 400ms ease-out forwards; }
        .cb-retry-btn {
          padding: 12px 28px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 24px;
          color: #F0EEF5;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .cb-retry-btn:hover {
          border-color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.05);
        }
      `}</style>

      {status === 'loading' && (
        <div className="cb-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div className="cb-spinner" />
          <p style={{ fontSize: '12px', color: '#b7b4c7', letterSpacing: '0.1em' }}>
            Connecting to Spotify…
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="cb-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '360px', textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255,77,143,0.1)',
              border: '1px solid rgba(255,77,143,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 6v4M10 14h.01" stroke="#FF4D8F" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="10" r="9" stroke="#FF4D8F" strokeWidth="1.5" />
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#F0EEF5' }}>
              Authentication failed
            </p>
            <p style={{ fontSize: '11px', color: '#b7b4c7', lineHeight: 1.7 }}>
              {errorMsg}
            </p>
          </div>

          <button className="cb-retry-btn" onClick={() => navigate('/login', { replace: true })}>
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
