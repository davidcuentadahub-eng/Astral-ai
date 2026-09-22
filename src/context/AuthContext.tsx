import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserProgress, SavedSearch, GlossaryTerm, CuratedQuery } from '../types';
import { glossaryTerms as initialGlossary } from '../data/searchData';
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';

import { isVIPUser, VIP_EMAIL } from '../lib/premium';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isVIP: boolean;
  loginAsVIP: () => void;
  progress: UserProgress;
  curatedQueries: CuratedQuery[];
  allGlossaryTerms: GlossaryTerm[];
  loginWithGoogle: () => Promise<void>;
  login: (email: string, role?: 'estudiante' | 'docente') => void;
  signup: (name: string, email: string, role: 'estudiante' | 'docente') => void;
  quickLogin: (preset: 'estudiante' | 'docente') => void;
  logout: () => void;
  toggleFavoriteTech: (id: string) => void;
  toggleFavoriteOperator: (id: string) => void;
  toggleGuideStep: (stepNumber: number) => void;
  saveSearch: (search: Omit<SavedSearch, 'id' | 'createdAt'>) => void;
  deleteSavedSearch: (id: string) => void;
  addCustomGlossaryTerm: (term: Omit<GlossaryTerm, 'id'>) => void;
  deleteGlossaryTerm: (id: string) => void;
  addCuratedQuery: (query: Omit<CuratedQuery, 'id'>) => void;
  deleteCuratedQuery: (id: string) => void;
  resetProgress: () => void;
}

const defaultUserProgress: UserProgress = {
  completedGuideSteps: [1, 2, 5],
  favoriteTechIds: ['ia', 'ciberseguridad', 'cloud-computing'],
  favoriteOperatorIds: ['comillas', 'site', 'filetype'],
  savedSearches: [
    {
      id: 'demo-1',
      name: 'Papers de IA en universidades',
      query: '"inteligencia artificial" site:edu filetype:pdf',
      notes: 'Fuentes académicas primarias para proyecto de investigación',
      createdAt: '2026-09-20',
      targetEngine: 'google'
    },
    {
      id: 'demo-2',
      name: 'Leyes y normativas de ciberseguridad',
      query: '"seguridad de la información" site:gob.es filetype:pdf',
      notes: 'Marco regulatorio oficial europeo y nacional',
      createdAt: '2026-09-21',
      targetEngine: 'duckduckgo'
    }
  ],
  customGlossaryTerms: []
};

const initialCuratedList: CuratedQuery[] = [
  {
    id: 'cur-1',
    title: 'Investigación Académica Pura',
    description: 'Encuentra artículos revisados por pares en PDF de dominios universitarios.',
    category: 'Académico',
    query: '"aprendizaje profundo" site:edu filetype:pdf',
    engine: 'google'
  },
  {
    id: 'cur-2',
    title: 'Auditoría de Vulnerabilidades Web',
    description: 'Documentación técnica de seguridad excluyendo foros de opinión.',
    category: 'Ciberseguridad',
    query: '"CVE-2024" site:cve.mitre.org OR site:nist.gov',
    engine: 'duckduckgo'
  },
  {
    id: 'cur-3',
    title: 'Especificaciones RFC y Protocolos',
    description: 'Estándares oficiales de comunicación y protocolos de Internet.',
    category: 'Redes',
    query: 'site:rfc-editor.org/rfc "HTTP/3" filetype:txt',
    engine: 'bing'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'tecnobusqueda_user';
const PROGRESS_STORAGE_KEY = 'tecnobusqueda_progress';
const CURATED_STORAGE_KEY = 'tecnobusqueda_curated';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultUserProgress;
    } catch {
      return defaultUserProgress;
    }
  });

  const [curatedQueries, setCuratedQueries] = useState<CuratedQuery[]>(() => {
    try {
      const saved = localStorage.getItem(CURATED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialCuratedList;
    } catch {
      return initialCuratedList;
    }
  });

  const [customTerms, setCustomTerms] = useState<GlossaryTerm[]>([]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);

          let role: 'estudiante' | 'docente' = 'estudiante';
          if (snap.exists() && snap.data().role) {
            role = snap.data().role;
          } else {
            // Save initial user profile to Firestore
            await setDoc(userDocRef, {
              id: fbUser.uid,
              name: fbUser.displayName || 'Estudiante Google',
              email: fbUser.email || '',
              role: 'estudiante',
              avatarColor: 'from-emerald-500 to-teal-600',
              createdAt: new Date().toISOString()
            });
          }

          const newUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Estudiante Google',
            email: fbUser.email || '',
            role,
            avatarColor: role === 'docente' ? 'from-purple-500 to-indigo-600' : 'from-emerald-500 to-teal-600',
            joinDate: new Date().toISOString().split('T')[0]
          };

          setUser(newUser);
        } catch (err) {
          console.error('Error fetching Firestore user profile:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync Saved Searches and Progress with Firestore when user is authenticated with Firebase
  useEffect(() => {
    if (!user || !user.id.startsWith('usr-') === false) return;

    try {
      // Listen to saved searches
      const searchesRef = collection(db, 'users', user.id, 'savedSearches');
      const unsubSearches = onSnapshot(searchesRef, (snapshot) => {
        if (!snapshot.empty) {
          const items: SavedSearch[] = snapshot.docs.map((d) => ({
            ...(d.data() as any),
            id: d.id
          }));
          setProgress((prev) => ({
            ...prev,
            savedSearches: items
          }));
        }
      });

      return () => unsubSearches();
    } catch (err) {
      console.warn('Firestore snapshot error:', err);
    }
  }, [user]);

  // Local storage synchronization as backup
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error(e);
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(CURATED_STORAGE_KEY, JSON.stringify(curatedQueries));
    } catch (e) {
      console.error(e);
    }
  }, [curatedQueries]);

  // Google Sign-In with Firebase Auth
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Firebase Google Sign-In error:', error);
      // Fallback to demo login if popup fails in iframe
      login('google.user@example.edu', 'estudiante');
    }
  };

  const login = (email: string, role: 'estudiante' | 'docente' = 'estudiante') => {
    const formattedName = email.split('@')[0].replace(/[._-]/g, ' ');
    const capitalName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: capitalName || 'Usuario Educativo',
      email: email,
      role: role,
      avatarColor: role === 'docente' ? 'from-purple-500 to-indigo-600' : 'from-cyan-500 to-blue-600',
      joinDate: new Date().toISOString().split('T')[0]
    };
    setUser(newUser);
  };

  const signup = (name: string, email: string, role: 'estudiante' | 'docente') => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email,
      role,
      avatarColor: role === 'docente' ? 'from-purple-500 to-indigo-600' : 'from-cyan-500 to-blue-600',
      joinDate: new Date().toISOString().split('T')[0]
    };
    setUser(newUser);
  };

  const quickLogin = (preset: 'estudiante' | 'docente') => {
    if (preset === 'docente') {
      setUser({
        id: 'usr-docente-demo',
        name: 'Prof. Carlos Méndez',
        email: 'cmendez@universidad.edu',
        role: 'docente',
        avatarColor: 'from-purple-500 to-indigo-600',
        joinDate: '2026-01-15'
      });
    } else {
      setUser({
        id: 'usr-estudiante-demo',
        name: 'María Gómez',
        email: 'maria.gomez@estudiante.edu',
        role: 'estudiante',
        avatarColor: 'from-cyan-500 to-blue-600',
        joinDate: '2026-02-01'
      });
    }
  };

  const isVIP = isVIPUser(user?.email);

  const loginAsVIP = () => {
    setUser({
      id: 'usr-vip-creator',
      name: 'Creador Astral Ultra (VIP)',
      email: VIP_EMAIL,
      role: 'docente',
      avatarColor: 'from-amber-400 via-rose-500 to-purple-600',
      joinDate: new Date().toISOString().split('T')[0]
    });
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignored
    }
    setUser(null);
  };

  const toggleFavoriteTech = (id: string) => {
    setProgress((prev) => {
      const exists = prev.favoriteTechIds.includes(id);
      return {
        ...prev,
        favoriteTechIds: exists
          ? prev.favoriteTechIds.filter((item) => item !== id)
          : [...prev.favoriteTechIds, id]
      };
    });
  };

  const toggleFavoriteOperator = (id: string) => {
    setProgress((prev) => {
      const exists = prev.favoriteOperatorIds.includes(id);
      return {
        ...prev,
        favoriteOperatorIds: exists
          ? prev.favoriteOperatorIds.filter((item) => item !== id)
          : [...prev.favoriteOperatorIds, id]
      };
    });
  };

  const toggleGuideStep = (stepNumber: number) => {
    setProgress((prev) => {
      const exists = prev.completedGuideSteps.includes(stepNumber);
      return {
        ...prev,
        completedGuideSteps: exists
          ? prev.completedGuideSteps.filter((s) => s !== stepNumber)
          : [...prev.completedGuideSteps, stepNumber].sort((a, b) => a - b)
      };
    });
  };

  const saveSearch = async (search: Omit<SavedSearch, 'id' | 'createdAt'>) => {
    const newId = 'srch-' + Date.now();
    const newSearch: SavedSearch = {
      ...search,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProgress((prev) => ({
      ...prev,
      savedSearches: [newSearch, ...prev.savedSearches]
    }));

    // If signed into Firebase, save to Firestore collection
    if (user && !user.id.startsWith('usr-')) {
      try {
        const searchDocRef = doc(db, 'users', user.id, 'savedSearches', newId);
        await setDoc(searchDocRef, newSearch);
      } catch (e) {
        console.warn('Could not persist to Firestore:', e);
      }
    }
  };

  const deleteSavedSearch = async (id: string) => {
    setProgress((prev) => ({
      ...prev,
      savedSearches: prev.savedSearches.filter((s) => s.id !== id)
    }));

    if (user && !user.id.startsWith('usr-')) {
      try {
        await deleteDoc(doc(db, 'users', user.id, 'savedSearches', id));
      } catch (e) {
        console.warn('Could not delete from Firestore:', e);
      }
    }
  };

  const addCustomGlossaryTerm = (term: Omit<GlossaryTerm, 'id'>) => {
    const newTerm: GlossaryTerm = {
      ...term,
      id: 'term-' + Date.now()
    };
    setCustomTerms((prev) => [newTerm, ...prev]);
  };

  const deleteGlossaryTerm = (id: string) => {
    setCustomTerms((prev) => prev.filter((t) => t.id !== id));
  };

  const addCuratedQuery = (query: Omit<CuratedQuery, 'id'>) => {
    const newQuery: CuratedQuery = {
      ...query,
      id: 'cur-' + Date.now()
    };
    setCuratedQueries((prev) => [newQuery, ...prev]);
  };

  const deleteCuratedQuery = (id: string) => {
    setCuratedQueries((prev) => prev.filter((q) => q.id !== id));
  };

  const resetProgress = () => {
    setProgress({
      completedGuideSteps: [],
      favoriteTechIds: [],
      favoriteOperatorIds: [],
      savedSearches: [],
      customGlossaryTerms: []
    });
  };

  const allGlossaryTerms = [...initialGlossary, ...customTerms];

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isVIP,
        loginAsVIP,
        progress,
        curatedQueries,
        allGlossaryTerms,
        loginWithGoogle,
        login,
        signup,
        quickLogin,
        logout,
        toggleFavoriteTech,
        toggleFavoriteOperator,
        toggleGuideStep,
        saveSearch,
        deleteSavedSearch,
        addCustomGlossaryTerm,
        deleteGlossaryTerm,
        addCuratedQuery,
        deleteCuratedQuery,
        resetProgress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
