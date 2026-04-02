import { Router } from 'express'
import {
  getEmergencyRequestsController,
  getMyEmergencyRequestsController,
  getMyResponsesController,
  getEmergencyRequestByIdController,
  createEmergencyRequestController,
  respondToEmergencyController,
  cancelResponseController,
  resolveEmergencyRequestController,
  getRequestsByBloodGroupController,
} from './emergency.controller'
import { authenticate } from '../../middleware/auth.middleware'
import { requireRole  } from '../../middleware/role.middleware'

export const emergencyRouter = Router()

emergencyRouter.use(authenticate)

// GET /api/emergency
emergencyRouter.get('/', getEmergencyRequestsController)

// GET /api/emergency/my-requests
emergencyRouter.get('/my-requests', getMyEmergencyRequestsController)

// GET /api/emergency/my-responses — Donors
emergencyRouter.get(
  '/my-responses',
  requireRole('DONOR'),
  getMyResponsesController
)

// GET /api/emergency/blood-group/:bloodGroup
emergencyRouter.get(
  '/blood-group/:bloodGroup',
  getRequestsByBloodGroupController
)

// GET /api/emergency/:id
emergencyRouter.get('/:id', getEmergencyRequestByIdController)

// POST /api/emergency — Staff + ER + Admin
emergencyRouter.post(
  '/',
  requireRole('STAFF', 'EMERGENCY_REQUESTER', 'ADMIN'),
  createEmergencyRequestController
)

// POST /api/emergency/:id/respond — Donors only
emergencyRouter.post(
  '/:id/respond',
  requireRole('DONOR'),
  respondToEmergencyController
)

// DELETE /api/emergency/:id/respond — Donors only
emergencyRouter.delete(
  '/:id/respond',
  requireRole('DONOR'),
  cancelResponseController
)

// PUT /api/emergency/:id/resolve
emergencyRouter.put(
  '/:id/resolve',
  requireRole('STAFF', 'EMERGENCY_REQUESTER', 'ADMIN'),
  resolveEmergencyRequestController
)