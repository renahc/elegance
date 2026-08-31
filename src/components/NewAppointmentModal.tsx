import React, { useState } from 'react';
import { X, Calendar, Clock, User, Scissors, DollarSign } from 'lucide-react';
import type { Appointment, Client, Service, Stylist } from '../types/dashboard';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (apt: Omit<Appointment, 'id'>) => void;
  clients: Client[];
  services: Service[];
  stylists: Stylist[];
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  onAddAppointment,
  clients,
  services,
  stylists,
}) => {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedStylistId, setSelectedStylistId] = useState(stylists[0]?.id || '');
  const [date, setDate] = useState('2026-08-31');
  const [time, setTime] = useState('12:00');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId);
    const service = services.find((s) => s.id === selectedServiceId);
    const stylist = stylists.find((s) => s.id === selectedStylistId);

    if (!client || !service || !stylist) return;

    onAddAppointment({
      clientId: client.id,
      clientName: client.name,
      clientAvatar: client.avatar,
      serviceId: service.id,
      serviceName: service.name,
      serviceCategory: service.category,
      stylistId: stylist.id,
      stylistName: stylist.name,
      date,
      time,
      durationMinutes: service.durationMinutes,
      price: service.price,
      status: 'confirmada',
      notes,
    });

    onClose();
  };

  const selectedService = services.find((s) => s.id === selectedServiceId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Agendar Nueva Cita</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <User size={14} style={{ display: 'inline', marginRight: 6 }} />
              Cliente
            </label>
            <select
              className="form-select"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              required
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.tier})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Scissors size={14} style={{ display: 'inline', marginRight: 6 }} />
              Servicio
            </label>
            <select
              className="form-select"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              required
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - ${s.price.toLocaleString('es-CL')} ({s.durationMinutes} min)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Estilista / Especialista</label>
            <select
              className="form-select"
              value={selectedStylistId}
              onChange={(e) => setSelectedStylistId(e.target.value)}
              required
            >
              {stylists.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} - {st.specialty}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={14} style={{ display: 'inline', marginRight: 6 }} />
                Fecha
              </label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Clock size={14} style={{ display: 'inline', marginRight: 6 }} />
                Hora
              </label>
              <input
                type="time"
                className="form-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notas Adicionales</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Preferencias del cliente, observaciones..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {selectedService && (
            <div
              style={{
                backgroundColor: 'var(--accent-gold-light)',
                border: '1px solid var(--accent-gold-border)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total a Pagar</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
                <DollarSign size={16} />
                {selectedService.price.toLocaleString('es-CL')} CLP
              </strong>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Confirmar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
