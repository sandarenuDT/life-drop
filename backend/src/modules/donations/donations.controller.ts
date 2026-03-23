import { Request, Response, NextFunction } from 'express'
import * as donationsService from './donations.service'

// POST /api/donations/book
export const bookAppointmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointment = await donationsService.bookAppointment(
      req.userId,
      req.body
    )
    res.status(201).json(appointment)
  } catch (error) {
    next(error)
  }
}

// GET /api/donations/appointments
export const getUserAppointmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointments = await donationsService.getUserAppointments(
      req.userId
    )
    res.status(200).json(appointments)
  } catch (error) {
    next(error)
  }
}

// GET /api/donations/appointments/:id
export const getAppointmentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointment = await donationsService.getAppointmentById(
      req.params.id as string,
      req.userId
    )
    res.status(200).json(appointment)
  } catch (error) {
    next(error)
  }
}

// PUT /api/donations/appointments/:id/cancel
export const cancelAppointmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointment = await donationsService.cancelAppointment(
      req.params.id as string,
      req.userId
    )
    res.status(200).json(appointment)
  } catch (error) {
    next(error)
  }
}

// GET /api/donations/history
export const getDonationHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const history = await donationsService.getDonationHistory(
      req.userId
    )
    res.status(200).json(history)
  } catch (error) {
    next(error)
  }
}

// GET /api/donations/stats
export const getDonationStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await donationsService.getDonationStats(
      req.userId
    )
    res.status(200).json(stats)
  } catch (error) {
    next(error)
  }
}