import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  Sparkles, 
  BarChart3, 
  Crown,
  ChevronRight
} from 'lucide-react';

export type TabType = 'overview' | 'appointments' | 'clients' | 'staff' | 'services' | 'analytics';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  appointmentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, appointmentsCount }) => {
  const navItems = [
    { id: 'overview', label: 'Resumen General', icon: LayoutDashboard },
    { id: 'appointments', label: 'Agenda & Citas', icon: Calendar, badge: appointmentsCount },
    { id: 'clients', label: 'Clientes (CRM)', icon: Users },
    { id: 'staff', label: 'Equipo & Estilistas', icon: Scissors },
    { id: 'services', label: 'Servicios & Tarifas', icon: Sparkles },
    { id: 'analytics', label: 'Estadísticas', icon: BarChart3 },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo-badge">
          <Crown size={22} />
        </div>
        <div>
          <h2 className="brand-title">ÉLÉGANCE</h2>
          <span className="brand-subtitle">Beauty Studio</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="nav-icon" />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge ? (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '99px',
                    backgroundColor: isActive ? 'var(--accent-gold)' : 'var(--border-subtle)',
                    color: isActive ? '#1C1917' : 'var(--text-secondary)'
                  }}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h4>Horario de Atención</h4>
          <ChevronRight size={14} color="var(--accent-gold)" />
        </div>
        <p>Lun - Sáb: 09:00 - 20:00</p>
        <p style={{ marginTop: '2px', fontWeight: 600, color: 'var(--accent-gold)' }}>● Salón Abierto</p>
      </div>
    </aside>
  );
};
