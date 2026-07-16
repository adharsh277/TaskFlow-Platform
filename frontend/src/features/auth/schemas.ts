import { z } from 'zod'

export const loginSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
