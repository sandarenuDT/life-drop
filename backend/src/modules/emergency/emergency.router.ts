import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { getEmergencyRequestsController, createEmergencyRequestController, resolveEmergencyRequestController } from "./emergency.controller";
import { requireRole } from "../../middleware/role.middleware";
import { create } from "node:domain";

export const emergencyRouter = Router();

//all routes require login 
emergencyRouter.use(authenticate);

//get /api/emergency
// all users can see emergency requests
emergencyRouter.get('/', getEmergencyRequestsController);

//get /api/emergency/my-requests
//see your own posted requests
emergencyRouter.get('/my-requests', getEmergencyRequestsController);

//get /api/emergency/blood-group/:bloodGroup
//see requests by blood group
emergencyRouter.get('/blood-group/:bloodGroup', getEmergencyRequestsController);


// all users can see details of a request
emergencyRouter.get('/:id', getEmergencyRequestsController);


//post /api/emergency
//only staff and emergency can post
emergencyRouter.post(
    '/',
    requireRole('STAFF','EMERGENCY_REQUESTER', 'ADMIN'),
    createEmergencyRequestController
)

// PUT /api/emergency/:id/resolve
emergencyRouter.put(
  '/:id/resolve',
  requireRole('STAFF', 'EMERGENCY_REQUESTER', 'ADMIN'),
  resolveEmergencyRequestController
)