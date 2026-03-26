import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'
import { ZodError } from 'zod'

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Zod validation error — return 400
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.flatten().fieldErrors
    })
  }

  // Known operational error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    })
  }

  // Unknown error
  console.error('UNEXPECTED ERROR:', err)
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
}