import { prisma } from "../../config/database";
import { AppError } from "../../utils/AppError";

// Book a donation appointment
export const bookAppointment = async (
  userId: string,
  data: {
    centerId: string;
    date: string;
    timeSlot: string;
    type: string;
  },
) => {
  // Check center exists
  const center = await prisma.donationCenter.findUnique({
    where: { id: data.centerId },
  });
  if (!center) {
    throw new AppError("Donation center not found", 404);
  }

  // Check user is eligible
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (!user.isEligible) {
    throw new AppError(
      "You are not eligible to donate at this time. Please wait for the required period.",
      400,
    );
  }

  // Check slot is not already booked by this user on same date
  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      userId,
      date: new Date(data.date),
      status: { not: "CANCELLED" },
    },
  });
  if (existingAppointment) {
    throw new AppError("You already have an appointment on this date", 400);
  }

  // Check center has available slots
  const bookedCount = await prisma.appointment.count({
    where: {
      centerId: data.centerId,
      date: new Date(data.date),
      timeSlot: data.timeSlot,
      status: { not: "CANCELLED" },
    },
  });
  if (bookedCount >= center.slots) {
    throw new AppError(
      "No available slots at this time. Please choose another time.",
      400,
    );
  }

  // Create appointment
  const appointment = await prisma.appointment.create({
    data: {
      userId,
      centerId: data.centerId,
      date: new Date(data.date),
      timeSlot: data.timeSlot,
      type: data.type as any,
      status: "PENDING",
    },
    include: {
      center: {
        select: {
          name: true,
          address: true,
          phone: true,
        },
      },
    },
  });

  return appointment;
};

// Get all appointments for a user
export const getUserAppointments = async (userId: string) => {
  return prisma.appointment.findMany({
    where: { userId },
    include: {
      center: {
        select: {
          name: true,
          address: true,
          phone: true,
          hours: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });
};

// Get single appointment
export const getAppointmentById = async (id: string, userId: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      center: {
        select: {
          name: true,
          address: true,
          phone: true,
          hours: true,
        },
      },
    },
  });

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  // Make sure user can only see their own appointments
  if (appointment.userId !== userId) {
    throw new AppError("Not authorized", 403);
  }

  return appointment;
};

// Cancel an appointment
export const cancelAppointment = async (id: string, userId: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
  });

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  if (appointment.userId !== userId) {
    throw new AppError("Not authorized", 403);
  }

  if (appointment.status === "COMPLETED") {
    throw new AppError("Cannot cancel a completed appointment", 400);
  }

  return prisma.appointment.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
};

// Get donation history for a user
export const getDonationHistory = async (userId: string) => {
  return prisma.donation.findMany({
    where: { userId },
    orderBy: { donatedAt: "desc" },
  });
};

// Get donation stats for a user
export const getDonationStats = async (userId: string) => {
  const totalDonations = await prisma.donation.count({
    where: { userId },
  });

  const lastDonation = await prisma.donation.findFirst({
    where: { userId },
    orderBy: { donatedAt: "desc" },
  });

  // Calculate next eligible date
  // Whole blood — 56 days
  // Platelets — 7 days
  // Plasma — 28 days
  let nextEligibleDate = null;
  if (lastDonation) {
    const days =
      lastDonation.type === "WHOLE_BLOOD"
        ? 56
        : lastDonation.type === "PLATELETS"
          ? 7
          : lastDonation.type === "PLASMA"
            ? 28
            : 56;

    nextEligibleDate = new Date(lastDonation.donatedAt);
    nextEligibleDate.setDate(nextEligibleDate.getDate() + days);
  }

  return {
    totalDonations,
    livesSaved: totalDonations * 3,
    lastDonation: lastDonation?.donatedAt || null,
    nextEligibleDate,
    isEligible: nextEligibleDate ? new Date() >= nextEligibleDate : true,
  };
};

// get all appointments for staff
export const getAllAppointments = async () => {
  return prisma.appointment.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          bloodGroup: true,
          city: true,
        },
      },
      center: {
        select: {
          name: true,
          address: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });
};

//confirm appoinments
export const confirmAppointment = async (id: string) => {
  const appoinment = await prisma.appointment.findUnique({
    where: { id },
  });
  if (!appoinment) {
    throw new AppError("Appointment not found", 404);
  }
  return prisma.appointment.update({
    where: { id },
    data: { status: "CONFIRMED" },
    include: {
      user: {
        select: {
          name: true,
          phone: true,
        },
      },
      center: {
        select: {
          name: true,
        },
      }
    }
  })
}

// Complete a donation — Staff only
export const completeAppointment = async (id: string) => {
  const appointment = await prisma.appointment.findUnique({
    where:   { id },
    include: { user: true }
  })
  if (!appointment) throw new AppError('Appointment not found', 404)
  if (appointment.status === 'CANCELLED') {
    throw new AppError('Cannot complete a cancelled appointment', 400)
  }

  // Update appointment status
  const updated = await prisma.appointment.update({
    where: { id },
    data:  { status: 'COMPLETED' },
    include: {
      user:   { select: { name: true, phone: true } },
      center: { select: { name: true } }
    }
  })

  // Create a donation record
  await prisma.donation.create({
    data: {
      userId:     appointment.userId,
      centerName: updated.center.name,
      type:       appointment.type,
    }
  })

  // Update user's lastDonation date and isEligible
  await prisma.user.update({
    where: { id: appointment.userId },
    data: {
      lastDonation: new Date(),
      isEligible:   false,
    }
  })

  return updated
}

// Get today's appointments
export const getTodayAppointments = async () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return prisma.appointment.findMany({
    where: {
      date: {
        gte: today,
        lt:  tomorrow,
      }
    },
    include: {
      user: {
        select: {
          name:       true,
          phone:      true,
          bloodGroup: true,
        }
      },
      center: {
        select: {
          name:    true,
          address: true,
        }
      }
    },
    orderBy: { timeSlot: 'asc' }
  })
}

// Get appointment stats for staff dashboard
export const getAppointmentStats = async () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [
    todayTotal,
    todayPending,
    todayConfirmed,
    todayCompleted,
    totalAllTime,
  ] = await Promise.all([
    prisma.appointment.count({
      where: { date: { gte: today, lt: tomorrow } }
    }),
    prisma.appointment.count({
      where: { date: { gte: today, lt: tomorrow }, status: 'PENDING' }
    }),
    prisma.appointment.count({
      where: { date: { gte: today, lt: tomorrow }, status: 'CONFIRMED' }
    }),
    prisma.appointment.count({
      where: { date: { gte: today, lt: tomorrow }, status: 'COMPLETED' }
    }),
    prisma.donation.count(),
  ])

  return {
    todayTotal,
    todayPending,
    todayConfirmed,
    todayCompleted,
    totalAllTime,
  }
}