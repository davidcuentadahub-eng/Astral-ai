import React from 'react';
import { Search, Globe, Shield, Heart, Terminal, BookOpen, Layers, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20">
                <Search className="w-4 h-4 text-slate-950" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">
                TechSearch <span className="text-cyan-400">Edu</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Portal académico e interactivo sobre tecnologías digitales, arquitectura de motores de búsqueda,
              sintaxis booleana, operadores avanzados y alfabetización informacional para la era digital.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Protegido contra inyecciones y XSS · Validación estricta client-side</span>
            </div>
          </div>

          {/* Column 1: Tecnologías y Motores */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Fundamentos
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#tecnologias" className="hover:text-cyan-400 transition-colors">
                  13 Tecnologías Digitales
                </a>
              </li>
              <li>
                <a href="#motores" className="hover:text-cyan-400 transition-colors">
                  Anatomía de Motores
                </a>
              </li>
              <li>
                <a href="#motores" className="hover:text-cyan-400 transition-colors">
                  Flujo de Crawling e Índice
                </a>
              </li>
              <li>
                <a href="#comparacion" className="hover:text-cyan-400 transition-colors">
                  Comparativa de Motores
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Búsqueda y Herramientas */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Herramientas
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#palabras-clave" className="hover:text-cyan-400 transition-colors">
                  Análisis de Palabras Clave
                </a>
              </li>
              <li>
                <a href="#operadores" className="hover:text-cyan-400 transition-colors">
                  Catálogo de Operadores
                </a>
              </li>
              <li>
                <a href="#constructor" className="hover:text-cyan-400 transition-colors">
                  Constructor de Búsquedas
                </a>
              </li>
              <li>
                <a href="#busqueda-inteligente" className="hover:text-cyan-400 transition-colors">
                  Técnicas Inteligentes
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Guía y Recursos */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Recursos
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#guia" className="hover:text-cyan-400 transition-colors">
                  Guía de 10 Pasos
                </a>
              </li>
              <li>
                <a href="#glosario" className="hover:text-cyan-400 transition-colors">
                  Diccionario Tecnológico
                </a>
              </li>
              <li>
                <span className="text-[11px] font-mono px-2 py-1 bg-slate-900 rounded border border-slate-800 text-cyan-300 block w-fit">
                  Atajo: Ctrl + K
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} TechSearch Edu · Portal Educativo de Tecnologías Digitales y Búsqueda de Información.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
            title="Volver al inicio"
          >
            <span>Subir arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
