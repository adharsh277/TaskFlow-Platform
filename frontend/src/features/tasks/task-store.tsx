import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { apiClient } from '@/lib/api-client'

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Dropped'
export type TaskPriority = 'Low' | 'Medium' | 'High'
export type Task = { id: string; title: string; description: string; priority: TaskPriority; dueDate: string; category: string; status: TaskStatus; createdAt: string; updatedAt: string; completedAt?: string }
export type Activity = { id: string; type: 'created' | 'updated' | 'completed' | 'dropped' | 'deleted'; taskTitle: string; createdAt: string }
type TaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>
type Store = { tasks: Task[]; activities: Activity[]; createTask: (input: TaskInput) => Promise<void>; updateTask: (id: string, input: TaskInput) => Promise<void>; setStatus: (id: string, status: TaskStatus) => Promise<void>; deleteTask: (id: string) => Promise<void>; getTask: (id: string) => Task | undefined }

const TaskContext = createContext<Store | null>(null)
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]); const [activities, setActivities] = useState<Activity[]>([])
  const normalizeTask = (value: any): Task => ({ id: String(value.id), title: value.title, description: value.description, priority: value.priority, dueDate: value.due_date, category: value.category, status: value.status, createdAt: value.created_at, updatedAt: value.updated_at })
  const load = async () => { try { const [taskResponse, activityResponse] = await Promise.all([apiClient.get('/tasks?page=1&page_size=100'), apiClient.get('/activities?limit=50')]); setTasks(taskResponse.data.data.map(normalizeTask)); setActivities(activityResponse.data.data.map((item: any) => ({ id: String(item.id), type: item.action === 'status_changed' ? 'updated' : item.action, taskTitle: item.task_id ? `Task #${item.task_id}` : 'Task', createdAt: item.timestamp }))) } catch { /* Login and API errors are surfaced by the mutation actions. */ } }
  useEffect(() => { const authenticated = () => { if (localStorage.getItem('taskflow-access-token')) void load() }; authenticated(); window.addEventListener('taskflow-authenticated', authenticated); return () => window.removeEventListener('taskflow-authenticated', authenticated) }, [])
  const value = useMemo<Store>(() => ({
    tasks,
    activities,
    createTask: async (input) => { const response = await apiClient.post('/tasks', { ...input, due_date: input.dueDate }); setTasks((items) => [normalizeTask(response.data), ...items]); await load() },
    updateTask: async (id, input) => { const response = await apiClient.put(`/tasks/${id}`, { ...input, due_date: input.dueDate }); setTasks((items) => items.map((task) => task.id === id ? normalizeTask(response.data) : task)); await load() },
    setStatus: async (id, status) => { const task = tasks.find((item) => item.id === id); if (!task) return; const response = await apiClient.put(`/tasks/${id}`, { title: task.title, description: task.description, priority: task.priority, status, category: task.category, due_date: task.dueDate }); setTasks((items) => items.map((item) => item.id === id ? normalizeTask(response.data) : item)); await load() },
    deleteTask: async (id) => { await apiClient.delete(`/tasks/${id}`); setTasks((items) => items.filter((task) => task.id !== id)); await load() },
    getTask: (id) => tasks.find((task) => task.id === id),
  }), [tasks, activities])
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
export const useTasks = () => { const context = useContext(TaskContext); if (!context) throw new Error('useTasks must be used inside TaskProvider'); return context }
export const statusClass: Record<TaskStatus, string> = { Pending: 'bg-amber-50 text-amber-700', 'In Progress': 'bg-blue-50 text-blue-700', Completed: 'bg-emerald-50 text-emerald-700', Dropped: 'bg-red-50 text-red-700' }
export function timeAgo(value: string) { const delta = Math.max(0, Date.now() - new Date(value).getTime()); const minutes = Math.floor(delta / 60000); if (minutes < 1) return 'Just now'; if (minutes < 60) return `${minutes} minutes ago`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours} hours ago`; if (hours < 48) return 'Yesterday'; return `${Math.floor(hours / 24)} days ago` }
