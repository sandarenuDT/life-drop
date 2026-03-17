import { Request, Response, NextFunction } from 'express'
import * as centersService from './centers.service'

// GET /api/centers
export const getAllCentersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const centers = await centersService.getAllCenters()
    res.status(200).json(centers)
  } catch (error) {
    next(error)
  }
}

// GET /api/centers/nearest?lat=6.9&lng=79.8
export const getNearestCentersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lat = parseFloat(req.query.lat as string)
    const lng = parseFloat(req.query.lng as string)
    const radius = parseFloat(req.query.radius as string) || 50

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({
        status: 'error',
        message: 'lat and lng query parameters are required'
      })
      return
    }

    const centers = await centersService.getNearestCenters(lat, lng, radius)
    res.status(200).json(centers)
  } catch (error) {
    next(error)
  }
}

// GET /api/centers/:id
export const getCenterByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const center = await centersService.getCenterById(req.params.id as string)
    res.status(200).json(center)
  } catch (error) {
    next(error)
  }
}

// GET /api/centers/:id/slots?date=2026-03-16
export const getAvailableSlotsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const date = req.query.date as string

    if (!date) {
      res.status(400).json({
        status: 'error',
        message: 'date query parameter is required'
      })
      return
    }

    const slots = await centersService.getAvailableSlots(id as string, date)
    res.status(200).json(slots)
  } catch (error) {
    next(error)
  }
}

export const createCenterController = async (
  req: Request,
  res: Response,  
  next: NextFunction
) => {
  try {
    const center = await centersService.createCenter(req.body)
    res.status(201).json(center)
  } catch (error) {
    next(error)
  }
}