import React, { useState } from 'react';
import { Mail, Phone, Plus, Trash2, X } from 'lucide-react';
import type { Client } from '../../types/dashboard';

interface ClientsTabProps {
  clients: Client[];
  searchQuery: string;
  onAddClient: (clientData: Omit<Client, "id">) => void;
  onDeleteClient: (id: string) => void;
}

export const ClientsTab: React.FC<ClientsTabProps> = ({
  clients,
  searchQuery,
  onAddClient,
  onDeleteClient,
}) => {
  const [tierFilter, setTierFilter] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+56 9 ');
  const [tier, setTier] = useState<'VIP' | 'Frecuente' | 'Regular' | 'Nuevo'>('Regular');

  const filteredClients = clients.filter((client) => {
    const matchesTier = tierFilter === 'todos' || client.tier === tierFilter;
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onAddClient({
      name,
      email,
      phone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      totalVisits: 1,
      totalSpent: 0,
      lastVisit: 'Hoy',
      tier,
      notes: 'Cliente registrado manualmente',
    });
    setName('');
    setEmail('');
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Gestión de Clientes (CRM)</h1>
          <p className="page-subtitle">Directorio de clientes, historial de visitas, consumo acumulado y categorías VIP.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Agregar Cliente</span>
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-pills">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'VIP', label: 'Clientes VIP' },
            { id: 'Frecuente', label: 'Frecuentes' },
            { id: 'Regular', label: 'Regulares' },
            { id: 'Nuevo', label: 'Nuevos' },
          ].map((pill) => (
            <button
              key={pill.id}
              className={`filter-pill ${tierFilter === pill.id ? 'active' : ''}`}
              onClick={() => setTierFilter(pill.id)}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Categoría</th>
              <th>Visitas</th>
              <th>Total Gastado</th>
              <th>Última Visita</th>
              <th>Notas</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={client.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={client.name}
                      style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{client.name}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Mail size={13} color="var(--text-tertiary)" />
                      {client.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <Phone size={13} color="var(--text-tertiary)" />
                      {client.phone}
                    </div>
                  </div>
                </td>

                <td>
                  <span className={`tier-badge ${client.tier}`}>{client.tier}</span>
                </td>

                <td style={{ fontWeight: 600 }}>{client.totalVisits} visitas</td>

                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  ${client.totalSpent.toLocaleString('es-CL')}
                </td>

                <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {client.lastVisit}
                </td>

                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: 220 }}>
                  {client.notes ? <em>"{client.notes}"</em> : '-'}
                </td>

                <td>
                  <button
                    onClick={() => onDeleteClient(client.id)}
                    title="Eliminar Cliente"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#EF4444',
                      cursor: 'pointer',
                      padding: '6px',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: 450 }}>
            <div className="modal-header">
              <h3>Agregar Nuevo Cliente</h3>
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
                  placeholder="Ej: María José Silva"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Correo Electrónico</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@ejemplo.cl"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Teléfono</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Categoría VIP</label>
                <select
                  className="form-input"
                  value={tier}
                  onChange={(e) => setTier(e.target.value as any)}
                >
                  <option value="Regular">Regular</option>
                  <option value="Frecuente">Frecuente</option>
                  <option value="VIP">VIP</option>
                  <option value="Nuevo">Nuevo</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
