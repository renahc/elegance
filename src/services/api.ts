// ============================================================================
// Configuración de la URL Base
// ============================================================================
const resolveBaseUrl = (): string => {
  // 1. Obtener la URL base (ej: https://3h4hyo5enk.execute-api.us-east-1.amazonaws.com)
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "https://3h4hyo5enk.execute-api.us-east-1.amazonaws.com";
  
  // 2. Obtener el prefijo de la ruta (ej: /api/v1)
  const apiPath = import.meta.env.VITE_API_URL?.trim() || "/api/v1";

  // 3. Limpiar barras para evitar duplicados (ej: ...com//api/v1)
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanApiPath = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;

  // 4. Combinar: https://...amazonaws.com + /api/v1
  return `${cleanBaseUrl}${cleanApiPath}`;
};

const API_BASE_URL = resolveBaseUrl();

// Log de depuración: verifica en la consola del navegador que esta URL sea la correcta
console.log("🚀 API_BASE_URL configurada como:", API_BASE_URL);

// ============================================================================
// Configuración de Autenticación y Headers
// ============================================================================
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

// ============================================================================
// Servicios de la API
// ============================================================================
export const apiService = {
  // --------------------------------------------------------------------------
  // Services & Rates
  // --------------------------------------------------------------------------
  getServices: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/services`, { headers: getHeaders() });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Error al cargar servicios:", e);
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
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Error al crear servicio:", e);
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
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Error al actualizar servicio:", e);
      return null;
    }
  },

  deleteService: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return true;
    } catch (e) {
      console.error("❌ Error al eliminar servicio:", e);
      return false;
    }
  },

  getRates: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/rates`, { headers: getHeaders() });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Error al cargar tarifas:", e);
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
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Error al crear tarifa:", e);
      return null;
    }
  },

  deleteRate: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/rates/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return true;
    } catch (e) {
      console.error("❌ Error al eliminar tarifa:", e);
      return false;
    }
  },

  // --------------------------------------------------------------------------
  // Stylists
  // --------------------------------------------------------------------------
  getStylists: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/stylists`, { headers: getHeaders() });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Error al cargar estilistas:", e);
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
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Error al crear estilista:", e);
      return null;
    }
  },

  updateStylist: async (id: string, stylistData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/stylists/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(stylistData),
      });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Error al actualizar estilista:", e);
      return null;
    }
  },

  deleteStylist: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/stylists/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return true;
    } catch (e) {
      console.error("❌ Error al eliminar estilista:", e);
      return false;
    }
  },

  // --------------------------------------------------------------------------
  // Clients
  // --------------------------------------------------------------------------
  getClients: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/clients`, { headers: getHeaders() });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Error al cargar clientes:", e);
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
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Error al crear cliente:", e);
      return null;
    }
  },

  updateClient: async (id: string, clientData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(clientData),
      });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Error al actualizar cliente:", e);
      return null;
    }
  },

  deleteClient: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return true;
    } catch (e) {
      console.error("❌ Error al eliminar cliente:", e);
      return false;
    }
  },

  // --------------------------------------------------------------------------
  // Appointments
  // --------------------------------------------------------------------------
  getAppointments: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments`, { headers: getHeaders() });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Error al cargar citas:", e);
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
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Error al crear cita:", e);
      return null;
    }
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}/status?status=${status}`, {
        method: "PUT",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return true;
    } catch (e) {
      console.error("❌ Error al actualizar estado de cita:", e);
      return false;
    }
  },

  // --------------------------------------------------------------------------
  // Notifications
  // --------------------------------------------------------------------------
  getNotifications: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications`, { headers: getHeaders() });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Error al cargar notificaciones:", e);
      return null;
    }
  },

  // --------------------------------------------------------------------------
  // Auth User Info from Azure AD
  // --------------------------------------------------------------------------
  getAuthUserInfo: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, { headers: getHeaders() });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error("❌ Error al obtener información de usuario:", e);
      return null;
    }
  },
};