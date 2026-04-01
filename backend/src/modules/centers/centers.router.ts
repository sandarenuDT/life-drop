import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { getAllCentersController, getNearestCentersController, getCenterByIdController, getAvailableSlotsController, createCenterController, updateCenterController, deleteCenterController } from "./centers.controller";
import { create } from "domain";
import { requireRole } from "../../middleware/role.middleware";




export const centersRouter = Router()
// all routed require lgin
centersRouter.use(authenticate)
// GET api/centers
centersRouter.get('/', getAllCentersController)
// GET api/centers/nearest
centersRouter.get('/nearest', getNearestCentersController)
// GET api/centers/:id
centersRouter.get('/:id', getCenterByIdController)
// GET api/centers/:id/slots
centersRouter.get('/:id/slots', getAvailableSlotsController)

// add center
centersRouter.post('/', requireRole('ADMIN'), createCenterController)
// PUT /api/centers/:id — ADMIN only
centersRouter.put(
  '/:id',
  requireRole('ADMIN'),
  updateCenterController
)

// DELETE /api/centers/:id — ADMIN only
centersRouter.delete(
  '/:id',
  requireRole('ADMIN'),
  deleteCenterController
)