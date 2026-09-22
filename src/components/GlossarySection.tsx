import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlossaryTerm } from '../types';
import { BookOpen, Search, Sparkles, Filter, Plus, ArrowRight, Tag } from 'lucide-react';

interface GlossarySectionProps {
  onOpenAddTermModal?: () => void;
}

export const GlossarySection: React.FC<GlossarySectionProps> = ({ onOpenAddTermModal }) => {
  const { allGlossaryTerms, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const categories = [
    { id: 'todos', label: 'Todos los términos' },
    { id: 'web-protocolos', label: 'Web y Protocolos' },
    { id: 'datos-ia', label: 'Datos e IA' },
    { id: 'busqueda-seo', label: 'Búsqueda y SEO' },
    { id: 'seguridad-redes', label: 'Seguridad y Redes' }
  ];

  const filteredTerms = allGlossaryTerms.filter((term) => {
    const matchesCategory = selectedCategory === 'todos' || term.category === selectedCategory;
    const matchesSearch =
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (term.acronym && term.acronym.toLowerCase().includes(searchTerm.toLowerCase())) ||
      term.relatedTerms.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="glosario"
      className="py-20 bg-slate-950 text-slate-100 border-t border-slate-900 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Enciclopedia Técnica</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Diccionario Tecnológico Interactivo
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
            Glosario exhaustivo de conceptos indispensables para comprender el funcionamiento
            de Internet, las redes de computadoras, los motores de búsqueda y la inteligencia artificial.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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

          {/* Search box & Add term button */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar término (ej. DNS, API, Crawler)..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                aria-label="Buscar en el glosario"
              />
            </div>

            {user?.role === 'docente' && onOpenAddTermModal && (
              <button
                onClick={onOpenAddTermModal}
                className="px-3 py-2 bg-purple-950/70 hover:bg-purple-900 border border-purple-600/50 text-purple-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 shrink-0"
                title="Añadir nuevo término como docente"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir</span>
              </button>
            )}
          </div>
        </div>

        {/* Counter of terms */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-400">
          <span>Mostrando {filteredTerms.length} de {allGlossaryTerms.length} conceptos</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-cyan-400 hover:underline"
            >
              Borrar filtro de búsqueda
            </button>
          )}
        </div>

        {/* Glossary Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map((term) => (
            <article
              key={term.id}
              id={`term-${term.id}`}
              className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-200"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-950 text-cyan-400 border border-slate-800">
                    {term.categoryLabel}
                  </span>
                  {term.acronym && (
                    <span className="text-[10px] font-mono text-slate-500">
                      Sigla: {term.acronym}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{term.term}</h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {term.definition}
                </p>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-4">
                  <span className="text-[10px] font-bold uppercase text-cyan-400 block mb-1">
                    Detalle técnico:
                  </span>
                  <p className="text-xs text-slate-400 leading-normal">
                    {term.technicalDetails}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/70">
                <span className="text-[11px] text-slate-500 block mb-1.5">Términos vinculados:</span>
                <div className="flex flex-wrap gap-1">
                  {term.relatedTerms.map((r, i) => (
                    <span
                      key={i}
                      onClick={() => setSearchTerm(r)}
                      className="cursor-pointer text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors"
                      title={`Buscar "${r}"`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {filteredTerms.length === 0 && (
          <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">No se encontraron términos para "{searchTerm}"</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('todos');
              }}
              className="mt-3 text-xs text-cyan-400 hover:underline"
            >
              Restablecer filtros del glosario
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
