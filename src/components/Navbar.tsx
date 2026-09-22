import React, { useState, useEffect } from 'react';
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  User as UserIcon,
  Sparkles,
  Shield,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onOpenAI: () => void;
  onOpenMultimodalStudio: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenAuth,
  onOpenDashboard,
  onOpenAI,
  onOpenMultimodalStudio,
  isDark,
  onToggleTheme
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Tecnologías', href: '#tecnologias' },
    { name: 'Motores', href: '#motores' },
    { name: 'Palabras clave', href: '#palabras-clave' },
    { name: 'Operadores', href: '#operadores' },
    { name: 'Constructor', href: '#constructor' },
    { name: 'Comparación', href: '#comparacion' },
    { name: 'Guía', href: '#guia' },
    { name: 'Glosario', href: '#glosario' }
  ];

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/85 dark:bg-slate-950/90 light:bg-white/90 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-black/20 py-2.5'
          : 'bg-transparent py-4 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#inicio"
          id="brand-logo-link"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-300 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-violet-200 transition-colors">
              TecnoBúsqueda
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium tracking-wide uppercase">
              Portal Educativo Digital
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav aria-label="Navegación principal" className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 dark:text-slate-300 hover:text-cyan-400 dark:hover:text-cyan-300 hover:bg-cyan-950/30 rounded-lg transition-all duration-150"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Assistant Button */}
          <button
            id="nav-ai-btn"
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-lg shadow-md shadow-purple-600/20 transition-all border border-purple-400/30"
            title="Abrir Asistente IA de Búsqueda"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
            <span className="hidden sm:inline">Asistente IA</span>
          </button>

          {/* Multimodal Studio Button (Music, Video, Image, Live Voice) */}
          <button
            id="nav-studio-btn"
            onClick={onOpenMultimodalStudio}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-md shadow-cyan-500/20 transition-all active:scale-95"
            title="Laboratorio Multimodal: Música, Imágenes, Veo Video y Transcripción"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
            <span className="hidden md:inline">Estudio Multimodal</span>
            <span className="md:hidden">Estudio</span>
          </button>

          {/* Quick Search Trigger */}
          <button
            id="quick-search-btn"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-lg transition-all shadow-inner group"
            title="Buscar en el portal (Ctrl + K)"
            aria-label="Abrir buscador global"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">Buscar...</span>
            <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Dark/Light Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className="p-2 text-slate-300 hover:text-cyan-400 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label="Alternar tema de color"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-400 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* User Auth or Dashboard button */}
          {isAuthenticated && user ? (
            <button
              id="user-dashboard-btn"
              onClick={onOpenDashboard}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg shadow-md shadow-cyan-600/20 transition-all group"
              aria-label="Abrir mi panel"
            >
              <div
                className={`w-5 h-5 rounded-full bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-[10px] font-bold text-white shadow-inner`}
              >
                {user.name.charAt(0)}
              </div>
              <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
              {user.role === 'docente' ? (
                <Shield className="w-3 h-3 text-amber-300" />
              ) : (
                <Sliders className="w-3 h-3 text-cyan-200" />
              )}
            </button>
          ) : (
            <button
              id="auth-login-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-600 border border-cyan-500/40 hover:border-transparent rounded-lg transition-all"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Acceder</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-300 hover:text-cyan-400 bg-slate-900 border border-slate-800 rounded-lg"
            aria-label="Abrir menú de navegación móvil"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="xl:hidden bg-slate-950/95 border-b border-cyan-500/20 backdrop-blur-xl px-4 pt-3 pb-5 shadow-2xl transition-all"
        >
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-900 rounded-md transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAI();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 shadow-md border border-purple-400/40"
            >
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span>Abrir Asistente IA (Tutor & Optimizador)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMultimodalStudio();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-900 bg-gradient-to-r from-cyan-400 to-teal-400 shadow-md active:scale-95"
            >
              <span>🎨 TechSearch Estudio Multimodal (Música, Veo, Imágenes, Voz)</span>
            </button>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="flex items-center gap-2 text-xs text-cyan-400"
              >
                <Search className="w-4 h-4" />
                <span>Buscar en todo el portal</span>
              </button>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDashboard();
                  }}
                  className="text-xs font-semibold text-cyan-400 hover:underline"
                >
                  Ver Mi Panel ({user?.role})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="text-xs font-semibold text-cyan-400 hover:underline"
                >
                  Iniciar sesión / Registro
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
