import React, { useState } from 'react';
import { searchEngineComparisons } from '../data/searchData';
import { EngineComparison } from '../types';
import {
  Layers,
  Shield,
  Sparkles,
  ExternalLink,
  Check,
  Globe,
  SlidersHorizontal,
  Scale
} from 'lucide-react';

export const EngineComparisonSection: React.FC = () => {
  const [activeEngineId, setActiveEngineId] = useState<string>('google');
  const activeEngine =
    searchEngineComparisons.find((e) => e.id === activeEngineId) || searchEngineComparisons[0];

  return (
    <section
      id="comparacion"
      className="py-20 bg-slate-900/60 text-slate-100 border-t border-slate-800 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Análisis Comparativo Neutral</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Comparación de Motores de Búsqueda
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            No existe un motor de búsqueda perfecto para todas las circunstancias. Cada opción prioriza
            diferentes compromisos entre privacidad, personalización algorítmica, volumen de datos y valores ambientales.
          </p>
        </div>

        {/* Engine Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {searchEngineComparisons.map((engine) => {
            const isSelected = activeEngineId === engine.id;
            return (
              <button
                key={engine.id}
                onClick={() => setActiveEngineId(engine.id)}
                className={`px-5 py-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-950 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 scale-105'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                <span>{engine.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Engine Card Detailed Overview */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl sm:text-3xl font-black text-white">{activeEngine.name}</h3>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400">
                  {activeEngine.indexingSource}
                </span>
              </div>
              <p className="text-sm text-slate-300 font-medium">{activeEngine.tagline}</p>
            </div>

            <a
              href={activeEngine.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start md:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <span>Visitar {activeEngine.name}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Core breakdown in 4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Características */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2">
                1. Características
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeEngine.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tipo de resultados */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
                2. Tipo de Resultados
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeEngine.resultQuality}
              </p>
            </div>

            {/* Privacidad */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400 block mb-2 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>3. Privacidad</span>
              </span>
              <span className="inline-block text-[11px] font-bold text-emerald-400 mb-1">
                {activeEngine.privacyRating}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeEngine.privacyPolicy}
              </p>
            </div>

            {/* Funciones destacadas y casos de uso */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                4. Función Estrella
              </span>
              <p className="text-xs text-slate-300 font-semibold mb-3">
                {activeEngine.highlightFunction}
              </p>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Casos recomendados:
              </span>
              <ul className="space-y-1 text-xs text-slate-400">
                {activeEngine.bestUseCases.map((u, i) => (
                  <li key={i}>• {u}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Side-by-side Comparative Matrix Table */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 overflow-x-auto shadow-xl">
          <h4 className="text-base font-bold text-white mb-4">Matriz Comparativa Resumida</h4>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4 font-semibold uppercase">Motor</th>
                <th className="py-3 px-4 font-semibold uppercase">Origen del Índice</th>
                <th className="py-3 px-4 font-semibold uppercase">Nivel de Privacidad</th>
                <th className="py-3 px-4 font-semibold uppercase">Enfoque Primario</th>
                <th className="py-3 px-4 font-semibold uppercase">Función Distintiva</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {searchEngineComparisons.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => setActiveEngineId(e.id)}
                  className={`cursor-pointer hover:bg-slate-900/70 transition-colors ${
                    activeEngineId === e.id ? 'bg-slate-900/50' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                    {e.name}
                  </td>
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                    {e.indexingSource}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {e.privacyRating}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {e.bestUseCases[0]}
                  </td>
                  <td className="py-3 px-4 text-cyan-300 font-mono">
                    {e.highlightFunction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
