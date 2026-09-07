import React, { useState } from 'react';
import { Search, Bell, Plus, Calendar as CalendarIcon, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import type { NotificationItem } from '../types/dashboard';


interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNewAppointment: () => void;
  notifications: NotificationItem[];
  user: { name: string; username: string } | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenNewAppointment,
  notifications,
  user,
  onLogin,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const currentDateFormatted = new Intl.DateTimeFormat('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());




  return (
    <header className="top-header">
      <div className="header-search">
        <Search size={18} className="header-search-icon" />
        <input
          type="text"
          placeholder="Buscar cita, cliente, servicio..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="header-actions">
        <div className="date-pill">
          <CalendarIcon size={15} color="var(--accent-gold)" />
          <span style={{ textTransform: 'capitalize' }}>{currentDateFormatted}</span>
        </div>

        {/* Azure AD MSAL Login / User Info Button */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '6px 14px', 
                borderRadius: 'var(--radius-full)', 
                background: 'rgba(0, 120, 212, 0.12)', 
                border: '1px solid rgba(0, 120, 212, 0.3)',
                color: '#0078D4',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <ShieldCheck size={16} />
              <span>{user.name || user.username}</span>
            </div>

            <button 
              onClick={onLogout}
              title="Cerrar Sesión Azure AD"
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#EF4444',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <LogOut size={14} />
              <span>Cerrar Sesión</span>
            </button>

          </div>
        ) : (
          <button 
            onClick={onLogin}

            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: '#0078D4',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0, 120, 212, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <LogIn size={16} />
            <span>Login Azure AD</span>
          </button>
        )}

        <button className="btn-primary" onClick={onOpenNewAppointment}>
          <Plus size={16} />
          <span>Nueva Cita</span>
        </button>

        <div style={{ position: 'relative' }}>
          <button
            className="icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notificaciones"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-badge" />}
          </button>

          {showNotifications && (
            <div className="notification-drawer">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <strong style={{ fontSize: '0.9rem' }}>Notificaciones</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  {unreadCount} nuevas
                </span>
              </div>
              {notifications.map((n) => (
                <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                    {n.time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
