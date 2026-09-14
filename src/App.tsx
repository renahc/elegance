import { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { loginRequest } from "./config/msalConfig";
import { Sidebar } from "./components/Sidebar";
import type { TabType } from "./components/Sidebar";
import { Header } from "./components/Header";
import { OverviewTab } from "./components/tabs/OverviewTab";
import { AppointmentsTab } from "./components/tabs/AppointmentsTab";
import { ClientsTab } from "./components/tabs/ClientsTab";
import { StaffTab } from "./components/tabs/StaffTab";
import { ServicesTab } from "./components/tabs/ServicesTab";
import { AnalyticsTab } from "./components/tabs/AnalyticsTab";
import { NewAppointmentModal } from "./components/NewAppointmentModal";
import { LandingPage } from "./components/landing/LandingPage";
import { apiService, setAuthToken } from "./services/api";

import {
  INITIAL_APPOINTMENTS,
  INITIAL_CLIENTS,
  INITIAL_KPIS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SERVICES,
  INITIAL_STYLISTS,
} from "./data/mockData";
import type { Appointment, AppointmentStatus, Client, Service, ServiceCategory, Stylist, UserRole, UserSession } from "./types/dashboard";

export function App() {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = sessionStorage.getItem('azure_ad_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return null;
  });

  // Sync MSAL active account & handle redirect promise
  useEffect(() => {
    const resolveRole = (account: any): UserRole => {
      const claims = (account?.idTokenClaims as any) || {};
      const roles: string[] = claims.roles || [];
      const username = (account?.username || '').toLowerCase();
      if (
        roles.some((r: string) => r.toLowerCase() === 'admin') ||
        username.includes('admin') ||
        username.includes('renato') ||
        username.includes('ga.hernandezl@duocuc.cl')
      ) {
        return 'Admin';
      }
      return 'Client';
    };

    const syncUserToBackendClients = async (account: any) => {
      const email = account.username || account.name;
      if (!email) return;

      const exists = clients.some(c => c.email.toLowerCase() === email.toLowerCase());
      if (!exists) {
        const name = account.name || account.username || 'Usuario Microsoft';
        const newClientData = {
          name,
          email,
          phone: '+56 9 8765 4321',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          totalVisits: 1,
          totalSpent: 0,
          lastVisit: 'Hoy',
          tier: 'VIP',
          notes: 'Registrado vía Microsoft Entra ID',
        };
        const created = await apiService.createClient(newClientData);
        const mappedClient: Client = created ? {
          id: created.id,
          name: created.name,
          email: created.email,
          phone: created.phone || '+56 9 8765 4321',
          avatar: created.avatar || newClientData.avatar,
          totalVisits: Number(created.totalVisits || 1),
          totalSpent: Number(created.totalSpent || 0),
          lastVisit: created.lastVisit || 'Hoy',
          tier: (created.tier || 'VIP') as any,
          notes: created.notes || 'Registrado vía Microsoft Entra ID',
        } : {
          ...newClientData,
          id: `cli-ms-${Date.now()}`,
          tier: 'VIP' as any
        };
        setClients(prev => {
          if (prev.some(c => c.email.toLowerCase() === email.toLowerCase())) return prev;
          return [mappedClient, ...prev];
        });
      }
    };

    instance.handleRedirectPromise().then((response) => {
      if (response && response.account) {
        instance.setActiveAccount(response.account);
        const userRole = resolveRole(response.account);

        const userObj: UserSession = {
          name: response.account.name || response.account.username,
          username: response.account.username,
          role: userRole,
        };
        setCurrentUser(userObj);
        sessionStorage.setItem('azure_ad_user', JSON.stringify(userObj));
        if (response.accessToken) {
          setAuthToken(response.accessToken);
        }
        syncUserToBackendClients(response.account);
      }
    }).catch((err) => {
      console.warn('MSAL handleRedirectPromise error:', err);
    });

    const active = instance.getActiveAccount() || accounts[0];
    if (active) {
      const userRole = resolveRole(active);

      const userObj: UserSession = {
        name: active.name || active.username,
        username: active.username,
        role: userRole,
      };
      setCurrentUser(userObj);
      sessionStorage.setItem('azure_ad_user', JSON.stringify(userObj));
      syncUserToBackendClients(active);
    }
  }, [accounts, instance, clients]);

  const clearStaleInteractionStatus = () => {
    try {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.includes('interaction.status')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (e) {
      // ignore
    }
  };

  const handleLogin = async () => {
    clearStaleInteractionStatus();

    try {
      await instance.loginRedirect(loginRequest);
    } catch (error: any) {
      console.warn('MSAL loginRedirect error:', error);
      clearStaleInteractionStatus();
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.clear();
    localStorage.clear();
    setAuthToken(null);

    try {
      instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin,
      });
    } catch (e) {
      console.warn('MSAL logoutRedirect:', e);
    }
  };

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);

  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>();
  const [preselectedStylistId, setPreselectedStylistId] = useState<string | undefined>();

  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [stylists, setStylists] = useState<Stylist[]>(INITIAL_STYLISTS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [kpis] = useState(INITIAL_KPIS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Sync activeTab from URL pathname
  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) {
      const parts = location.pathname.split("/").filter(Boolean);
      if (parts.length > 1 && ["overview", "appointments", "clients", "staff", "services", "analytics"].includes(parts[1])) {
        setActiveTab(parts[1] as TabType);
      } else {
        setActiveTab("overview");
      }
    }
  }, [location.pathname]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    navigate(`/dashboard/${tab}`);
  };

  // Load data from Spring Boot REST APIs and sync with Backend Microservices
  useEffect(() => {
    async function loadBackendData() {
      // 1. Services Microservice (Port 8084)
      const liveServices = await apiService.getServices();
      if (Array.isArray(liveServices) && liveServices.length > 0) {
        const mappedServices: Service[] = liveServices.map((s: any) => ({
          id: s.id,
          name: s.name,
          category: (s.category || "cabello") as ServiceCategory,
          price: Number(s.basePrice || s.price || 25000),
          durationMinutes: Number(s.durationMinutes || 60),
          popular: true,
          active: s.active ?? true,
        }));
        setServices(mappedServices);
      } else if (Array.isArray(liveServices) && liveServices.length === 0) {
        // Seed initial services to backend if DB is empty
        for (const s of INITIAL_SERVICES) {
          await apiService.createService({
            name: s.name,
            description: `Servicio profesional de ${s.category}`,
            category: s.category,
            durationMinutes: s.durationMinutes,
            basePrice: s.price,
            imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
          });
        }
        setServices(INITIAL_SERVICES);
      }

      // 2. Stylists (User Microservice - Port 8082)
      const liveStylists = await apiService.getStylists();
      if (Array.isArray(liveStylists) && liveStylists.length > 0) {
        const mappedStylists: Stylist[] = liveStylists.map((st: any) => ({
          id: st.id,
          name: st.name,
          role: st.role || "Estilista Master",
          specialty: st.specialty || "Estilismo & Color",
          avatar: st.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
          rating: Number(st.rating || 4.9),
          reviewsCount: Number(st.reviewsCount || 120),
          isAvailable: st.isAvailable ?? true,
          shift: st.shift || "09:00 - 18:00",
          completedTodayCount: Number(st.completedTodayCount || 4),
        }));
        setStylists(mappedStylists);
      } else if (Array.isArray(liveStylists) && liveStylists.length === 0) {
        for (const st of INITIAL_STYLISTS) {
          await apiService.createStylist({
            name: st.name,
            role: st.role,
            specialty: st.specialty,
            avatar: st.avatar,
            rating: st.rating,
            reviewsCount: st.reviewsCount,
            shift: st.shift,
            isAvailable: st.isAvailable,
          });
        }
        setStylists(INITIAL_STYLISTS);
      }

      // 3. Clients (User Microservice - Port 8082)
      const liveClients = await apiService.getClients();
      if (Array.isArray(liveClients) && liveClients.length > 0) {
        const mappedClients: Client[] = liveClients.map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email || "cliente@elegance.cl",
          phone: c.phone || "+56 9 1234 5678",
          avatar: c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
          totalVisits: Number(c.totalVisits || 1),
          totalSpent: Number(c.totalSpent || 45000),
          lastVisit: c.lastVisit || "Hoy",
          tier: (c.tier || "Regular") as any,
          notes: c.notes || "",
        }));
        setClients(mappedClients);
      } else if (Array.isArray(liveClients) && liveClients.length === 0) {
        for (const c of INITIAL_CLIENTS) {
          await apiService.createClient({
            name: c.name,
            email: c.email,
            phone: c.phone,
            avatar: c.avatar,
            totalVisits: c.totalVisits,
            totalSpent: c.totalSpent,
            lastVisit: c.lastVisit,
            tier: c.tier,
            notes: c.notes,
          });
        }
        setClients(INITIAL_CLIENTS);
      }

      // 4. Appointments (Appointment Microservice - Port 8081)
      const liveAppointments = await apiService.getAppointments();
      if (Array.isArray(liveAppointments) && liveAppointments.length > 0) {
        const mappedAppointments: Appointment[] = liveAppointments.map((a: any) => ({
          id: a.id,
          clientId: a.clientId,
          clientName: a.clientName,
          clientAvatar: a.clientAvatar,
          serviceId: a.serviceId,
          serviceName: a.serviceName,
          serviceCategory: (a.serviceCategory || "cabello") as ServiceCategory,
          stylistId: a.stylistId,
          stylistName: a.stylistName,
          date: a.date,
          time: a.time,
          durationMinutes: Number(a.durationMinutes || 60),
          price: Number(a.price || 35000),
          status: a.status as AppointmentStatus,
          notes: a.notes,
        }));
        setAppointments(mappedAppointments);
      } else if (Array.isArray(liveAppointments) && liveAppointments.length === 0) {
        for (const apt of INITIAL_APPOINTMENTS) {
          await apiService.createAppointment({
            clientId: apt.clientId,
            clientName: apt.clientName,
            clientAvatar: apt.clientAvatar,
            serviceId: apt.serviceId,
            serviceName: apt.serviceName,
            serviceCategory: apt.serviceCategory,
            stylistId: apt.stylistId,
            stylistName: apt.stylistName,
            date: apt.date,
            time: apt.time,
            durationMinutes: apt.durationMinutes,
            price: apt.price,
            notes: apt.notes,
          });
        }
        setAppointments(INITIAL_APPOINTMENTS);
      }

      // 5. Notifications (Notification Microservice - Port 8083)
      const liveNotifs = await apiService.getNotifications();
      if (Array.isArray(liveNotifs) && liveNotifs.length > 0) {
        setNotifications(liveNotifs);
      }
    }

    loadBackendData();
  }, []);

  // Open modal with optional preselected items
  const handleOpenNewAppointment = (serviceId?: string, stylistId?: string) => {
    setPreselectedServiceId(serviceId);
    setPreselectedStylistId(stylistId);
    setIsNewAppointmentOpen(true);
  };

  // Handlers for Backend API Mutating Operations
  const handleAddAppointment = async (newAptData: Omit<Appointment, "id">) => {
    const persisted = await apiService.createAppointment(newAptData);

    const newAppointment: Appointment = persisted
      ? {
          id: persisted.id,
          clientId: persisted.clientId,
          clientName: persisted.clientName,
          clientAvatar: persisted.clientAvatar,
          serviceId: persisted.serviceId,
          serviceName: persisted.serviceName,
          serviceCategory: (persisted.serviceCategory || "cabello") as ServiceCategory,
          stylistId: persisted.stylistId,
          stylistName: persisted.stylistName,
          date: persisted.date,
          time: persisted.time,
          durationMinutes: Number(persisted.durationMinutes || 60),
          price: Number(persisted.price || 35000),
          status: persisted.status as AppointmentStatus,
          notes: persisted.notes,
        }
      : {
          ...newAptData,
          id: `apt-${Date.now()}`,
        };

    setAppointments([newAppointment, ...appointments]);

    setNotifications([
      {
        id: `notif-${Date.now()}`,
        title: "Cita Agendada Exitosamente",
        message: `${newAppointment.clientName} para ${newAppointment.serviceName} a las ${newAppointment.time}`,
        time: "Justo ahora",
        read: false,
        type: "appointment",
      },
      ...notifications,
    ]);
  };

  const handleChangeAppointmentStatus = async (id: string, newStatus: AppointmentStatus) => {
    await apiService.updateAppointmentStatus(id, newStatus);
    const target = appointments.find((a) => a.id === id);
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );

    if (target) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: "Estado de Cita Actualizado",
          message: `La cita de ${target.clientName} ha cambiado a: ${newStatus.replace('_', ' ')}`,
          time: "Justo ahora",
          read: false,
          type: "appointment",
        },
        ...prev,
      ]);
    }
  };

  const handleToggleStylistAvailability = async (id: string) => {
    const target = stylists.find((st) => st.id === id);
    if (target) {
      const newAvail = !target.isAvailable;
      await apiService.updateStylist(id, {
        name: target.name,
        role: target.role,
        specialty: target.specialty,
        avatar: target.avatar,
        rating: target.rating,
        reviewsCount: target.reviewsCount,
        shift: target.shift,
        isAvailable: newAvail,
      });
    }

    setStylists((prev) =>
      prev.map((st) =>
        st.id === id ? { ...st, isAvailable: !st.isAvailable } : st
      )
    );
  };

  const handleCreateStylist = async (stylistData: Omit<Stylist, "id">) => {
    const created = await apiService.createStylist(stylistData);
    const newStylist: Stylist = created
      ? {
          id: created.id,
          name: created.name,
          role: created.role,
          specialty: created.specialty,
          avatar: created.avatar || stylistData.avatar,
          rating: Number(created.rating || 5.0),
          reviewsCount: Number(created.reviewsCount || 1),
          isAvailable: created.isAvailable ?? true,
          shift: created.shift || stylistData.shift,
          completedTodayCount: Number(created.completedTodayCount || 0),
        }
      : {
          ...stylistData,
          id: `st-${Date.now()}`,
        };

    setStylists((prev) => [newStylist, ...prev]);
  };

  const handleDeleteStylist = async (id: string) => {
    await apiService.deleteStylist(id);
    setStylists((prev) => prev.filter((st) => st.id !== id));
  };

  const handleToggleServiceActive = async (id: string) => {
    const target = services.find((s) => s.id === id);
    if (target) {
      await apiService.updateService(id, {
        name: target.name,
        category: target.category,
        durationMinutes: target.durationMinutes,
        basePrice: target.price,
        active: !target.active,
      });
    }

    setServices((prev) =>
      prev.map((srv) =>
        srv.id === id ? { ...srv, active: !srv.active } : srv
      )
    );
  };

  const handleCreateService = async (serviceData: Omit<Service, "id">) => {
    const created = await apiService.createService({
      name: serviceData.name,
      description: `Servicio profesional de ${serviceData.category}`,
      category: serviceData.category,
      durationMinutes: serviceData.durationMinutes,
      basePrice: serviceData.price,
      imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
    });

    const newService: Service = created
      ? {
          id: created.id,
          name: created.name,
          category: created.category as ServiceCategory,
          price: Number(created.basePrice || created.price || serviceData.price),
          durationMinutes: Number(created.durationMinutes || serviceData.durationMinutes),
          popular: serviceData.popular ?? false,
          active: created.active ?? true,
        }
      : {
          ...serviceData,
          id: `srv-${Date.now()}`,
        };

    setServices((prev) => [newService, ...prev]);
  };

  const handleDeleteService = async (id: string) => {
    await apiService.deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCreateClient = async (clientData: Omit<Client, "id">) => {
    const created = await apiService.createClient(clientData);
    const newClient: Client = created
      ? {
          id: created.id,
          name: created.name,
          email: created.email,
          phone: created.phone,
          avatar: created.avatar || clientData.avatar,
          totalVisits: Number(created.totalVisits || 1),
          totalSpent: Number(created.totalSpent || 0),
          lastVisit: created.lastVisit || "Hoy",
          tier: created.tier as any,
          notes: created.notes || "",
        }
      : {
          ...clientData,
          id: `cli-${Date.now()}`,
        };

    setClients((prev) => [newClient, ...prev]);
  };

  const handleDeleteClient = async (id: string) => {
    await apiService.deleteClient(id);
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              services={services}
              stylists={stylists}
              onOpenNewAppointment={handleOpenNewAppointment}
              onSwitchToDashboard={() => navigate("/dashboard")}
              user={currentUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
              notifications={notifications}
            />
          }
        />

        <Route
          path="/dashboard/*"
          element={
            currentUser && currentUser.role === 'Admin' ? (
              <div className="dashboard-layout">
                {/* Sidebar Navigation */}
                <Sidebar
                  activeTab={activeTab}
                  setActiveTab={handleTabChange}
                  appointmentsCount={appointments.length}
                  onSwitchToLanding={() => navigate("/")}
                />

                {/* Main Content Area */}
                <div className="main-wrapper">
                  <Header
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onOpenNewAppointment={() => handleOpenNewAppointment()}
                    notifications={notifications}
                    user={currentUser}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                  />

                  <main className="content-body">
                    {activeTab === "overview" && (
                      <OverviewTab
                        kpis={kpis}
                        appointments={appointments}
                        services={services}
                        stylists={stylists}
                        onNavigateToAppointments={() => handleTabChange("appointments")}
                        onOpenNewAppointment={() => handleOpenNewAppointment()}
                        onChangeStatus={handleChangeAppointmentStatus}
                      />
                    )}

                    {activeTab === "appointments" && (
                      <AppointmentsTab
                        appointments={appointments}
                        onChangeStatus={handleChangeAppointmentStatus}
                        onOpenNewAppointment={() => handleOpenNewAppointment()}
                        searchQuery={searchQuery}
                      />
                    )}

                    {activeTab === "clients" && (
                      <ClientsTab
                        clients={clients}
                        searchQuery={searchQuery}
                        onAddClient={handleCreateClient}
                        onDeleteClient={handleDeleteClient}
                      />
                    )}

                    {activeTab === "staff" && (
                      <StaffTab
                        stylists={stylists}
                        onToggleAvailability={handleToggleStylistAvailability}
                        onAddStylist={handleCreateStylist}
                        onDeleteStylist={handleDeleteStylist}
                      />
                    )}

                    {activeTab === "services" && (
                      <ServicesTab
                        services={services}
                        onToggleActive={handleToggleServiceActive}
                        onAddService={handleCreateService}
                        onDeleteService={handleDeleteService}
                        searchQuery={searchQuery}
                      />
                    )}

                    {activeTab === "analytics" && <AnalyticsTab />}
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Shared New Appointment Modal */}
      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        onAddAppointment={handleAddAppointment}
        clients={clients}
        services={services}
        stylists={stylists}
        initialServiceId={preselectedServiceId}
        initialStylistId={preselectedStylistId}
      />
    </>
  );
}

export default App;
