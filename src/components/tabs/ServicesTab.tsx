import React, { useState } from 'react';
import { Sparkles, Clock } from 'lucide-react';
import type { Service } from '../../types/dashboard';

interface ServicesTabProps {
  services: Service[];
  onToggleActive: (id: string) => void;
  searchQuery: string;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({ services, onToggleActive, searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const filteredServices = services.filter((srv) => {
    const matchesCat = selectedCategory === 'todos' || srv.category === selectedCategory;
    const matchesSearch = srv.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Catálogo de Servicios & Tarifas</h1>
          <p className="page-subtitle">Tarifario de tratamientos, duración estimada y servicios destacados.</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-pills">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'cabello', label: 'Cabello' },
            { id: 'uñas', label: 'Uñas' },
            { id: 'facial', label: 'Facial & Dermo' },
            { id: 'maquillaje', label: 'Maquillaje' },
            { id: 'spa', label: 'Spa & Corporal' },
          ].map((pill) => (
            <button
              key={pill.id}
              className={`filter-pill ${selectedCategory === pill.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(pill.id)}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {filteredServices.map((srv) => (
          <div key={srv.id} className="card-panel" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                    color: 'var(--accent-gold)',
                  }}
                >
                  {srv.category}
                </span>

                {srv.popular && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      backgroundColor: 'var(--accent-gold-light)',
                      color: 'var(--accent-gold)',
                      border: '1px solid var(--accent-gold-border)',
                      padding: '2px 8px',
                      borderRadius: '99px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Sparkles size={11} />
                    Popular
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                {srv.name}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 16 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={14} color="var(--text-tertiary)" />
                  {srv.durationMinutes} minutos
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 14,
                borderTop: '1px solid var(--border-light)',
              }}
            >
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                ${srv.price.toLocaleString('es-CL')}
              </div>

              <button
                className="btn-secondary"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                }}
                onClick={() => onToggleActive(srv.id)}
              >
                {srv.active ? 'Activo' : 'Desactivado'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
