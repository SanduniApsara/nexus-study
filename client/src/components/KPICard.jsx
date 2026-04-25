import clsx from 'clsx'

const colorMap = {
  green:  { glow: 'before:bg-accent',  text: 'text-accent'  },
  violet: { glow: 'before:bg-violet',  text: 'text-violet'  },
  red:    { glow: 'before:bg-danger',  text: 'text-danger'  },
  sky:    { glow: 'before:bg-sky',     text: 'text-sky'     },
}

export default function KPICard({ label, value, sub, badge, color = 'green', icon: Icon }) {
  const c = colorMap[color] || colorMap.green

  return (
    <div className={clsx(
      'card relative overflow-hidden cursor-default',
      'hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200',
      'animate-fade-up'
    )}>
      {/* Background glow orb */}
      <div className={clsx(
        'absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 blur-xl -translate-y-4 translate-x-4',
        c.glow.replace('before:', '')
      )} />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <p className="label">{label}</p>
          {Icon && <Icon size={16} className={clsx('opacity-50', c.text)} />}
        </div>
        <p className="text-2xl font-black tracking-tight text-text1 mb-1">{value}</p>
        <div className="flex items-center gap-2 text-xs text-text3 font-mono">
          {badge && (
            <span className={clsx(
              'px-1.5 py-0.5 rounded text-xs font-mono',
              badge.type === 'up'   && 'bg-accent/15 text-accent',
              badge.type === 'down' && 'bg-danger/15 text-danger',
              badge.type === 'neutral' && 'bg-bg3 text-text3',
            )}>
              {badge.text}
            </span>
          )}
          {sub}
        </div>
      </div>
    </div>
  )
}
