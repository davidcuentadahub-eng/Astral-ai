import React, { useState } from 'react';
import { searchOperators } from '../data/searchData';
import { SearchOperator } from '../types';
import {
  Code,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Send,
  Sliders,
  Table as TableIcon,
  LayoutGrid,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface OperatorsSectionProps {
  onLoadIntoBuilder: (opExample: string) => void;
}

export const OperatorsSection: React.FC<OperatorsSectionProps> = ({ onLoadIntoBuilder }) => {
  const { progress, toggleFavoriteOperator, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'todos', label: 'Todos los operadores' },
    { id: 'filtros', label: 'Filtros de Dominio y Archivos' },
    { id: 'contenido', label: 'Contenido y Títulos' },
    { id: 'logica', label: 'Lógica Booleana y Exclusión' },
    { id: 'temporal', label: 'Límites Temporales' }
  ];

  const filteredOperators = searchOperators.filter(
    (op) => selectedCategory === 'todos' || op.category === selectedCategory
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      id="operadores"
      className="py-20 bg-slate-900/60 text-slate-100 border-t border-slate-800 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Code className="w-3.5 h-3.5" />
            <span>Sintaxis Avanzada</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Operadores de Búsqueda Avanzada
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
            Los <strong>operadores de búsqueda</strong> son caracteres, comandos y palabras clave especiales que
            amplían o restringen los parámetros de una consulta habitual. Permiten ordenar al algoritmo exactamente
            dónde buscar, qué archivos descargar y qué términos excluir de forma quirúrgica.
          </p>

          {/* Engine availability notice as requested */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs sm:text-sm text-amber-200 text-left flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block mb-1">Nota importante de compatibilidad:</strong>
              La disponibilidad, sensibilidad a mayúsculas y comportamiento exacto de algunos operadores puede variar
              según el motor de búsqueda (Google, Bing, DuckDuckGo). Por ejemplo, <code>OR</code> debe ir en mayúsculas en Google,
              mientras que DuckDuckGo también admite el prefijo <code>ext:</code> como sinónimo directo de <code>filetype:</code>.
            </div>
          </div>
        </div>

        {/* View Toggle & Category Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                viewMode === 'cards' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
              }`}
              title="Vista en tarjetas"
              aria-label="Vista en tarjetas"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tarjetas</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
              }`}
              title="Vista en tabla"
              aria-label="Vista en tabla"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tabla</span>
            </button>
          </div>
        </div>

        {/* Cards View */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOperators.map((op) => {
              const isFav = progress.favoriteOperatorIds.includes(op.id);
              const isCopied = copiedId === op.id;

              return (
                <article
                  key={op.id}
                  id={`operator-card-${op.id}`}
                  className="rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:shadow-cyan-950/20 group"
                >
                  <div>
                    {/* Top Bar */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <code className="text-sm sm:text-base font-mono font-bold px-2.5 py-1 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                        {op.operator}
                      </code>

                      <div className="flex items-center gap-1.5">
                        {isAuthenticated && (
                          <button
                            onClick={() => toggleFavoriteOperator(op.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isFav
                                ? 'bg-cyan-950 border-cyan-500 text-cyan-400'
                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-cyan-300'
                            }`}
                            title={isFav ? 'Quitar de favoritos' : 'Guardar operador'}
                            aria-label={isFav ? `Quitar ${op.name} de favoritos` : `Guardar ${op.name} en favoritos`}
                          >
                            {isFav ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                          </button>
                        )}

                        <button
                          onClick={() => handleCopy(op.id, op.example)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                          title="Copiar ejemplo"
                          aria-label="Copiar ejemplo"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2">{op.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      {op.description}
                    </p>

                    {/* Example Box */}
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/90 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Ejemplo práctico:
                      </span>
                      <code className="text-xs font-mono text-cyan-300 font-semibold block break-all">
                        {op.example}
                      </code>
                    </div>

                    {op.notes && (
                      <p className="text-[11px] text-slate-400 italic mb-3">
                        💡 {op.notes}
                      </p>
                    )}
                  </div>

                  {/* Footer card */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {op.targetEngines.slice(0, 3).map((engine) => (
                        <span key={engine} className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded">
                          {engine}
                        </span>
                      ))}
                      {op.targetEngines.length > 3 && (
                        <span className="text-[10px] font-mono text-slate-500">+{op.targetEngines.length - 3}</span>
                      )}
                    </div>

                    <button
                      onClick={() => onLoadIntoBuilder(op.example)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
                      title="Cargar esta consulta en el constructor interactivo"
                    >
                      <span>Probar</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto bg-slate-950 border border-slate-800 rounded-2xl shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                  <th className="p-3.5 font-bold uppercase">Operador</th>
                  <th className="p-3.5 font-bold uppercase">Nombre</th>
                  <th className="p-3.5 font-bold uppercase">Descripción</th>
                  <th className="p-3.5 font-bold uppercase">Ejemplo Práctico</th>
                  <th className="p-3.5 font-bold uppercase text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredOperators.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-cyan-300 whitespace-nowrap">
                      {op.operator}
                    </td>
                    <td className="p-3.5 font-bold text-white whitespace-nowrap">
                      {op.name}
                    </td>
                    <td className="p-3.5 text-slate-300 min-w-[240px]">
                      {op.description}
                    </td>
                    <td className="p-3.5 font-mono text-cyan-400 min-w-[180px]">
                      {op.example}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => onLoadIntoBuilder(op.example)}
                        className="px-2.5 py-1 text-[11px] bg-cyan-950 text-cyan-300 border border-cyan-700/60 rounded hover:bg-cyan-900"
                      >
                        Cargar en constructor
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
