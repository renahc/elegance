import React from 'react';
import { Star, Clock } from 'lucide-react';
import type { Stylist } from '../../types/dashboard';

interface StaffTabProps {
  stylists: Stylist[];
  onToggleAvailability: (id: string) => void;
}

export const StaffTab: React.FC<StaffTabProps> = ({ stylists, onToggleAvailability }) => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Equipo de Estilistas & Especialistas</h1>
        <p className="page-subtitle">Personal activo, áreas de especialización, calificaciones de clientes y turnos.</p>
      </div>

      <div className="stylist-grid">
        {stylists.map((st) => (
          <div key={st.id} className="stylist-card">
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
    </div>
  );
};
