import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function ComingSoonPage({ title }: { title: string }) {
  return <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="surface grid min-h-[55vh] place-items-center p-8 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Sparkles size={22} /></span><h2 className="heading mt-5 text-2xl font-extrabold">{title} is taking shape</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">The foundation is ready. This workspace view will arrive in the next build increment.</p></div></motion.section>
}
