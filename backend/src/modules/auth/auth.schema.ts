import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  role: z.string().optional().default('DONOR'),
  bloodGroup: z.string().optional(),
  dateOfBirth: z.string().optional(),
}).superRefine((data, ctx) => {
  const isDonor = data.role === 'DONOR' || !data.role

  if (isDonor) {
    // Check blood group
    if (!data.bloodGroup) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Blood group is required for donors',
        path: ['bloodGroup'],
      })
    } else {
      // Validate blood group value is correct
      const validBloodGroups = [
        'A_POS', 'A_NEG', 'B_POS', 'B_NEG',
        'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'
      ]
      if (!validBloodGroups.includes(data.bloodGroup)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid blood group. Must be one of: A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG',
          path: ['bloodGroup'],
        })
      }
    }

    // Check date of birth
    if (!data.dateOfBirth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date of birth is required for donors',
        path: ['dateOfBirth'],
      })
    }
  }
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>