import React, { useState } from 'react';
import { smartTechniques } from '../data/searchData';
import { TechIcon } from './TechIcon';
import { Sparkles, Copy, Check, ExternalLink, ShieldCheck, Terminal, Compass } from 'lucide-react';

export const SmartSearchSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, formula: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      id="busqueda-inteligente"
      className="py-20 bg-slate-900/60 text-slate-100 border-t border-slate-800 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Técnicas de Nivel Experto</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Búsqueda Inteligente: Estrategias de Investigación
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Las técnicas que utilizan analistas de inteligencia, programadores y documentalistas científicos
            para extraer información veraz y saltarse el 99% de contenido irrelevante o promocional en Internet.
          </p>
        </div>

        {/* 8-9 Techniques Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {smartTechniques.map((tech) => {
            const isCopied = copiedId === tech.id;

            return (
              <div
                key={tech.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/20 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <TechIcon name={tech.iconName} className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-slate-800">
                      {tech.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {tech.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 font-medium mb-3">
                    {tech.summary}
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {tech.deepDive}
                  </p>
                </div>

                <div>
                  {/* Formula / Syntax Box */}
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Comando recomendado:
                      </span>
                      <button
                        onClick={() => handleCopy(tech.id, tech.formula)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        title="Copiar sintaxis al portapapeles"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? '¡Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                    <code className="text-xs font-mono text-cyan-300 block break-all">
                      {tech.formula}
                    </code>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {tech.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
