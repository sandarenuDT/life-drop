import { api } from "./api";

export const donationsService = {
  // Book appointment
  bookAppointment: async (data: {
    centerId: string;
    date: string;
    timeSlot: string;
    type: string;
  }) => {
    const response = await api.post("/donations/book", data);
    return response.data;
  },

  // Get my appointments
  getMyAppointments: async () => {
    const response = await api.get("/donations/appointments");
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (id: string) => {
    const response = await api.put(`/donations/appointments/${id}/cancel`);
    return response.data;
  },

  // Get donation history
  getDonationHistory: async () => {
    const response = await api.get("/donations/history");
    return response.data;
  },

  // Get donation stats
  getDonationStats: async () => {
    const response = await api.get("/donations/stats");
    return response.data;
  },

  // for staff get all appointment s
  getAllAppointments: async () => {
    const response = await api.get("/donations/appoinments");
    return response.data;
  },

  getTodayAppointments: async () => {
    const response = await api.get("/donations/today");
    return response.data;
  },
  getAppointmentStats: async () => {
    const response = await api.get("/donations/appointments-stats");
    return response.data;
  },
  confirmAppointment: async (id: string) => {
    const response = await api.put(`/donations/appointments/${id}/confirm`);
    return response.data;
  },
  completeAppointment: async (id: string) => {
    const response = await api.put(`/donations/appointments/${id}/complete`);
    return response.data;
  },
};
