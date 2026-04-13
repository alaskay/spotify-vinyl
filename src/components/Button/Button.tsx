interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {

  // Base: fonte mono, uppercase, quase sem arredondamento — agressivo
  const base = 'font-body text-xs tracking-widest uppercase px-6 h-11 rounded-[var(--radius-card)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    // Primary: rosa neon — para CTAs principais como "Adicionar" e "Entrar"
    primary: 'bg-pink text-base hover:opacity-85 active:scale-95',

    // Secondary: superfície roxa — para ações secundárias
    secondary: 'bg-purple text-white/80 hover:bg-purple/80 active:scale-95',

    // Ghost: só borda — para cancelar, fechar, ações destrutivas leves
    ghost: 'bg-transparent text-muted border border-border hover:border-pink hover:text-pink active:scale-95',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}