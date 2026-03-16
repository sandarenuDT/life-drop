import { Router } from 'express'
import {
  registerController,
  loginController,
  getMeController,
} from './auth.controller'
import { authenticate } from '../../middleware/auth.middleware'

export const authRouter = Router()

// Public routes
authRouter.post('/register', registerController)
authRouter.post('/login',    loginController)

// Protected route — needs token
authRouter.get('/me', authenticate, getMeController)