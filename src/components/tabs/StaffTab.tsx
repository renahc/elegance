import React, { useState } from 'react';
import { Star, Clock, Plus, Trash2, X } from 'lucide-react';
import type { Stylist } from '../../types/dashboard';

interface StaffTabProps {
  stylists: Stylist[];
  onToggleAvailability: (id: string) => void;
  onAddStylist: (stylistData: Omit<Stylist, "id">) => void;
  onDeleteStylist: (id: string) => void;
}

export const StaffTab: React.FC<StaffTabProps> = ({
  stylists,
  onToggleAvailability,
  onAddStylist,
  onDeleteStylist,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Estilista Senior');
  const [specialty, setSpecialty] = useState('Colorimetría & Balayage');
  const [shift, setShift] = useState('09:00 - 18:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddStylist({
      name,
      role,
      specialty,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      rating: 5.0,
      reviewsCount: 1,
      isAvailable: true,
      shift,
      completedTodayCount: 0,
    });
    setName('');
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Equipo de Estilistas & Especialistas</h1>
          <p className="page-subtitle">Personal activo, áreas de especialización, calificaciones de clientes y turnos.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Agregar Estilista</span>
        </button>
      </div>

      <div className="stylist-grid">
        {stylists.map((st) => (
          <div key={st.id} className="stylist-card" style={{ position: 'relative' }}>
            <button
              onClick={() => onDeleteStylist(st.id)}
              title="Eliminar Estilista"
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'rgba(239, 68, 68, 0.1)',
                border: 'none',
                color: '#EF4444',
                padding: '6px',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={15} />
            </button>

            <img src={st.avatar} alt={st.name} className="stylist-avatar-lg" />
            
            <h3 className="stylist-name">{st.name}</h3>
            <div className="stylist-specialty">{st.specialty}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 8 }}>{st.role}</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
              <Star size={15} fill="var(--accent-gold)" color="var(--accent-gold)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{st.rating}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>({st.reviewsCount} reseñas)</span>
            </div>

            <div className="stylist-shift">
              <Clock size={13} style={{ display: 'inline', marginRight: 4 }} />
              Turno: {st.shift}
            </div>

            <div className="stylist-meta">
              <div>
                <span className={`availability-dot ${st.isAvailable ? 'active' : 'inactive'}`} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {st.isAvailable ? 'Disponible' : 'En Descanso'}
                </span>
              </div>

              <button
                className="btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                onClick={() => onToggleAvailability(st.id)}
              >
                Cambiar Estado
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Stylist Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: 450 }}>
            <div className="modal-header">
              <h3>Agregar Nuevo Estilista</h3>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Nombre Completo</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Carolina Morales"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Cargo / Rol</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ej: Estilista Master"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Especialidad</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Ej: Balayage & Keratina"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Turno Horario</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  placeholder="Ej: 09:00 - 18:00"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar Estilista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
