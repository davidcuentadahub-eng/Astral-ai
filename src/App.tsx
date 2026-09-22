import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AstralSidebar } from './components/astral/AstralSidebar';
import { AstralChatArea } from './components/astral/AstralChatArea';
import { AuthModal } from './components/AuthModal';
import { ChatSession, ChatMessage } from './types/astral';
import { db } from './lib/firebase';
import { cleanForFirestore } from './lib/firestoreUtils';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';

function AstralAppContent() {
  const { user, isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Active persona
  const [activePersona, setActivePersona] = useState<'general' | 'coder' | 'researcher' | 'creative'>('general');

  // Load initial sessions from LocalStorage / Firestore
  useEffect(() => {
    async function loadSessions() {
      if (isAuthenticated && user?.id) {
        try {
          const chatsRef = collection(db, 'users', user.id, 'chats');
          const q = query(chatsRef, orderBy('updatedAt', 'desc'));
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const loaded = snapshot.docs.map((d) => {
              const data = d.data() as ChatSession;
              return {
                ...data,
                useSearchGrounding: false
              };
            });
            setSessions(loaded);
            setActiveSessionId(loaded[0].id);
            return;
          }
        } catch (err) {
          console.warn('Could not load from Firestore, falling back to local storage:', err);
        }
      }

      // LocalStorage fallback
      const saved = localStorage.getItem('astral_sessions');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const sanitized = parsed.map((s: ChatSession) => ({
              ...s,
              useSearchGrounding: false
            }));
            setSessions(sanitized);
            setActiveSessionId(sanitized[0].id);
            return;
          }
        } catch {
          // ignore error
        }
      }

      // Default first session if none exists
      createNewSession();
    }

    loadSessions();
  }, [isAuthenticated, user?.id]);

  // Persist sessions
  const persistSessions = (updated: ChatSession[], targetSession?: ChatSession) => {
    setSessions(updated);
    localStorage.setItem('astral_sessions', JSON.stringify(updated));

    if (isAuthenticated && user?.id) {
      const active = targetSession || updated.find((s) => s.id === activeSessionId) || updated[0];
      if (active) {
        const sanitized = cleanForFirestore(active);
        setDoc(doc(db, 'users', user.id, 'chats', active.id), sanitized).catch((err) =>
          console.warn('Firestore sync error:', err)
        );
      }
    }
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `astral-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: 'Nueva conversación',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      model: 'gemini-3.8-flash',
      persona: activePersona,
      useSearchGrounding: false
    };

    const updated = [newSession, ...sessions];
    persistSessions(updated, newSession);
    setActiveSessionId(newSession.id);
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  const handleSendMessage = async (text: string, imageBase64?: string, imageMime?: string) => {
    if (!activeSession) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
      ...(imageBase64 ? { imageBase64 } : {}),
      ...(imageMime ? { imageMime } : {})
    };

    // Generate auto-title for new conversation if title is still default
    let newTitle = activeSession.title;
    if (activeSession.messages.length === 0 && text) {
      newTitle = text.slice(0, 36) + (text.length > 36 ? '...' : '');
    }

    const updatedMessages = [...activeSession.messages, userMessage];
    const updatedSession: ChatSession = {
      ...activeSession,
      title: newTitle,
      updatedAt: Date.now(),
      messages: updatedMessages
    };

    const newSessionsList = sessions.map((s) => (s.id === activeSession.id ? updatedSession : s));
    persistSessions(newSessionsList, updatedSession);
    setIsLoading(true);

    try {
      // Build server payload
      const payload = {
        messages: updatedMessages.map((m) => ({
          role: m.role,
          text: m.text,
          imageBase64: m.imageBase64,
          imageMime: m.imageMime
        })),
        model: activeSession.model || 'gemini-3.8-flash',
        role: activeSession.persona || activePersona,
        useSearchGrounding: !!activeSession.useSearchGrounding
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Error al comunicarse con Astral.ai');
      }

      const assistantMessage: ChatMessage = {
        id: `astral-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'No pude generar una respuesta.',
        timestamp: Date.now(),
        ...(data.groundingMetadata ? { groundingMetadata: data.groundingMetadata } : {}),
        ...(data.modelUsed ? { modelUsed: data.modelUsed } : {})
      };

      const finalSession: ChatSession = {
        ...updatedSession,
        updatedAt: Date.now(),
        messages: [...updatedMessages, assistantMessage]
      };

      const finalList = sessions.map((s) => (s.id === activeSession.id ? finalSession : s));
      persistSessions(finalList, finalSession);
    } catch (err: any) {
      console.error('Error communicating with Astral.ai:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `⚠️ **Error:** ${err?.message || 'Ocurrió un error inesperado al conectar con el servidor de Astral.ai.'}`,
        isError: true,
        timestamp: Date.now()
      };

      const errorSession: ChatSession = {
        ...updatedSession,
        messages: [...updatedMessages, errorMessage]
      };

      const finalList = sessions.map((s) => (s.id === activeSession.id ? errorSession : s));
      persistSessions(finalList, errorSession);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    persistSessions(updated);

    if (isAuthenticated && user?.id) {
      deleteDoc(doc(db, 'users', user.id, 'chats', id)).catch((err) =>
        console.warn('Error deleting chat from Firestore:', err)
      );
    }

    if (activeSessionId === id) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
      } else {
        createNewSession();
      }
    }
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    const target = sessions.find((s) => s.id === id);
    if (!target) return;
    const updatedSession = { ...target, title: newTitle, updatedAt: Date.now() };
    const updated = sessions.map((s) => (s.id === id ? updatedSession : s));
    persistSessions(updated, updatedSession);
  };

  const handleClearSession = () => {
    if (!activeSession) return;
    const cleared: ChatSession = {
      ...activeSession,
      messages: [],
      updatedAt: Date.now()
    };
    const updated = sessions.map((s) => (s.id === activeSession.id ? cleared : s));
    persistSessions(updated, cleared);
  };

  const handleChangeModel = (model: 'gemini-3.8-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite') => {
    if (!activeSession) return;
    const updatedSession: ChatSession = {
      ...activeSession,
      model,
      updatedAt: Date.now()
    };
    const updated = sessions.map((s) => (s.id === activeSession.id ? updatedSession : s));
    persistSessions(updated, updatedSession);
  };

  const handleToggleSearchGrounding = () => {
    if (!activeSession) return;
    const updatedSession: ChatSession = {
      ...activeSession,
      useSearchGrounding: !activeSession.useSearchGrounding,
      updatedAt: Date.now()
    };
    const updated = sessions.map((s) => (s.id === activeSession.id ? updatedSession : s));
    persistSessions(updated, updatedSession);
  };

  const handleChangePersona = (persona: 'general' | 'coder' | 'researcher' | 'creative') => {
    setActivePersona(persona);
    if (!activeSession) return;
    const updatedSession: ChatSession = {
      ...activeSession,
      persona,
      updatedAt: Date.now()
    };
    const updated = sessions.map((s) => (s.id === activeSession.id ? updatedSession : s));
    persistSessions(updated, updatedSession);
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans select-text">
      {/* Sidebar */}
      <AstralSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => setActiveSessionId(id)}
        onNewSession={createNewSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        activePersona={activePersona}
        onChangePersona={handleChangePersona}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <AstralChatArea
          session={activeSession}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onClearSession={handleClearSession}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onChangeModel={handleChangeModel}
          onToggleSearchGrounding={handleToggleSearchGrounding}
          isSidebarOpen={isSidebarOpen}
        />
      </main>

      {/* Firebase Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AstralAppContent />
    </AuthProvider>
  );
}
