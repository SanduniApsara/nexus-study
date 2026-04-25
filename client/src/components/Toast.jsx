import { useEffect } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import useAppStore from '../store/useAppStore'
import clsx from 'clsx'

export default function Toast() {
  const toast = useAppStore(s => s.toast)

  if (!toast) return null

  return (
    <div className={clsx(
      'fixed bottom-5 right-5 z-[999] flex items-center gap-3',
      'bg-bg3 border rounded-xl px-4 py-3 shadow-2xl',
      'animate-fade-up text-sm font-semibold',
      toast.type === 'success' ? 'border-accent/40 text-text1' : 'border-danger/40 text-text1'
    )}>
      {toast.type === 'success'
        ? <CheckCircle size={17} className="text-accent flex-shrink-0" />
        : <XCircle    size={17} className="text-danger flex-shrink-0" />
      }
      {toast.message}
    </div>
  )
}
