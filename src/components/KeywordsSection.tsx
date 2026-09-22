import React, { useState } from 'react';
import { keywordTypes } from '../data/searchData';
import { Key, Sparkles, Check, HelpCircle, ArrowRight, Lightbulb, Compass, Search } from 'lucide-react';

export const KeywordsSection: React.FC = () => {
  // Interactive Analyzer state
  const [customQuery, setCustomQuery] = useState('cómo aprender programación');

  const presetQueries = [
    { text: 'cómo aprender programación', label: 'Ejemplo Solicitado' },
    { text: 'comprar laptop gamer barata', label: 'Transaccional' },
    { text: 'portal campus virtual ugr', label: 'Navegacional' },
    { text: 'comparativa iphone 16 vs galaxy s24', label: 'Investigación Comercial' }
  ];

  // Helper to dynamically analyze intent based on keywords
  const analyzeQuery = (query: string) => {
    const q = query.toLowerCase();
    let intent = 'Informativa';
    let intentColor = 'text-blue-400 bg-blue-950/60 border-blue-500/40';
    let intentDesc = 'El usuario busca adquirir conocimientos, entender un proceso o resolver dudas teóricas.';
    let mainTopic = 'Tema no identificado';
    let relatedWords: string[] = [];

    if (q.includes('cómo') || q.includes('como') || q.includes('aprender') || q.includes('que es') || q.includes('tutorial')) {
      intent = 'Informativa (Know)';
      intentColor = 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
      intentDesc = 'Deseo de aprendizaje procedimental o conceptual.';
    } else if (q.includes('comprar') || q.includes('precio') || q.includes('barato') || q.includes('descuento') || q.includes('oferta')) {
      intent = 'Transaccional (Do / Buy)';
      intentColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
      intentDesc = 'Intención decidida de adquisición, compra o contratación inmediata.';
    } else if (q.includes('login') || q.includes('portal') || q.includes('oficial') || q.includes('acceder') || q.includes('web')) {
      intent = 'Navegacional (Go / Website)';
      intentColor = 'text-purple-400 bg-purple-950/60 border-purple-500/40';
      intentDesc = 'El usuario ya sabe a qué sitio quiere ir y usa el buscador como atajo.';
    } else if (q.includes('mejor') || q.includes('comparativa') || q.includes('vs') || q.includes('opiniones')) {
      intent = 'Comercial / Comparativa';
      intentColor = 'text-amber-400 bg-amber-950/60 border-amber-500/40';
      intentDesc = 'Evaluación de alternativas previa a una decisión de compra.';
    }

    // Extract main topic roughly
    const words = query.split(/\s+/).filter((w) => w.length > 2);
    if (q.includes('programación') || q.includes('programacion')) {
      mainTopic = 'Programación y desarrollo de software';
      relatedWords = ['aprender', 'programación', 'curso', 'tutorial', 'código', 'lenguaje'];
    } else if (q.includes('laptop') || q.includes('ordenador')) {
      mainTopic = 'Hardware y computadoras portátiles';
      relatedWords = ['laptop', 'gamer', 'rendimiento', 'tarjeta gráfica', 'procesador'];
    } else if (q.includes('campus') || q.includes('ugr') || q.includes('portal')) {
      mainTopic = 'Portal universitario institucional';
      relatedWords = ['login', 'acceso', 'estudiantes', 'asignaturas', 'plataforma'];
    } else {
      mainTopic = words[words.length - 1] || 'Tema general';
      relatedWords = words;
    }

    return { intent, intentColor, intentDesc, mainTopic, relatedWords };
  };

  const analysis = analyzeQuery(customQuery);

  return (
    <section
      id="palabras-clave"
      className="py-20 bg-slate-950 text-slate-100 border-t border-slate-900 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Key className="w-3.5 h-3.5" />
            <span>Semántica y Lenguaje</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            El Poder de las Palabras Clave (Keywords)
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Una <strong>palabra clave (keyword)</strong> es el término o conjunto de términos que un usuario introduce
            en la caja de búsqueda para manifestar su necesidad de información. Representan el puente semántico exacto
            entre lo que las personas buscan y el contenido que los motores indexan en la red.
          </p>
        </div>

        {/* Highlight Showcase: Exactly requested breakdown */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Caso de Estudio Práctico Solicitado</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white mb-6">
            Desglose de Consulta: <span className="text-cyan-300 font-mono">“cómo aprender programación”</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-1">01. Identificación</span>
              <h4 className="text-sm font-bold text-white mb-2">Tema Principal</h4>
              <p className="text-lg font-black text-cyan-400 font-mono">Programación</p>
              <p className="text-xs text-slate-400 mt-2">
                El núcleo conceptual indiscutible alrededor del cual debe gravitar la búsqueda.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-1">02. Propósito Real</span>
              <h4 className="text-sm font-bold text-white mb-2">Intención de Búsqueda</h4>
              <p className="text-lg font-black text-emerald-400 font-mono">Informativa</p>
              <p className="text-xs text-slate-400 mt-2">
                El usuario no quiere comprar un producto ahora mismo; busca métodos, guías y rutas de formación.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-1">03. Expansión Semántica</span>
              <h4 className="text-sm font-bold text-white mb-2">Palabras Relacionadas</h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['aprender', 'programación', 'curso', 'tutorial'].map((w) => (
                  <span
                    key={w}
                    className="text-xs font-mono px-2 py-0.5 bg-violet-950 text-violet-300 border border-violet-800/60 rounded"
                  >
                    {w}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Términos complementarios que los motores usan para indexar artículos y vídeos educativos.
              </p>
            </div>
          </div>

          {/* Interactive Live Keyword Analyzer Playground */}
          <div className="pt-6 border-t border-slate-800/80">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Analizador Interactivo de Consultas</span>
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Prueba con tus propias consultas para ver cómo un motor clasifica la intención y descompone las palabras clave:
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {presetQueries.map((p) => (
                <button
                  key={p.text}
                  onClick={() => setCustomQuery(p.text)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    customQuery === p.text
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {p.label}: <span className="italic font-mono">"{p.text}"</span>
                </button>
              ))}
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Escribe cualquier consulta que harías en Google o Bing..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-cyan-200 font-mono focus:outline-none focus:border-cyan-400"
                aria-label="Consulta a analizar"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/90 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Intención detectada:</span>
                <span className={`inline-block font-bold px-2.5 py-1 rounded-md border text-xs ${analysis.intentColor}`}>
                  {analysis.intent}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">{analysis.intentDesc}</p>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Tema central:</span>
                <span className="font-bold text-white block">{analysis.mainTopic}</span>
                <span className="text-[11px] text-slate-400">Entidad principal indexable</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Palabras clave detectadas:</span>
                <div className="flex flex-wrap gap-1">
                  {analysis.relatedWords.map((w, idx) => (
                    <span key={idx} className="font-mono px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-cyan-300 rounded text-[11px]">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Tipologías de Palabras Clave */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Tipología y Clasificación de Palabras Clave
            </h3>
            <p className="text-sm text-slate-400">
              Aprende a diferenciar el alcance, la intención y el volumen de cada tipo de palabra clave.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keywordTypes.map((type) => (
              <div
                key={type.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-violet-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                      Intención {type.intent}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400">
                      Volumen: {type.searchVolume}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2">{type.name}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {type.description}
                  </p>

                  <div className="mb-4">
                    <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
                      Características clave:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {type.characteristics.map((char, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">Ejemplo real:</span>
                  <span className="text-xs font-mono text-violet-300 font-semibold">
                    "{type.exampleQuery}"
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
