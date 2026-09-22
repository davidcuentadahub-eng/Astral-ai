import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  X,
  Code,
  Search,
  Palette,
  Bot,
  LogIn,
  LogOut,
  Sliders,
  Database,
  ChevronLeft,
  ChevronRight,
  Zap,
  Brain,
  Feather
} from 'lucide-react';
import { ChatSession, ASTRAL_PERSONAS, AstralPersonaOption } from '../../types/astral';
import { useAuth } from '../../context/AuthContext';

interface AstralSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  activePersona: 'general' | 'coder' | 'researcher' | 'creative';
  onChangePersona: (persona: 'general' | 'coder' | 'researcher' | 'creative') => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onOpenAuth: () => void;
}

export const AstralSidebar: React.FC<AstralSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  activePersona,
  onChangePersona,
  isOpen,
  onToggleOpen,
  onOpenAuth
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const startRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const saveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      onRenameSession(id, editingTitle.trim());
    }
    setEditingSessionId(null);
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(null);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggleOpen}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-40 w-72 sm:w-80 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-none'
        }`}
      >
        {/* Header: Logo & New Chat */}
        <div className="p-4 border-b border-slate-850 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  Astral.ai
                </span>
                <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  Agent
                </span>
              </div>
            </div>

            <button
              onClick={onToggleOpen}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => {
              onNewSession();
              if (window.innerWidth < 1024) onToggleOpen();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-850 hover:from-slate-850 hover:to-slate-800 border border-slate-700/80 hover:border-cyan-500/40 text-slate-100 text-xs font-semibold shadow-md transition-all active:scale-95 group"
          >
            <Plus className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-200" />
            <span>Nueva conversación</span>
          </button>
        </div>

        {/* Persona Mode Switcher */}
        <div className="px-4 py-3 border-b border-slate-850 bg-slate-950/70">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
            Modo del Agente
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {ASTRAL_PERSONAS.map((p) => {
              const isSelected = activePersona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onChangePersona(p.id)}
                  title={p.description}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all text-left truncate ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {p.id === 'general' && <Sparkles className="w-3 h-3 text-cyan-400 flex-shrink-0" />}
                  {p.id === 'coder' && <Code className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
                  {p.id === 'researcher' && <Search className="w-3 h-3 text-indigo-400 flex-shrink-0" />}
                  {p.id === 'creative' && <Palette className="w-3 h-3 text-purple-400 flex-shrink-0" />}
                  <span className="truncate">{p.name.replace('Astral ', '')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation History List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Recientes ({sessions.length})
          </div>

          {sessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              Aún no tienes conversaciones. Haz clic en "Nueva conversación" para comenzar.
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingSessionId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (window.innerWidth < 1024) onToggleOpen();
                  }}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                    isActive
                      ? 'bg-slate-900 text-cyan-300 font-medium border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate flex-1 mr-1">
                    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename(session.id, e as any);
                          if (e.key === 'Escape') cancelRename(e as any);
                        }}
                        autoFocus
                        className="bg-slate-850 border border-cyan-400 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none w-full"
                      />
                    ) : (
                      <span className="truncate">{session.title}</span>
                    )}
                  </div>

                  {/* Action Icons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isEditing ? (
                      <>
                        <button
                          onClick={(e) => saveRename(session.id, e)}
                          className="p-1 hover:text-emerald-400 text-slate-400"
                          title="Guardar"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={cancelRename}
                          className="p-1 hover:text-rose-400 text-slate-400"
                          title="Cancelar"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => startRename(session, e)}
                          className="p-1 hover:text-cyan-300 text-slate-400 transition-colors"
                          title="Renombrar"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          className="p-1 hover:text-rose-400 text-slate-400 transition-colors"
                          title="Eliminar conversación"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: User Account & Sync */}
        <div className="p-3 border-t border-slate-850 bg-slate-950/80">
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 truncate">
                <div
                  className={`w-7 h-7 rounded-full bg-gradient-to-tr ${user.avatarColor || 'from-cyan-500 to-blue-600'} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="truncate text-left">
                  <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Firestore sincronizado</span>
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sincronizar con Google / Cuenta</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
