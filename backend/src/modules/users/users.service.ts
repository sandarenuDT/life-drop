import { prisma } from "../../config/database";
import { AppError } from "../../utils/AppError";

// Get all users
export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      bloodGroup: true,
      city: true,
      isEligible: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// Get single user by ID
export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      bloodGroup: true,
      city: true,
      isEligible: true,
      createdAt: true,
      donations: {
        orderBy: { donatedAt: "desc" },
        take: 5,
      },
      appointments: {
        include: {
          center: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });
  if (!user) throw new AppError("User not found", 404);
  return user;
};

// Delete user
export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError("User not found", 404);
  await prisma.user.delete({ where: { id } });
  return { message: "User deleted successfully" };
};

// Get admin dashboard stats
export const getAdminStats = async () => {
  const [
    totalUsers,
    totalDonors,
    totalStaff,
    totalEmergencyRequesters,
    totalCenters,
    totalDonations,
    totalEmergencies,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "DONOR" } }),
    prisma.user.count({ where: { role: "STAFF" } }),
    prisma.user.count({ where: { role: "EMERGENCY_REQUESTER" } }),
    prisma.donationCenter.count({ where: { isActive: true } }),
    prisma.donation.count(),
    prisma.emergencyRequest.count({ where: { resolved: false } }),
  ]);

  return {
    totalUsers,
    totalDonors,
    totalStaff,
    totalEmergencyRequesters,
    totalCenters,
    totalDonations,
    activeEmergencies: totalEmergencies,
  };
};
