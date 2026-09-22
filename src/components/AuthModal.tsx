import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, Shield, CheckCircle, Sparkles, X, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, signup, quickLogin, loginWithGoogle, loginAsVIP } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'estudiante' | 'docente'>('estudiante');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Por favor introduce un correo electrónico válido');
      return;
    }

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    if (tab === 'signup') {
      if (!name.trim()) {
        setError('Por favor introduce tu nombre completo');
        return;
      }
      signup(name.trim(), email.trim(), role);
    } else {
      login(email.trim(), role);
    }

    onSuccess?.();
  };

  const handleQuick = (preset: 'estudiante' | 'docente') => {
    quickLogin(preset);
    onSuccess?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
          aria-label="Cerrar modal de autenticación"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-3 text-white shadow-lg shadow-cyan-500/20">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {tab === 'login' ? 'Acceso al Portal Educativo' : 'Registro de Usuario'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Guarda tus búsquedas avanzadas, operadores favoritos y progreso de investigación.
          </p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 mb-5">
          {/* Google Sign-in with Firebase Auth */}
          <button
            type="button"
            onClick={async () => {
              try {
                await loginWithGoogle();
                onSuccess?.();
              } catch (e: any) {
                setError('Error al iniciar sesión con Google en Firebase');
              }
            }}
            className="w-full mb-2 flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold text-xs transition-all shadow-md active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Iniciar sesión con Google (Firebase Auth)</span>
          </button>

          {/* Dedicated VIP Premium Owner Access */}
          <button
            type="button"
            onClick={() => {
              loginAsVIP();
              onSuccess?.();
            }}
            className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 hover:from-amber-500/30 hover:via-rose-500/30 hover:to-purple-500/30 border border-amber-400/50 text-amber-300 rounded-xl font-bold text-xs transition-all shadow-lg active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Acceso Propietario VIP (tainela010212@gmail.com)</span>
          </button>
          <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-400 font-medium mb-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sincronización en la nube con Google Cloud Firestore</span>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-2 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">o prueba rápida</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              type="button"
              onClick={() => handleQuick('estudiante')}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 rounded-xl text-xs font-semibold text-cyan-300 transition-colors text-center"
            >
              Demo Estudiante
              <span className="block text-[10px] text-slate-400 font-normal">María Gómez</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuick('docente')}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-400 rounded-xl text-xs font-semibold text-purple-300 transition-colors text-center"
            >
              Demo Docente
              <span className="block text-[10px] text-slate-400 font-normal">Prof. Méndez</span>
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-950 p-1 mb-5 border border-slate-800 text-xs">
          <button
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              tab === 'login' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              tab === 'signup' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Error notice */}
        {error && (
          <div className="mb-4 p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Laura Salazar"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@institucion.edu"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Rol en la Plataforma</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('estudiante')}
                  className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                    role === 'estudiante'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Estudiante / Aprendiz
                </button>
                <button
                  type="button"
                  onClick={() => setRole('docente')}
                  className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                    role === 'docente'
                      ? 'bg-purple-950/80 border-purple-400 text-purple-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Docente / Gestor
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/20 mt-2"
          >
            {tab === 'login' ? 'Entrar a mi cuenta' : 'Crear mi cuenta educativa'}
          </button>
        </form>
      </div>
    </div>
  );
};
