import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  Sparkles,
  BookmarkPlus,
  Search,
  Filter,
  Globe,
  FileCode,
  Calendar,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface QueryBuilderProps {
  externalQueryToLoad?: string;
  onClearLoadedQuery?: () => void;
  onOpenAI?: () => void;
}

export const QueryBuilder: React.FC<QueryBuilderProps> = ({
  externalQueryToLoad,
  onClearLoadedQuery,
  onOpenAI
}) => {
  const { saveSearch, isAuthenticated } = useAuth();

  // Form Fields
  const [keyword, setKeyword] = useState('inteligencia artificial');
  const [exactPhrase, setExactPhrase] = useState('');
  const [site, setSite] = useState('edu');
  const [fileType, setFileType] = useState('pdf');
  const [excludeWords, setExcludeWords] = useState('');
  const [intitle, setIntitle] = useState('');
  const [inurl, setInurl] = useState('');
  const [afterDate, setAfterDate] = useState('');
  const [beforeDate, setBeforeDate] = useState('');
  const [orOption, setOrOption] = useState('');

  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // If parent sends an external query to load
  useEffect(() => {
    if (externalQueryToLoad) {
      // Basic parse or set as keyword
      setKeyword(externalQueryToLoad);
      onClearLoadedQuery?.();
    }
  }, [externalQueryToLoad, onClearLoadedQuery]);

  // Construct query dynamically
  const buildQuery = () => {
    const parts: string[] = [];

    if (keyword.trim()) {
      parts.push(keyword.trim());
    }

    if (exactPhrase.trim()) {
      parts.push(`"${exactPhrase.trim()}"`);
    }

    if (orOption.trim()) {
      parts.push(`OR "${orOption.trim()}"`);
    }

    if (site.trim()) {
      const cleanSite = site.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
      parts.push(`site:${cleanSite}`);
    }

    if (fileType.trim()) {
      const cleanExt = fileType.trim().replace(/^\./, '').toLowerCase();
      parts.push(`filetype:${cleanExt}`);
    }

    if (excludeWords.trim()) {
      const wordsToExclude = excludeWords
        .split(/\s+/)
        .map((w) => (w.startsWith('-') ? w : `-${w}`))
        .join(' ');
      parts.push(wordsToExclude);
    }

    if (intitle.trim()) {
      parts.push(`intitle:${intitle.trim()}`);
    }

    if (inurl.trim()) {
      parts.push(`inurl:${inurl.trim()}`);
    }

    if (afterDate.trim()) {
      parts.push(`after:${afterDate.trim()}`);
    }

    if (beforeDate.trim()) {
      parts.push(`before:${beforeDate.trim()}`);
    }

    return parts.join(' ');
  };

  const finalQuery = buildQuery();

  const handleCopy = () => {
    if (!finalQuery) return;
    navigator.clipboard.writeText(finalQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!finalQuery) return;
    saveSearch({
      name: keyword || exactPhrase || 'Consulta avanzada',
      query: finalQuery,
      notes: `Generado con Constructor (site:${site || 'todos'}, file:${fileType || 'todos'})`
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    setKeyword('');
    setExactPhrase('');
    setSite('');
    setFileType('');
    setExcludeWords('');
    setIntitle('');
    setInurl('');
    setAfterDate('');
    setBeforeDate('');
    setOrOption('');
  };

  const setPreset = (presetType: string) => {
    if (presetType === 'academico') {
      setKeyword('redes neuronales');
      setExactPhrase('machine learning');
      setSite('edu');
      setFileType('pdf');
      setExcludeWords('comprar curso');
    } else if (presetType === 'gobierno') {
      setKeyword('ciberseguridad');
      setExactPhrase('seguridad nacional');
      setSite('gob.es');
      setFileType('pdf');
      setExcludeWords('opiniones blog');
    } else if (presetType === 'codigo') {
      setKeyword('algoritmo dijkstra');
      setExactPhrase('');
      setSite('github.com');
      setFileType('');
      setExcludeWords('tutorial ejercicio');
    }
  };

  return (
    <section
      id="constructor"
      className="py-20 bg-slate-950 text-slate-100 border-t border-slate-900 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>Herramienta Interactiva</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Constructor de Búsquedas Avanzadas
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Genera automáticamente comandos y sintaxis de búsqueda optimizados para Google, Bing o DuckDuckGo.
            Configura los parámetros a continuación y observa cómo se ensambla la consulta en tiempo real.
          </p>
        </div>

        {/* Builder Container */}
        <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Quick Presets Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cargar plantillas de investigación:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {onOpenAI && (
                <button
                  onClick={onOpenAI}
                  className="text-xs px-3 py-1 rounded-md bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold border border-purple-400/40 flex items-center gap-1.5 shadow-md shadow-purple-600/20"
                  title="Abrir el Optimizador de Consultas con Inteligencia Artificial"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
                  <span>Optimizar con IA</span>
                </button>
              )}
              <button
                onClick={() => setPreset('academico')}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
              >
                Paper Académico
              </button>
              <button
                onClick={() => setPreset('gobierno')}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700"
              >
                Informe Oficial (.gob)
              </button>
              <button
                onClick={() => setPreset('codigo')}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-violet-300 border border-slate-700"
              >
                Código en GitHub
              </button>
              <button
                onClick={handleReset}
                className="text-xs px-2.5 py-1 rounded-md bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/50 flex items-center gap-1"
                title="Limpiar todos los campos"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpiar</span>
              </button>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Keyword */}
            <div>
              <label htmlFor="builder-keyword" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Palabra o Tema Principal
              </label>
              <input
                id="builder-keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Ej. inteligencia artificial"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Término base de la búsqueda</span>
            </div>

            {/* Exact Phrase */}
            <div>
              <label htmlFor="builder-exact" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Frase Exacta ("...")
              </label>
              <input
                id="builder-exact"
                type="text"
                value={exactPhrase}
                onChange={(e) => setExactPhrase(e.target.value)}
                placeholder="Ej. aprendizaje profundo"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Se colocará entre comillas dobles automáticamente</span>
            </div>

            {/* Site / Domain */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="builder-site" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Sitio o Dominio (site:)
                </label>
                <div className="flex gap-1 text-[10px] text-cyan-400">
                  <button type="button" onClick={() => setSite('edu')} className="hover:underline">edu</button>
                  <span>·</span>
                  <button type="button" onClick={() => setSite('gob.es')} className="hover:underline">gob.es</button>
                  <span>·</span>
                  <button type="button" onClick={() => setSite('github.com')} className="hover:underline">github</button>
                </div>
              </div>
              <input
                id="builder-site"
                type="text"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                placeholder="Ej. edu, unam.mx, elpais.com"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* File Type */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="builder-filetype" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Tipo de Archivo (filetype:)
                </label>
                <div className="flex gap-1 text-[10px] text-cyan-400">
                  <button type="button" onClick={() => setFileType('pdf')} className="hover:underline">PDF</button>
                  <span>·</span>
                  <button type="button" onClick={() => setFileType('docx')} className="hover:underline">DOCX</button>
                  <span>·</span>
                  <button type="button" onClick={() => setFileType('pptx')} className="hover:underline">PPTX</button>
                </div>
              </div>
              <input
                id="builder-filetype"
                type="text"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                placeholder="Ej. pdf, docx, pptx, xlsx"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Exclude words */}
            <div>
              <label htmlFor="builder-exclude" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Palabras que quieres excluir (-)
              </label>
              <input
                id="builder-exclude"
                type="text"
                value={excludeWords}
                onChange={(e) => setExcludeWords(e.target.value)}
                placeholder="Ej. curso precio comprar"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Se antepondrá el guión (-) a cada palabra</span>
            </div>

            {/* OR alternative */}
            <div>
              <label htmlFor="builder-or" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Término Alternativo (OR)
              </label>
              <input
                id="builder-or"
                type="text"
                value={orOption}
                onChange={(e) => setOrOption(e.target.value)}
                placeholder="Ej. machine learning"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Buscará la palabra principal O esta alternativa</span>
            </div>

            {/* Dates: After and Before */}
            <div>
              <label htmlFor="builder-after" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Publicado después de (after:)
              </label>
              <input
                id="builder-after"
                type="text"
                value={afterDate}
                onChange={(e) => setAfterDate(e.target.value)}
                placeholder="AAAA o AAAA-MM-DD (Ej. 2024)"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label htmlFor="builder-before" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Publicado antes de (before:)
              </label>
              <input
                id="builder-before"
                type="text"
                value={beforeDate}
                onChange={(e) => setBeforeDate(e.target.value)}
                placeholder="AAAA o AAAA-MM-DD (Ej. 2025)"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Generated Result Display Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 shadow-inner mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                <span>Resultado Generado Automáticamente</span>
              </span>

              {finalQuery && (
                <span className="text-[11px] font-mono text-slate-400">
                  {finalQuery.length} caracteres
                </span>
              )}
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 font-mono text-sm sm:text-base text-cyan-300 break-all select-all">
              {finalQuery || <span className="text-slate-600 italic">Completa los campos arriba para ver la consulta...</span>}
            </div>

            {/* Action buttons bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              {/* Copy search button requested */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-copy-search"
                  onClick={handleCopy}
                  disabled={!finalQuery}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 transition-all shadow-md shadow-cyan-500/20"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? '¡Búsqueda Copiada!' : 'Copiar búsqueda'}</span>
                </button>

                <button
                  onClick={handleSave}
                  disabled={!finalQuery}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-50 transition-all"
                  title="Guardar en mi panel para reutilizar"
                >
                  <BookmarkPlus className="w-4 h-4 text-cyan-400" />
                  <span>{savedSuccess ? '¡Guardada en panel!' : 'Guardar consulta'}</span>
                </button>
              </div>

              {/* Direct Engine Test Links */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 hidden md:inline">Probar en:</span>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-blue-950/60 hover:bg-blue-900/70 border border-blue-500/40 text-blue-300 text-xs rounded-lg flex items-center gap-1"
                >
                  <span>Google</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`https://duckduckgo.com/?q=${encodeURIComponent(finalQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-orange-950/60 hover:bg-orange-900/70 border border-orange-500/40 text-orange-300 text-xs rounded-lg flex items-center gap-1"
                >
                  <span>DuckDuckGo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`https://www.bing.com/search?q=${encodeURIComponent(finalQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-teal-950/60 hover:bg-teal-900/70 border border-teal-500/40 text-teal-300 text-xs rounded-lg flex items-center gap-1"
                >
                  <span>Bing</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
