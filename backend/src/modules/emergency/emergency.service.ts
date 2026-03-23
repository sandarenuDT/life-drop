import { string } from "zod";
import { prisma } from "../../config/database";
import { AppError } from "../../utils/AppError";
//get all requests
export const getEmergencyRequests = async (city?: string) => {
  return prisma.emergencyRequest.findMany({
    where: {
      resolved: false,
      ...(city && { city }),
    },
    orderBy: [{ urgency: "asc" }, { createdAt: "desc" }],
  });
};
//get single request
export const getEmergencyRequestById = async (id: string) => {
  const request = await prisma.emergencyRequest.findUnique({
    where: { id },
  });
  if (!request) {
    throw new AppError("Emergency request not found", 404 );
  }
  return request;
};

// create a new request
export const createEmergencyRequest = async (
  userId: string,
  data: {
    bloodGroup: string;
    hospital: string;
    city: string;
    units: number;
    urgency: string;
  },
) => {
  return prisma.emergencyRequest.create({
    data: {
      bloodGroup: data.bloodGroup as any,
      hospital: data.hospital,
      city: data.city,
      units: data.units,
      urgency: data.urgency as any,
      postedBy: userId,
    },
  });
};

// mark emergency as resolved
export const resolveEmergencyRequest = async (id: string, userId: string) => {
  const request = await prisma.emergencyRequest.findUnique({
    where: { id },
  });
  if (!request) {
    throw new AppError("Emergency request not found", 404);
  }
  if (request.postedBy !== userId) {
    throw new AppError("Unauthorized", 403);
  }
  return prisma.emergencyRequest.update({
    where: { id },
    data: { resolved: true },
  });
};
// get emergency requests by a user
export const getMyEmergencyRequests = async (userId: string) => {
  return prisma.emergencyRequest.findMany({
    where: { postedBy: userId },
    orderBy: { createdAt: "desc" },
  });
};
// get emergency requests by blood group
export const getRequestsByBloodGroup = async (bloodGroup: string) => {
  return prisma.emergencyRequest.findMany({
    where: {
      bloodGroup: bloodGroup as any,
      resolved: false,
    },
    orderBy: { createdAt: "desc" },
  });
};
