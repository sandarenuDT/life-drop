import { Request, Response, NextFunction } from 'express'
import * as emergencyService from './emergency.service'

// GET /api/emergency
export const getEmergencyRequestsController = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const city    = req.query.city as string | undefined
    const requests = await emergencyService.getEmergencyRequests(city)
    res.status(200).json(requests)
  } catch (error) { next(error) }
}

// GET /api/emergency/my-requests
export const getMyEmergencyRequestsController = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const requests = await emergencyService.getMyEmergencyRequests(req.userId)
    res.status(200).json(requests)
  } catch (error) { next(error) }
}

// GET /api/emergency/my-responses
export const getMyResponsesController = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const responses = await emergencyService.getMyResponses(req.userId)
    res.status(200).json(responses)
  } catch (error) { next(error) }
}

// GET /api/emergency/:id
export const getEmergencyRequestByIdController = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const request = await emergencyService.getEmergencyRequestById(req.params.id as string)
    res.status(200).json(request)
  } catch (error) { next(error) }
}

// POST /api/emergency
export const createEmergencyRequestController = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const request = await emergencyService.createEmergencyRequest(
      req.userId,
      req.body
    )
    res.status(201).json(request)
  } catch (error) { next(error) }
}

// POST /api/emergency/:id/respond
export const respondToEmergencyController = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const response = await emergencyService.respondToEmergency(
      req.params.id as string,
      req.userId
    )
    res.status(201).json(response)
  } catch (error) { next(error) }
}

// DELETE /api/emergency/:id/respond
export const cancelResponseController = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const response = await emergencyService.cancelResponse(
      req.params.id as string,
      req.userId
    )
    res.status(200).json(response)
  } catch (error) { next(error) }
}

// PUT /api/emergency/:id/resolve
export const resolveEmergencyRequestController = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const request = await emergencyService.resolveEmergencyRequest(
      req.params.id as string, 
      req.userId
    )
    res.status(200).json(request)
  } catch (error) { next(error) }
}

// GET /api/emergency/blood-group/:bloodGroup
export const getRequestsByBloodGroupController = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const requests = await emergencyService.getRequestsByBloodGroup(
      req.params.bloodGroup as string
    )
    res.status(200).json(requests)
  } catch (error) { next(error) }
}