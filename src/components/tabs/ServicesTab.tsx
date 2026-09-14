import React, { useState } from 'react';
import { Sparkles, Clock, Plus, Trash2, X } from 'lucide-react';
import type { Service, ServiceCategory } from '../../types/dashboard';

interface ServicesTabProps {
  services: Service[];
  onToggleActive: (id: string) => void;
  onAddService: (serviceData: Omit<Service, "id">) => void;
  onDeleteService: (id: string) => void;
  searchQuery: string;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
  services,
  onToggleActive,
  onAddService,
  onDeleteService,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('cabello');
  const [price, setPrice] = useState(25000);
  const [durationMinutes, setDurationMinutes] = useState(60);

  const filteredServices = services.filter((srv) => {
    const matchesCat = selectedCategory === 'todos' || srv.category === selectedCategory;
    const matchesSearch = srv.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddService({
      name,
      category,
      price: Number(price),
      durationMinutes: Number(durationMinutes),
      popular: false,
      active: true,
    });
    setName('');
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Catálogo de Servicios & Tarifas</h1>
          <p className="page-subtitle">Tarifario de tratamientos, duración estimada y gestión de catálogo.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Agregar Servicio</span>
        </button>
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

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
                  <button
                    onClick={() => onDeleteService(srv.id)}
                    title="Eliminar Servicio"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#EF4444',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
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
                  borderColor: srv.active ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                  color: srv.active ? '#10B981' : '#EF4444',
                }}
                onClick={() => onToggleActive(srv.id)}
              >
                {srv.active ? 'Activo' : 'Desactivado'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: 450 }}>
            <div className="modal-header">
              <h3>Agregar Nuevo Servicio</h3>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Nombre del Servicio</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Balayage Platinum Extra"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Categoría</label>
                <select
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                >
                  <option value="cabello">Cabello & Color</option>
                  <option value="uñas">Manicura & Pedicura</option>
                  <option value="facial">Faciales & Dermo</option>
                  <option value="maquillaje">Maquillaje</option>
                  <option value="spa">Spa & Corporal</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Precio ($ CLP)</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Duración (min)</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
