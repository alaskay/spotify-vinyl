interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  visible?: boolean
}

export default function Toast({ message, type = 'info', visible = false }: ToastProps) {

  const variants = {
    // Success: verde Spotify — álbum adicionado, ação concluída
    success: 'bg-surface border border-spotify text-spotify',

    // Error: borda rosa — algo deu errado
    error: 'bg-surface border border-pink text-pink',

    // Info: neutro — avisos gerais
    info: 'bg-elevated border border-border text-white',
  }

  return (
    <div className={`
      fixed top-4 right-4 z-50
      px-4 py-3 rounded-[var(--radius-card)]
      font-body text-xs tracking-wider uppercase
      transition-all duration-300
      ${variants[type]}
      ${visible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 -translate-y-2 pointer-events-none'
      }
    `}>
      {message}
    </div>
  )
}