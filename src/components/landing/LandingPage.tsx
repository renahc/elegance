import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  Calendar, 
  Star, 
  Clock, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Globe, 
  Share2, 
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
  Heart,
  Scissors,
  LogIn,
  LogOut
} from 'lucide-react';

import type { Service, Stylist } from '../../types/dashboard';


interface LandingPageProps {
  services: Service[];
  stylists: Stylist[];
  onOpenNewAppointment: (serviceId?: string, stylistId?: string) => void;
  onSwitchToDashboard: () => void;
  user: { name: string; username: string } | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  services,
  stylists,
  onOpenNewAppointment,
  onSwitchToDashboard,
  user,
  onLogin,
  onLogout,
}) => {




  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  
  // Interactive estimator state
  const [estimatorServiceId, setEstimatorServiceId] = useState<string>(services[0]?.id || '');
  const [estimatorStylistId, setEstimatorStylistId] = useState<string>(stylists[0]?.id || '');

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter((s) => s.category === selectedCategory);

  const selectedEstimatorService = services.find((s) => s.id === estimatorServiceId) || services[0];
  const selectedEstimatorStylist = stylists.find((st) => st.id === estimatorStylistId) || stylists[0];

  const galleryItems = [
    {
      title: 'Balayage Platinum Luxury',
      category: 'Colorimetría',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Manicura Rusa & Soft Gel',
      category: 'Nail Art',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Facial Hydra-Lifting Bio',
      category: 'Cosmiatría',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Maquillaje Social & Novias',
      category: 'Makeup',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800',
    },
  ];

  const testimonials = [
    {
      name: 'Sofía Larraín',
      role: 'Cliente VIP Élégance',
      comment: 'El mejor servicio de Balayage que he recibido en Santiago. El nivel de detalle, la atención con café de especialidad y la calidez del equipo hacen que cada visita sea un ritual imprescindible.',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Fernanda Valenzuela',
      role: 'Cliente Frecuente',
      comment: 'La Manicura Rusa de Camila es insuperable. Mis uñas duran perfectas más de 3 semanas sin saltarse. El ambiente es super elegante y relajante.',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Antonia Edwards',
      role: 'Cliente VIP Élégance',
      comment: 'Sus tratamientos faciales Olaplex e Hydra-Lifting son magia pura. Te asesoran con absoluta honestidad. ¡Élégance es mi lugar feliz!',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=200',
    },
  ];

  return (
    <div className="landing-container">
      {/* Dynamic Navbar */}
      <header className="landing-navbar">
        <div className="landing-nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-logo-badge">
            <Crown size={22} />
          </div>
          <div>
            <h2 className="brand-title" style={{ fontSize: '1.25rem', letterSpacing: '1px' }}>ÉLÉGANCE</h2>
            <span className="brand-subtitle" style={{ fontSize: '0.68rem' }}>Beauty Studio & Spa</span>
          </div>
        </div>

        <ul className="landing-nav-links">
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#estilistas">Estilistas</a></li>
          <li><a href="#galeria">Galería</a></li>
          <li><a href="#testimonios">Testimonios</a></li>
          <li><a href="#cotizador">Cotizador</a></li>
          <li><a href="#contacto">Ubicación</a></li>
        </ul>

        <div className="landing-nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(0, 120, 212, 0.12)', border: '1px solid rgba(0, 120, 212, 0.4)', color: '#0078D4', fontSize: '0.82rem', fontWeight: 600 }}>
                <ShieldCheck size={14} />
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
                  borderRadius: '20px',
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
                gap: '6px',
                padding: '8px 16px',
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
              <LogIn size={15} />
              <span>Login Azure AD</span>
            </button>
          )}


          <button className="btn-landing-secondary" onClick={onSwitchToDashboard}>
            <LayoutDashboard size={16} />
            <span>Panel Dashboard</span>
          </button>
          <button className="btn-landing-primary" onClick={() => onOpenNewAppointment()}>
            <Calendar size={16} />
            <span>Reservar Cita</span>
          </button>
        </div>
      </header>



      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow-bg" />
        <div className="hero-glow-bg-2" />

        <div className="hero-content-grid">
          <div>
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>Experiencia de Alta Gama</span>
            </div>

            <h1 className="hero-title">
              La excelencia de la <span>belleza & elegancia</span> en cada detalle.
            </h1>

            <p className="hero-subtitle">
              Descubre nuestro concepto exclusivo de estilismo, cuidado capilar avanzado, manicura rusa y tratamientos faciales personalizados. Diseñado para realzar tu belleza natural.
            </p>

            <div className="hero-cta-group">
              <button className="btn-landing-primary" style={{ padding: '16px 36px', fontSize: '1rem' }} onClick={() => onOpenNewAppointment()}>
                <Calendar size={18} />
                <span>Agendar mi Visita</span>
              </button>
              <a href="#servicios" className="btn-landing-secondary" style={{ padding: '16px 28px', fontSize: '0.95rem', textDecoration: 'none' }}>
                <span>Ver Servicios</span>
                <ChevronRight size={16} />
              </a>
            </div>

            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <h3>12k+</h3>
                <p>Clientes VIP</p>
              </div>
              <div className="hero-stat-item">
                <h3>4.9 ★</h3>
                <p>Valoración Excelente</p>
              </div>
              <div className="hero-stat-item">
                <h3>15+</h3>
                <p>Años de Experiencia</p>
              </div>
            </div>
          </div>

          <div className="hero-media-wrapper">
            <div className="hero-image-frame">
              <img 
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000" 
                alt="Élégance Beauty Studio Room" 
              />
            </div>

            {/* Floating Info Cards */}
            <div className="hero-float-card hero-float-card-1">
              <div className="float-icon-box">
                <Award size={22} />
              </div>
              <div className="float-text">
                <strong>Coloristas Master</strong>
                <span>Especialistas en Balayage</span>
              </div>
            </div>

            <div className="hero-float-card hero-float-card-2">
              <div className="float-icon-box" style={{ color: '#E8C8BA', background: 'rgba(232, 200, 186, 0.2)' }}>
                <ShieldCheck size={22} />
              </div>
              <div className="float-text">
                <strong>Productos Premium</strong>
                <span>Olaplex, Kérastase & Dior</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Catalog Section */}
      <section id="servicios" className="landing-section">
        <div className="section-header-center">
          <span className="section-tag">Nuestros Servicios</span>
          <h2 className="section-title-large">Experiencias y Tratamientos Exclusivos</h2>
          <p className="section-description">
            Seleccionamos las mejores técnicas e insumos del mundo para brindarte resultados excepcionales en un ambiente relajante y acogedor.
          </p>
        </div>

        {/* Category Pills */}
        <div className="services-category-pills">
          <button 
            className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Todos los Servicios
          </button>
          <button 
            className={`category-pill ${selectedCategory === 'cabello' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('cabello')}
          >
            Cabello & Color
          </button>
          <button 
            className={`category-pill ${selectedCategory === 'uñas' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('uñas')}
          >
            Manicura & Pedicura
          </button>
          <button 
            className={`category-pill ${selectedCategory === 'facial' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('facial')}
          >
            Faciales & Piel
          </button>
          <button 
            className={`category-pill ${selectedCategory === 'maquillaje' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('maquillaje')}
          >
            Maquillaje
          </button>
          <button 
            className={`category-pill ${selectedCategory === 'spa' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('spa')}
          >
            Spa & Relajación
          </button>
        </div>

        {/* Services Grid */}
        <div className="services-grid-landing">
          {filteredServices.map((service) => (
            <div key={service.id} className="service-card-landing">
              {service.popular && <span className="service-popular-badge">Popular</span>}

              <div className="service-card-header">
                <span className="service-category-tag">{service.category}</span>
                <h3 className="service-title-landing">{service.name}</h3>
                
                <div className="service-details-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={15} color="var(--accent-gold)" />
                    {service.durationMinutes} minutos
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={15} color="#10B981" />
                    Garantizado
                  </span>
                </div>
              </div>

              <div className="service-card-footer">
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block' }}>
                    Inversión
                  </span>
                  <div className="service-price-landing">
                    ${service.price.toLocaleString('es-CL')}
                  </div>
                </div>

                <button 
                  className="btn-landing-secondary" 
                  onClick={() => onOpenNewAppointment(service.id)}
                >
                  <span>Agendar</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stylists Team Section */}
      <section id="estilistas" className="landing-section stylists-section-bg">
        <div className="section-header-center">
          <span className="section-tag">Talento Élégance</span>
          <h2 className="section-title-large">Conoce a Nuestro Equipo Master</h2>
          <p className="section-description">
            Profesionales altamente capacitados internacionalmente en colorimetría, estilismo y dermatología cosmética.
          </p>
        </div>

        <div className="stylists-grid-landing">
          {stylists.map((stylist) => (
            <div key={stylist.id} className="stylist-card-landing">
              <div className="stylist-img-container">
                <img src={stylist.avatar} alt={stylist.name} />
                <div className="stylist-badge-status">
                  <Scissors size={13} color="var(--accent-gold)" />
                  <span>{stylist.shift}</span>
                </div>
              </div>

              <div className="stylist-info-box">
                <span className="stylist-role">{stylist.role}</span>
                <h3 className="stylist-name">{stylist.name}</h3>
                <p className="stylist-specialty">{stylist.specialty}</p>

                <div className="stylist-rating-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={15} fill="#F59E0B" color="#F59E0B" />
                    <strong style={{ color: 'var(--text-primary)' }}>{stylist.rating}</strong>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>({stylist.reviewsCount})</span>
                  </div>

                  <button 
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-gold)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.85rem'
                    }}
                    onClick={() => onOpenNewAppointment(undefined, stylist.id)}
                  >
                    <span>Reservar</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="landing-section">
        <div className="section-header-center">
          <span className="section-tag">Galería de Resultados</span>
          <h2 className="section-title-large">Transformaciones & Estilo</h2>
          <p className="section-description">
            Cada trabajo refleja la dedicación, precisión y pasión de nuestro equipo.
          </p>
        </div>

        <div className="gallery-grid-landing">
          {galleryItems.map((item, idx) => (
            <div key={idx} className="gallery-item">
              <img src={item.image} alt={item.title} />
              <div className="gallery-overlay">
                <h4>{item.title}</h4>
                <p>{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonios" className="landing-section" style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
        <div className="section-header-center">
          <span className="section-tag">Reseñas de Clientas</span>
          <h2 className="section-title-large">La Experiencia Élégance</h2>
          <p className="section-description">
            La confianza de nuestras clientas es nuestro mayor reconocimiento.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <div>
                <div className="testimonial-stars">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p className="testimonial-text">&ldquo;{t.comment}&rdquo;</p>
              </div>

              <div className="testimonial-author">
                <img src={t.avatar} alt={t.name} />
                <div className="author-details">
                  <h5>{t.name}</h5>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Estimator Widget Banner */}
      <section id="cotizador" className="landing-section">
        <div className="estimator-banner">
          <div>
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Calculadora en Vivo
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginTop: '8px', marginBottom: '16px' }}>
              Planifica tu próxima cita en segundos.
            </h2>
            <p style={{ color: '#D6D3D1', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '24px' }}>
              Elige el servicio de tu preferencia y tu profesional favorito para obtener un resumen inmediato del valor e inversión de tiempo.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold-border)' }}>
                <CheckCircle2 size={18} />
                <span>Confirmación Inmediata</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold-border)' }}>
                <Heart size={18} />
                <span>Atención Personalizada</span>
              </div>
            </div>
          </div>

          <div className="estimator-box">
            <div className="estimator-field">
              <label>1. Selecciona tu Servicio</label>
              <select 
                className="estimator-select"
                value={estimatorServiceId}
                onChange={(e) => setEstimatorServiceId(e.target.value)}
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (${s.price.toLocaleString('es-CL')})
                  </option>
                ))}
              </select>
            </div>

            <div className="estimator-field">
              <label>2. Elige tu Estilista Preferido</label>
              <select 
                className="estimator-select"
                value={estimatorStylistId}
                onChange={(e) => setEstimatorStylistId(e.target.value)}
              >
                {stylists.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} - {st.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="estimator-result">
              <div>
                <span style={{ fontSize: '0.8rem', color: '#A8A29E', textTransform: 'uppercase' }}>Inversión Estimada</span>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  ${selectedEstimatorService.price.toLocaleString('es-CL')}
                </div>
                <span style={{ fontSize: '0.8rem', color: '#D6D3D1' }}>
                  Duración aproximada: {selectedEstimatorService.durationMinutes} min
                </span>
              </div>

              <button 
                className="btn-landing-primary"
                onClick={() => onOpenNewAppointment(selectedEstimatorService.id, selectedEstimatorStylist.id)}
              >
                <Calendar size={16} />
                <span>Reservar Ahora</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Contact */}
      <footer id="contacto" className="landing-footer">
        <div className="footer-grid">
          <div className="footer-col-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div className="brand-logo-badge">
                <Crown size={20} />
              </div>
              <div>
                <h3>ÉLÉGANCE</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', letterSpacing: '1px' }}>BEAUTY STUDIO & SPA</span>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#A8A29E', maxWidth: '340px' }}>
              El estándar supremo en belleza, estilismo capilar y spa exclusivo. Un santuario dedicado a tu bienestar.
            </p>
          </div>

          <div className="footer-col">
            <h4>Navegación</h4>
            <ul>
              <li><a href="#servicios">Servicios & Tarifas</a></li>
              <li><a href="#estilistas">Equipo Estilistas</a></li>
              <li><a href="#galeria">Galería de Trabajos</a></li>
              <li><a href="#testimonios">Opiniones VIP</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Horarios</h4>
            <ul>
              <li style={{ color: '#FFFFFF', fontWeight: 600 }}>Lunes a Sábado</li>
              <li style={{ fontSize: '0.88rem' }}>09:00 hrs - 20:00 hrs</li>
              <li style={{ color: '#FFFFFF', fontWeight: 600, marginTop: '10px' }}>Domingos</li>
              <li style={{ fontSize: '0.88rem' }}>Cerrado (Atención Eventos)</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contacto & Reserva</h4>
            <ul>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="var(--accent-gold)" />
                <span>Av. Alonso de Córdova 3890, Vitacura</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <Phone size={16} color="var(--accent-gold)" />
                <span>+56 9 8765 4321 / +56 2 2987 6543</span>
              </li>
            </ul>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <a href="#" style={{ padding: '8px', borderRadius: '50%', background: '#282523', color: 'var(--accent-gold)', display: 'inline-flex' }} aria-label="Sitio Web">
                <Globe size={18} />
              </a>
              <a href="#" style={{ padding: '8px', borderRadius: '50%', background: '#282523', color: 'var(--accent-gold)', display: 'inline-flex' }} aria-label="Compartir">
                <Share2 size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Élégance Beauty Studio. Todos los derechos reservados.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ color: '#A8A29E', textDecoration: 'none' }}>Términos & Condiciones</a>
            <a href="#" style={{ color: '#A8A29E', textDecoration: 'none' }}>Política de Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
