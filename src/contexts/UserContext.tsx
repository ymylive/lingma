import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { normalizeSkillLevel, type UserSkillLevel } from '../utils/userPersonalization';
import { normalizeTargetLanguage, type TargetLanguage } from '../utils/targetLanguages';
import { clearVibeCache } from '../services/vibeCodingService';

export interface User {
  id: string;
  username: string;
  email: string;
  skillLevel: UserSkillLevel;
  targetLanguage: TargetLanguage;
  avatar?: string;
  createdAt: string;
}

export interface LearningRecord {
  lessonId: string;
  lessonTitle: string;
  category: string;
  completedAt: string;
  duration: number;
}

export interface ExerciseRecord {
  exerciseId: string;
  exerciseTitle: string;
  category: string;
  completedAt: string;
  score: number;
  isCorrect: boolean;
  passRate?: number;
  verdict?: string;
  feedbackLevel?: string;
  runtimeMs?: number;
  checkpointsPassed?: number;
  checkpointsTotal?: number;
}

export interface UserProgress {
  completedLessons: string[];
  completedExercises: string[];
  learningHistory: LearningRecord[];
  exerciseHistory: ExerciseRecord[];
  skillLevel: UserSkillLevel;
  totalLearningTime: number;
  lastVisit: string;
  streak: number;
}

interface UserContextType {
  user: User | null;
  progress: UserProgress;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, skillLevel: UserSkillLevel, targetLanguage: TargetLanguage) => Promise<boolean>;
  updatePreferences: (updates: { skillLevel?: UserSkillLevel; targetLanguage?: TargetLanguage }) => Promise<boolean>;
  logout: () => void;
  updateProgress: (updates: Partial<UserProgress>) => void;
  recordLessonVisit: (lessonId: string, lessonTitle: string, category: string) => void;
  recordExerciseComplete: (
    exerciseId: string,
    exerciseTitle: string,
    category: string,
    isCorrect: boolean,
    details?: Partial<ExerciseRecord>
  ) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isExerciseCompleted: (exerciseId: string) => boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_PROXY_ORIGIN =
  typeof window !== 'undefined' && window.location ? window.location.origin : 'https://lingma.cornna.xyz';
const AUTH_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:3001/api/auth'
  : (
      import.meta.env.VITE_AUTH_BASE_URL ||
      import.meta.env.VITE_AI_PROXY_URL?.replace('/api/ai', '/api/auth') ||
      `${DEFAULT_PROXY_ORIGIN}/api/auth`
    );

const STORAGE_KEYS = {
  LEGACY_USER: 'ds_user',
  LEGACY_PROGRESS: 'ds_progress',
  LEGACY_USERS_DB: 'ds_users_db',
  PROGRESS_PREFIX: 'ds_progress_user',
};

const defaultProgress: UserProgress = {
  completedLessons: [],
  completedExercises: [],
  learningHistory: [],
  exerciseHistory: [],
  skillLevel: 'beginner',
  totalLearningTime: 0,
  lastVisit: '',
  streak: 0,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

function normalizeProgress(input: unknown): UserProgress {
  if (!input || typeof input !== 'object') {
    return { ...defaultProgress };
  }

  const data = input as Partial<UserProgress>;
  return {
    completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons : [],
    completedExercises: Array.isArray(data.completedExercises) ? data.completedExercises : [],
    learningHistory: Array.isArray(data.learningHistory) ? data.learningHistory : [],
    exerciseHistory: Array.isArray(data.exerciseHistory) ? data.exerciseHistory : [],
    skillLevel: normalizeSkillLevel(data.skillLevel),
    totalLearningTime: typeof data.totalLearningTime === 'number' ? data.totalLearningTime : 0,
    lastVisit: typeof data.lastVisit === 'string' ? data.lastVisit : '',
    streak: typeof data.streak === 'number' ? data.streak : 0,
  };
}

function syncProgressSkillLevel(progress: UserProgress, skillLevel: UserSkillLevel): UserProgress {
  return {
    ...progress,
    skillLevel: normalizeSkillLevel(skillLevel || progress.skillLevel),
  };
}

function getProgressStorageKey(userId: string) {
  return `${STORAGE_KEYS.PROGRESS_PREFIX}_${userId}`;
}

function readStoredProgress(key: string) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    return normalizeProgress(JSON.parse(raw));
  } catch {
    return null;
  }
}

function persistProgress(userId: string, progress: UserProgress) {
  localStorage.setItem(getProgressStorageKey(userId), JSON.stringify(progress));
}

function applyDailyStreak(progress: UserProgress) {
  const today = new Date().toDateString();
  const lastVisit = progress.lastVisit;

  if (!lastVisit) {
    return { ...progress, lastVisit: today, streak: 1 };
  }

  if (lastVisit === today) {
    return progress;
  }

  const diffDays = Math.floor((new Date(today).getTime() - new Date(lastVisit).getTime()) / DAY_MS);
  if (diffDays === 1) {
    return { ...progress, lastVisit: today, streak: progress.streak + 1 };
  }

  return { ...progress, lastVisit: today, streak: 1 };
}

function loadProgressForUser(userId: string) {
  const namespaced = readStoredProgress(getProgressStorageKey(userId));
  if (namespaced) {
    return namespaced;
  }

  const legacy = readStoredProgress(STORAGE_KEYS.LEGACY_PROGRESS);
  if (legacy) {
    persistProgress(userId, legacy);
    return legacy;
  }

  return { ...defaultProgress };
}

function clearLegacyAuthStorage() {
  localStorage.removeItem(STORAGE_KEYS.LEGACY_USER);
  localStorage.removeItem(STORAGE_KEYS.LEGACY_USERS_DB);
}

async function readAuthError(response: Response) {
  const text = await response.text();
  if (!text) {
    return `auth request failed: ${response.status}`;
  }

  try {
    const parsed = JSON.parse(text) as { detail?: string; error?: string };
    if (typeof parsed.detail === 'string' && parsed.detail) return parsed.detail;
    if (typeof parsed.error === 'string' && parsed.error) return parsed.error;
  } catch {
    // Ignore malformed JSON error payloads and fall back to raw text.
  }

  return text;
}

async function fetchAuthSession() {
  const response = await fetch(`${AUTH_BASE_URL}/session`, {
    method: 'GET',
    credentials: 'include',
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await readAuthError(response));
  }

  const data = (await response.json()) as { user?: Partial<User> };
  if (!data.user) {
    return null;
  }

  return {
    id: String(data.user.id || ''),
    username: String(data.user.username || ''),
    email: String(data.user.email || ''),
    createdAt: String(data.user.createdAt || ''),
    avatar: data.user.avatar,
    skillLevel: normalizeSkillLevel(data.user.skillLevel),
    targetLanguage: normalizeTargetLanguage(data.user.targetLanguage),
  };
}

async function loginRequest(email: string, password: string) {
  const response = await fetch(`${AUTH_BASE_URL}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await readAuthError(response));
  }

  const data = (await response.json()) as { user?: Partial<User> };
  if (!data.user) {
    return null;
  }

  return {
    id: String(data.user.id || ''),
    username: String(data.user.username || ''),
    email: String(data.user.email || ''),
    createdAt: String(data.user.createdAt || ''),
    avatar: data.user.avatar,
    skillLevel: normalizeSkillLevel(data.user.skillLevel),
    targetLanguage: normalizeTargetLanguage(data.user.targetLanguage),
  };
}

async function registerRequest(
  username: string,
  email: string,
  password: string,
  skillLevel: UserSkillLevel,
  targetLanguage: TargetLanguage,
) {
  const response = await fetch(`${AUTH_BASE_URL}/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, skillLevel, targetLanguage }),
  });

  if (response.status === 409) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await readAuthError(response));
  }

  const data = (await response.json()) as { user?: Partial<User> };
  if (!data.user) {
    return null;
  }

  return {
    id: String(data.user.id || ''),
    username: String(data.user.username || ''),
    email: String(data.user.email || ''),
    createdAt: String(data.user.createdAt || ''),
    avatar: data.user.avatar,
    skillLevel: normalizeSkillLevel(data.user.skillLevel),
    targetLanguage: normalizeTargetLanguage(data.user.targetLanguage),
  };
}

async function updateProfileRequest(updates: { skillLevel?: UserSkillLevel; targetLanguage?: TargetLanguage }) {
  const response = await fetch(`${AUTH_BASE_URL}/profile`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(await readAuthError(response));
  }

  const data = (await response.json()) as { user?: Partial<User> };
  if (!data.user) {
    return null;
  }

  return {
    id: String(data.user.id || ''),
    username: String(data.user.username || ''),
    email: String(data.user.email || ''),
    createdAt: String(data.user.createdAt || ''),
    avatar: data.user.avatar,
    skillLevel: normalizeSkillLevel(data.user.skillLevel),
    targetLanguage: normalizeTargetLanguage(data.user.targetLanguage),
  };
}

async function logoutRequest() {
  const response = await fetch(`${AUTH_BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok && response.status !== 401) {
    throw new Error(await readAuthError(response));
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const hydrateSession = async () => {
      try {
        const sessionUser = await fetchAuthSession();
        if (cancelled) return;

        clearLegacyAuthStorage();
        clearVibeCache();

        if (!sessionUser) {
          setUser(null);
          setProgress({ ...defaultProgress });
          return;
        }

        const nextProgress = applyDailyStreak(syncProgressSkillLevel(loadProgressForUser(sessionUser.id), sessionUser.skillLevel));
        setUser(sessionUser);
        setProgress(nextProgress);
        persistProgress(sessionUser.id, nextProgress);
      } catch (error) {
        console.error('Failed to restore auth session', error);
        if (!cancelled) {
          clearVibeCache();
          setUser(null);
          setProgress({ ...defaultProgress });
        }
      } finally {
        if (!cancelled) {
          setIsAuthLoading(false);
        }
      }
    };

    void hydrateSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    persistProgress(user.id, progress);
  }, [progress, user]);

  const login = async (email: string, password: string) => {
    const nextUser = await loginRequest(email, password);
    if (!nextUser) {
      return false;
    }

    clearLegacyAuthStorage();
    clearVibeCache();
    const nextProgress = applyDailyStreak(syncProgressSkillLevel(loadProgressForUser(nextUser.id), nextUser.skillLevel));
    setUser(nextUser);
    setProgress(nextProgress);
    persistProgress(nextUser.id, nextProgress);
    return true;
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    skillLevel: UserSkillLevel,
    targetLanguage: TargetLanguage,
  ) => {
    const nextUser = await registerRequest(username, email, password, skillLevel, targetLanguage);
    if (!nextUser) {
      return false;
    }

    clearLegacyAuthStorage();
    clearVibeCache();
    const nextProgress = applyDailyStreak(syncProgressSkillLevel({ ...defaultProgress }, nextUser.skillLevel));
    setUser(nextUser);
    setProgress(nextProgress);
    persistProgress(nextUser.id, nextProgress);
    return true;
  };

  const updatePreferences = async (updates: { skillLevel?: UserSkillLevel; targetLanguage?: TargetLanguage }) => {
    const nextUser = await updateProfileRequest(updates);
    if (!nextUser) {
      return false;
    }

    setUser(nextUser);
    setProgress((prev) => syncProgressSkillLevel(prev, nextUser.skillLevel));
    return true;
  };

  const logout = () => {
    const currentUser = user;
    if (currentUser) {
      persistProgress(currentUser.id, progress);
    }

    clearVibeCache();
    setUser(null);
    setProgress({ ...defaultProgress });
    clearLegacyAuthStorage();
    void logoutRequest().catch((error) => {
      console.error('Failed to clear auth session', error);
    });
  };

  const updateProgress = (updates: Partial<UserProgress>) => {
    setProgress((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const recordLessonVisit = (lessonId: string, lessonTitle: string, category: string) => {
    const record: LearningRecord = {
      lessonId,
      lessonTitle,
      category,
      completedAt: new Date().toISOString(),
      duration: 0,
    };

    setProgress((prev) => {
      const base = applyDailyStreak(prev);
      const completedLessons = base.completedLessons.includes(lessonId)
        ? base.completedLessons
        : [...base.completedLessons, lessonId];

      return {
        ...base,
        completedLessons,
        learningHistory: [record, ...base.learningHistory].slice(0, 100),
      };
    });
  };

  const recordExerciseComplete = (
    exerciseId: string,
    exerciseTitle: string,
    category: string,
    isCorrect: boolean,
    details: Partial<ExerciseRecord> = {}
  ) => {
    const record: ExerciseRecord = {
      exerciseId,
      exerciseTitle,
      category,
      completedAt: new Date().toISOString(),
      score: typeof details.score === 'number' ? details.score : (isCorrect ? 100 : 0),
      isCorrect,
      passRate: details.passRate,
      verdict: details.verdict,
      feedbackLevel: details.feedbackLevel,
      runtimeMs: details.runtimeMs,
      checkpointsPassed: details.checkpointsPassed,
      checkpointsTotal: details.checkpointsTotal,
    };

    setProgress((prev) => {
      const base = applyDailyStreak(prev);
      const completedExercises = isCorrect && !base.completedExercises.includes(exerciseId)
        ? [...base.completedExercises, exerciseId]
        : base.completedExercises;

      return {
        ...base,
        completedExercises,
        exerciseHistory: [record, ...base.exerciseHistory].slice(0, 100),
      };
    });
  };

  const isLessonCompleted = (lessonId: string) => progress.completedLessons.includes(lessonId);
  const isExerciseCompleted = (exerciseId: string) => progress.completedExercises.includes(exerciseId);

  return (
    <UserContext.Provider
      value={{
        user,
        progress,
        isLoggedIn: !!user,
        isAuthLoading,
        login,
        register,
        updatePreferences,
        logout,
        updateProgress,
        recordLessonVisit,
        recordExerciseComplete,
        isLessonCompleted,
        isExerciseCompleted,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
