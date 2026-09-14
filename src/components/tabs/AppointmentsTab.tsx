import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Appointment, AppointmentStatus } from '../../types/dashboard';

interface AppointmentsTabProps {
  appointments: Appointment[];
  onChangeStatus: (id: string, newStatus: AppointmentStatus) => void;
  onOpenNewAppointment: () => void;
  searchQuery: string;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  appointments,
  onChangeStatus,
  onOpenNewAppointment,
  searchQuery,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'todos' || apt.status === statusFilter;
    const matchesDate = !selectedDate || apt.date === selectedDate || (apt.date && apt.date.includes(selectedDate));
    const matchesSearch =
      apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.stylistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (apt.date && apt.date.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesDate && matchesSearch;
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Agenda & Citas</h1>
          <p className="page-subtitle">Gestiona reservas, horarios de atención y estado del servicio en tiempo real.</p>
        </div>
        <button className="btn-primary" onClick={onOpenNewAppointment}>
          <Plus size={16} />
          <span>Nueva Cita</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-pills">
          {[
            { id: 'todos', label: 'Todas las Citas' },
            { id: 'confirmada', label: 'Confirmadas' },
            { id: 'en_proceso', label: 'En Proceso' },
            { id: 'completada', label: 'Completadas' },
            { id: 'cancelada', label: 'Canceladas' },
          ].map((pill) => (
            <button
              key={pill.id}
              className={`filter-pill ${statusFilter === pill.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(pill.id)}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Filtrar por Fecha:</label>
          <input
            type="date"
            className="form-input"
            style={{ width: 160, padding: '6px 12px' }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {selectedDate && (
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-gold)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
              onClick={() => setSelectedDate('')}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Appointments List View */}
      <div className="card-panel">
        <div className="appointment-list">
          {filteredAppointments.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No se encontraron citas con los filtros seleccionados.
            </div>
          ) : (
            filteredAppointments.map((apt) => (
              <div key={apt.id} className="appointment-item-card" style={{ padding: '18px 20px' }}>
                <div className="apt-left">
                  <div className="apt-time-badge" style={{ minWidth: 70, padding: '10px 12px' }}>
                    <span className="apt-time">{apt.time}</span>
                    <span className="apt-duration">{apt.durationMinutes} min</span>
                  </div>

                  <img
                    src={apt.clientAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={apt.clientName}
                    className="apt-client-avatar"
                  />

                  <div className="apt-details">
                    <div className="apt-client-name" style={{ fontSize: '0.98rem' }}>{apt.clientName}</div>
                    <div className="apt-service-name" style={{ fontSize: '0.86rem' }}>
                      {apt.serviceName}
                    </div>
                    <div className="apt-stylist-tag">Estilista: {apt.stylistName} {apt.notes ? `• "${apt.notes}"` : ''}</div>
                  </div>
                </div>

                <div className="apt-right">
                  <span className={`status-chip ${apt.status}`}>
                    {apt.status.replace('_', ' ')}
                  </span>
                  
                  <div className="apt-price">${apt.price.toLocaleString('es-CL')}</div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    {apt.status !== 'completada' && apt.status !== 'cancelada' && (
                      <>
                        <button
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                          onClick={() => onChangeStatus(apt.id, apt.status === 'confirmada' ? 'en_proceso' : 'completada')}
                        >
                          {apt.status === 'confirmada' ? 'Avanzar a En Proceso' : 'Marcar Completada'}
                        </button>

                        <button
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--status-cancelada-bg)',
                            color: 'var(--status-cancelada-text)',
                            borderRadius: '99px',
                            padding: '6px 10px',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                          }}
                          onClick={() => onChangeStatus(apt.id, 'cancelada')}
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
