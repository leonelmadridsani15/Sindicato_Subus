import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
} from 'lucide-react';

const WHATSAPP_NUMBER = '56987654321';
const WHATSAPP_LABEL = '+56 9 8765 4321';
const EMAIL = 'info@sintraunif.cl';
const FIXED_PHONE = '(+562) 2858 4522';

const WHATSAPP_REASONS = [
  'Urgencia en Ruta / Accidente',
  'Consulta sobre Beneficios o Convenios',
  'Asesoría Legal / Amonestación',
  'Certificado de Afiliación',
];

const TERMINALS = [
  'Terminal San José',
  'Terminal Catemito',
  'Terminal Los Libertadores',
];

const REQUEST_TYPES = [
  'Consulta General',
  'Reporte de Máquina/Bus con falla',
  'Problemas en Cabezal/Baños',
  'Solicitud de Reunión con Directiva',
];

const initialForm = {
  name: '',
  rut: '',
  terminal: TERMINALS[0],
  requestType: REQUEST_TYPES[0],
  message: '',
};

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function ContactoSection({ onNotify }) {
  const [reason, setReason] = useState(WHATSAPP_REASONS[0]);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const directWhatsAppUrl = useMemo(
    () =>
      buildWhatsAppUrl(
        `Hola, soy socio de SINTRAUNIF SUBUS. Necesito ayuda con: ${reason}.`,
      ),
    [reason],
  );

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSubmitted(false);
  };

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    const subject = `[SINTRAUNIF] ${form.requestType} - ${form.terminal}`;
    const body = [
      `Nombre: ${form.name}`,
      `RUT: ${form.rut}`,
      `Terminal: ${form.terminal}`,
      `Tipo de solicitud: ${form.requestType}`,
      '',
      form.message,
    ].join('\n');
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
    onNotify?.('Se abrió tu correo con los datos del reporte preparados.');
  };

  const handleWhatsAppSubmit = () => {
    const message = [
      'Hola, necesito contactar a SINTRAUNIF SUBUS.',
      `Nombre: ${form.name || 'No informado'}`,
      `RUT: ${form.rut || 'No informado'}`,
      `Terminal: ${form.terminal}`,
      `Solicitud: ${form.requestType}`,
      `Mensaje: ${form.message || 'Sin detalle adicional'}`,
    ].join('\n');
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative bg-[#f4f7fb] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2.5">
            <span className="h-1 w-6 rounded-full bg-[#f5b800]" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#1d58c8]">
              CANALES DE ATENCIÓN SINTRAUNIF
            </span>
          </div>
          <h1 className="font-heading text-4xl font-black italic text-[#0b224c]">
            Estamos para ayudarte
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Comunícate con la directiva, reporta una situación en ruta o solicita orientación para tus beneficios.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b224c] to-[#0f2e66] p-6 text-white shadow-xl sm:p-8">
          <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full border-[28px] border-[#f5b800]/15" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#f5b800]">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-[#25D366]" />
                </span>
                En línea · Lun a Vie 9:00 a 18:00 hrs
              </div>
              <h2 className="mt-3 font-heading text-3xl font-black italic sm:text-4xl">
                Atención rápida al socio
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100">
                Escríbenos directamente por WhatsApp y recibe orientación de un dirigente en tu terminal.
              </p>
              <div className="mt-6 flex flex-wrap gap-5 text-sm">
                <a href={`tel:${FIXED_PHONE.replace(/\D/g, '')}`} className="flex items-center gap-2 font-bold hover:text-[#f5b800]">
                  <Phone className="h-4 w-4 text-[#f5b800]" /> {FIXED_PHONE}
                </a>
                <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 font-bold hover:text-[#f5b800]">
                  <Mail className="h-4 w-4 text-[#f5b800]" /> {EMAIL}
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <label htmlFor="whatsapp-reason" className="text-xs font-bold text-blue-100">
                Motivo de consulta por WhatsApp
              </label>
              <select
                id="whatsapp-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/20 bg-[#13326b] px-3 py-3 text-xs text-white outline-none focus:border-[#f5b800]"
              >
                {WHATSAPP_REASONS.map((item) => <option key={item}>{item}</option>)}
              </select>
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#1da851]"
              >
                <MessageCircle className="h-5 w-5" /> Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg sm:p-8">
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2.5">
                <span className="h-1 w-6 rounded-full bg-[#f5b800]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#1d58c8]">FORMULARIO GREMIAL</span>
              </div>
              <h2 className="font-heading text-2xl font-black italic text-[#0b224c]">Contacto y reporte para conductores</h2>
              <p className="mt-2 text-xs text-slate-500">Completa tus datos y elige el canal de respuesta.</p>
            </div>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-700">Nombre Completo *
                  <input name="name" value={form.name} onChange={updateForm} required className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none focus:border-[#0b224c]" placeholder="Ej: Juan Morales" />
                </label>
                <label className="text-xs font-bold text-slate-700">RUT del Socio *
                  <input name="rut" value={form.rut} onChange={updateForm} required className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none focus:border-[#0b224c]" placeholder="12.345.678-9" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-700">Terminal *
                  <select name="terminal" value={form.terminal} onChange={updateForm} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#0b224c]">{TERMINALS.map((item) => <option key={item}>{item}</option>)}</select>
                </label>
                <label className="text-xs font-bold text-slate-700">Tipo de Solicitud *
                  <select name="requestType" value={form.requestType} onChange={updateForm} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#0b224c]">{REQUEST_TYPES.map((item) => <option key={item}>{item}</option>)}</select>
                </label>
              </div>
              <label className="block text-xs font-bold text-slate-700">Mensaje *
                <textarea name="message" value={form.message} onChange={updateForm} required rows={5} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none focus:border-[#0b224c]" placeholder="Describe tu consulta, reporte o patente del bus..." />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-[#f5b800] px-4 py-3 text-xs font-extrabold text-[#0b224c] transition hover:bg-[#eab308]">
                  <Send className="h-4 w-4" /> Enviar al Correo del Sindicato
                </button>
                <button type="button" onClick={handleWhatsAppSubmit} className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-xs font-extrabold text-white transition hover:bg-[#1da851]">
                  <MessageCircle className="h-4 w-4" /> Enviar estos datos por WhatsApp
                </button>
              </div>
              {submitted && (
                <p className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700" role="status">
                  <CheckCircle2 className="h-4 w-4" /> Tus datos están listos para enviarse al correo del sindicato.
                </p>
              )}
            </form>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg sm:p-8">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2.5">
                    <span className="h-1 w-6 rounded-full bg-[#f5b800]" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#1d58c8]">SEDE CENTRAL</span>
                  </div>
                  <h2 className="font-heading text-2xl font-black italic text-[#0b224c]">Encuéntranos en San Bernardo</h2>
                </div>
                <MapPin className="h-7 w-7 text-[#f5b800]" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-[#f4f7fb] p-3"><MapPin className="h-4 w-4 text-[#1d58c8]" /><p className="mt-2 text-[11px] font-bold text-[#0b224c]">San José #030, San Bernardo, Región Metropolitana</p></div>
                <div className="rounded-xl bg-[#f4f7fb] p-3"><Clock3 className="h-4 w-4 text-[#1d58c8]" /><p className="mt-2 text-[11px] font-bold text-[#0b224c]">Lunes a Viernes de 9:00 a 18:00 hrs</p></div>
                <div className="rounded-xl bg-[#f4f7fb] p-3"><Phone className="h-4 w-4 text-[#1d58c8]" /><p className="mt-2 text-[11px] font-bold text-[#0b224c]">{FIXED_PHONE}</p></div>
              </div>
              <iframe
                title="Mapa de la sede central SINTRAUNIF"
                src="https://www.google.com/maps?q=San+Jose+030,+San+Bernardo,+Chile&output=embed"
                className="mt-5 h-80 w-full rounded-2xl border-0 shadow-md"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a href="https://www.google.com/maps/search/?api=1&query=San+Jose+030+San+Bernardo" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#0f2e66] px-4 py-3 text-xs font-extrabold text-white transition hover:bg-[#0b224c]"><Navigation className="h-4 w-4 text-[#f5b800]" /> Abrir en Google Maps</a>
                <a href="https://waze.com/ul?q=San%20Jose%20030%20San%20Bernardo" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-[#0b224c] px-4 py-3 text-xs font-extrabold text-[#0b224c] transition hover:bg-slate-50"><Navigation className="h-4 w-4" /> Abrir en Waze</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a
        href={directWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 hidden items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-xs font-extrabold text-white shadow-2xl transition hover:bg-[#1da851] sm:flex"
      >
        <span className="relative"><MessageCircle className="h-6 w-6" /><span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#25D366] bg-white" /></span>
        ¿Eres socio? Escríbenos por WhatsApp
      </a>
    </section>
  );
}
