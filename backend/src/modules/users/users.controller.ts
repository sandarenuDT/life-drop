import { Request, Response, NextFunction } from 'express'
import * as usersService from './users.service'

// GET /api/users/stats
export const getAdminStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await usersService.getAdminStats()
    res.status(200).json(stats)
  } catch (error) {
    next(error)
  }
}

// GET /api/users
export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await usersService.getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

// GET /api/users/:id
export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await usersService.getUserById(req.params.id as string)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

// DELETE /api/users/:id
export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await usersService.deleteUser(req.params.id as string)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}