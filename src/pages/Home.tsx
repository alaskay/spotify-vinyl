import Button from '@/components/Button'
import Toast from '@/components/Toast'

export default function Home() {
  return (
    // fundo base escuro, padding generoso
    <div className="min-h-screen bg-base p-8 font-body">

      {/* ── Logo gótica ── */}
      <h1 className="font-gothic text-6xl text-pink mb-2">
        VinylShelf
      </h1>
      {/* tagline em Space Mono — contraste intencional com a gótica acima */}
      <p className="text-muted text-xs tracking-widest uppercase mb-12">
        seus discos, do seu jeito
      </p>

      {/* ── Paleta ── */}
      <section className="mb-10">
        <p className="text-muted text-xs tracking-widest uppercase mb-4">Paleta</p>
        <div className="flex gap-3 flex-wrap">
          {[
            { bg: 'bg-base border border-border',  label: 'base',     text: 'text-muted'  },
            { bg: 'bg-surface',                     label: 'surface',  text: 'text-muted'  },
            { bg: 'bg-elevated',                    label: 'elevated', text: 'text-muted'  },
            { bg: 'bg-pink',                        label: 'pink',     text: 'text-base'   },
            { bg: 'bg-purple',                      label: 'purple',   text: 'text-white'  },
            { bg: 'bg-spotify',                     label: 'spotify',  text: 'text-base'   },
          ].map(({ bg, label, text }) => (
            <div key={label} className={`${bg} ${text} w-20 h-20 rounded-[var(--radius-card)] flex items-end p-2`}>
              <span className="text-xs tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tipografia ── */}
      <section className="mb-10">
        <p className="text-muted text-xs tracking-widest uppercase mb-4">Tipografia</p>
        {/* Gótica só em títulos grandes — ilegível em tamanhos pequenos */}
        <p className="font-gothic text-5xl text-white mb-1">Display gótico</p>
        <p className="text-muted text-xs mb-4">UnifrakturMaguntia — logo e nome do álbum</p>
        <p className="font-body text-sm text-white mb-1">Space Mono — UI e labels</p>
        <p className="text-muted text-xs">toda a interface, botões e metadata</p>
      </section>

      {/* ── Botões ── */}
      <section className="mb-10">
        <p className="text-muted text-xs tracking-widest uppercase mb-4">Botões</p>
        <div className="flex gap-3 flex-wrap">
          <Button variant="primary">Adicionar +</Button>
          <Button variant="secondary">Biblioteca</Button>
          <Button variant="ghost">Cancelar</Button>
        </div>
      </section>

      {/* ── Toasts ── */}
      <section className="mb-10">
        <p className="text-muted text-xs tracking-widest uppercase mb-4">Toast</p>
        <div className="flex gap-3 flex-wrap items-start">
          {/* visible={true} só para o teste visual — na app real controlado por estado */}
          <div className="relative h-12 w-48">
            <Toast message="Álbum adicionado!" type="success" visible={true} />
          </div>
          <div className="relative h-12 w-48">
            <Toast message="Algo deu errado." type="error" visible={true} />
          </div>
          <div className="relative h-12 w-48">
            <Toast message="Requer Premium." type="info" visible={true} />
          </div>
        </div>
      </section>

    </div>
  )
}