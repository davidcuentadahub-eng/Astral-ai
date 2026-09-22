import React, { useState } from 'react';
import { pipelineSteps, engineConcepts } from '../data/searchData';
import { TechIcon } from './TechIcon';
import { ArrowRight, Sparkles, Activity, Layers, HelpCircle, CheckCircle } from 'lucide-react';

export const SearchEnginesSection: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [activeConceptTab, setActiveConceptTab] = useState<string>('crawling');

  const currentStepData = pipelineSteps.find((s) => s.stepNumber === selectedStep) || pipelineSteps[0];
  const currentConcept = engineConcepts.find((c) => c.id === activeConceptTab) || engineConcepts[0];

  return (
    <section
      id="motores"
      className="py-20 bg-slate-900/60 text-slate-100 border-t border-slate-800/80 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Activity className="w-3.5 h-3.5" />
            <span>Anatomía de la Búsqueda</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            ¿Qué es un Motor de Búsqueda y Cómo Funciona?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Un <strong>motor de búsqueda</strong> es un sistema informático complejo diseñado para recopilar, indexar
            y organizar la inmensa cantidad de información dispersa en la World Wide Web, permitiendo a los usuarios
            localizar contenidos específicos en fracciones de segundo a través de consultas textuales o visuales.
          </p>
        </div>

        {/* Interactive Visual Process Diagram */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-16 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                Diagrama Interactivo del Flujo
              </span>
              <h3 className="text-xl font-bold text-white">
                El Viaje de una Consulta: de tu mente a la pantalla
              </h3>
            </div>
            <span className="text-xs font-mono px-3 py-1 bg-slate-900 rounded-full border border-slate-700 text-slate-300">
              Tiempo total promedio: ~0.35 segundos
            </span>
          </div>

          {/* Stepper buttons (Visual Pipeline) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
            {pipelineSteps.map((step) => {
              const isSelected = selectedStep === step.stepNumber;
              return (
                <button
                  key={step.id}
                  onClick={() => setSelectedStep(step.stepNumber)}
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-950/70 to-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-400">
                      0{step.stepNumber}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <TechIcon name={step.iconName} className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <span className="text-xs font-bold text-white leading-snug">{step.title}</span>

                  {isSelected && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-cyan-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed step view */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 text-center md:text-left">
              <div className="inline-block p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4">
                <TechIcon name={currentStepData.iconName} className="w-10 h-10 mx-auto md:mx-0" />
              </div>
              <span className="text-xs font-mono text-cyan-400 block mb-1">
                Fase 0{currentStepData.stepNumber} de 06
              </span>
              <h4 className="text-2xl font-black text-white mb-1">{currentStepData.title}</h4>
              <p className="text-sm font-semibold text-slate-400">{currentStepData.subtitle}</p>
            </div>

            <div className="w-full md:w-2/3 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1">
                  Descripción del proceso:
                </span>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs font-bold uppercase text-cyan-400 block mb-1">
                  Mecánica técnica bajo el capó:
                </span>
                <p className="text-xs text-slate-300 font-mono">
                  {currentStepData.technicalDetails}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>
                  Métrica en escala mundial: <strong className="text-emerald-300">{currentStepData.metrics}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Conceptos Fundamentales de los Motores */}
        <div className="mt-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Conceptos Esenciales del Funcionamiento
            </h3>
            <p className="text-sm text-slate-400">
              Explora en profundidad los 10 pilares que determinan qué páginas aparecen primero y por qué.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar list of concepts */}
            <div className="lg:col-span-4 space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {engineConcepts.map((concept) => {
                const isActive = activeConceptTab === concept.id;
                return (
                  <button
                    key={concept.id}
                    onClick={() => setActiveConceptTab(concept.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-cyan-500/20 border-cyan-500/60 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <TechIcon name={concept.iconName} className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold truncate">{concept.title}</span>
                    </div>
                    <ArrowRight className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>

            {/* Main concept showcase panel */}
            <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <TechIcon name={currentConcept.iconName} className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{currentConcept.title}</h4>
                    <p className="text-xs text-cyan-400 font-medium">{currentConcept.shortDesc}</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-slate-300 leading-relaxed mb-6">
                  <p>{currentConcept.fullDesc}</p>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Ejemplo práctico:
                    </span>
                    <p className="text-xs text-slate-200 italic">
                      "{currentConcept.example}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Términos relacionados:</span>
                {currentConcept.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
