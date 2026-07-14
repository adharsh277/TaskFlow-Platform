import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return <div className={cn('inline-flex items-center gap-2.5', className)}>
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-[0_8px_20px_-8px_rgba(6,182,212,.8)]"><Check size={20} strokeWidth={3} className="text-white" /></span>
    {!compact && <span className="heading text-lg font-extrabold tracking-tight text-slate-900">TaskFlow</span>}
  </div>
}
