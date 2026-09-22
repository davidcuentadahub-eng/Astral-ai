import React, { useState } from 'react';
import { technologiesData } from '../data/technologiesData';
import { TechIcon } from './TechIcon';
import { DigitalTech } from '../types';
import { Search, Bookmark, BookmarkCheck, ExternalLink, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TechnologiesSection: React.FC = () => {
  const { progress, toggleFavoriteTech, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalTech, setActiveModalTech] = useState<DigitalTech | null>(null);

  const categories = [
    { id: 'todas', label: 'Todas las tecnologías' },
    { id: 'ia-datos', label: 'IA y Datos' },
    { id: 'infraestructura-redes', label: 'Infraestructura y Redes' },
    { id: 'automatizacion-inmersion', label: 'Automatización e Inmersión' }
  ];

  const filteredTechnologies = technologiesData.filter((tech) => {
    const matchesCategory = selectedCategory === 'todas' || tech.category === selectedCategory;
    const matchesSearch =
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.practicalExample.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="tecnologias"
      className="py-20 bg-slate-950 text-slate-100 border-t border-slate-900 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fundamentos Digitales</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            ¿Qué son las Tecnologías Digitales?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
            Las <strong>tecnologías digitales</strong> son el conjunto de herramientas electrónicas, sistemas computacionales,
            redes y dispositivos que generan, procesan, almacenan y transmiten datos en código binario (ceros y unos).
            Constituyen el cimiento sobre el cual opera la economía moderna, la comunicación global y el acceso al conocimiento.
          </p>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 text-left flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-white block mb-1">Impacto en la búsqueda de información:</strong>
              Comprender estas tecnologías permite entender cómo las máquinas interpretan nuestras dudas, procesan miles de millones
              de fuentes en segundos y nos ofrecen resultados contextualizados.
            </div>
          </div>
        </div>

        {/* Filters and search bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800/80">
          {/* Category tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search input within tech */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar tecnologías..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
              aria-label="Buscar tecnología"
            />
          </div>
        </div>

        {/* Technologies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechnologies.map((tech) => {
            const isFav = progress.favoriteTechIds.includes(tech.id);
            return (
              <article
                key={tech.id}
                id={`tech-card-${tech.id}`}
                className="group relative rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/90 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20 transform hover:-translate-y-1"
              >
                <div>
                  {/* Top Bar: Icon, Category Badge & Favorite */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-violet-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300 transition-transform">
                      <TechIcon name={tech.iconName} className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {tech.categoryLabel}
                      </span>
                      {isAuthenticated && (
                        <button
                          onClick={() => toggleFavoriteTech(tech.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isFav
                              ? 'bg-cyan-950 border-cyan-500 text-cyan-400'
                              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-cyan-300'
                          }`}
                          title={isFav ? 'Quitar de favoritos' : 'Guardar en mi panel'}
                          aria-label={isFav ? `Quitar ${tech.name} de favoritos` : `Guardar ${tech.name} en favoritos`}
                        >
                          {isFav ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {tech.name}
                  </h3>

                  {/* Definition */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {tech.definition}
                  </p>

                  {/* Practical Example Box */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                      💡 Ejemplo práctico:
                    </span>
                    <p className="text-xs text-slate-300 italic">
                      "{tech.practicalExample}"
                    </p>
                  </div>

                  {/* Current Applications List */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Aplicaciones actuales:
                    </span>
                    <ul className="space-y-1.5">
                      {tech.currentApplications.map((app, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer card note */}
                <div className="mt-5 pt-4 border-t border-slate-800/70 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Ventaja: {tech.keyBenefit.slice(0, 35)}...
                  </span>
                  <button
                    onClick={() => setActiveModalTech(tech)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
                  >
                    <span>Detalles</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty state if search finds nothing */}
        {filteredTechnologies.length === 0 && (
          <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
            <Search className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">No se encontraron tecnologías que coincidan con "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todas');
              }}
              className="mt-3 text-xs text-cyan-400 hover:underline"
            >
              Restablecer filtros de búsqueda
            </button>
          </div>
        )}
      </div>

      {/* Modal for Tech Details */}
      {activeModalTech && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <TechIcon name={activeModalTech.iconName} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{activeModalTech.name}</h3>
                  <span className="text-xs text-cyan-400 font-mono">{activeModalTech.categoryLabel}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModalTech(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Definición Exhaustiva</h4>
                <p className="leading-relaxed">{activeModalTech.definition}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase text-cyan-400 mb-1">Ejemplo Cotidiano</h4>
                <p className="text-xs italic">{activeModalTech.practicalExample}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Casos Reales y Aplicaciones</h4>
                <ul className="space-y-1.5">
                  {activeModalTech.currentApplications.map((app, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      <Check className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-800/50">
                <span className="text-xs font-bold text-cyan-300 block mb-1">Beneficio Clave en la Sociedad:</span>
                <p className="text-xs text-slate-300">{activeModalTech.keyBenefit}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveModalTech(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg"
              >
                Cerrar ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
