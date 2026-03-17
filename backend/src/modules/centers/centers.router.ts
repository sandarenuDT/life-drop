import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { getAllCentersController, getNearestCentersController, getCenterByIdController, getAvailableSlotsController } from "./centers.controller";




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

centersRouter.use(authenticate)