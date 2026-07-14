import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { type Task, useTasks } from './task-store'

export function TaskActions({ task }: { task: Task }) {
  const [open, setOpen] = useState(false); const { setStatus, deleteTask } = useTasks()
  const change = (status: Task['status']) => { setStatus(task.id, status); toast.success(`Task marked as ${status}`); setOpen(false) }
  return <div className="relative"><button onClick={() => setOpen(!open)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Actions for ${task.title}`}><MoreHorizontal size={18}/></button>{open && <div className="absolute right-0 z-30 mt-1 w-48 rounded-xl border bg-white p-1.5 shadow-floating"><Link onClick={() => setOpen(false)} to={`/tasks/${task.id}/edit`} className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-50">Edit</Link><button onClick={() => change('Completed')} className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-slate-50">Mark as Completed</button><button onClick={() => change('In Progress')} className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-slate-50">Mark as In Progress</button><button onClick={() => change('Dropped')} className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-slate-50">Mark as Dropped</button><button onClick={() => { deleteTask(task.id); toast.success('Task deleted'); setOpen(false) }} className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50">Delete</button></div>}</div>
}
