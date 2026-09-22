import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Bookmark,
  Terminal,
  Trash2,
  Copy,
  Check,
  Plus,
  X,
  ExternalLink,
  Award,
  BookOpen,
  Send,
  Download,
  Settings,
  ShieldCheck,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { searchOperators } from '../data/searchData';
import { technologiesData } from '../data/technologiesData';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadQueryIntoBuilder: (query: string) => void;
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  onLoadQueryIntoBuilder
}) => {
  const {
    user,
    progress,
    curatedQueries,
    allGlossaryTerms,
    deleteSavedSearch,
    addCuratedQuery,
    deleteCuratedQuery,
    addCustomGlossaryTerm,
    logout
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'estudiante' | 'gestion'>('estudiante');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New curated query form state
  const [newTitle, setNewTitle] = useState('');
  const [newQuery, setNewQuery] = useState('');
  const [newCategory, setNewCategory] = useState('Académica');
  const [newExplanation, setNewExplanation] = useState('');

  // New glossary term form state
  const [newTerm, setNewTerm] = useState('');
  const [newAcronym, setNewAcronym] = useState('');
  const [newDef, setNewDef] = useState('');
  const [newTechDetails, setNewTechDetails] = useState('');
  const [newTermCat, setNewTermCat] = useState<'web-protocolos' | 'datos-ia' | 'busqueda-seo' | 'seguridad-redes'>('datos-ia');

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddCurated = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newQuery.trim()) return;

    addCuratedQuery({
      title: newTitle.trim(),
      query: newQuery.trim(),
      category: newCategory,
      description: newExplanation.trim() || 'Consulta recomendada para estudio.',
      engine: 'google'
    });

    setNewTitle('');
    setNewQuery('');
    setNewExplanation('');
  };

  const handleAddGlossaryTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm.trim() || !newDef.trim()) return;

    const catLabels: Record<string, string> = {
      'web-protocolos': 'Web y Protocolos',
      'datos-ia': 'Datos e IA',
      'busqueda-seo': 'Búsqueda y SEO',
      'seguridad-redes': 'Seguridad y Redes'
    };

    addCustomGlossaryTerm({
      term: newTerm.trim(),
      acronym: newAcronym.trim() || undefined,
      category: newTermCat,
      categoryLabel: catLabels[newTermCat],
      definition: newDef.trim(),
      technicalDetails: newTechDetails.trim() || 'Concepto incorporado mediante el panel de gestión educativa.',
      relatedTerms: [newTerm.trim().toLowerCase()]
    });

    setNewTerm('');
    setNewAcronym('');
    setNewDef('');
    setNewTechDetails('');
  };

  const exportDossier = () => {
    const report = `# Dossier de Investigación Digital - Portal Educativo
Usuario: ${user?.name} (${user?.email})
Rol: ${user?.role}
Fecha: ${new Date().toLocaleDateString('es-ES')}

## 1. Progreso de la Guía Metodológica
Pasos completados: ${progress.completedGuideSteps.length} / 10 (${Math.round((progress.completedGuideSteps.length / 10) * 100)}%)

## 2. Consultas de Búsqueda Guardadas (${progress.savedSearches.length})
${progress.savedSearches
  .map(
    (s, i) => `### ${i + 1}. ${s.name}
- Sintaxis: \`${s.query}\`
- Notas: ${s.notes || 'Ninguna'}
- Fecha: ${new Date(s.createdAt).toLocaleString('es-ES')}
`
  )
  .join('\n')}

## 3. Operadores Marcados como Favoritos
${progress.favoriteOperatorIds.join(', ') || 'Ninguno'}
`;

    navigator.clipboard.writeText(report);
    alert('¡Dossier de investigación copiado al portapapeles en formato Markdown!');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
              {user?.name.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{user?.name || 'Mi Perfil de Aprendizaje'}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {user?.role || 'Estudiante'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportDossier}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
              title="Exportar dossier de investigación"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar Dossier</span>
            </button>
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 rounded-lg text-xs font-semibold border border-rose-800/50"
            >
              Cerrar Sesión
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              aria-label="Cerrar panel de gestión"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switch between Student and Admin Management */}
        <div className="flex rounded-xl bg-slate-950 p-1 my-4 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('estudiante')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'estudiante' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Mi Panel de Aprendizaje</span>
          </button>

          <button
            onClick={() => setActiveTab('gestion')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'gestion' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Panel de Gestión Educativa {user?.role === 'docente' ? '(Docente/Admin)' : '(Modo Demo)'}</span>
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-6 text-xs">
          {activeTab === 'estudiante' ? (
            /* Student Panel View */
            <div className="space-y-6">
              {/* Progress Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>Guía Metodológica</span>
                    <Award className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-xl font-black text-white">
                    {progress.completedGuideSteps.length} / 10
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-1">Pasos aplicados con éxito</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>Búsquedas Guardadas</span>
                    <Terminal className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-xl font-black text-white">
                    {progress.savedSearches.length}
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-1">Consultas listas para usar</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>Operadores Favoritos</span>
                    <Bookmark className="w-4 h-4 text-violet-400" />
                  </div>
                  <span className="text-xl font-black text-white">
                    {progress.favoriteOperatorIds.length}
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-1">Sintaxis guardadas</span>
                </div>
              </div>

              {/* Saved Searches Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Mis Consultas de Búsqueda Guardadas</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {progress.savedSearches.length} consultas
                  </span>
                </div>

                {progress.savedSearches.length === 0 ? (
                  <div className="text-center py-8 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400">
                    <p>No tienes consultas guardadas aún.</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Usa el <strong>Constructor de Búsquedas</strong> y pulsa "Guardar consulta".
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {progress.savedSearches.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white">{item.name}</span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <code className="font-mono text-cyan-300 text-[11px] block break-all">
                            {item.query}
                          </code>
                          {item.notes && (
                            <span className="text-[10px] text-slate-400 italic block mt-1">
                              {item.notes}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              onLoadQueryIntoBuilder(item.query);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 rounded text-[11px] flex items-center gap-1"
                            title="Cargar en el Constructor"
                          >
                            <Send className="w-3 h-3" />
                            <span>Cargar</span>
                          </button>

                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(item.query)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                            title="Probar en Google"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => handleCopy(item.id, item.query)}
                            className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                            title="Copiar consulta"
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => deleteSavedSearch(item.id)}
                            className="p-1 bg-rose-950/50 hover:bg-rose-900 text-rose-300 rounded border border-rose-800/60"
                            title="Eliminar consulta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Educational Management Panel View (Docente/Gestor) */
            <div className="space-y-6">
              {/* Management Metrics */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
                  Estadísticas de la Plataforma Educativa
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-lg font-black text-white">{technologiesData.length}</span>
                    <span className="block text-[10px] text-slate-400">Tecnologías</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-lg font-black text-cyan-400">{searchOperators.length}</span>
                    <span className="block text-[10px] text-slate-400">Operadores</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-lg font-black text-violet-400">{allGlossaryTerms.length}</span>
                    <span className="block text-[10px] text-slate-400">Términos Glosario</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-lg font-black text-emerald-400">{curatedQueries.length}</span>
                    <span className="block text-[10px] text-slate-400">Consultas Curadas</span>
                  </div>
                </div>
              </div>

              {/* Add New Curated Query for Students */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Añadir Consulta Curada para Alumnos</span>
                </h4>
                <p className="text-[11px] text-slate-400 mb-4">
                  Las consultas curadas quedan disponibles como plantillas para toda la comunidad de estudiantes.
                </p>

                <form onSubmit={handleAddCurated} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Título descriptivo</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Ej. Búsqueda de tesis doctorales"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Categoría</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      >
                        <option value="Académica">Académica</option>
                        <option value="Ciberseguridad">Ciberseguridad</option>
                        <option value="Programación">Programación</option>
                        <option value="Gubernamental">Gubernamental</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Sintaxis de búsqueda exacta</label>
                    <input
                      type="text"
                      value={newQuery}
                      onChange={(e) => setNewQuery(e.target.value)}
                      placeholder='Ej. "deep learning" site:arxiv.org filetype:pdf'
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-cyan-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Explicación pedagógica</label>
                    <input
                      type="text"
                      value={newExplanation}
                      onChange={(e) => setNewExplanation(e.target.value)}
                      placeholder="Ej. Permite filtrar únicamente preprints científicos en arXiv."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
                  >
                    Publicar Consulta en el Catálogo
                  </button>
                </form>
              </div>

              {/* Add Custom Glossary Term */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>Añadir Concepto al Diccionario Tecnológico</span>
                </h4>
                <p className="text-[11px] text-slate-400 mb-4">
                  Crea nuevos conceptos que se integrarán inmediatamente al glosario y al buscador del portal.
                </p>

                <form onSubmit={handleAddGlossaryTerm} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Término</label>
                      <input
                        type="text"
                        value={newTerm}
                        onChange={(e) => setNewTerm(e.target.value)}
                        placeholder="Ej. Latencia"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Sigla / Acrónimo (Opcional)</label>
                      <input
                        type="text"
                        value={newAcronym}
                        onChange={(e) => setNewAcronym(e.target.value)}
                        placeholder="Ej. RTT"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Categoría</label>
                      <select
                        value={newTermCat}
                        onChange={(e) => setNewTermCat(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      >
                        <option value="web-protocolos">Web y Protocolos</option>
                        <option value="datos-ia">Datos e IA</option>
                        <option value="busqueda-seo">Búsqueda y SEO</option>
                        <option value="seguridad-redes">Seguridad y Redes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Definición clara para principiantes</label>
                    <input
                      type="text"
                      value={newDef}
                      onChange={(e) => setNewDef(e.target.value)}
                      placeholder="Ej. Tiempo exacto que tarda un paquete de datos en viajar desde el cliente al servidor."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Detalle técnico avanzado</label>
                    <input
                      type="text"
                      value={newTechDetails}
                      onChange={(e) => setNewTechDetails(e.target.value)}
                      placeholder="Ej. Medido habitualmente en milisegundos (ms) mediante peticiones ICMP o ping."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs transition-colors"
                  >
                    Guardar Término en el Diccionario
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
