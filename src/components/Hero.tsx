import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Search,
  Zap,
  Layers,
  Terminal,
  Cpu,
  Database,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface HeroProps {
  onOpenConstructor: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenConstructor }) => {
  const [activeNode, setActiveNode] = useState<number>(0);
  const [pulseCount, setPulseCount] = useState<number>(0);
  const [searchSimulationText, setSearchSimulationText] = useState('site:edu "algoritmos de IA" filetype:pdf');

  // Rotate simulation nodes every few seconds for lively tech feel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 5);
      setPulseCount((c) => c + 1);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const networkNodes = [
    { label: 'Usuario', detail: 'Consulta formulada', icon: Search, color: 'text-cyan-400', border: 'border-cyan-500' },
    { label: 'Rastreo Web', detail: 'Googlebot & Bingbot', icon: Terminal, color: 'text-teal-400', border: 'border-teal-500' },
    { label: 'Índice Inverso', detail: 'Embeddings vectoriales', icon: Database, color: 'text-blue-400', border: 'border-blue-500' },
    { label: 'Algoritmo / IA', detail: 'RankBrain & BERT', icon: Cpu, color: 'text-violet-400', border: 'border-violet-500' },
    { label: 'SERP Precisa', detail: '100% Relevante (0.19s)', icon: Sparkles, color: 'text-emerald-400', border: 'border-emerald-500' }
  ];

  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] pt-28 pb-16 flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
    >
      {/* Subtle ambient tech grid and particle glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-violet-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center max-w-4xl mx-auto mb-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-sm shadow-cyan-500/10 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Portal Educativo Abierto de Alfabetización Digital</span>
          </div>

          {/* Exact Main Title requested */}
          <h1
            id="hero-title"
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6"
          >
            Tecnologías Digitales y{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
              Búsqueda Inteligente
            </span>
          </h1>

          {/* Exact Subtitle requested */}
          <p
            id="hero-subtitle"
            className="text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto mb-8"
          >
            Aprende cómo funcionan las tecnologías digitales, los motores de búsqueda y las técnicas avanzadas para
            encontrar información de forma rápida y precisa.
          </p>

          {/* Action Buttons requested */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a
              href="#tecnologias"
              id="hero-btn-explore-tech"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Zap className="w-4 h-4 text-cyan-200" />
              <span>Explorar tecnologías</span>
            </a>

            <a
              href="#operadores"
              id="hero-btn-learn-advanced-search"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md"
            >
              <span>Aprender búsqueda avanzada</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </a>

            <button
              onClick={onOpenConstructor}
              id="hero-btn-open-constructor"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 hover:border-cyan-400 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Abrir constructor</span>
            </button>
          </div>

          {/* Quick Metrics highlight */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2 pb-6 border-t border-slate-800/80">
            <div className="p-2 text-center">
              <span className="block text-xl sm:text-2xl font-black text-cyan-400">13</span>
              <span className="text-xs text-slate-400">Tecnologías Clave</span>
            </div>
            <div className="p-2 text-center">
              <span className="block text-xl sm:text-2xl font-black text-blue-400">6 Fases</span>
              <span className="text-xs text-slate-400">Pipeline de Rastreo</span>
            </div>
            <div className="p-2 text-center">
              <span className="block text-xl sm:text-2xl font-black text-violet-400">12+</span>
              <span className="text-xs text-slate-400">Operadores Booleanos</span>
            </div>
            <div className="p-2 text-center">
              <span className="block text-xl sm:text-2xl font-black text-emerald-400">100%</span>
              <span className="text-xs text-slate-400">Práctico e Interactivo</span>
            </div>
          </div>
        </div>

        {/* Visual Animation: Search & AI Data Network Simulator */}
        <div className="relative max-w-5xl mx-auto mt-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-cyan-950/30 overflow-hidden">
          {/* Header of the simulated terminal */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline">
                simulador-rastreo-y-procesamiento-de-consultas.v2
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Algoritmo activo: BERT + RankBrain</span>
            </div>
          </div>

          {/* Interactive Query Bar in simulator */}
          <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-3 sm:p-4 mb-6 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 w-full">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={searchSimulationText}
                onChange={(e) => setSearchSimulationText(e.target.value)}
                placeholder="Escribe una consulta con operadores..."
                className="w-full bg-transparent text-sm font-mono text-cyan-200 focus:outline-none placeholder:text-slate-600"
                aria-label="Consulta de simulación interactiva"
              />
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="text-[11px] font-mono px-2 py-1 bg-cyan-950 text-cyan-300 rounded border border-cyan-800/60">
                0.19 seg
              </span>
              <button
                onClick={() => setActiveNode((prev) => (prev + 1) % 5)}
                className="text-xs px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded border border-cyan-500/40 transition-colors"
              >
                Pulsar flujo
              </button>
            </div>
          </div>

          {/* Pipeline Nodes Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
            {networkNodes.map((node, index) => {
              const IconComp = node.icon;
              const isCurrent = activeNode === index;
              return (
                <div
                  key={node.label}
                  onClick={() => setActiveNode(index)}
                  className={`cursor-pointer rounded-xl p-3 transition-all duration-300 border ${
                    isCurrent
                      ? `bg-slate-800/90 ${node.border} shadow-lg shadow-cyan-500/10 scale-[1.03]`
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-slate-400">Paso 0{index + 1}</span>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isCurrent ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">{node.label}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight">{node.detail}</p>

                  {isCurrent && (
                    <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center gap-1 text-[10px] text-cyan-300 font-mono">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                      <span>Procesando</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Real-time telemetry log strip */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">● Tokenización exitosa:</span>
              <span className="text-slate-300">[site:edu] + [algoritmos] + [filetype:pdf]</span>
            </div>
            <div className="text-slate-400">
              Índice invertido consultado: <span className="text-cyan-400">14.8M documentos coincidentes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
