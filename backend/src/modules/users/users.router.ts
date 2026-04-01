import { Router } from 'express'
import {
  getAdminStatsController,
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
} from './users.controller'
import { authenticate } from '../../middleware/auth.middleware'
import { requireRole  } from '../../middleware/role.middleware'

export const usersRouter = Router()

// All routes require login
usersRouter.use(authenticate)

// Stats — ADMIN only
// GET /api/users/stats
usersRouter.get(
  '/stats',
  requireRole('ADMIN'),
  getAdminStatsController
)

// All users — ADMIN only
// GET /api/users
usersRouter.get(
  '/',
  requireRole('ADMIN'),
  getAllUsersController
)

// Single user — ADMIN only
// GET /api/users/:id
usersRouter.get(
  '/:id',
  requireRole('ADMIN'),
  getUserByIdController
)

// Delete user — ADMIN only
// DELETE /api/users/:id
usersRouter.delete(
  '/:id',
  requireRole('ADMIN'),
  deleteUserController
)