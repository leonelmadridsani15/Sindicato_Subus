import React, { useEffect, useState } from 'react';
import DocumentosSection from './components/DocumentosSection';
import NoticiasSection from './components/NoticiasSection';
import ContactoSection from './components/ContactoSection';
import AdminDashboard, { STORAGE_KEYS } from './components/AdminDashboard';
import {
  MapPin,
  Clock,
  Phone,
  Bus,
  Users,
  FileText,
  ShieldCheck,
  Headphones,
  Calendar,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  QrCode,
  Scale,
  Download,
  Mail,
  Building2,
  AlertTriangle,
  Sparkles,
  X,
  Menu,
  IdCard,
  Vote,
  ChevronRight
} from 'lucide-react';

// ============================================================================
// DATOS CENTRALIZADOS (En VS Code irían en: src/data/sintraunifData.js)
// ============================================================================
const NEWS_ITEMS = [
  {
    id: 1,
    date: '25 OCT',
    title: 'Nuevos beneficios para nuestros socios',
    category: 'Beneficios',
    terminal: 'San José • Catemito • Libertadores',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    summary: 'Ampliamos nuestra red de convenios en salud dental, óptica para renovación de licencia profesional A3 y descuentos directos para las familias de SUBUS.',
    content: 'La directiva de SINTRAUNIF informa a sus más de 1.200 socios activos en los terminales San José, Catemito y Los Libertadores la incorporación de mejoras en nuestros convenios con Clínica Dentomundo, Óptica Nueva Visión y Librería La Real. Puedes generar tu orden de atención directamente en el Portal del Socio o en nuestra sede de San José #030, San Bernardo.'
  },
  {
    id: 2,
    date: '18 OCT',
    title: 'Avances en la negociación colectiva',
    category: 'Gremial',
    terminal: 'Mesa Ejecutiva SUBUS',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
    summary: 'Reunión clave entre la directiva de SINTRAUNIF y la gerencia de operaciones para asegurar mejores condiciones salariales, bonos y tiempos de descanso.',
    content: 'Nuestro equipo negociador y asesores legales presentaron los puntos prioritarios levantados en las asambleas de cada terminal: reajuste real de remuneraciones, bono de término de conflicto, fiscalización de programación de turnos y mejoras urgentes en baños y casinos de cabezales.'
  },
  {
    id: 3,
    date: '10 OCT',
    title: 'Comunicado importante del sindicato',
    category: 'Comunicado Oficial',
    terminal: 'Sede San José #030',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    summary: 'Información oficial sobre defensa jurídica gratuita ante cartas de amonestación, siniestros viales en ruta y aplicación de protocolo Ley Karin.',
    content: 'Recordamos a todos los conductores asociados que ante cualquier citación, accidente en vía pública o carta de aviso, deben comunicarse de inmediato con su delegado de terminal o acudir a nuestra oficina en San José #030 (lunes a viernes de 09:00 a 18:00 hrs) antes de firmar descargos sin asesoría.'
  }
];

const CONVENIOS_DATA = [
  {
    id: 'dentomundo',
    name: 'Clínica Dentomundo',
    category: 'Salud Dental',
    discount: 'Hasta 60% Dcto.',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=800&q=80',
    desc: 'Evaluación sin costo, urgencias dentales, prótesis y ortodoncia para el socio titular y todas sus cargas familiares.',
    code: 'SINTRA-DENTO'
  },
  {
    id: 'optica',
    name: 'Óptica Nueva Visión',
    category: 'Salud Visual / Licencia A3',
    discount: 'Arancel Preferencial',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    desc: 'Especialistas en examen visual y lentes ópticos para renovación de Licencia Profesional A3 de conductores SUBUS.',
    code: 'SINTRA-VISION'
  },
  {
    id: 'lareal',
    name: 'Librería La Real',
    category: 'Escolar y Oficina',
    discount: '15% al 25% Dcto.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    desc: 'Descuento inmediato en listas de útiles escolares y artículos de oficina presentando tu credencial sindical en San Bernardo.',
    code: 'SINTRA-REAL'
  },
  {
    id: 'compramas',
    name: 'Compramás Mayorista',
    category: 'Hogar y Abastecimiento',
    discount: 'Precios Mayoristas',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80',
    desc: 'Convenio de abastecimiento familiar y descuento por planilla para trabajadores afiliados a SINTRAUNIF.',
    code: 'SINTRA-COMPRA'
  },
  {
    id: 'joyas',
    name: 'Joyas María Cecilia',
    category: 'Joyería y Regalos',
    discount: 'Facilidades en Cuotas',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    desc: 'Atención preferencial y descuento especial para regalos familiares, aniversarios y fechas especiales.',
    code: 'SINTRA-JOYAS'
  },
  {
    id: 'margot',
    name: 'Perfumería Sra. Margot',
    category: 'Perfumería y Belleza',
    discount: '20% Dcto. Socio',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    desc: 'Fragancias originales y sets de regalo con convenio directo para socios activos de los 3 terminales.',
    code: 'SINTRA-MARGOT'
  },
  {
    id: 'nissan',
    name: 'Convenio Automotriz Nissan',
    category: 'Automotriz',
    discount: 'Bono Flota Sindical',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
    desc: 'Bonificación exclusiva en compra de vehículo particular y descuentos en servicio técnico oficial.',
    code: 'SINTRA-AUTO'
  },
  {
    id: 'petfuneral',
    name: 'Pet Funeral',
    category: 'Asistencia Mascotas',
    discount: 'Tarifa Preferencial',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80',
    desc: 'Apoyo y cobertura con arancel rebajado en servicios de asistencia para las mascotas de la familia.',
    code: 'SINTRA-PET'
  }
];

const TERMINALS_DATA = [
  {
    id: 'catemito',
    code: 'CA',
    name: 'Terminal Catemito',
    address: 'San Bernardo • Zona Sur',
    desc: 'Delegados en terreno para fiscalización de frecuencia, condiciones de máquinas y apoyo directo en turnos.',
    members: '430 socios',
    routes: '18 recorridos',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1000&q=85',
    hours: 'Lunes, miércoles y viernes de 10:00 a 16:00 hrs.',
    service: 'Delegados en patio y orientación para turnos, beneficios y reportes operativos.'
  },
  {
    id: 'san-jose',
    code: 'SJ',
    name: 'Terminal San José (Sede Central)',
    address: 'San José #030, San Bernardo',
    desc: 'Oficina sindical central, atención jurídica presencial y tesorería para todos los socios.',
    members: '520 socios',
    routes: '24 recorridos',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=85',
    hours: 'Lunes a viernes de 09:00 a 18:00 hrs.',
    service: 'Atención jurídica, tesorería, afiliaciones y recepción de solicitudes sindicales.'
  },
  {
    id: 'los-libertadores',
    code: 'LL',
    name: 'Terminal Los Libertadores',
    address: 'Huechuraba / Quilicura • Zona Norte',
    desc: 'Representación sindical permanente, comité paritario y apoyo a socios de la zona norte.',
    members: '290 socios',
    routes: '15 recorridos',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1000&q=85',
    hours: 'Martes y jueves de 10:00 a 17:00 hrs.',
    service: 'Fiscalización de ruta, comité paritario y recepción de solicitudes de los socios.'
  }
];

const DIRECTIVE_DATA = [
  {
    role: 'Secretario General',
    name: 'Representación y Secretaría',
    base: 'Terminal San José',
    phone: '56987654322',
    email: 'secretaria@sintraunif.cl',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80'
  },
  {
    role: 'Tesorero Sindical',
    name: 'Finanzas y Convenios',
    base: 'Terminal Catemito',
    phone: '56987654323',
    email: 'tesoreria@sintraunif.cl',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80'
  },
  {
    role: '1° Director',
    name: 'Encargado Terminal San José',
    base: 'San José #030',
    phone: '56987654324',
    email: 'director.sanjose@sintraunif.cl',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80'
  },
  {
    role: '2° Director',
    name: 'Encargado Terminal Catemito',
    base: 'Terminal Catemito',
    phone: '56987654325',
    email: 'director.catemito@sintraunif.cl',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80'
  },
  {
    role: '3° Director',
    name: 'Encargado Terminal Los Libertadores',
    base: 'Terminal Los Libertadores',
    phone: '56987654326',
    email: 'director.libertadores@sintraunif.cl',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80'
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ============================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [newsId, setNewsId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState('san-jose');
  const [toast, setToast] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminNews, setAdminNews] = useState([]);

  useEffect(() => {
    const refreshAdminNews = () => {
      try {
        setAdminNews(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.news) || '[]'));
      } catch {
        setAdminNews([]);
      }
    };
    refreshAdminNews();
    window.addEventListener('storage', refreshAdminNews);
    window.addEventListener('sintraunif-content-updated', refreshAdminNews);
    return () => {
      window.removeEventListener('storage', refreshAdminNews);
      window.removeEventListener('sintraunif-content-updated', refreshAdminNews);
    };
  }, []);

  const triggerToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const navigateTo = (tab) => {
    setActiveTab(tab);
    if (tab !== 'noticias') setNewsId(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTerminal = TERMINALS_DATA.find((terminal) => terminal.id === selectedTerminal) || TERMINALS_DATA[1];
  const orderedTerminals = [
    ...TERMINALS_DATA.filter((terminal) => terminal.id !== selectedTerminal),
  ];
  orderedTerminals.splice(1, 0, activeTerminal);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb] text-slate-800 font-sans selection:bg-[#f5b800] selection:text-[#0b224c]">
      {/* Importación de tipografía Montserrat (Itálica pesada igual a la imagen) e Inter */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&display=swap');
        .font-heading { font-family: 'Montserrat', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .text-shadow-hero { text-shadow: 0 4px 20px rgba(0, 0, 0, 0.45); }
      `}</style>

      {/* ================================================================== */}
      {/* 1. TOP BAR EXACTA A LA IMAGEN (#0b224c)                            */}
      {/* ================================================================== */}
      <div className="bg-[#0b224c] text-white text-xs py-2.5 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          {/* Datos de contacto izquierda con iconos amarillos */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[12px] font-medium text-slate-100">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#f5b800] shrink-0" />
              <span>San José #030, San Bernardo</span>
            </span>
            <span className="hidden md:inline text-white/30">|</span>
            <span className="hidden md:flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#f5b800] shrink-0" />
              <span>Lun - Vie: 9:00 a 18:00 hrs</span>
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <a href="tel:+56228584522" className="flex items-center gap-1.5 hover:text-[#f5b800] transition">
              <Phone className="w-4 h-4 text-[#f5b800] shrink-0" />
              <span>(+562) 2858 4522</span>
            </a>
          </div>

        </div>
      </div>

      {/* ================================================================== */}
      {/* 2. NAVBAR PRINCIPAL EXACTA A LA IMAGEN                             */}
      {/* ================================================================== */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Izquierda */}
          <div
            onClick={() => navigateTo('inicio')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0b224c] flex items-center justify-center text-[#f5b800] shadow-md group-hover:scale-105 transition">
              <Bus className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-2xl tracking-tight text-[#0b224c]">
                  SINTRAUNIF
                </span>
                <span className="bg-[#1d58c8] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-md tracking-wide uppercase">
                  SUBUS
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Sindicato de Trabajadores Unificado SUBUS
              </p>
            </div>
          </div>

          {/* Navegación Desktop (Con píldora azul oscura activa igual a la foto) */}
          <nav className="hidden lg:flex items-center gap-2">
            {[
              { id: 'inicio', label: 'Inicio' },
              { id: 'nosotros', label: 'Nosotros' },
              { id: 'beneficios', label: 'Beneficios' },
              { id: 'noticias', label: 'Noticias' },
              { id: 'documentos', label: 'Documentos' },
              { id: 'contacto', label: 'Contacto' }
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition ${
                    isActive
                      ? 'bg-[#0f2e66] text-white shadow-sm'
                      : 'text-slate-800 hover:bg-slate-100 hover:text-[#0f2e66]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Botón Extra: Intranet del Socio */}
            <button
              onClick={() => navigateTo('intranet')}
              className={`ml-2 px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 border transition ${
                activeTab === 'intranet'
                  ? 'bg-[#f5b800] text-[#0b224c] border-[#f5b800] shadow'
                  : 'bg-amber-50 text-[#0b224c] border-amber-300 hover:bg-[#f5b800]'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Portal Socio</span>
            </button>
          </nav>

          {/* Botón Menú Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-[#0b224c] hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menú Desplegable Móvil */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-5 space-y-2">
            {[
              { id: 'inicio', label: 'Inicio' },
              { id: 'nosotros', label: 'Nosotros (Terminales y Directiva)' },
              { id: 'beneficios', label: 'Beneficios y Convenios' },
              { id: 'noticias', label: 'Noticias y Comunicados' },
              { id: 'documentos', label: 'Documentos y Estatutos' },
              { id: 'contacto', label: 'Contacto y Reportes' },
              { id: 'intranet', label: '🔑 Portal del Socio (Credencial QR)' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold ${
                  activeTab === item.id
                    ? 'bg-[#0f2e66] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ================================================================== */}
      {/* CONTENIDO DINÁMICO SEGÚN PESTAÑA ACTIVA                            */}
      {/* ================================================================== */}
      {isAdminView ? (
        <AdminDashboard
          onLogout={() => setIsAdminView(false)}
          notify={triggerToast}
        />
      ) : (
      <main className="flex-grow">
        {activeTab === 'inicio' && (
          <div>
            {/* ============================================================ */}
            {/* 3. HERO BANNER IDÉNTICO A LA IMAGEN SUBIDA                   */}
            {/* ============================================================ */}
            <section className="relative bg-[#0a2351] text-white overflow-hidden">
              {/* Imagen de fondo con bus urbano azul y avenida arbolada + gradiente azul */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1920&q=85')`
                }}
              />
              {/* Gradiente azul profundo a la izquierda y centro para legibilidad idéntica al mockup */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(8,28,68,0.96) 0%, rgba(12,41,97,0.88) 48%, rgba(16,60,130,0.35) 100%)'
                }}
              />

              {/* Curva decorativa amarilla y azul marino en la esquina inferior derecha */}
              <svg
                className="absolute bottom-0 right-0 w-72 sm:w-[460px] h-28 sm:h-40 pointer-events-none z-10"
                viewBox="0 0 500 160"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M120 160 C 230 95, 360 45, 500 20 L 500 160 Z"
                  fill="#f5b800"
                />
                <path
                  d="M180 160 C 280 110, 390 68, 500 48 L 500 160 Z"
                  fill="#081c44"
                />
              </svg>

              {/* Contenido Principal del Hero */}
              <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-28 lg:pt-16 lg:pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Columna Izquierda: Tipografía SINTRAUNIF Siempre contigo */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-1 bg-[#f5b800] rounded-full inline-block" />
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
                        UNIDOS POR UN MEJOR TRANSPORTE
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h1 className="font-heading italic font-black text-5xl sm:text-6xl lg:text-[68px] leading-none tracking-tight text-white text-shadow-hero">
                        SINTRAUNIF
                      </h1>
                      <p className="font-heading italic font-extrabold text-4xl sm:text-5xl lg:text-[56px] leading-tight text-[#f5b800] text-shadow-hero">
                        Siempre contigo
                      </p>
                    </div>

                    <p className="text-base sm:text-lg text-slate-100 max-w-xl font-medium leading-relaxed pt-1">
                      Representamos, apoyamos y defendemos los derechos de todos los
                      trabajadores de SUBUS.
                    </p>

                    {/* Dos Botones Píldora exactos al diseño */}
                    <div className="flex flex-wrap items-center gap-4 pt-3">
                      <button
                        onClick={() => navigateTo('nosotros')}
                        className="bg-[#f5b800] hover:bg-[#eab308] text-[#0b224c] font-extrabold px-6 py-3.5 rounded-full text-sm shadow-lg hover:shadow-xl transition flex items-center gap-2.5"
                      >
                        <Users className="w-4 h-4 stroke-[2.5]" />
                        <span>Conoce nuestro sindicato</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <button
                        onClick={() => navigateTo('documentos')}
                        className="bg-[#0b224c]/60 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/80 font-bold px-6 py-3 rounded-full text-sm transition flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-[#f5b800]" />
                        <span>Más información</span>
                      </button>
                    </div>
                  </div>

                  {/* Columna Derecha: Tarjeta Visual del Bus SUBUS con insignia oficial */}
                  <div className="lg:col-span-5 hidden lg:block">
                    <div className="relative rounded-2xl overflow-hidden border-2 border-white/25 shadow-2xl bg-[#0f2e66]/80 backdrop-blur">
                      <img
                        src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1000&q=85"
                        alt="Flota de Buses SUBUS"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#081c44] via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                        <div>
                          <span className="bg-[#1d58c8] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded">
                            FLOTA SUBUS CHILE
                          </span>
                          <p className="font-heading italic font-bold text-lg mt-1">
                            San José • Catemito • Los Libertadores
                          </p>
                        </div>
                        <div className="bg-[#f5b800] text-[#0b224c] font-black text-xs px-3 py-1.5 rounded-lg shadow">
                          +1.200 Socios
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* 4. BARRA FLOTANTE DE 4 PILARES (SUPERPUESTA AL HERO)         */}
            {/* ============================================================ */}
            <section className="relative z-30 -mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 py-6 px-4 sm:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-200">
                  {/* Item 1 */}
                  <div
                    onClick={() => navigateTo('nosotros')}
                    className="flex items-center gap-4 lg:px-5 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0b224c] text-white flex items-center justify-center shrink-0 group-hover:bg-[#1d58c8] transition shadow">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-[15px] text-[#0b224c] group-hover:text-[#1d58c8] transition">
                        Representación Gremial
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Defendemos tus derechos
                      </p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div
                    onClick={() => navigateTo('beneficios')}
                    className="flex items-center gap-4 lg:px-5 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0b224c] text-white flex items-center justify-center shrink-0 group-hover:bg-[#1d58c8] transition shadow">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-[15px] text-[#0b224c] group-hover:text-[#1d58c8] transition">
                        Beneficios para Socios
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Ventajas exclusivas
                      </p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div
                    onClick={() => navigateTo('noticias')}
                    className="flex items-center gap-4 lg:px-5 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0b224c] text-white flex items-center justify-center shrink-0 group-hover:bg-[#1d58c8] transition shadow">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-[15px] text-[#0b224c] group-hover:text-[#1d58c8] transition">
                        Información Actualizada
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Noticias y comunicados
                      </p>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div
                    onClick={() => navigateTo('contacto')}
                    className="flex items-center gap-4 lg:px-5 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0b224c] text-white flex items-center justify-center shrink-0 group-hover:bg-[#1d58c8] transition shadow">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-[15px] text-[#0b224c] group-hover:text-[#1d58c8] transition">
                        Contacto Directo
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Estamos para ayudarte
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* 5. SECCIÓN PRINCIPAL DIVIDIDA: NOTICIAS (IZQ) + BENEFICIOS   */}
            {/* ============================================================ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* COLUMNA IZQUIERDA (8 COLUMNAS): ÚLTIMAS NOTICIAS */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                  <div>
                    {/* Encabezado de sección idéntico a la imagen */}
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="w-6 h-1 bg-[#f5b800] rounded-full inline-block" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#d99b00]">
                        ÚLTIMAS NOTICIAS
                      </span>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-2 mb-6">
                      <h2 className="font-heading italic font-black text-2xl sm:text-3xl text-[#0b224c]">
                        Entérate de las novedades
                      </h2>
                      <button
                        onClick={() => navigateTo('noticias')}
                        className="text-xs sm:text-sm font-bold text-[#1d58c8] hover:text-[#0b224c] flex items-center gap-1 transition"
                      >
                        <span>Ver todas las noticias</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Grilla de las 3 Tarjetas de Noticias Exactas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {[...adminNews, ...NEWS_ITEMS].map((item) => (
                        <article
                          key={item.id}
                          onClick={() => {
                            setNewsId(item.id);
                            navigateTo('noticias');
                          }}
                          className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-slate-200/80 transition cursor-pointer flex flex-col justify-between group"
                        >
                          <div>
                            {/* Imagen con Badge de fecha azul superpuesto abajo a la izquierda */}
                            <div className="relative h-44 overflow-hidden">
                              <img
                                src={item.image || item.images?.[0]}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                              <div className="absolute bottom-3 left-3 bg-[#0f2e66] text-white text-[11px] font-extrabold px-3 py-1 rounded-md shadow flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#f5b800]" />
                                <span>{item.date}</span>
                              </div>
                            </div>

                            {/* Título de la tarjeta */}
                            <div className="p-5 pb-3">
                              <h3 className="font-bold text-[15px] text-[#0b224c] group-hover:text-[#1d58c8] leading-snug transition">
                                {item.title}
                              </h3>
                            </div>
                          </div>

                          <div className="px-5 pb-5 pt-1">
                            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1d58c8] group-hover:translate-x-1 transition">
                              <span>Leer más</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>

                {/* COLUMNA DERECHA (4 COLUMNAS): TARJETA AZUL "NUESTROS BENEFICIOS" */}
                <div className="lg:col-span-4 flex">
                  <div className="w-full bg-gradient-to-br from-[#0b224c] via-[#102f69] to-[#081a3b] text-white rounded-2xl p-7 shadow-xl relative overflow-hidden flex flex-col justify-between border border-white/10">
                    {/* Marca de agua de Bus a la derecha igual a la imagen */}
                    <Bus className="w-44 h-44 text-white/10 absolute -right-8 bottom-8 pointer-events-none stroke-[1.2]" />

                    <div className="relative z-10">
                      {/* Barra vertical amarilla + Título en cursiva */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-1.5 h-7 bg-[#f5b800] rounded-full inline-block" />
                        <h3 className="font-heading italic font-black text-2xl text-white">
                          Nuestros Beneficios
                        </h3>
                      </div>

                      <p className="text-sm text-slate-200 leading-relaxed mb-6">
                        Trabajamos para ofrecerte los mejores beneficios y apoyo en tu
                        labor diaria.
                      </p>

                      {/* Lista con Check amarillo idéntica al diseño */}
                      <ul className="space-y-3.5 text-sm font-medium text-slate-100">
                        {[
                          'Asesoría laboral',
                          'Capacitaciones',
                          'Apoyo en trámites',
                          'Actividades recreativas'
                        ].map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-[#f5b800] shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="relative z-10 pt-7">
                      <button
                        onClick={() => navigateTo('beneficios')}
                        className="bg-[#f5b800] hover:bg-[#eab308] text-[#0b224c] font-extrabold px-6 py-3 rounded-full text-sm shadow-md transition inline-flex items-center gap-2"
                      >
                        <span>Conoce más</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================================================================ */}
        {/* PESTAÑA 2: NOSOTROS (TERMINALES SUBUS, DIRECTIVA Y LEGAL)        */}
        {/* ================================================================ */}
        {activeTab === 'nosotros' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-100">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-6 h-1 bg-[#f5b800] rounded-full" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#1d58c8]">
                  QUIÉNES SOMOS • SINTRAUNIF SUBUS
                </span>
              </div>
              <h1 className="font-heading italic font-black text-3xl sm:text-4xl text-[#0b224c]">
                El Sindicato Más Grande de SUBUS (+12 Años de Historia)
              </h1>
              <p className="text-slate-600 mt-3 max-w-3xl text-sm sm:text-base leading-relaxed">
                Con sede central en <strong>San José #030, San Bernardo</strong>,
                representamos a más de <strong>1.200 conductores y trabajadores</strong> en
                los tres depósitos estratégicos de la empresa, bajo los pilares de
                Confianza, Honestidad y Beneficios reales.
              </p>

              <div className="mt-10">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#1d58c8]">
                      Presencia gremial en terreno
                    </p>
                    <h2 className="font-heading text-2xl font-black italic text-[#0b224c]">
                      Nuestros tres terminales
                    </h2>
                  </div>
                  <span className="hidden rounded-full bg-[#f5b800]/20 px-3 py-1.5 text-xs font-bold text-[#0b224c] sm:inline-flex">
                    Haz clic para cambiar la sede central
                  </span>
                </div>

                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
                  {orderedTerminals.map((terminal, index) => {
                    const isCenter = index === 1;
                    const isActive = terminal.id === selectedTerminal;
                    return (
                      <button
                        key={terminal.id}
                        type="button"
                        onClick={() => setSelectedTerminal(terminal.id)}
                        className={`group text-left transition duration-300 ${
                          isCenter ? 'md:scale-105 md:z-10' : ''
                        } ${isActive ? 'outline-none' : 'opacity-90 hover:opacity-100'}`}
                        aria-pressed={isActive}
                      >
                        <div className={`relative overflow-hidden rounded-3xl shadow-lg ${
                          isCenter ? 'h-60 sm:h-72' : 'h-52 sm:h-60'
                        }`}>
                          <img
                            src={terminal.image}
                            alt={terminal.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#071a3b] via-[#0b224c]/15 to-transparent" />
                          <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase text-[#0b224c]">
                              {terminal.code} • Cobertura activa
                            </span>
                            {isActive && (
                              <span className="rounded-full bg-[#f5b800] px-2.5 py-1 text-[10px] font-black text-[#0b224c]">
                                Seleccionado
                              </span>
                            )}
                          </div>
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <p className="text-xs font-bold text-[#f5b800]">
                              {terminal.members} • {terminal.routes}
                            </p>
                            <p className="mt-1 text-sm font-bold">{terminal.address}</p>
                          </div>
                        </div>
                        <div className="px-1 pt-4">
                          <h3 className="text-lg font-bold text-[#0b224c]">{terminal.name}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-500">{terminal.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7 flex flex-col gap-3 rounded-2xl border-l-4 border-[#f5b800] bg-[#f4f7fb] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#1d58c8]">
                      Atención sindical en {activeTerminal.name}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#0b224c]">{activeTerminal.hours}</p>
                    <p className="mt-1 text-xs text-slate-600">{activeTerminal.service}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerToast(`Solicitud enviada a ${activeTerminal.name}.`)}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#0b224c] px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#0f2e66]"
                  >
                    Solicitar atención <ArrowRight className="h-4 w-4 text-[#f5b800]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-md border border-slate-100 sm:p-8">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2.5">
                    <span className="h-1 w-6 rounded-full bg-[#f5b800]" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#1d58c8]">
                      ORGANIGRAMA SINTRAUNIF
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl font-black italic text-[#0b224c]">
                    Directiva sindical
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-600">
                    Una estructura conectada para representar a cada conductor desde la mesa ejecutiva hasta los terminales.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl bg-[#f4f7fb] p-4 sm:p-8">
                <svg className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 1000 570" preserveAspectRatio="none" aria-hidden="true">
                  <path className="org-chart-line" d="M500 143 V205 M250 205 H750 M250 205 V250 M500 205 V250 M750 205 V250 M250 360 V430 M500 360 V430 M750 360 V430" fill="none" stroke="#f5b800" strokeWidth="3" strokeDasharray="8 8" markerEnd="url(#org-arrow)" />
                  <defs>
                    <marker id="org-arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#f5b800" />
                    </marker>
                  </defs>
                </svg>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="org-chart-enter w-full max-w-sm rounded-2xl border-2 border-[#f5b800] bg-[#0b224c] p-5 text-white shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-[#f5b800]">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80" alt="Presidente SINTRAUNIF" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <span className="rounded-full bg-[#f5b800] px-2.5 py-1 text-[10px] font-black uppercase text-[#0b224c]">Presidente SINTRAUNIF</span>
                        <h3 className="mt-2 text-base font-black">Presidente del Sindicato</h3>
                        <p className="text-xs text-blue-100">Base: San José #030, San Bernardo</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 border-t border-white/15 pt-3 text-xs text-blue-100">
                      <Phone className="h-4 w-4 text-[#f5b800]" /> WhatsApp directo: +56 9 8765 4321
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <a
                        href="https://wa.me/56987654321?text=Hola%2C%20quiero%20contactar%20al%20Presidente%20de%20SINTRAUNIF."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 text-[11px] font-extrabold text-white transition hover:bg-[#1da851]"
                        aria-label="Contactar al Presidente por WhatsApp"
                      >
                        <Phone className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                      <a
                        href="mailto:presidente@sintraunif.cl"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 px-3 py-2 text-[11px] font-extrabold text-white transition hover:border-[#f5b800] hover:text-[#f5b800]"
                        aria-label="Enviar correo al Presidente"
                      >
                        <Mail className="h-3.5 w-3.5" /> Correo
                      </a>
                    </div>
                  </div>

                  <div className="my-12 grid w-full max-w-2xl gap-12 md:grid-cols-2">
                    {DIRECTIVE_DATA.slice(0, 2).map((director, index) => (
                      <div key={director.role} className="org-chart-enter rounded-2xl border border-[#0f2e66]/20 bg-white p-4 shadow-md" style={{ animationDelay: `${(index + 1) * 120}ms` }}>
                        <div className="flex items-center gap-3">
                          <img src={director.image} alt={director.role} className="h-12 w-12 rounded-full object-cover ring-2 ring-[#f5b800]" />
                          <div>
                            <span className="text-[10px] font-extrabold uppercase text-[#1d58c8]">{director.role}</span>
                            <h3 className="text-sm font-bold text-[#0b224c]">{director.name}</h3>
                            <p className="text-[11px] text-slate-500">{director.base}</p>
                            <div className="mt-3 flex items-center gap-2">
                              <a
                                href={`https://wa.me/${director.phone}?text=${encodeURIComponent(`Hola, quiero contactar al ${director.role} de SINTRAUNIF.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-[10px] font-extrabold text-white transition hover:bg-[#1da851]"
                                aria-label={`Contactar a ${director.role} por WhatsApp`}
                              >
                                <Phone className="h-3 w-3" /> WhatsApp
                              </a>
                              <a
                                href={`mailto:${director.email}`}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#0b224c]/15 px-2.5 py-1.5 text-[10px] font-extrabold text-[#0b224c] transition hover:border-[#1d58c8] hover:text-[#1d58c8]"
                                aria-label={`Enviar correo a ${director.role}`}
                              >
                                <Mail className="h-3 w-3" /> Correo
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid w-full max-w-5xl gap-4 md:grid-cols-3">
                    {DIRECTIVE_DATA.slice(2).map((director, index) => (
                      <div
                        key={director.role}
                        className="org-chart-enter group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-md transition hover:-translate-y-1 hover:border-[#f5b800] hover:shadow-lg"
                        style={{ animationDelay: `${(index + 3) * 120}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <img src={director.image} alt={director.role} className="h-12 w-12 rounded-full object-cover ring-2 ring-[#0f2e66] transition group-hover:ring-[#f5b800]" />
                          <div>
                            <span className="text-[10px] font-extrabold uppercase text-[#1d58c8]">{director.role}</span>
                            <h3 className="text-sm font-bold text-[#0b224c]">{director.name}</h3>
                            <p className="text-[11px] text-slate-500">{director.base}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                          <a
                            href={`https://wa.me/${director.phone}?text=${encodeURIComponent(`Hola, quiero contactar al ${director.role} de SINTRAUNIF.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-[10px] font-extrabold text-white transition hover:bg-[#1da851]"
                            aria-label={`Contactar a ${director.role} por WhatsApp`}
                          >
                            <Phone className="h-3 w-3" /> WhatsApp
                          </a>
                          <a
                            href={`mailto:${director.email}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#0b224c]/15 px-2.5 py-1.5 text-[10px] font-extrabold text-[#0b224c] transition hover:border-[#1d58c8] hover:text-[#1d58c8]"
                            aria-label={`Enviar correo a ${director.role}`}
                          >
                            <Mail className="h-3 w-3" /> Correo
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7 rounded-3xl bg-[#0b224c] p-8 text-white shadow-xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f5b800] px-3 py-1 text-xs font-extrabold text-[#0b224c]">
                  <Scale className="h-4 w-4" /> Asesoría Legal Gratuita
                </div>
                <h3 className="mt-3 font-heading text-2xl font-black italic">Defensa Jurídica al Conductor</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  Respaldo inmediato ante cartas de amonestación, despidos injustificados, accidentes en ruta y denuncias por Ley Karin.
                </p>
                <button onClick={() => navigateTo('contacto')} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f5b800] px-5 py-3 text-xs font-extrabold text-[#0b224c]">
                  Solicitar asesoría <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="lg:col-span-5 rounded-3xl border border-slate-100 bg-white p-8 shadow-md">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#1d58c8]">Nuestro compromiso</p>
                <h3 className="mt-2 font-heading text-2xl font-black italic text-[#0b224c]">Representación cercana y transparente</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Cada terminal cuenta con una representación activa para que la información, la defensa y los beneficios lleguen a todos los socios.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* PESTAÑA 3: BENEFICIOS Y CONVENIOS REALES SINTRAUNIF              */}
        {/* ================================================================ */}
        {activeTab === 'beneficios' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="w-6 h-1 bg-[#f5b800] rounded-full" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#1d58c8]">
                    RED DE BENEFICIOS SINTRAUNIF
                  </span>
                </div>
                <h1 className="font-heading italic font-black text-3xl text-[#0b224c]">
                  Convenios Exclusivos para Socios y Familias
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Haz clic en cualquier convenio para descargar tu cupón validado o usa tu
                  Credencial QR en el Portal del Socio.
                </p>
              </div>
              <button
                onClick={() => navigateTo('intranet')}
                className="bg-[#0b224c] hover:bg-[#1d58c8] text-white font-bold text-xs px-5 py-3 rounded-full flex items-center gap-2 self-start transition"
              >
                <QrCode className="w-4 h-4 text-[#f5b800]" />
                <span>Abrir Mi Credencial Digital QR</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CONVENIOS_DATA.map((conv) => (
                <div
                  key={conv.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={conv.image}
                      alt={conv.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b224c]/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-4 text-white text-xs font-extrabold">
                      Convenio asociado
                    </span>
                  </div>
                  <div className="p-6 pt-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="bg-[#0b224c]/10 text-[#0b224c] text-[11px] font-extrabold px-2.5 py-1 rounded-md">
                        {conv.category}
                      </span>
                      <span className="bg-[#f5b800]/25 text-[#0b224c] text-[11px] font-extrabold px-2.5 py-1 rounded-md">
                        {conv.discount}
                      </span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-[#0b224c]">
                      {conv.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {conv.desc}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      triggerToast(
                        `Voucher generado para ${conv.name} (Código: ${conv.code}).`
                      )
                    }
                    className="mx-6 mb-6 mt-0 w-[calc(100%-3rem)] bg-[#0f2e66] hover:bg-[#f5b800] hover:text-[#0b224c] text-white font-extrabold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generar Orden de Descuento</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* PESTAÑA 4: NOTICIAS Y COMUNICADOS                                */}
        {/* ================================================================ */}
        {activeTab === 'noticias' && (
          <NoticiasSection
            initialNewsId={newsId}
            onBackToHome={() => navigateTo('inicio')}
          />
        )}

        {/* ================================================================ */}
        {/* PESTAÑA 5: DOCUMENTOS Y TRANSPARENCIA                            */}
        {/* ================================================================ */}
        {activeTab === 'documentos' && <DocumentosSection onNotify={triggerToast} />}

        {/* ================================================================ */}
        {/* PESTAÑA 6: CONTACTO Y REPORTE DE MÁQUINAS / TERMINALES           */}
        {/* ================================================================ */}
        {activeTab === 'contacto' && <ContactoSection onNotify={triggerToast} />}

        {/* ================================================================ */}
        {/* PESTAÑA 7: PORTAL PRIVADO DEL SOCIO (CREDENCIAL QR + ENCUESTA)   */}
        {/* ================================================================ */}
        {activeTab === 'intranet' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-[#0b224c] text-white rounded-2xl p-6 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#f5b800] text-[#0b224c] font-heading font-black text-xl flex items-center justify-center">
                  CS
                </div>
                <div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    Socio Activo • Padrón #0914 / 1.200
                  </span>
                  <h2 className="font-heading font-black text-xl sm:text-2xl mt-0.5">
                    Carlos Santander Gómez
                  </h2>
                  <p className="text-xs text-slate-300">
                    RUT: 14.892.310-K • Terminal Catemito (SUBUS) • Licencia A3 Al Día
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  triggerToast('Descargando Certificado de Afiliación SINTRAUNIF firmado...')
                }
                className="bg-[#f5b800] hover:bg-[#eab308] text-[#0b224c] font-extrabold text-xs px-5 py-3 rounded-full flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Certificado Afiliación</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Credencial Digital con QR */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#0b224c] to-[#1d58c8] text-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <IdCard className="w-6 h-6 text-[#f5b800]" />
                    <span className="font-heading font-black text-sm">
                      CREDENCIAL DIGITAL SINTRAUNIF
                    </span>
                  </div>
                  <span className="bg-[#f5b800] text-[#0b224c] text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
                    Vigente 2026
                  </span>
                </div>

                <div className="bg-slate-950/40 rounded-xl p-4 flex items-center justify-between gap-4 border border-white/15">
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-300 text-[10px] uppercase">Socio Titular</p>
                    <p className="font-bold text-sm">CARLOS SANTANDER GÓMEZ</p>
                    <p className="text-[#f5b800] font-semibold">Terminal Catemito • SUBUS</p>
                    <p className="text-[11px] text-emerald-300 pt-1">
                      Habilitado en Dentomundo, Nueva Visión y La Real
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl text-[#0b224c] shrink-0 text-center">
                    <QrCode className="w-16 h-16 mx-auto" />
                    <span className="text-[9px] font-black block mt-1">QR SOCIO #914</span>
                  </div>
                </div>
              </div>

              {/* Votación Sindical en Línea */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-md border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#1d58c8] uppercase mb-1">
                    <Vote className="w-4 h-4" />
                    <span>Consulta Digital a las Bases</span>
                  </div>
                  <h3 className="font-heading italic font-black text-xl text-[#0b224c]">
                    ¿Qué nuevo convenio priorizamos para el próximo trimestre?
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Vota desde tu celular sin hacer filas en el terminal:
                  </p>

                  <div className="space-y-2.5">
                    <label className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                      <span className="text-xs font-bold text-[#0b224c]">
                        1. Convenio Gas Licuado (Lipigas / Abastible) con descuento sindical
                      </span>
                      <span className="text-xs font-extrabold text-[#1d58c8]">64%</span>
                    </label>
                    <label className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                      <span className="text-xs font-bold text-[#0b224c]">
                        2. Bono Preuniversitario para hijos de conductores SUBUS
                      </span>
                      <span className="text-xs font-extrabold text-slate-500">36%</span>
                    </label>
                  </div>
                </div>

                <button
                  disabled={hasVoted}
                  onClick={() => {
                    setHasVoted(true);
                    triggerToast('¡Voto registrado exitosamente en el padrón de SINTRAUNIF!');
                  }}
                  className={`mt-5 w-full py-3 rounded-xl text-xs font-extrabold transition ${
                    hasVoted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#0b224c] hover:bg-[#1d58c8] text-white'
                  }`}
                >
                  {hasVoted ? '✓ Tu voto ya fue contabilizado' : 'Emitir Voto Electrónico'}
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
      )}

      {/* ================================================================== */}
      {/* 6. BANNER INFERIOR EXACTO A LA IMAGEN ("Juntos llegamos más lejos")*/}
      {/* ================================================================== */}
      <footer className="relative bg-[#092147] text-white overflow-hidden border-t border-white/10">
        {/* Silueta urbana sutil de fondo */}
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-bottom pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=60')`
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#f5b800]/15 border border-[#f5b800]/40 flex items-center justify-center text-[#f5b800] shrink-0">
              <HeartHandshake className="w-8 h-8 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-heading italic font-black text-2xl sm:text-3xl text-white tracking-tight">
                Juntos llegamos más lejos
              </h3>
              <p className="text-xs sm:text-sm font-semibold mt-0.5">
                <span className="text-[#f5b800] font-extrabold">SINTRAUNIF</span>
                <span className="text-slate-200">
                  {' '}
                  – Sindicato de Trabajadores Unificado SUBUS
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('contacto')}
            className="bg-[#0b224c] hover:bg-[#f5b800] hover:text-[#0b224c] text-white border-2 border-[#f5b800] font-extrabold px-7 py-3 rounded-full text-sm transition flex items-center gap-2 shrink-0 shadow-lg"
          >
            <span>Contáctanos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsAdminView(true)}
            className="text-[11px] font-semibold text-slate-300 transition hover:text-[#f5b800]"
          >
            Acceso Directiva
          </button>
        </div>
      </footer>

      {/* ================================================================== */}
      {/* NOTIFICACIÓN FLOTANTE (TOAST)                                      */}
      {/* ================================================================== */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0b224c] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-[#f5b800] flex items-center gap-3 max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-[#f5b800] shrink-0" />
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}
    </div>
  );
}