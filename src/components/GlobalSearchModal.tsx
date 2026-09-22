import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Zap, Code, BookOpen, Layers, Award } from 'lucide-react';
import { technologiesData } from '../data/technologiesData';
import { searchOperators, engineConcepts, searchStepsGuide } from '../data/searchData';
import { useAuth } from '../context/AuthContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (targetAnchor: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult
}) => {
  const { allGlossaryTerms } = useAuth();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search in Technologies
  const matchingTech = cleanQuery
    ? technologiesData.filter(
        (t) =>
          t.name.toLowerCase().includes(cleanQuery) ||
          t.definition.toLowerCase().includes(cleanQuery) ||
          t.currentApplications.some((a) => a.toLowerCase().includes(cleanQuery))
      )
    : [];

  // Search in Operators
  const matchingOperators = cleanQuery
    ? searchOperators.filter(
        (o) =>
          o.operator.toLowerCase().includes(cleanQuery) ||
          o.name.toLowerCase().includes(cleanQuery) ||
          o.description.toLowerCase().includes(cleanQuery) ||
          o.example.toLowerCase().includes(cleanQuery)
      )
    : [];

  // Search in Concepts
  const matchingConcepts = cleanQuery
    ? engineConcepts.filter(
        (c) =>
          c.title.toLowerCase().includes(cleanQuery) ||
          c.shortDesc.toLowerCase().includes(cleanQuery) ||
          c.fullDesc.toLowerCase().includes(cleanQuery)
      )
    : [];

  // Search in Glossary
  const matchingGlossary = cleanQuery
    ? allGlossaryTerms.filter(
        (g) =>
          g.term.toLowerCase().includes(cleanQuery) ||
          g.definition.toLowerCase().includes(cleanQuery) ||
          (g.acronym && g.acronym.toLowerCase().includes(cleanQuery))
      )
    : [];

  // Search in Guide Steps
  const matchingSteps = cleanQuery
    ? searchStepsGuide.filter(
        (s) =>
          s.title.toLowerCase().includes(cleanQuery) ||
          s.description.toLowerCase().includes(cleanQuery) ||
          s.actionableTip.toLowerCase().includes(cleanQuery)
      )
    : [];

  const totalMatches =
    matchingTech.length +
    matchingOperators.length +
    matchingConcepts.length +
    matchingGlossary.length +
    matchingSteps.length;

  const handleNavigate = (anchor: string) => {
    onClose();
    onSelectResult(anchor);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tecnologías, operadores, conceptos, glosario o guías..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            aria-label="Buscar contenido en el portal"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-500 hover:text-slate-300 rounded"
              title="Borrar texto"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-5 divide-y divide-slate-800/60 text-xs">
          {!cleanQuery && (
            <div className="text-center py-10 text-slate-400">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">Buscador Interno del Portal</p>
              <p className="text-xs text-slate-500 mt-1">
                Escribe cualquier palabra como <em>"blockchain"</em>, <em>"site:"</em>, <em>"crawling"</em> o <em>"DNS"</em>.
              </p>
            </div>
          )}

          {cleanQuery && totalMatches === 0 && (
            <div className="text-center py-10 text-slate-400">
              <Search className="w-8 h-8 text-rose-500/60 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">Sin resultados</p>
              <p className="text-xs text-slate-400 mt-1">
                No encontramos coincidencias para <strong>"{query}"</strong> dentro de los contenidos del portal.
              </p>
              <p className="text-[11px] text-slate-500 mt-2">
                Prueba buscando términos generales como "IA", "PDF", "ranking", "Google" o "operadores".
              </p>
            </div>
          )}

          {/* Matching Technologies */}
          {matchingTech.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Tecnologías Digitales ({matchingTech.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingTech.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleNavigate(`#tech-card-${t.id}`)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <span className="font-bold text-white group-hover:text-cyan-300">{t.name}</span>
                      <p className="text-slate-400 line-clamp-1 text-[11px]">{t.definition}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Operators */}
          {matchingOperators.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2">
                <Code className="w-3.5 h-3.5" />
                <span>Operadores de Búsqueda ({matchingOperators.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingOperators.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => handleNavigate(`#operator-card-${o.id}`)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-bold text-cyan-300">{o.operator}</code>
                        <span className="font-medium text-white">{o.name}</span>
                      </div>
                      <p className="text-slate-400 line-clamp-1 text-[11px]">{o.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Concepts */}
          {matchingConcepts.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Conceptos de Motores ({matchingConcepts.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingConcepts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleNavigate('#motores')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <span className="font-bold text-white group-hover:text-blue-300">{c.title}</span>
                      <p className="text-slate-400 line-clamp-1 text-[11px]">{c.shortDesc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Glossary */}
          {matchingGlossary.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-400 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Glosario Tecnológico ({matchingGlossary.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingGlossary.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleNavigate(`#term-${g.id}`)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <span className="font-bold text-white group-hover:text-violet-300">{g.term}</span>
                      <p className="text-slate-400 line-clamp-1 text-[11px]">{g.definition}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Steps */}
          {matchingSteps.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Pasos de la Guía ({matchingSteps.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingSteps.map((s) => (
                  <button
                    key={s.step}
                    onClick={() => handleNavigate('#guia')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <span className="font-bold text-white group-hover:text-emerald-300">
                        Paso {s.step}: {s.title}
                      </span>
                      <p className="text-slate-400 line-clamp-1 text-[11px]">{s.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navega con las flechas o haz clic en cualquier resultado</span>
          <span>Presiona ESC para cerrar</span>
        </div>
      </div>
    </div>
  );
};
