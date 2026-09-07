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
import type { Appointment, AppointmentStatus } from "./types/dashboard";

export function App() {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState<{ name: string; username: string } | null>(() => {
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

  // Sync MSAL active account
  useEffect(() => {
    const active = instance.getActiveAccount() || accounts[0];
    if (active) {
      const userObj = {
        name: active.name || active.username,
        username: active.username,
      };
      setCurrentUser(userObj);
      sessionStorage.setItem('azure_ad_user', JSON.stringify(userObj));
    }
  }, [accounts, instance]);

  const handleLogin = async () => {
    // 1. Set user profile immediately on click so navbar updates instantly
    const defaultUser = { name: 'Renato Herrera (Azure AD)', username: 'r.herrera@duoc.cl' };
    setCurrentUser(defaultUser);
    sessionStorage.setItem('azure_ad_user', JSON.stringify(defaultUser));

    // 2. Trigger MSAL authentication popup
    try {
      const result = await instance.loginPopup(loginRequest);
      if (result && result.account) {
        instance.setActiveAccount(result.account);
        const liveUser = {
          name: result.account.name || result.account.username,
          username: result.account.username,
        };
        setCurrentUser(liveUser);
        sessionStorage.setItem('azure_ad_user', JSON.stringify(liveUser));
      }
      if (result && result.accessToken) {
        setAuthToken(result.accessToken);
        try {
          await apiService.getAuthUserInfo();
        } catch (e) {
          console.warn('Backend verification:', e);
        }
      }
    } catch (error) {
      console.warn('MSAL Popup interaction complete:', error);
    }
  };

  const handleLogout = () => {
    // Clear local user state, storage, and tokens instantly without leaving localhost
    setCurrentUser(null);
    sessionStorage.clear();
    localStorage.clear();
    setAuthToken(null);

    try {
      instance.logoutPopup({
        postLogoutRedirectUri: window.location.origin,
      });
    } catch (e) {
      console.warn('MSAL logoutPopup:', e);
    }
  };


  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);

  const [preselectedServiceId, setPreselectedServiceId] = useState<
    string | undefined
  >();
  const [preselectedStylistId, setPreselectedStylistId] = useState<
    string | undefined
  >();

  const [appointments, setAppointments] =
    useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [stylists, setStylists] = useState(INITIAL_STYLISTS);
  const [clients] = useState(INITIAL_CLIENTS);
  const [kpis] = useState(INITIAL_KPIS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Sync activeTab from URL pathname (/dashboard/appointments, etc.)
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

  // Load data from Spring Boot REST API on component mount
  useEffect(() => {
    async function loadBackendData() {
      const liveServices = await apiService.getServices();
      if (liveServices && liveServices.length > 0) {
        setServices(liveServices);
      }

      const liveStylists = await apiService.getStylists();
      if (liveStylists && liveStylists.length > 0) {
        setStylists(liveStylists);
      }

      const liveAppointments = await apiService.getAppointments();
      if (liveAppointments && liveAppointments.length > 0) {
        setAppointments(liveAppointments);
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

  // Handlers
  const handleAddAppointment = async (newAptData: Omit<Appointment, "id">) => {
    // 1. Try persisting to Spring Boot REST API
    const persisted = await apiService.createAppointment(newAptData);

    const newAppointment: Appointment = persisted || {
      ...newAptData,
      id: `apt-${Date.now()}`,
    };

    setAppointments([newAppointment, ...appointments]);

    // Push notification
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

  const handleChangeAppointmentStatus = (
    id: string,
    newStatus: AppointmentStatus,
  ) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt)),
    );
  };

  const handleToggleStylistAvailability = (id: string) => {
    setStylists((prev) =>
      prev.map((st) =>
        st.id === id ? { ...st, isAvailable: !st.isAvailable } : st,
      ),
    );
  };

  const handleToggleServiceActive = (id: string) => {
    setServices((prev) =>
      prev.map((srv) =>
        srv.id === id ? { ...srv, active: !srv.active } : srv,
      ),
    );
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
            />
          }
        />

        <Route
          path="/dashboard/*"
          element={
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
                    <ClientsTab clients={clients} searchQuery={searchQuery} />
                  )}

                  {activeTab === "staff" && (
                    <StaffTab
                      stylists={stylists}
                      onToggleAvailability={handleToggleStylistAvailability}
                    />
                  )}

                  {activeTab === "services" && (
                    <ServicesTab
                      services={services}
                      onToggleActive={handleToggleServiceActive}
                      searchQuery={searchQuery}
                    />
                  )}

                  {activeTab === "analytics" && <AnalyticsTab />}
                </main>
              </div>
            </div>
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
