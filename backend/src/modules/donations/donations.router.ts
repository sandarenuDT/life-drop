import { Router } from 'express'
import {
  bookAppointmentController,
  getUserAppointmentsController,
  getAppointmentByIdController,
  cancelAppointmentController,
  getDonationHistoryController,
  getDonationStatsController,
  getAllAppointmentsController,
  getTodayAppointmentsController,
  getAppointmentStatsController,
  confirmAppointmentController,
  completeAppointmentController,
} from './donations.controller'
import { authenticate } from '../../middleware/auth.middleware'
import { requireRole } from '../../middleware/role.middleware'

export const donationsRouter = Router()

// All routes require login
donationsRouter.use(authenticate)

// POST /api/donations/book — Donors only
donationsRouter.post(
  '/book',
  requireRole('DONOR'),
  bookAppointmentController
)

// GET /api/donations/appointments
donationsRouter.get(
  '/appointments',
  getUserAppointmentsController
)

// GET /api/donations/appointments/:id
donationsRouter.get(
  '/appointments/:id',
  getAppointmentByIdController
)

// PUT /api/donations/appointments/:id/cancel
donationsRouter.put(
  '/appointments/:id/cancel',
  cancelAppointmentController
)

// GET /api/donations/history
donationsRouter.get(
  '/history',
  getDonationHistoryController
)

// GET /api/donations/stats
donationsRouter.get(
  '/stats',
  getDonationStatsController
)

///staff + admin routes
//get /api/donations/all
donationsRouter.get(
  '/all',
  requireRole('STAFF', 'ADMIN'),
  getAllAppointmentsController
)

//get api/donations/today
donationsRouter.get(
  '/today',
  requireRole('STAFF', 'ADMIN'),
  getTodayAppointmentsController
)

//get /api/donations/appinments-stats
donationsRouter.get(
  '/appointments-stats',    
  requireRole('STAFF', 'ADMIN'),
  getAppointmentStatsController
)

//put /api/donations/appoinments/:id/confirm
donationsRouter.put(
  '/appointments/:id/confirm',
  requireRole('STAFF', 'ADMIN'),
  confirmAppointmentController
)

//Put /api/donations/appoinments/:id/complete
donationsRouter.put(
  '/appointments/:id/complete',
  requireRole('STAFF', 'ADMIN'),
  completeAppointmentController
)
