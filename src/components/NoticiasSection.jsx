import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  MessageCircle,
  Share2,
  UserRound,
  X,
} from 'lucide-react';
import { STORAGE_KEYS } from './AdminDashboard';

const NEWS_ARTICLES = [
  {
    id: 1,
    date: '25 OCT',
    category: 'Beneficios',
    title: 'Nuevos beneficios para nuestros socios',
    summary: 'Ampliamos nuestra red de convenios en salud dental, óptica para renovación de licencia profesional A3 y descuentos directos para las familias de SUBUS.',
    terminals: 'San José • Catemito • Los Libertadores',
    images: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=85',
    ],
    paragraphs: [
      'La directiva de SINTRAUNIF informa a sus más de 1.200 socios activos que ya se encuentran disponibles nuevos convenios para salud dental, cuidado visual y apoyo familiar.',
      'Los acuerdos fueron construidos a partir de las necesidades levantadas en las asambleas de los terminales San José, Catemito y Los Libertadores. Cada socio podrá solicitar orientación en su sede o validar su beneficio mediante la credencial digital.',
      'La red incorpora atención preferencial en Clínica Dentomundo, Óptica Nueva Visión y comercios asociados. Los beneficios también consideran a las cargas familiares acreditadas.',
    ],
    quote: 'Cuando un beneficio llega a la familia, el sindicato cumple su propósito de acompañar al trabajador dentro y fuera del terminal.',
    keyPoints: ['Evaluación dental y urgencias con tarifa preferencial', 'Examen visual para renovación de licencia A3', 'Descuentos directos para socios y cargas familiares'],
    timeline: [
      { day: '25', month: 'OCT', time: '08:30 hrs', terminal: 'Terminal San José', title: 'Presentación de convenios', images: ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=85'] },
      { day: '26', month: 'OCT', time: '14:00 hrs', terminal: 'Terminal Catemito', title: 'Operativo de orientación', images: ['https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85'] },
      { day: '27', month: 'OCT', time: '17:00 hrs', terminal: 'Los Libertadores', title: 'Entrega de credenciales', images: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=85'] },
    ],
  },
  {
    id: 2,
    date: '18 OCT',
    category: 'Gremial',
    title: 'Avances en la negociación colectiva',
    summary: 'Reunión clave entre la directiva de SINTRAUNIF y la gerencia de operaciones para asegurar mejores condiciones salariales, bonos y tiempos de descanso.',
    terminals: 'Mesa Ejecutiva SUBUS',
    images: [
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85',
    ],
    paragraphs: [
      'Nuestro equipo negociador presentó a la gerencia de operaciones los puntos prioritarios recogidos en las asambleas de cada terminal.',
      'La mesa de trabajo abordó un reajuste real de remuneraciones, el bono de término de conflicto y la fiscalización de la programación de turnos.',
      'También se solicitó un plan con fechas para mejorar baños, casinos y espacios de descanso de los cabezales.',
    ],
    quote: 'La negociación se construye con información clara, participación de las bases y una sola voz para todos los terminales.',
    keyPoints: ['Reajuste real de remuneraciones', 'Bono de término de conflicto', 'Mejoras en turnos y espacios de descanso'],
    timeline: [
      { day: '18', month: 'OCT', time: '09:00 hrs', terminal: 'Mesa Ejecutiva', title: 'Inicio de la reunión', images: ['https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85'] },
      { day: '19', month: 'OCT', time: '13:30 hrs', terminal: 'Terminal Catemito', title: 'Consulta a las bases', images: ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85'] },
      { day: '20', month: 'OCT', time: '16:00 hrs', terminal: 'Terminal San José', title: 'Síntesis de propuestas', images: ['https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85'] },
    ],
  },
  {
    id: 3,
    date: '10 OCT',
    category: 'Comunicado Oficial',
    title: 'Comunicado importante del sindicato',
    summary: 'Información oficial sobre defensa jurídica gratuita ante cartas de amonestación, siniestros viales en ruta y aplicación de protocolo Ley Karin.',
    terminals: 'Sede San José #030',
    images: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=85',
    ],
    paragraphs: [
      'Recordamos a todos los conductores asociados que ante cualquier citación, accidente en vía pública o carta de aviso deben comunicarse de inmediato con su delegado.',
      'La asesoría jurídica gratuita permite revisar los antecedentes antes de firmar descargos y activar el protocolo correspondiente ante un siniestro.',
      'La directiva también mantiene canales de orientación para casos relacionados con la Ley Karin y situaciones de convivencia laboral.',
    ],
    quote: 'Ningún socio debe enfrentar solo una amonestación, un siniestro o una situación que afecte su dignidad laboral.',
    keyPoints: ['Avisar al delegado antes de firmar documentos', 'Asesoría jurídica en San José #030', 'Activación del protocolo ante siniestros y Ley Karin'],
    timeline: [
      { day: '10', month: 'OCT', time: '08:30 hrs', terminal: 'Terminal San José', title: 'Difusión del comunicado', images: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=85'] },
      { day: '11', month: 'OCT', time: '12:00 hrs', terminal: 'Terminal Catemito', title: 'Orientación a conductores', images: ['https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=85'] },
      { day: '12', month: 'OCT', time: '15:30 hrs', terminal: 'Los Libertadores', title: 'Reunión con delegados', images: ['https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=85'] },
    ],
  },
];

function NewsCarousel({ article, onOpen }) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % article.images.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [article.images.length]);

  const moveImage = (direction) => {
    setActiveImage((current) => (current + direction + article.images.length) % article.images.length);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <button type="button" onClick={onOpen} className="relative h-56 overflow-hidden text-left">
        {article.images.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`${article.title} - imagen ${index + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${
              activeImage === index ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b224c]/75 via-transparent to-transparent" />
        <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-md bg-[#0f2e66] px-3 py-1.5 text-xs font-extrabold text-white">
          <Calendar className="h-3.5 w-3.5 text-[#f5b800]" /> {article.date}
        </span>
        <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition group-hover:opacity-100">
          <span role="presentation" onClick={(event) => { event.stopPropagation(); moveImage(-1); }} className="rounded-full bg-[#0b224c]/80 p-2 text-white"><ChevronLeft className="h-4 w-4" /></span>
          <span role="presentation" onClick={(event) => { event.stopPropagation(); moveImage(1); }} className="rounded-full bg-[#0b224c]/80 p-2 text-white"><ChevronRight className="h-4 w-4" /></span>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-1.5">
          {article.images.map((image, index) => (
            <span key={image} className={`h-1.5 rounded-full transition-all ${activeImage === index ? 'w-5 bg-[#f5b800]' : 'w-1.5 bg-white/70'}`} />
          ))}
        </div>
      </button>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[11px] font-extrabold uppercase tracking-wide text-[#1d58c8]">{article.category}</span>
        <button type="button" onClick={onOpen} className="mt-1 text-left font-heading text-xl font-black text-[#0b224c] hover:text-[#1d58c8]">{article.title}</button>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{article.summary}</p>
        <button type="button" onClick={onOpen} className="mt-5 inline-flex items-center gap-1.5 text-left text-xs font-extrabold text-[#1d58c8]">
          Leer más <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
}

function PhotoLightbox({ photos, selectedIndex, onClose, onChange }) {
  if (selectedIndex === null) return null;
  const currentPhoto = photos[selectedIndex];
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#061633]/95 p-4" role="dialog" aria-modal="true" aria-label="Visor de fotografía">
      <button type="button" onClick={onClose} className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Cerrar fotografía"><X className="h-6 w-6" /></button>
      <button type="button" onClick={() => onChange((selectedIndex - 1 + photos.length) % photos.length)} className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Fotografía anterior"><ChevronLeft className="h-6 w-6" /></button>
      <div className="max-w-5xl text-center">
        <img src={currentPhoto.src} alt={currentPhoto.alt} className="max-h-[78vh] w-auto rounded-2xl object-contain shadow-2xl" />
        <p className="mt-4 text-sm font-semibold text-white">{currentPhoto.alt}</p>
        <p className="mt-1 text-xs text-slate-300">{selectedIndex + 1} / {photos.length}</p>
      </div>
      <button type="button" onClick={() => onChange((selectedIndex + 1) % photos.length)} className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Fotografía siguiente"><ChevronRight className="h-6 w-6" /></button>
    </div>
  );
}

function NewsDetail({ article, onBack, onSelectArticle }) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const selectedTimeline = article.timeline[selectedDay];
  const photos = useMemo(() => article.timeline.flatMap((day) => day.images.map((src) => ({ src, alt: `${day.title} - ${day.terminal}` }))), [article.timeline]);
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${article.title} - SINTRAUNIF SUBUS`)}`;

  return (
    <article className="bg-[#f4f7fb]">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0b224c] hover:text-[#1d58c8]"><ArrowLeft className="h-4 w-4" /> Volver a todas las noticias</button>
          <a href={shareUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2.5 text-xs font-extrabold text-white"><MessageCircle className="h-4 w-4" /> Compartir por WhatsApp</a>
        </div>
        <nav className="mt-4 text-xs text-slate-500" aria-label="Breadcrumb">Inicio <span className="mx-2">/</span> Noticias <span className="mx-2">/</span> <span className="font-semibold text-[#0b224c]">{article.title}</span></nav>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-extrabold uppercase tracking-wide text-[#1d58c8]"><span className="rounded-full bg-[#f5b800] px-3 py-1 text-[#0b224c]">{article.category}</span><span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {article.date}</span></div>
          <h1 className="mt-4 max-w-4xl font-heading text-4xl font-black italic leading-tight text-[#0b224c] sm:text-6xl">{article.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">{article.summary}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500"><span className="flex items-center gap-1.5"><UserRound className="h-4 w-4 text-[#1d58c8]" /> Directiva SINTRAUNIF - SUBUS</span><span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#1d58c8]" /> {article.terminals}</span></div>
        </header>

        <div className="relative mt-8 h-64 overflow-hidden rounded-3xl shadow-xl sm:h-[26rem]"><img src={article.images[0]} alt={article.title} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#0b224c]/70 to-transparent" /></div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="space-y-5 text-base leading-8 text-slate-700">
            {article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <blockquote className="border-l-4 border-[#f5b800] bg-[#0f2e66] p-6 font-heading text-xl font-bold italic leading-relaxed text-white">“{article.quote}”</blockquote>
          </div>
          <aside className="h-fit rounded-2xl border border-[#f5b800]/40 bg-[#f5b800]/20 p-5">
            <h2 className="font-heading text-lg font-black italic text-[#0b224c]">Puntos clave</h2>
            <ul className="mt-4 space-y-3 text-sm font-semibold text-[#0b224c]">{article.keyPoints.map((point) => <li key={point} className="flex gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0f2e66]" />{point}</li>)}</ul>
          </aside>
        </div>

        <section className="mt-14">
          <div className="flex items-end justify-between gap-4"><div><div className="flex items-center gap-2.5"><span className="h-1 w-6 rounded-full bg-[#f5b800]" /><span className="text-xs font-extrabold uppercase tracking-wider text-[#1d58c8]">Registro visual</span></div><h2 className="mt-2 font-heading text-3xl font-black italic text-[#0b224c]">Registro Fotográfico y Cronología por Día</h2><p className="mt-2 text-sm text-slate-600">Calendario de la actividad en los terminales.</p></div><Clock3 className="hidden h-8 w-8 text-[#f5b800] sm:block" /></div>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">{article.timeline.map((day, index) => <button type="button" key={day.day} onClick={() => setSelectedDay(index)} className={`min-w-[120px] rounded-xl px-4 py-3 text-left transition ${selectedDay === index ? 'bg-[#0b224c] text-white shadow-lg' : 'bg-white text-[#0b224c] shadow-sm'}`}><span className="text-[10px] font-extrabold text-[#f5b800]">{day.month}</span><span className="block text-2xl font-black">{day.day}</span><span className="text-[10px]">{day.terminal}</span></button>)}</div>
          <div className="mt-4 grid gap-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-md md:grid-cols-[180px_1fr]">
            <div className="rounded-2xl bg-[#0f2e66] p-5 text-white"><p className="text-4xl font-black text-[#f5b800]">{selectedTimeline.day}</p><p className="font-extrabold">{selectedTimeline.month}</p><p className="mt-4 flex items-center gap-1.5 text-xs"><Clock3 className="h-4 w-4 text-[#f5b800]" /> {selectedTimeline.time}</p><p className="mt-2 flex items-start gap-1.5 text-xs"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#f5b800]" /> {selectedTimeline.terminal}</p><p className="mt-5 text-sm font-bold">{selectedTimeline.title}</p></div>
            <div className="grid gap-3 sm:grid-cols-2">{selectedTimeline.images.map((src, index) => <button type="button" key={src} onClick={() => setLightboxIndex(article.timeline.slice(0, selectedDay).reduce((total, day) => total + day.images.length, 0) + index)} className="group relative h-52 overflow-hidden rounded-2xl text-left"><img src={src} alt={`${selectedTimeline.title} ${index + 1}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b224c]/80 p-3 text-xs font-bold text-white">Ampliar fotografía</span></button>)}</div>
          </div>
        </section>

        <section className="mt-14 border-t border-slate-200 pt-8"><h2 className="font-heading text-2xl font-black italic text-[#0b224c]">Otras noticias que te pueden interesar</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{NEWS_ARTICLES.filter((item) => item.id !== article.id).map((item) => <button type="button" key={item.id} onClick={() => { onSelectArticle(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-4 rounded-2xl bg-white p-3 text-left shadow-sm transition hover:shadow-md"><img src={item.images[0]} alt={item.title} className="h-20 w-24 rounded-xl object-cover" /><span><span className="text-[10px] font-extrabold uppercase text-[#1d58c8]">{item.date}</span><span className="mt-1 block text-sm font-bold text-[#0b224c]">{item.title}</span></span><ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#1d58c8]" /></button>)}</div></section>
      </div>
      <PhotoLightbox photos={photos} selectedIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onChange={setLightboxIndex} />
    </article>
  );
}

export default function NoticiasSection({ initialNewsId = null, onBackToHome }) {
  const [selectedId, setSelectedId] = useState(initialNewsId);
  const [adminArticles, setAdminArticles] = useState([]);
  const articles = [...adminArticles, ...NEWS_ARTICLES];
  const selectedArticle = articles.find((article) => article.id === selectedId);

  useEffect(() => {
    if (initialNewsId) setSelectedId(initialNewsId);
  }, [initialNewsId]);

  useEffect(() => {
    const refresh = () => {
      try {
        setAdminArticles(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.news) || '[]'));
      } catch {
        setAdminArticles([]);
      }
    };
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('sintraunif-content-updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('sintraunif-content-updated', refresh);
    };
  }, []);

  if (selectedArticle) {
    return <NewsDetail article={selectedArticle} onBack={() => { setSelectedId(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onSelectArticle={setSelectedId} />;
  }

  return (
    <section className="bg-[#f4f7fb] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><div className="mb-1 flex items-center gap-2.5"><span className="h-1 w-6 rounded-full bg-[#f5b800]" /><span className="text-xs font-extrabold uppercase tracking-wider text-[#1d58c8]">PRENSA Y COMUNICADOS OFICIALES</span></div><h1 className="font-heading text-4xl font-black italic text-[#0b224c]">Todas las noticias de SINTRAUNIF</h1><p className="mt-2 text-sm text-slate-600">Información oficial para las bases de San José, Catemito y Los Libertadores.</p></div>
          <button type="button" onClick={onBackToHome} className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0b224c]"><ArrowLeft className="h-4 w-4" /> Volver al inicio</button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">{articles.map((article) => <NewsCarousel key={article.id} article={article} onOpen={() => { setSelectedId(article.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />)}</div>
      </div>
    </section>
  );
}
