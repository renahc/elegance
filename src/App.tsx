import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useMsal } from "@azure/msal-react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { loginRequest } from "./config/msalConfig";
import { Sidebar, type TabType } from "./components/Sidebar";
import { Header } from "./components/Header";
import { OverviewTab } from "./components/tabs/OverviewTab";
import { AppointmentsTab } from "./components/tabs/AppointmentsTab";
import { ClientsTab } from "./components/tabs/ClientsTab";
import { StaffTab } from "./components/tabs/StaffTab";
import { ServicesTab } from "./components/tabs/ServicesTab";
import { AnalyticsTab } from "./components/tabs/AnalyticsTab";
import { MonitoringTab } from "./components/tabs/MonitoringTab";
import { NewAppointmentModal } from "./components/NewAppointmentModal";
import { LandingPage } from "./components/landing/LandingPage";
import { apiService, setTokenProvider } from "./services/api";
import type {
  Appointment,
  AppointmentStatus,
  Client,
  KpiMetric,
  NotificationItem,
  Service,
  Stylist,
  UserSession,
} from "./types/dashboard";

const serviceFromApi = (s: any): Service => ({
  ...s,
  price: Number(s.basePrice ?? s.price ?? 0),
  durationMinutes: Number(s.durationMinutes),
  active: s.active ?? true,
});
const stylistFromApi = (s: any): Stylist => ({
  ...s,
  rating: Number(s.rating ?? 0),
  reviewsCount: Number(s.reviewsCount ?? 0),
  completedTodayCount: Number(s.completedTodayCount ?? 0),
});
export function App() {
  const { instance, accounts } = useMsal();
  const account = instance.getActiveAccount() || accounts[0];
  const user = useMemo<UserSession | null>(
    () =>
      account
        ? {
            name: account.name || account.username,
            username: account.username,
            role: ((account.idTokenClaims?.roles || []) as string[]).includes(
              "Admin",
            )
              ? "Admin"
              : "Client",
          }
        : null,
    [account],
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const loadGeneration = useRef({ value: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [serviceId, setServiceId] = useState<string>();
  const [stylistId, setStylistId] = useState<string>();
  const tabs: TabType[] = [
    "overview",
    "appointments",
    "clients",
    "staff",
    "services",
    "analytics",
    "monitoring",
  ];
  const activeTab = tabs.includes(location.pathname.split("/")[2] as TabType)
    ? (location.pathname.split("/")[2] as TabType)
    : "overview";
  useEffect(() => {
    setTokenProvider(async () => {
      if (!account) return null;
      try {
        return (await instance.acquireTokenSilent({ ...loginRequest, account }))
          .accessToken;
      } catch {
        throw new Error(
          "No se pudo renovar tu sesión. Vuelve a iniciar sesión con Microsoft.",
        );
      }
    });
    return () => setTokenProvider(null);
  }, [instance, account]);
  const fail = useCallback(
    (e: unknown) =>
      setError(
        e instanceof Error ? e.message : "No se pudo completar la operación.",
      ),
    [],
  );
  const load = useCallback(async () => {
    const generation = ++loadGeneration.current.value;
    setLoading(true);
    setError("");
    try {
      const [sv, st] = await Promise.all([
        apiService.getServices(),
        apiService.getStylists(),
      ]);
      if (generation !== loadGeneration.current.value) return;
      setServices(sv.map(serviceFromApi));
      setStylists(st.map(stylistFromApi));
      if (user) {
        const [ap, cl] = await Promise.all([
          apiService.getAppointments(),
          user.role === "Admin"
            ? apiService.getClients()
            : apiService.getClientMe().then((c) => [c]),
        ]);
        if (generation !== loadGeneration.current.value) return;
        setAppointments(ap);
        setClients(cl);
        if (user.role === "Admin") {
          const results = await Promise.allSettled([
            apiService.getNotifications(),
            apiService.getAnalytics(),
          ]);
          if (generation !== loadGeneration.current.value) return;
          if (results[0].status === "fulfilled")
            setNotifications(results[0].value);
          if (results[1].status === "fulfilled") setMetrics(results[1].value);
          for (const result of results)
            if (result.status === "rejected") fail(result.reason);
        }
      } else {
        setAppointments([]);
        setClients([]);
        setNotifications([]);
        setMetrics(null);
      }
    } catch (e) {
      if (generation === loadGeneration.current.value) fail(e);
    } finally {
      if (generation === loadGeneration.current.value) setLoading(false);
    }
  }, [user, fail]);
  useEffect(() => {
    const counter = loadGeneration.current;
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) return load();
    });
    return () => {
      cancelled = true;
      counter.value++;
    };
  }, [load]);
  useEffect(() => {
    if (user?.role !== "Admin") return;
    const timer = window.setInterval(() => {
      Promise.all([apiService.getAnalytics(), apiService.getNotifications()])
        .then(([m, n]) => {
          setMetrics(m);
          setNotifications(n);
        })
        .catch(fail);
    }, 10000);
    return () => window.clearInterval(timer);
  }, [user, fail]);
  const openAppointment = (service?: string, stylist?: string) => {
    if (!user) {
      void instance.loginRedirect(loginRequest);
      return;
    }
    setServiceId(service);
    setStylistId(stylist);
    setOpen(true);
  };
  const mutate = async (action: () => Promise<unknown>) => {
    setError("");
    try {
      await action();
      return true;
    } catch (e) {
      fail(e);
      return false;
    }
  };
  const addAppointment = (data: Omit<Appointment, "id">) =>
    mutate(async () => {
      const saved = await apiService.createAppointment(data);
      setAppointments((prev) => [saved, ...prev]);
    });
  const changeStatus = (id: string, status: AppointmentStatus) =>
    mutate(async () => {
      const saved = await apiService.updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? saved : a)));
    });
  const addClient = (data: Omit<Client, "id">) =>
    mutate(async () => {
      const saved = await apiService.createClient(data);
      setClients((prev) => [saved, ...prev]);
    });
  const deleteClient = (id: string) =>
    mutate(async () => {
      await apiService.deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    });
  const addStylist = (data: Omit<Stylist, "id">) =>
    mutate(async () => {
      const saved = await apiService.createStylist(data);
      setStylists((prev) => [stylistFromApi(saved), ...prev]);
    });
  const deleteStylist = (id: string) =>
    mutate(async () => {
      await apiService.deleteStylist(id);
      setStylists((prev) => prev.filter((s) => s.id !== id));
    });
  const toggleStylist = (id: string) =>
    mutate(async () => {
      const s = stylists.find((s) => s.id === id)!;
      const saved = await apiService.updateStylist(id, {
        ...s,
        isAvailable: !s.isAvailable,
      });
      setStylists((prev) =>
        prev.map((s) => (s.id === id ? stylistFromApi(saved) : s)),
      );
    });
  const addService = (data: Omit<Service, "id">) =>
    mutate(async () => {
      const saved = await apiService.createService({
        ...data,
        basePrice: data.price,
      });
      setServices((prev) => [serviceFromApi(saved), ...prev]);
    });
  const deleteService = (id: string) =>
    mutate(async () => {
      await apiService.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    });
  const toggleService = (id: string) =>
    mutate(async () => {
      const s = services.find((s) => s.id === id)!;
      const saved = await apiService.updateService(id, {
        ...s,
        basePrice: s.price,
        active: !s.active,
      });
      setServices((prev) =>
        prev.map((s) => (s.id === id ? serviceFromApi(saved) : s)),
      );
    });
  const login = () => {
    instance.loginRedirect(loginRequest).catch(fail);
  };
  const logout = () => {
    setOpen(false);
    instance
      .logoutRedirect({ postLogoutRedirectUri: window.location.origin })
      .catch(fail);
  };
  const kpis: KpiMetric[] = metrics
    ? [
        {
          id: "appointments",
          title: "Reservas registradas",
          value: String(metrics.appointments),
          change: "",
          isPositive: true,
          period: "Eventos procesados",
          iconName: "Calendar",
        },
        {
          id: "completed",
          title: "Servicios realizados",
          value: String(metrics.completedServices),
          change: "",
          isPositive: true,
          period: "Eventos procesados",
          iconName: "CheckCircle",
        },
        {
          id: "value",
          title: "Valor de servicios realizados",
          value: new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
          }).format(metrics.serviceValue),
          change: "",
          isPositive: true,
          period: "No representa pagos cobrados",
          iconName: "DollarSign",
        },
      ]
    : [];
  return (
    <>
      {error && (
        <div
          role="alert"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2000,
            padding: 16,
            background: "#fff0ef",
            color: "#8b2520",
          }}
        >
          {error} <button onClick={() => void load()}>Reintentar</button>
          <button onClick={() => setError("")}>Cerrar</button>
        </div>
      )}
      {loading && (
        <div role="status" style={{ padding: 8, textAlign: "center" }}>
          Cargando datos del salón…
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <LandingPage
                services={services}
                stylists={stylists}
                onOpenNewAppointment={openAppointment}
                onSwitchToDashboard={() => navigate("/dashboard/overview")}
                user={user}
                onLogin={login}
                onLogout={logout}
                notifications={notifications}
              />
              {user?.role === "Client" && (
                <section style={{ padding: 32 }}>
                  <h2>Mis reservas</h2>
                  {appointments.length === 0 ? (
                    <p>Aún no tienes reservas.</p>
                  ) : (
                    appointments.map((a) => (
                      <div key={a.id} style={{ padding: 12 }}>
                        {a.date} {a.time} · {a.serviceName} · {a.status}
                        {a.status === "confirmada" && (
                          <button
                            onClick={() => void changeStatus(a.id, "cancelada")}
                          >
                            Cancelar reserva
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </section>
              )}
            </>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            user?.role === "Admin" ? (
              <div className="dashboard-layout">
                <Sidebar
                  activeTab={activeTab}
                  setActiveTab={(t) => navigate(`/dashboard/${t}`)}
                  appointmentsCount={appointments.length}
                  onSwitchToLanding={() => navigate("/")}
                />
                <div className="main-wrapper">
                  <Header
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onOpenNewAppointment={() => openAppointment()}
                    notifications={notifications}
                    user={user}
                    onLogin={login}
                    onLogout={logout}
                  />
                  <main className="content-body">
                    {activeTab === "overview" && (
                      <OverviewTab
                        kpis={kpis}
                        appointments={appointments}
                        services={services}
                        stylists={stylists}
                        onNavigateToAppointments={() =>
                          navigate("/dashboard/appointments")
                        }
                        onOpenNewAppointment={() => openAppointment()}
                        onChangeStatus={changeStatus}
                      />
                    )}
                    {activeTab === "appointments" && (
                      <AppointmentsTab
                        appointments={appointments}
                        onChangeStatus={changeStatus}
                        onOpenNewAppointment={() => openAppointment()}
                        searchQuery={searchQuery}
                      />
                    )}
                    {activeTab === "clients" && (
                      <ClientsTab
                        clients={clients}
                        searchQuery={searchQuery}
                        onAddClient={addClient}
                        onDeleteClient={deleteClient}
                      />
                    )}
                    {activeTab === "staff" && (
                      <StaffTab
                        stylists={stylists}
                        onToggleAvailability={toggleStylist}
                        onAddStylist={addStylist}
                        onDeleteStylist={deleteStylist}
                      />
                    )}
                    {activeTab === "services" && (
                      <ServicesTab
                        services={services}
                        onToggleActive={toggleService}
                        onAddService={addService}
                        onDeleteService={deleteService}
                        searchQuery={searchQuery}
                      />
                    )}
                    {activeTab === "analytics" && (
                      <AnalyticsTab metrics={metrics} />
                    )}
                    {activeTab === "monitoring" && <MonitoringTab />}
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {isOpen && (
        <NewAppointmentModal
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          onAddAppointment={addAppointment}
          clients={clients}
          services={services.filter((s) => s.active)}
          stylists={stylists.filter((s) => s.isAvailable)}
          initialServiceId={serviceId}
          initialStylistId={stylistId}
        />
      )}
    </>
  );
}
export default App;
