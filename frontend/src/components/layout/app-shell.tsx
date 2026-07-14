import { Bell, ChevronDown, Command, Menu, Moon, Search, Settings, UserRound } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/brand/logo'
import { cn } from '@/lib/cn'

const navigation = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'My tasks', to: '/tasks' },
  { label: 'Create task', to: '/tasks/new' },
  { label: 'Profile', to: '/profile' },
  { label: 'Settings', to: '/settings' },
]

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('taskflow-theme') === 'dark')
  const location = useLocation()
  const page = navigation.find((item) => item.to === location.pathname)?.label ?? 'Workspace'
  useEffect(() => { const listener = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setCommandOpen(true) } }; window.addEventListener('keydown', listener); return () => window.removeEventListener('keydown', listener) }, [])
  const toggleTheme = () => { const next = !dark; setDark(next); localStorage.setItem('taskflow-theme', next ? 'dark' : 'light'); document.documentElement.classList.toggle('dark', next) }
  return <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <aside className={cn('fixed inset-y-4 left-4 z-30 flex w-[252px] flex-col rounded-card border border-white/80 bg-white/80 p-3 shadow-floating backdrop-blur-xl transition-transform lg:translate-x-0', mobileOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1.5rem)]')}>
      <Logo className="px-3 py-2" />
      <nav className="mt-8 space-y-1" aria-label="Primary navigation">{navigation.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => cn('flex h-11 items-center rounded-xl px-3 text-sm font-semibold transition-colors', isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')}>{item.label}</NavLink>)}</nav>
      <div className="mt-auto rounded-xl bg-slate-900 p-4 text-white"><p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Team plan</p><p className="mt-2 text-sm font-semibold">Everything in flow.</p><p className="mt-1 text-xs leading-5 text-slate-300">Manage your team’s work with clarity.</p></div>
    </aside>
    {mobileOpen && <button className="fixed inset-0 z-20 bg-slate-900/25 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
    <div className="lg:pl-[284px]"><header className="sticky top-0 z-10 flex h-[76px] items-center gap-3 border-b border-slate-200/75 bg-slate-50/80 px-4 backdrop-blur-xl sm:px-7 dark:border-slate-800 dark:bg-slate-950/80"><button className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 hover:bg-white lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace</p><h1 className="heading truncate text-lg font-extrabold">{page}</h1></div><button onClick={() => setCommandOpen(true)} className="hidden h-10 max-w-sm flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-left text-sm text-slate-400 shadow-sm md:flex"><Search size={17} /><span className="flex-1">Search anything...</span><kbd className="inline-flex items-center gap-1 rounded border bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium"><Command size={10} />K</kbd></button><button onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-white" aria-label="Toggle theme"><Moon size={18}/></button><button className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-white" aria-label="Notifications"><Bell size={19} /><span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-slate-50" /></button><button className="flex items-center gap-2 rounded-xl p-1.5 pr-2 text-left hover:bg-white"><span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white">AM</span><ChevronDown size={15} className="hidden text-slate-400 sm:block" /></button></header><main className="p-4 sm:p-7"><Outlet /></main></div>{commandOpen && <div className="fixed inset-0 z-50 grid place-items-start bg-slate-900/30 p-4 pt-[15vh] backdrop-blur-sm" onMouseDown={() => setCommandOpen(false)}><div className="w-full max-w-xl overflow-hidden rounded-2xl border bg-white shadow-floating" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-center gap-3 border-b p-4"><Search size={19} className="text-slate-400"/><input autoFocus placeholder="Search commands, pages, tasks..." className="w-full text-sm outline-none"/><kbd className="rounded border bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-500">ESC</kbd></div><div className="p-2"><p className="px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick actions</p><a href="/tasks/new" className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold hover:bg-slate-50"><span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">+</span>Create a new task</a><a href="/settings" className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold hover:bg-slate-50"><span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600"><Settings size={16}/></span>Open settings</a><a href="/profile" className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold hover:bg-slate-50"><span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600"><UserRound size={16}/></span>View profile</a></div></div></div>}
  </div>
}
