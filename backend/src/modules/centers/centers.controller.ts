import { Request, Response, NextFunction } from 'express'
import * as centersService from './centers.service'

export const getAllCentersController = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const centers = await centersService.getAllCenters()
    res.status(200).json(centers)
  } catch (error) { next(error) }
}

export const getNearestCentersController = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const lat    = parseFloat(req.query.lat    as string)
    const lng    = parseFloat(req.query.lng    as string)
    const radius = parseFloat(req.query.radius as string) || 100

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({
        status:  'error',
        message: 'lat and lng query parameters are required'
      })
      return
    }

    const centers = await centersService.getNearestCenters(lat, lng, radius)
    res.status(200).json(centers)
  } catch (error) { next(error) }
}

export const getCenterByIdController = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const center = await centersService.getCenterById(req.params.id as string)
    res.status(200).json(center)
  } catch (error) { next(error) }
}

export const getAvailableSlotsController = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const { id }  = req.params as { id: string }
    const date    = req.query.date as string

    if (!date) {
      res.status(400).json({
        status:  'error',
        message: 'date query parameter is required'
      })
      return
    }

    const slots = await centersService.getAvailableSlots(id, date)
    res.status(200).json(slots)
  } catch (error) { next(error) }
}

export const createCenterController = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const center = await centersService.createCenter(req.body)
    res.status(201).json(center)
  } catch (error) { next(error) }
}

export const updateCenterController = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const center = await centersService.updateCenter(req.params.id as string, req.body)
    res.status(200).json(center)
  } catch (error) { next(error) }
}

export const deleteCenterController = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {
    const result = await centersService.deleteCenter(req.params.id as string)
    res.status(200).json(result)
  } catch (error) { next(error) }
}