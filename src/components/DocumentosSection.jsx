import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  Download,
  FileCheck2,
  FileText,
  Search,
  X,
} from 'lucide-react';
import { STORAGE_KEYS } from './AdminDashboard';

const CATEGORIES = [
  'Todos',
  'Contrato Colectivo',
  'Estatutos y Reglamentos',
  'Formularios y Solicitudes',
  'Actas de Asamblea',
];

const QUICK_CLAUSES = [
  {
    title: 'Bono de locomoción, colación y vacaciones',
    description:
      'Consulta los beneficios asociados a traslados, alimentación durante la jornada y feriado legal.',
    points: ['Asignación de locomoción', 'Colación por turno', 'Feriado legal y permisos'],
  },
  {
    title: 'Jornada laboral, descansos y horas extra',
    description:
      'Revisa la distribución de turnos, los descansos en cabezal y la forma de registrar horas extraordinarias.',
    points: ['Jornada y cambios de turno', 'Descansos mínimos', 'Autorización de horas extra'],
  },
  {
    title: 'Aguinaldos y bonos de escolaridad',
    description:
      'Encuentra los requisitos y fechas de pago de los beneficios familiares contemplados en el contrato.',
    points: ['Fiestas Patrias y Navidad', 'Bono de escolaridad', 'Documentación requerida'],
  },
  {
    title: 'Defensa ante siniestros o amonestaciones',
    description:
      'Guía rápida para solicitar apoyo sindical antes de firmar descargos o entregar una declaración.',
    points: ['Aviso al delegado', 'Asesoría jurídica', 'Protocolo de siniestros'],
  },
];

const DOCUMENTS = [
  {
    id: 1,
    title: 'Contrato Colectivo Vigente SINTRAUNIF - SUBUS',
    category: 'Contrato Colectivo',
    type: 'PDF',
    size: '4.2 MB',
    date: 'Actualizado: enero 2026',
    status: 'Vigente',
    description: 'Consulta remuneraciones, turnos, descansos, bonos y beneficios colectivos.',
    keywords: 'bono vacaciones turno colación locomoción jornada horas extra',
    summary:
      'Documento principal que reúne las condiciones laborales pactadas entre SINTRAUNIF y SUBUS.',
    points: ['Jornada y descansos en cabezal', 'Bonos, asignaciones y aguinaldos', 'Procedimiento para solicitar beneficios'],
  },
  {
    id: 2,
    title: 'Estatuto Oficial del Sindicato SINTRAUNIF',
    category: 'Estatutos y Reglamentos',
    type: 'PDF',
    size: '1.8 MB',
    date: 'Actualizado: noviembre 2025',
    status: 'Vigente',
    description: 'Conoce la organización, derechos, deberes y participación de los socios.',
    keywords: 'estatutos socios directiva elecciones asamblea reglamento',
    summary:
      'Estatuto que define la estructura de SINTRAUNIF, sus órganos de representación y la participación sindical.',
    points: ['Derechos y deberes de los socios', 'Funciones de la directiva', 'Asambleas y procesos electorales'],
  },
  {
    id: 3,
    title: 'Reglamento Interno de Orden, Higiene y Seguridad SUBUS',
    category: 'Estatutos y Reglamentos',
    type: 'PDF',
    size: '3.5 MB',
    date: 'Actualizado: marzo 2026',
    status: 'Vigente',
    description: 'Revisa protocolos de seguridad, prevención de riesgos y obligaciones en ruta.',
    keywords: 'frenos seguridad higiene accidente siniestro ruta prevención',
    summary:
      'Guía de referencia para trabajar de forma segura, reportar riesgos y actuar ante incidentes operativos.',
    points: ['Reporte de fallas y frenos', 'Elementos de protección', 'Accidentes y prevención de riesgos'],
  },
  {
    id: 4,
    title: 'Formulario de Solicitud de Beneficio por Natalidad / Matrimonio / Defunción',
    category: 'Formularios y Solicitudes',
    type: 'PDF/Formulario',
    size: '450 KB',
    date: 'Actualizado: febrero 2026',
    status: 'Descargable',
    description: 'Solicita beneficios familiares presentando los antecedentes correspondientes.',
    keywords: 'beneficio natalidad matrimonio defunción familia formulario',
    summary:
      'Formulario único para iniciar solicitudes de apoyo familiar contempladas en los convenios sindicales.',
    points: ['Datos del socio y cargas', 'Antecedentes que debes adjuntar', 'Canal de entrega y plazos'],
  },
  {
    id: 5,
    title: 'Formulario de Solicitud de Préstamo de Emergencia Sindical',
    category: 'Formularios y Solicitudes',
    type: 'PDF',
    size: '380 KB',
    date: 'Actualizado: abril 2026',
    status: 'Descargable',
    description: 'Solicita apoyo económico extraordinario en situaciones familiares urgentes.',
    keywords: 'préstamo emergencia ayuda cuota tesorería formulario',
    summary:
      'Solicitud para evaluar un préstamo de emergencia, sujeto a los requisitos y disponibilidad del fondo sindical.',
    points: ['Motivo de la emergencia', 'Documentos de respaldo', 'Evaluación y forma de pago'],
  },
  {
    id: 6,
    title: 'Acta de Asamblea General - Terminales San José, Catemito y Los Libertadores',
    category: 'Actas de Asamblea',
    type: 'PDF',
    size: '1.1 MB',
    date: 'Actualizado: mayo 2026',
    status: 'Acta oficial',
    description: 'Revisa acuerdos, votaciones y compromisos informados a las bases.',
    keywords: 'acta asamblea acuerdos terminal san josé catemito libertadores votación',
    summary:
      'Registro oficial de los acuerdos tomados en la asamblea general de los tres terminales.',
    points: ['Acuerdos aprobados', 'Votaciones de las bases', 'Compromisos de la directiva'],
  },
];

function FileIcon({ type }) {
  return type.includes('Formulario') ? (
    <FileCheck2 className="h-6 w-6" />
  ) : (
    <FileText className="h-6 w-6" />
  );
}

export default function DocumentosSection({ onNotify }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openClause, setOpenClause] = useState(0);
  const [adminDocuments, setAdminDocuments] = useState([]);

  useEffect(() => {
    const refresh = () => {
      try {
        setAdminDocuments(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.documents) || '[]'));
      } catch {
        setAdminDocuments([]);
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

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...adminDocuments, ...DOCUMENTS].filter((document) => {
      const matchesCategory = category === 'Todos' || document.category === category;
      const searchableText = `${document.title} ${document.description} ${document.keywords}`.toLowerCase();
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [category, query]);

  const downloadDocument = (document) => {
    if (document.fileData) {
      const link = window.document.createElement('a');
      link.href = document.fileData;
      link.download = document.fileName || `${document.title}.pdf`;
      link.click();
      return;
    }
    onNotify?.(`Descarga preparada: ${document.title}`);
  };

  return (
    <section className="bg-[#f4f7fb] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="mb-1 flex items-center gap-2.5">
            <span className="h-1 w-6 rounded-full bg-[#f5b800]" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#1d58c8]">
              BIBLIOTECA LEGAL Y TRANSPARENCIA
            </span>
          </div>
          <h1 className="font-heading text-3xl font-black italic text-[#0b224c]">
            Documentos para nuestros conductores
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Encuentra contratos, reglamentos, formularios y actas oficiales de SINTRAUNIF SUBUS.
          </p>
        </div>

        <div className="mb-10 overflow-hidden rounded-2xl bg-[#0f2e66] p-6 text-white shadow-xl sm:p-8">
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-xl bg-[#f5b800] p-2 text-[#0b224c]">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#f5b800]">
                Ayuda rápida para el conductor
              </p>
              <h2 className="font-heading text-2xl font-black italic">
                Buscador rápido de cláusulas
              </h2>
              <p className="mt-1 text-sm text-blue-100">
                Revisa los temas más consultados del contrato colectivo.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {QUICK_CLAUSES.map((clause, index) => {
              const isOpen = openClause === index;
              return (
                <div key={clause.title} className="rounded-xl border border-white/15 bg-white/10">
                  <button
                    type="button"
                    onClick={() => setOpenClause(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left"
                  >
                    <span className="text-sm font-bold">{clause.title}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-[#f5b800] transition ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/15 px-4 pb-4 pt-3 text-xs text-blue-100">
                      <p>{clause.description}</p>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                        {clause.points.map((point) => (
                          <li key={point} className="flex items-center gap-1.5 font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#f5b800]" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  category === item
                    ? 'bg-[#0b224c] text-white shadow-md'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-[#1d58c8] hover:text-[#0b224c]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar bono, vacaciones, frenos..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-xs shadow-sm outline-none transition focus:border-[#0b224c]"
              aria-label="Buscar documentos"
            />
          </div>
        </div>

        {filteredDocuments.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredDocuments.map((document) => (
              <article key={document.id} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-xl bg-[#0b224c]/10 p-3 text-[#0b224c]">
                    <FileIcon type={document.type} />
                  </div>
                  <span className="rounded-full bg-[#f5b800]/20 px-2.5 py-1 text-[10px] font-extrabold text-[#0b224c]">
                    {document.status}
                  </span>
                </div>
                <div className="mt-4 flex-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#1d58c8]">
                    {document.category}
                  </span>
                  <h3 className="mt-1 font-heading text-lg font-black text-[#0b224c]">{document.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{document.description}</p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{document.date}</span>
                  <span>{document.type} · {document.size}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDocument(document)}
                    className="flex items-center justify-center gap-1 rounded-xl border border-[#0b224c] px-3 py-2.5 text-xs font-bold text-[#0b224c] transition hover:bg-slate-50"
                  >
                    Vista Previa <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadDocument(document)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-[#f5b800] px-3 py-2.5 text-xs font-bold text-[#0b224c] transition hover:bg-[#eab308]"
                  >
                    <Download className="h-3.5 w-3.5" /> Descargar PDF
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-3 text-sm font-bold text-[#0b224c]">No encontramos documentos</p>
            <p className="mt-1 text-xs text-slate-500">Prueba con otra palabra o categoría.</p>
          </div>
        )}
      </div>

      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b224c]/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="document-preview-title">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1d58c8]">{selectedDocument.category}</span>
                <h2 id="document-preview-title" className="mt-1 font-heading text-xl font-black text-[#0b224c]">{selectedDocument.title}</h2>
              </div>
              <button type="button" onClick={() => setSelectedDocument(null)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Cerrar vista previa">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-slate-600">{selectedDocument.summary}</p>
            <h3 className="mt-6 text-sm font-extrabold uppercase tracking-wide text-[#0b224c]">Artículos y puntos clave</h3>
            <ul className="mt-3 space-y-2">
              {selectedDocument.points.map((point) => (
                <li key={point} className="flex items-start gap-2 rounded-xl bg-[#f4f7fb] p-3 text-sm text-slate-700">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#f5b800]" />{point}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">
              <button type="button" onClick={() => setSelectedDocument(null)} className="rounded-full px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100">Cerrar</button>
              <button type="button" onClick={() => downloadDocument(selectedDocument)} className="flex items-center gap-2 rounded-full bg-[#f5b800] px-5 py-2.5 text-xs font-bold text-[#0b224c]">
                <Download className="h-4 w-4" /> Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
