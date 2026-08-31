import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import type { TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewTab } from './components/tabs/OverviewTab';
import { AppointmentsTab } from './components/tabs/AppointmentsTab';
import { ClientsTab } from './components/tabs/ClientsTab';
import { StaffTab } from './components/tabs/StaffTab';
import { ServicesTab } from './components/tabs/ServicesTab';
import { AnalyticsTab } from './components/tabs/AnalyticsTab';
import { NewAppointmentModal } from './components/NewAppointmentModal';

import {
  INITIAL_APPOINTMENTS,
  INITIAL_CLIENTS,
  INITIAL_KPIS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SERVICES,
  INITIAL_STYLISTS,
} from './data/mockData';
import type { Appointment, AppointmentStatus } from './types/dashboard';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [stylists, setStylists] = useState(INITIAL_STYLISTS);
  const [clients] = useState(INITIAL_CLIENTS);
  const [kpis] = useState(INITIAL_KPIS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Handlers
  const handleAddAppointment = (newAptData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...newAptData,
      id: `apt-${Date.now()}`,
    };
    setAppointments([newAppointment, ...appointments]);

    // Push notification
    setNotifications([
      {
        id: `notif-${Date.now()}`,
        title: 'Cita Agendada Exitosamente',
        message: `${newAppointment.clientName} para ${newAppointment.serviceName} a las ${newAppointment.time}`,
        time: 'Justo ahora',
        read: false,
        type: 'appointment',
      },
      ...notifications,
    ]);
  };

  const handleChangeAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  const handleToggleStylistAvailability = (id: string) => {
    setStylists((prev) =>
      prev.map((st) => (st.id === id ? { ...st, isAvailable: !st.isAvailable } : st))
    );
  };

  const handleToggleServiceActive = (id: string) => {
    setServices((prev) =>
      prev.map((srv) => (srv.id === id ? { ...srv, active: !srv.active } : srv))
    );
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        appointmentsCount={appointments.length}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
          notifications={notifications}
        />

        <main className="content-body">
          {activeTab === 'overview' && (
            <OverviewTab
              kpis={kpis}
              appointments={appointments}
              services={services}
              stylists={stylists}
              onNavigateToAppointments={() => setActiveTab('appointments')}
              onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
              onChangeStatus={handleChangeAppointmentStatus}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsTab
              appointments={appointments}
              onChangeStatus={handleChangeAppointmentStatus}
              onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsTab clients={clients} searchQuery={searchQuery} />
          )}

          {activeTab === 'staff' && (
            <StaffTab
              stylists={stylists}
              onToggleAvailability={handleToggleStylistAvailability}
            />
          )}

          {activeTab === 'services' && (
            <ServicesTab
              services={services}
              onToggleActive={handleToggleServiceActive}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsTab />}
        </main>
      </div>

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        onAddAppointment={handleAddAppointment}
        clients={clients}
        services={services}
        stylists={stylists}
      />
    </div>
  );
}

export default App;
