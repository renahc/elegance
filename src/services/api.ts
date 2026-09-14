const rawBaseUrl = import.meta.env.VITE_API_URL || "/api/v1";
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
  // Services & Rates
  getServices: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/services`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Error al cargar servicios");
      return await res.json();
    } catch (e) {
      console.warn("Backend Spring Boot no disponible, utilizando fallback", e);
      return null;
    }
  },

  createService: async (serviceData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(serviceData),
      });
      if (!res.ok) throw new Error("Error al crear servicio");
      return await res.json();
    } catch (e) {
      console.error("Error al crear servicio:", e);
      return null;
    }
  },

  updateService: async (id: string, serviceData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(serviceData),
      });
      if (!res.ok) throw new Error("Error al actualizar servicio");
      return await res.json();
    } catch (e) {
      console.error("Error al actualizar servicio:", e);
      return null;
    }
  },

  getRates: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/rates`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Error al cargar tarifas");
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  createRate: async (rateData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/rates`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(rateData),
      });
      if (!res.ok) throw new Error("Error al crear tarifa");
      return await res.json();
    } catch (e) {
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
      console.warn("Backend Spring Boot no disponible, utilizando fallback", e);
      return null;
    }
  },

  createStylist: async (stylistData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/stylists`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(stylistData),
      });
      if (!res.ok) throw new Error("Error al crear estilista");
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Clients
  getClients: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/clients`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Error al cargar clientes");
      return await res.json();
    } catch (e) {
      console.warn("Backend Spring Boot no disponible, utilizando fallback", e);
      return null;
    }
  },

  createClient: async (clientData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/clients`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(clientData),
      });
      if (!res.ok) throw new Error("Error al crear cliente");
      return await res.json();
    } catch (e) {
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

  // Notifications
  getNotifications: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Error al cargar notificaciones");
      return await res.json();
    } catch (e) {
      return null;
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
