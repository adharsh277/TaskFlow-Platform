import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; icon?: React.ReactNode }

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, error, icon, className, id, ...props }, ref) {
  const inputId = id ?? props.name
  return <div className="space-y-2">
    {label && <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700">{label}</label>}
    <div className="relative">
      {icon && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">{icon}</span>}
      <input ref={ref} id={inputId} className={cn('h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10', icon && 'pl-10', error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10', className)} {...props} />
    </div>
    {error && <p className="text-xs font-medium text-red-600">{error}</p>}
  </div>
})
