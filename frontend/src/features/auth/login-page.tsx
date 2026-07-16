import { motion } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginSchema, type LoginFormValues } from './schemas'
import { apiClient } from '@/lib/api-client'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isSignup = location.pathname === '/signup'
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { remember: true } })
  const onSubmit = async (values: LoginFormValues) => {
    try {
      if (isSignup) {
        if (!values.fullName?.trim()) { toast.error('Please enter your full name'); return }
        await apiClient.post('/auth/register', { full_name: values.fullName.trim(), email: values.email, password: values.password })
      }
      const response = await apiClient.post('/auth/login', new URLSearchParams({ username: values.email, password: values.password }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      localStorage.setItem('taskflow-access-token', response.data.access_token)
      localStorage.setItem('taskflow-demo-user', values.email)
      window.dispatchEvent(new Event('taskflow-authenticated'))
      toast.success(isSignup ? 'Account created successfully' : 'Welcome back to TaskFlow')
      navigate('/dashboard')
    } catch (error: any) {
      const message = error?.response?.data?.message ?? error?.response?.data?.detail ?? 'Unable to connect to TaskFlow. Please try again.'
      toast.error(message)
    }
  }
  return <main className="relative min-h-screen overflow-hidden bg-slate-50 p-4 sm:p-6 lg:p-8">
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-28 left-[8%] h-96 w-96 rounded-full bg-blue-200/35 blur-3xl" />
      <div className="absolute -bottom-24 right-[4%] h-[28rem] w-[28rem] rounded-full bg-cyan-100/65 blur-3xl" />
    </div>
    <div className="relative mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1440px] overflow-hidden rounded-[28px] border border-white/70 bg-white/65 shadow-floating backdrop-blur-sm lg:grid-cols-[1.15fr_.85fr]">
      <section className="hidden flex-col justify-between bg-slate-900 p-10 text-white lg:flex">
        <Logo className="[&>span:last-child]:text-white" />
        <div className="max-w-xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> WORKSPACE, REIMAGINED</span>
          <h1 className="heading text-5xl font-extrabold leading-[1.08] tracking-tight">Move work forward, <span className="text-cyan-300">beautifully.</span></h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">TaskFlow brings your people, projects, and priorities into one calm, focused workspace.</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-300"><span className="grid h-10 w-10 place-items-center rounded-full bg-white/10"><ShieldCheck size={20} className="text-cyan-300" /></span><span>Secure by design. Built for teams that care about craft.</span></div>
      </section>
      <section className="flex min-h-full items-center justify-center p-6 sm:p-12 lg:p-16">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }} className="w-full max-w-[400px]">
          <Logo className="mb-12 lg:hidden" />
          <div className="mb-9"><p className="text-sm font-semibold text-blue-600">{isSignup ? 'GET STARTED' : 'WELCOME BACK'}</p><h2 className="heading mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{isSignup ? 'Create your TaskFlow account' : 'Sign in to TaskFlow'}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{isSignup ? 'Create an account to start managing your work.' : 'Enter your details to access your workspace.'}</p></div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {isSignup && <Input label="Full name" autoComplete="name" placeholder="Your full name" error={errors.fullName?.message} {...register('fullName')} />}
            <Input label="Work email" type="email" autoComplete="email" placeholder="you@company.com" icon={<Mail size={17} />} error={errors.email?.message} {...register('email')} />
            <div className="space-y-2"><Input label="Password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" icon={<KeyRound size={17} />} error={errors.password?.message} {...register('password')} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute ml-[calc(100%-42px)] -mt-10 rounded p-1 text-slate-400 hover:text-slate-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            <div className="flex items-center justify-between gap-4 text-sm"><label className="flex cursor-pointer items-center gap-2 text-slate-600"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" {...register('remember')} /> Remember me</label><a href="#forgot-password" className="font-semibold text-blue-600 hover:text-blue-700">Forgot password?</a></div>
            <Button type="submit" loading={isSubmitting} className="w-full">{isSignup ? 'Create account' : 'Continue'} <ArrowRight size={17} /></Button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-500">{isSignup ? 'Already have an account?' : 'New to TaskFlow?'} <Link to={isSignup ? '/login' : '/signup'} className="font-semibold text-blue-600 hover:text-blue-700">{isSignup ? 'Sign in' : 'Create an account'}</Link></p>
        </motion.div>
      </section>
    </div>
  </main>
}
