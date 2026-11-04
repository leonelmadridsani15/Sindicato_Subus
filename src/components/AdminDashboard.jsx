import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  FileText,
  ImagePlus,
  LogOut,
  Newspaper,
  Plus,
  ShieldCheck,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

export const STORAGE_KEYS = {
  news: 'sintraunif.admin.news',
  documents: 'sintraunif.admin.documents',
};

const CONTENT_EVENT = 'sintraunif-content-updated';
const ADMIN_USER = 'admin@sintraunif.cl';
const ADMIN_PASSWORD = 'sintraunif2026';
const NEWS_CATEGORIES = ['Beneficios', 'Negociación Colectiva', 'Comunicado Oficial'];
const DOCUMENT_CATEGORIES = [
  'Contrato Colectivo',
  'Estatutos y Reglamentos',
  'Formularios y Solicitudes',
  'Actas de Asamblea',
];

function readItems(key) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveItems(key, items) {
  window.localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CONTENT_EVENT));
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`No se pudo leer ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function Login({ onLogin }) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (user.trim().toLowerCase() === ADMIN_USER && password === ADMIN_PASSWORD) {
      onLogin();
      return;
    }
    setError('Usuario o clave incorrectos.');
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f4f7fb] px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b224c] text-[#f5b800]">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-center font-heading text-2xl font-black italic text-[#0b224c]">Acceso Directiva</h1>
        <p className="mt-2 text-center text-xs text-slate-500">Panel privado de administración SINTRAUNIF SUBUS</p>
        <div className="mt-6 space-y-4">
          <label className="block text-xs font-bold text-slate-700">Usuario
            <input type="email" required value={user} onChange={(event) => setUser(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none focus:border-[#0b224c]" placeholder="admin@sintraunif.cl" />
          </label>
          <label className="block text-xs font-bold text-slate-700">Clave
            <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none focus:border-[#0b224c]" placeholder="••••••••" />
          </label>
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs font-bold text-red-700">{error}</p>}
        <button type="submit" className="mt-6 w-full rounded-xl bg-[#f5b800] px-4 py-3 font-extrabold text-[#0b224c] transition hover:bg-[#eab308]">Ingresar al panel</button>
        <p className="mt-5 rounded-xl bg-[#f4f7fb] p-3 text-center text-[11px] text-slate-500">Demo: admin@sintraunif.cl / sintraunif2026</p>
      </form>
    </main>
  );
}

function NewsManager({ items, setItems, notify }) {
  const [form, setForm] = useState({
    title: '', date: '', category: NEWS_CATEGORIES[0], summary: '', content: '', terminal: 'San José • Catemito • Los Libertadores',
  });
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const selectPhotos = async (event) => {
    const selected = Array.from(event.target.files || []);
    const prepared = await Promise.all(selected.map(async (file, index) => ({
      src: await fileToDataUrl(file),
      name: file.name,
      day: `Día ${index + 1}`,
      terminal: 'Terminal San José',
    })));
    setPhotos(prepared);
  };
  const updatePhoto = (index, field, value) => setPhotos((current) => current.map((photo, photoIndex) => photoIndex === index ? { ...photo, [field]: value } : photo));

  const publish = async (event) => {
    event.preventDefault();
    setSaving(true);
    const images = photos.length ? photos.map((photo) => photo.src) : ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=85'];
    const article = {
      id: `admin-news-${Date.now()}`,
      ...form,
      images,
      paragraphs: [form.content],
      quote: 'La directiva SINTRAUNIF mantiene informadas a sus bases.',
      keyPoints: photos.map((photo) => `${photo.day} · ${photo.terminal}`),
      timeline: photos.length ? photos.map((photo, index) => ({ day: String(index + 1).padStart(2, '0'), month: form.date.slice(-3) || 'NOV', time: '09:00 hrs', terminal: photo.terminal, title: photo.day, images: [photo.src] })) : [],
      createdByAdmin: true,
      featured: false,
    };
    const next = [article, ...items];
    saveItems(STORAGE_KEYS.news, next);
    setItems(next);
    setForm({ title: '', date: '', category: NEWS_CATEGORIES[0], summary: '', content: '', terminal: 'San José • Catemito • Los Libertadores' });
    setPhotos([]);
    setSaving(false);
    notify('Noticia publicada y disponible en la sección pública.');
  };

  const remove = (id) => {
    const next = items.filter((item) => item.id !== id);
    saveItems(STORAGE_KEYS.news, next);
    setItems(next);
  };

  const toggleFeatured = (id) => {
    const next = items.map((item) => item.id === id ? { ...item, featured: !item.featured } : item);
    saveItems(STORAGE_KEYS.news, next);
    setItems(next);
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
      <form onSubmit={publish} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
        <h2 className="font-heading text-2xl font-black italic text-[#0b224c]">Publicar noticia</h2>
        <div className="mt-5 space-y-4">
          <input name="title" required value={form.title} onChange={update} placeholder="Título de la noticia" className="admin-input" />
          <div className="grid gap-4 sm:grid-cols-2"><input name="date" required value={form.date} onChange={update} placeholder="05 NOV" className="admin-input" /><select name="category" value={form.category} onChange={update} className="admin-input">{NEWS_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></div>
          <input name="terminal" value={form.terminal} onChange={update} placeholder="Terminales involucrados" className="admin-input" />
          <textarea name="summary" required value={form.summary} onChange={update} rows={3} placeholder="Resumen corto para la tarjeta de inicio" className="admin-input" />
          <textarea name="content" required value={form.content} onChange={update} rows={6} placeholder="Cuerpo completo de la noticia" className="admin-input" />
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 p-4 text-xs font-bold text-[#0b224c] hover:border-[#f5b800]">
            <ImagePlus className="h-5 w-5 text-[#1d58c8]" /> Seleccionar múltiples fotografías
            <input type="file" multiple accept="image/*" onChange={selectPhotos} className="hidden" />
          </label>
          {photos.length > 0 && <div className="space-y-3">{photos.map((photo, index) => <div key={photo.name + index} className="flex gap-3 rounded-xl bg-[#f4f7fb] p-2"><img src={photo.src} alt={photo.name} className="h-16 w-20 rounded-lg object-cover" /><div className="grid flex-1 gap-2 sm:grid-cols-2"><input value={photo.day} onChange={(event) => updatePhoto(index, 'day', event.target.value)} className="admin-input py-2" placeholder="Día / etapa" /><input value={photo.terminal} onChange={(event) => updatePhoto(index, 'terminal', event.target.value)} className="admin-input py-2" placeholder="Terminal" /></div></div>)}</div>}
        </div>
        <button disabled={saving} type="submit" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#f5b800] px-5 py-3 text-xs font-extrabold text-[#0b224c] disabled:opacity-60"><Upload className="h-4 w-4" /> {saving ? 'Guardando...' : 'Publicar noticia'}</button>
      </form>
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
        <h2 className="font-heading text-2xl font-black italic text-[#0b224c]">Noticias creadas por la directiva</h2>
        <div className="mt-5 space-y-3">{items.length === 0 && <p className="text-sm text-slate-500">Todavía no hay noticias nuevas.</p>}{items.map((item) => <div key={item.id} className="flex items-start gap-3 rounded-xl bg-[#f4f7fb] p-3"><Newspaper className="mt-1 h-5 w-5 shrink-0 text-[#1d58c8]" /><div className="min-w-0 flex-1"><p className="text-sm font-bold text-[#0b224c]">{item.title}</p><p className="text-[11px] text-slate-500">{item.date} · {item.category}</p><div className="mt-2 flex gap-2"><button type="button" onClick={() => toggleFeatured(item.id)} className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-bold ${item.featured ? 'bg-[#f5b800] text-[#0b224c]' : 'bg-white text-slate-600'}`}><Star className="h-3 w-3" /> {item.featured ? 'Destacada' : 'Destacar'}</button><button type="button" onClick={() => remove(item.id)} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-[10px] font-bold text-red-700"><Trash2 className="h-3 w-3" /> Eliminar</button></div></div></div>)}</div>
      </div>
    </div>
  );
}

function DocumentsManager({ items, setItems, notify }) {
  const [form, setForm] = useState({ title: '', category: DOCUMENT_CATEGORIES[0], description: '', points: '' });
  const [file, setFile] = useState(null);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const publish = async (event) => {
    event.preventDefault();
    const document = {
      id: `admin-document-${Date.now()}`,
      ...form,
      type: 'PDF',
      size: file ? formatBytes(file.size) : 'Sin archivo',
      fileName: file?.name || '',
      fileData: file ? await fileToDataUrl(file) : '',
      date: `Actualizado: ${new Date().toLocaleDateString('es-CL')}`,
      status: 'Vigente',
      summary: form.description,
      points: form.points.split('\n').map((point) => point.trim()).filter(Boolean),
      createdByAdmin: true,
    };
    const next = [document, ...items];
    saveItems(STORAGE_KEYS.documents, next);
    setItems(next);
    setForm({ title: '', category: DOCUMENT_CATEGORIES[0], description: '', points: '' });
    setFile(null);
    event.target.reset();
    notify('Documento publicado y disponible en la biblioteca pública.');
  };
  const remove = (id) => { const next = items.filter((item) => item.id !== id); saveItems(STORAGE_KEYS.documents, next); setItems(next); };
  const toggleStatus = (id) => { const next = items.map((item) => item.id === id ? { ...item, status: item.status === 'Vigente' ? 'Histórico' : 'Vigente' } : item); saveItems(STORAGE_KEYS.documents, next); setItems(next); };

  return (
    <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
      <form onSubmit={publish} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg">
        <h2 className="font-heading text-2xl font-black italic text-[#0b224c]">Subir documento PDF</h2>
        <div className="mt-5 space-y-4"><input name="title" required value={form.title} onChange={update} placeholder="Título del documento" className="admin-input" /><select name="category" value={form.category} onChange={update} className="admin-input">{DOCUMENT_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select><textarea name="description" required value={form.description} onChange={update} rows={3} placeholder="Descripción para el conductor" className="admin-input" /><textarea name="points" value={form.points} onChange={update} rows={4} placeholder="Puntos clave, uno por línea" className="admin-input" /><label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 p-4 text-xs font-bold text-[#0b224c] hover:border-[#f5b800]"><FileText className="h-5 w-5 text-[#1d58c8]" /> {file ? `${file.name} · ${formatBytes(file.size)}` : 'Seleccionar archivo PDF'}<input type="file" accept=".pdf,application/pdf" required={!file} onChange={(event) => setFile(event.target.files?.[0] || null)} className="hidden" /></label></div>
        <button type="submit" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#f5b800] px-5 py-3 text-xs font-extrabold text-[#0b224c]"><Plus className="h-4 w-4" /> Publicar documento</button>
      </form>
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg"><h2 className="font-heading text-2xl font-black italic text-[#0b224c]">Documentos publicados por la directiva</h2><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="border-b border-slate-200 text-[10px] uppercase text-slate-500"><tr><th className="pb-3">Documento</th><th className="pb-3">Categoría</th><th className="pb-3">Estado</th><th className="pb-3">Acciones</th></tr></thead><tbody className="divide-y divide-slate-100">{items.map((item) => <tr key={item.id}><td className="py-3 pr-3 font-bold text-[#0b224c]">{item.title}<span className="block text-[10px] font-normal text-slate-500">{item.size}</span></td><td className="py-3 pr-3 text-slate-600">{item.category}</td><td className="py-3 pr-3"><button type="button" onClick={() => toggleStatus(item.id)} className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.status === 'Vigente' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{item.status}</button></td><td className="py-3"><button type="button" onClick={() => remove(item.id)} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-[10px] font-bold text-red-700"><Trash2 className="h-3 w-3" /> Eliminar</button></td></tr>)}</tbody></table>{items.length === 0 && <p className="py-6 text-sm text-slate-500">Todavía no hay documentos nuevos.</p>}</div></div>
    </div>
  );
}

export default function AdminDashboard({ onLogout, notify }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeModule, setActiveModule] = useState('news');
  const [news, setNews] = useState(() => readItems(STORAGE_KEYS.news));
  const [documents, setDocuments] = useState(() => readItems(STORAGE_KEYS.documents));
  const [message, setMessage] = useState('');

  const notifyUser = (text) => {
    setMessage(text);
    notify?.(text);
    window.setTimeout(() => setMessage(''), 3500);
  };

  useEffect(() => {
    if (!authenticated) return undefined;
    const refresh = () => {
      setNews(readItems(STORAGE_KEYS.news));
      setDocuments(readItems(STORAGE_KEYS.documents));
    };
    window.addEventListener(CONTENT_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(CONTENT_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [authenticated]);

  if (!authenticated) return <Login onLogin={() => setAuthenticated(true)} />;

  return (
    <main className="min-h-[75vh] bg-[#f4f7fb] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[#0b224c] p-5 text-white shadow-xl sm:p-6">
          <div><p className="text-xs font-extrabold uppercase tracking-wider text-[#f5b800]">Panel privado</p><h1 className="font-heading text-2xl font-black italic">Administración SINTRAUNIF</h1><p className="mt-1 text-xs text-blue-100">Publica noticias y documentos para las bases.</p></div>
          <button type="button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs font-bold transition hover:bg-white/10"><LogOut className="h-4 w-4" /> Cerrar Sesión de Admin y ver como Socio</button>
        </header>
        <nav className="mt-6 flex gap-2 rounded-2xl bg-white p-2 shadow-md"><button type="button" onClick={() => setActiveModule('news')} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-extrabold ${activeModule === 'news' ? 'bg-[#0b224c] text-white' : 'text-slate-600'}`}><Newspaper className="h-4 w-4" /> Noticias</button><button type="button" onClick={() => setActiveModule('documents')} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-extrabold ${activeModule === 'documents' ? 'bg-[#0b224c] text-white' : 'text-slate-600'}`}><FileText className="h-4 w-4" /> Documentos</button></nav>
        {message && <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> {message}</p>}
        <div className="mt-6">{activeModule === 'news' ? <NewsManager items={news} setItems={setNews} notify={notifyUser} /> : <DocumentsManager items={documents} setItems={setDocuments} notify={notifyUser} />}</div>
      </div>
    </main>
  );
}
