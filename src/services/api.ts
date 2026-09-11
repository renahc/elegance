const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
const API_BASE_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;


let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const getHeaders = (): HeadersInit => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  return headers;
};

export const apiService = {
  // Services
  getServices: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/services`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Error al cargar servicios");
      return await res.json();
    } catch (e) {
      console.warn("Backend Spring Boot no disponible, usando estado local", e);
      return null;
    }
  },

  // Stylists
  getStylists: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/stylists`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Error al cargar estilistas");
      return await res.json();
    } catch (e) {
      console.warn("Backend Spring Boot no disponible, usando estado local", e);
      return null;
    }
  },

  // Appointments
  getAppointments: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Error al cargar citas");
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  createAppointment: async (appointmentData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(appointmentData),
      });
      if (!res.ok) throw new Error("Error al crear cita");
      return await res.json();
    } catch (e) {
      console.error("Error al persistir cita en Spring Boot:", e);
      return null;
    }
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/appointments/${id}/status?status=${status}`,
        {
          method: "PUT",
          headers: getHeaders(),
        },
      );
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // Auth User Info from Azure AD
  getAuthUserInfo: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },
};
