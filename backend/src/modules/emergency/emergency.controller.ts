import { NextFunction, Request, Response } from "express";
import * as emergencyService from "./emergency.service";

export const getEmergencyRequestsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const city = req.query.city as string | undefined;
    const requests = await emergencyService.getEmergencyRequests(city);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

//get /api/emergency/:id
export const getEmergencyRequestByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = await emergencyService.getEmergencyRequestById(
      req.params.id as string,
    );
    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

//post /api/emergency
export const createEmergencyRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = await emergencyService.createEmergencyRequest(
      req.userId,
      req.body,
    );
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

//put /api/emergency/:id/resolve
export const resolveEmergencyRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = await emergencyService.resolveEmergencyRequest(
      req.params.id as string,
      req.userId,
    );
    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

//get /api/emergency/my-requests
export const getMyEmergencyRequestsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const requests = await emergencyService.getMyEmergencyRequests(req.userId);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

//get api/emergency/blood-group/: bloodGroup
export const getEmergencyRequestsByBloodGroupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const requests = await emergencyService.getRequestsByBloodGroup(
      req.params.bloodGroup as string,
    );
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};
