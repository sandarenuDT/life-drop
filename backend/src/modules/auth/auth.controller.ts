import { Request, Response, NextFunction } from 'express'
import * as authService from './auth.service'
import { registerSchema, loginSchema } from './auth.schema'

// POST /api/auth/register
export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = registerSchema.parse(req.body)
    const result = await authService.register(data)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/login
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = loginSchema.parse(req.body)
    const result = await authService.login(data)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

// GET /api/auth/me
export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.getProfile(req.userId)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}