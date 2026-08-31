import React, { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import type { Client } from '../../types/dashboard';

interface ClientsTabProps {
  clients: Client[];
  searchQuery: string;
}

export const ClientsTab: React.FC<ClientsTabProps> = ({ clients, searchQuery }) => {
  const [tierFilter, setTierFilter] = useState<string>('todos');

  const filteredClients = clients.filter((client) => {
    const matchesTier = tierFilter === 'todos' || client.tier === tierFilter;
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Gestión de Clientes (CRM)</h1>
          <p className="page-subtitle">Directorio de clientes, historial de visitas, consumo acumulado y categorías VIP.</p>
        </div>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
