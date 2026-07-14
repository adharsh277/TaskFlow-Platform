import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Dropped'
export type TaskPriority = 'Low' | 'Medium' | 'High'
export type Task = { id: string; title: string; description: string; priority: TaskPriority; dueDate: string; category: string; status: TaskStatus; createdAt: string; updatedAt: string; completedAt?: string }
export type Activity = { id: string; type: 'created' | 'updated' | 'completed' | 'dropped'; taskTitle: string; createdAt: string }
type TaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>
type Store = { tasks: Task[]; activities: Activity[]; createTask: (input: TaskInput) => void; updateTask: (id: string, input: TaskInput) => void; setStatus: (id: string, status: TaskStatus) => void; deleteTask: (id: string) => void; getTask: (id: string) => Task | undefined }

const seedTasks: Task[] = []
const TaskContext = createContext<Store | null>(null)
const STORAGE_KEY = 'taskflow-tasks-v2'; const ACTIVITY_KEY = 'taskflow-activity-v2'
const read = <T,>(key: string, fallback: T): T => { try { const stored = localStorage.getItem(key); return stored ? JSON.parse(stored) as T : fallback } catch { return fallback } }
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => read(STORAGE_KEY, seedTasks)); const [activities, setActivities] = useState<Activity[]>(() => read(ACTIVITY_KEY, []))
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)), [tasks]); useEffect(() => localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities)), [activities])
  const addActivity = (type: Activity['type'], taskTitle: string) => setActivities((items) => [{ id: crypto.randomUUID(), type, taskTitle, createdAt: new Date().toISOString() }, ...items].slice(0, 50))
  const value = useMemo<Store>(() => ({ tasks, activities, createTask: (input) => { const now = new Date().toISOString(); const task = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now }; setTasks((items) => [task, ...items]); addActivity('created', task.title) }, updateTask: (id, input) => setTasks((items) => items.map((task) => task.id === id ? { ...task, ...input, updatedAt: new Date().toISOString() } : task)), setStatus: (id, status) => setTasks((items) => items.map((task) => { if (task.id !== id) return task; const next = { ...task, status, updatedAt: new Date().toISOString(), completedAt: status === 'Completed' ? new Date().toISOString() : task.completedAt }; addActivity(status === 'Completed' ? 'completed' : status === 'Dropped' ? 'dropped' : 'updated', task.title); return next })), deleteTask: (id) => setTasks((items) => items.filter((task) => task.id !== id)), getTask: (id) => tasks.find((task) => task.id === id) }), [tasks, activities])
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
export const useTasks = () => { const context = useContext(TaskContext); if (!context) throw new Error('useTasks must be used inside TaskProvider'); return context }
export const statusClass: Record<TaskStatus, string> = { Pending: 'bg-amber-50 text-amber-700', 'In Progress': 'bg-blue-50 text-blue-700', Completed: 'bg-emerald-50 text-emerald-700', Dropped: 'bg-red-50 text-red-700' }
export function timeAgo(value: string) { const delta = Math.max(0, Date.now() - new Date(value).getTime()); const minutes = Math.floor(delta / 60000); if (minutes < 1) return 'Just now'; if (minutes < 60) return `${minutes} minutes ago`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours} hours ago`; if (hours < 48) return 'Yesterday'; return `${Math.floor(hours / 24)} days ago` }
