import React, { useState } from 'react';
import { Search, Bell, Plus, Calendar as CalendarIcon } from 'lucide-react';
import type { NotificationItem } from '../types/dashboard';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNewAppointment: () => void;
  notifications: NotificationItem[];
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenNewAppointment,
  notifications,
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

        <button className="user-profile-btn">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
            alt="Elena Rostova"
            className="user-avatar"
          />
          <div className="user-info">
            <div className="user-name">Elena Rostova</div>
            <div className="user-role">Directora de Salón</div>
          </div>
        </button>
      </div>
    </header>
  );
};
