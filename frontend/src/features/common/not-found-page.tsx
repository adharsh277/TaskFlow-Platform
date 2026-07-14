import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Compass size={25} /></span><p className="heading mt-8 text-7xl font-extrabold tracking-tighter text-slate-900">404</p><h1 className="heading mt-4 text-2xl font-extrabold">This page is out of flow.</h1><p className="mt-2 text-sm text-slate-500">It may have moved, or it never existed.</p><Link to="/dashboard" className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,.8)] transition hover:bg-blue-700"><ArrowLeft size={17} /> Back to workspace</Link></div></main>
}
