import React from 'react';
import { searchStepsGuide } from '../data/searchData';
import { CheckSquare, Square, Award, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HowToSearchBetterSection: React.FC = () => {
  const { progress, toggleGuideStep } = useAuth();

  const completedCount = progress.completedGuideSteps.length;
  const percentage = Math.round((completedCount / searchStepsGuide.length) * 100);

  return (
    <section
      id="guia"
      className="py-20 bg-slate-950 text-slate-100 border-t border-slate-900 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>Metodología de 10 Pasos</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Guía Paso a Paso: Cómo Buscar Mejor en Internet
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
            La búsqueda eficaz no es una cuestión de suerte, sino de método riguroso. Sigue este protocolo
            estandarizado para transformar búsquedas caóticas en hallazgos académicos y profesionales certeros.
          </p>

          {/* Interactive Checklist Mastery Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 max-w-xl mx-auto shadow-lg">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
              <span>Tu Progreso de Dominio: {completedCount} de {searchStepsGuide.length} pasos aplicados</span>
              <span className="text-cyan-400 font-mono">{percentage}%</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Marca las casillas conforme apliques cada paso en tus investigaciones. Tu progreso se guarda automáticamente.
            </p>
          </div>
        </div>

        {/* 10 Steps Grid / Vertical timeline */}
        <div className="max-w-4xl mx-auto space-y-4">
          {searchStepsGuide.map((step) => {
            const isCompleted = progress.completedGuideSteps.includes(step.step);

            return (
              <div
                key={step.step}
                onClick={() => toggleGuideStep(step.step)}
                className={`cursor-pointer rounded-2xl p-5 sm:p-6 border transition-all duration-200 flex items-start gap-4 ${
                  isCompleted
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-md shadow-emerald-950/20'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* Checkbox button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGuideStep(step.step);
                  }}
                  className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                  aria-label={isCompleted ? `Marcar paso ${step.step} como pendiente` : `Marcar paso ${step.step} como completado`}
                >
                  {isCompleted ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      Paso {step.step < 10 ? `0${step.step}` : step.step}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      Fase: {step.category}
                    </span>
                  </div>

                  <h3
                    className={`text-base sm:text-lg font-bold mb-2 transition-colors ${
                      isCompleted ? 'text-emerald-200' : 'text-white'
                    }`}
                  >
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                    {step.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-800/80">
                    <div className="flex items-start gap-1.5 text-slate-300">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-amber-300">Consejo de oro:</strong> {step.actionableTip}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-[11px] text-cyan-300">
                      <span className="text-slate-500 block mb-0.5">Ejemplo:</span>
                      {step.example}
                    </div>
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
