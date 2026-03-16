import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../utils/AppError'

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401)
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: string }

    req.userId = decoded.userId
    next()
  } catch (error) {
    next(new AppError('Invalid or expired token', 401))
  }
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}