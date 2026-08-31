export type AppointmentStatus = 'confirmada' | 'en_proceso' | 'completada' | 'cancelada';

export type ServiceCategory = 'cabello' | 'uñas' | 'facial' | 'maquillaje' | 'spa';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  durationMinutes: number;
  popular?: boolean;
  active: boolean;
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  shift: string;
  completedTodayCount: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  tier: 'VIP' | 'Frecuente' | 'Nuevo' | 'Regular';
  notes?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  stylistId: string;
  stylistName: string;
  date: string;
  time: string;
  durationMinutes: number;
  price: number;
  status: AppointmentStatus;
  notes?: string;
}

export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
  iconName: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'appointment' | 'client' | 'system';
}
