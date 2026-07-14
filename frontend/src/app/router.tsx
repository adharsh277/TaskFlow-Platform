import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { LoginPage } from '@/features/auth/login-page'
import { DashboardPage } from '@/features/dashboard/dashboard-page'
import { NotFoundPage } from '@/features/common/not-found-page'
import { ProfilePage, SettingsPage } from '@/features/settings/settings-pages'
import { TaskFormPage } from '@/features/tasks/task-form-page'
import { TasksPage } from '@/features/tasks/tasks-page'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <LoginPage /> },
  { element: <AppShell />, children: [
    { path: '/dashboard', element: <DashboardPage /> },
    { path: '/tasks', element: <TasksPage /> },
    { path: '/tasks/new', element: <TaskFormPage /> },
    { path: '/tasks/:taskId/edit', element: <TaskFormPage /> },
    { path: '/profile', element: <ProfilePage /> },
    { path: '/settings', element: <SettingsPage /> },
  ] },
  { path: '*', element: <NotFoundPage /> },
])
