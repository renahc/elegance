import React from 'react';
import { 
  DollarSign, 
  CalendarCheck, 
  Users, 
  TrendingUp, 
  Scissors
} from 'lucide-react';
import type { Appointment, KpiMetric, Service, Stylist } from '../../types/dashboard';

interface OverviewTabProps {
  kpis: KpiMetric[];
  appointments: Appointment[];
  services: Service[];
  stylists: Stylist[];
  onNavigateToAppointments: () => void;
  onOpenNewAppointment: () => void;
  onChangeStatus: (id: string, newStatus: Appointment['status']) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  kpis,
  appointments,
  services,
  stylists,
  onNavigateToAppointments,
  onChangeStatus,
}) => {
  const getKpiIcon = (name: string) => {
    switch (name) {
      case 'DollarSign': return <DollarSign size={20} />;
      case 'CalendarCheck': return <CalendarCheck size={20} />;
      case 'Users': return <Users size={20} />;
      case 'TrendingUp': return <TrendingUp size={20} />;
      default: return <DollarSign size={20} />;
    }
  };

  const todayAppointments = appointments.slice(0, 5);
  const popularServices = services.filter((s) => s.popular);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Bienvenido a Élégance Studio</h1>
        <p className="page-subtitle">Resumen ejecutivo del salón y gestión de la jornada de hoy.</p>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="kpi-card">
            <div className="kpi-top">
              <div className="kpi-icon-box">{getKpiIcon(kpi.iconName)}</div>
              <span className={`kpi-change-badge ${kpi.isPositive ? 'positive' : ''}`}>
                {kpi.change}
              </span>
            </div>
            <div className="kpi-title">{kpi.title}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-period">{kpi.period}</div>
          </div>
        ))}
      </div>

      {/* Main Dashboard Columns */}
      <div className="dashboard-columns">
        {/* Left Column: Today's Appointments */}
        <div>
          <div className="card-panel">
            <div className="panel-header">
              <h3 className="panel-title">Citas de Hoy</h3>
              <button className="panel-action" onClick={onNavigateToAppointments}>
                Ver Agenda Completa →
              </button>
            </div>

            <div className="appointment-list">
              {todayAppointments.map((apt) => (
                <div key={apt.id} className="appointment-item-card">
                  <div className="apt-left">
                    <div className="apt-time-badge">
                      <span className="apt-time">{apt.time}</span>
                      <span className="apt-duration">{apt.durationMinutes}m</span>
                    </div>

                    <img
                      src={apt.clientAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={apt.clientName}
                      className="apt-client-avatar"
                    />

                    <div className="apt-details">
                      <div className="apt-client-name">{apt.clientName}</div>
                      <div className="apt-service-name">
                        <Scissors size={13} color="var(--accent-gold)" />
                        {apt.serviceName}
                      </div>
                      <div className="apt-stylist-tag">Con {apt.stylistName}</div>
                    </div>
                  </div>

                  <div className="apt-right">
                    <div className={`status-chip ${apt.status}`}>
                      {apt.status.replace('_', ' ')}
                    </div>
                    <div className="apt-price">${apt.price.toLocaleString('es-CL')}</div>
                    
                    {apt.status === 'confirmada' && (
                      <button
                        style={{
                          background: 'none',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                        }}
                        onClick={() => onChangeStatus(apt.id, 'en_proceso')}
                      >
                        Iniciar
                      </button>
                    )}
                    {apt.status === 'en_proceso' && (
                      <button
                        style={{
                          background: 'var(--status-completada-bg)',
                          color: 'var(--status-completada-text)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                        onClick={() => onChangeStatus(apt.id, 'completada')}
                      >
                        Finalizar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Popular Services & Stylists */}
        <div>
          <div className="card-panel">
            <div className="panel-header">
              <h3 className="panel-title">Servicios Más Solicitados</h3>
            </div>
            <div className="popular-services-list">
              {popularServices.map((srv, idx) => {
                const percentage = [85, 72, 64, 58, 45][idx % 5];
                return (
                  <div key={srv.id} className="service-progress-item">
                    <div className="service-progress-info">
                      <span className="service-progress-name">{srv.name}</span>
                      <span className="service-progress-val">${srv.price.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-panel">
            <div className="panel-header">
              <h3 className="panel-title">Estilistas Activos Hoy</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stylists.map((st) => (
                <div
                  key={st.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img
                      src={st.avatar}
                      alt={st.name}
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{st.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{st.specialty}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                    {st.completedTodayCount} atendidas
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
