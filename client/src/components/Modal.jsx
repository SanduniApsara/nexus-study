import { useEffect } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'

export default function Modal({ open, onClose, title, children, footer }) {
  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <div className={clsx('modal-overlay', open && 'open')}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={clsx(
        'bg-bg2 border border-borderHi rounded-xl2 w-full max-w-lg max-h-[90vh] overflow-y-auto',
        'shadow-2xl transition-transform duration-300',
        open ? 'translate-y-0 scale-100' : 'translate-y-6 scale-95'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display font-bold text-base text-text1">{title}</h2>
          <button onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-text3 hover:bg-bg3 hover:text-text1 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
