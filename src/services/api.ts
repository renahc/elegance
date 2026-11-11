const configured =
  import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "") || "/api/v1";
const base =
  configured.startsWith("http") && !configured.includes("/api/v1")
    ? `${configured}/api/v1`
    : configured;
let tokenProvider: (() => Promise<string | null>) | null = null;
export const setTokenProvider = (
  provider: (() => Promise<string | null>) | null,
) => {
  tokenProvider = provider;
};
export async function request<T = any>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  const token = await tokenProvider?.();
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message ||
        (res.status === 401
          ? "Tu sesión expiró. Inicia sesión nuevamente."
          : res.status === 403
            ? "No tienes permisos para esta operación."
            : `No se pudo completar la operación (${res.status}).`),
    );
  }
  return res.status === 204 ? (undefined as T) : await res.json();
}
const del = async (path: string) => {
  await request(path, "DELETE");
  return true;
};
export const apiService = {
  getServices: () => request("/services"),
  createService: (data: unknown) => request("/services", "POST", data),
  updateService: (id: string, data: unknown) =>
    request(`/services/${id}`, "PUT", data),
  deleteService: (id: string) => del(`/services/${id}`),
  getStylists: () => request("/stylists"),
  createStylist: (data: unknown) => request("/stylists", "POST", data),
  updateStylist: (id: string, data: unknown) =>
    request(`/stylists/${id}`, "PUT", data),
  deleteStylist: (id: string) => del(`/stylists/${id}`),
  getClients: () => request("/clients"),
  getClientMe: () => request("/clients/me"),
  createClient: (data: unknown) => request("/clients", "POST", data),
  updateClient: (id: string, data: unknown) =>
    request(`/clients/${id}`, "PUT", data),
  deleteClient: (id: string) => del(`/clients/${id}`),
  getAppointments: () => request("/appointments"),
  createAppointment: (data: unknown) => request("/appointments", "POST", data),
  updateAppointmentStatus: (id: string, status: string) =>
    request(
      `/appointments/${id}/status?status=${encodeURIComponent(status)}`,
      "PUT",
    ),
  getNotifications: () => request("/notifications"),
  getAnalytics: () => request("/analytics"),
  getAudit: () => request("/audit"),
  getTopics: () => request<string[]>("/admin/kafka/topics"),
  getGroups: () => request<any[]>("/admin/kafka/groups"),
  getOffsets: (group: string) =>
    request<any[]>(`/admin/kafka/groups/${encodeURIComponent(group)}/offsets`),
};
