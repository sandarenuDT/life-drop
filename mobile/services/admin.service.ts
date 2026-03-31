import { api } from "./api"; // adjust the import path as needed

export const adminService = {
  //dashboard stats
  getStats: async () => {
    const response = await api.get("/users/stats");
    return response.data;
  },
  //Users
  getAllUSers: async () => {
    const response = await api.get("/users");
    return response.data;
  },
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  //centers
  addCenter: async (data: {
    name: string;
    address: string;
    phone: string;
    hours: string;
    type: "HOSPITAL" | "BANK" | "NGO" | "CLINIC";
    latitude: number;
    longitude: number;
    slots: number;
  }) => {
    const response = await api.post("/centers", data);
    return response.data;
  },
  deleteCenter: async (id: string) => {
    const response = await api.delete(`/centers/${id}`);
    return response.data;
  },
  // getAllCenters: async() => {
  //     const response=api.get('/centers')
  //     return response.data
  // }
  updateCenter: async (
    id: string,
    data: {
      name?: string;
      address?: string;
      phone?: string;
      hours?: string;
      type?: "HOSPITAL" | "BANK" | "NGO" | "CLINIC";
      latitude?: number;
      longitude?: number;
      slots?: number;
    },
  ) => {
    const response = await api.put(`/centers/${id}`, data);
    return response.data;
  },

  //emergency requests
  getALllEmergencyRequests: async () => {
    const response = await api.get("/emergency");
    return response.data;
  },

  resolveEmergencyRequest: async (id: string) => {
    const response = await api.post(`/emergency/${id}/resolve`);
    return response.data;
  },

  //appoinments
  getAllAppointments: async () => {
    const response = await api.get("/appointments");
    return response.data;
  },
  confirmAppointment: async (id: string) => {
    const response = await api.post(`/donations/appointments/${id}/confirm`);
    return response.data;
  },

  cancelAppoinment: async (id: string) => {
    const response = await api.post(`/donations/appointments/${id}/cancel`);
    return response.data;
  },
};
