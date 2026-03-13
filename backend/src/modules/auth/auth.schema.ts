import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  bloodGroup: z.enum([
    'A_POS', 'A_NEG', 'B_POS', 'B_NEG',
    'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'
  ]),
  dateOfBirth: z.string(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
