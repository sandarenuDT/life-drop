import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'
import { prisma } from '../config/database'

export const requireRole = (...roles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { role: true }
      })

      if (!user) {
        throw new AppError('User not found', 404)
      }

      if (!roles.includes(user.role)) {
        throw new AppError(
          'You do not have permission to do this',
          403
        )
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}