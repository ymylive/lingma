import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// 用户信息接口
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

// 学习记录接口
export interface LearningRecord {
  lessonId: string;
  lessonTitle: string;
  category: string;
  completedAt: string;
  duration: number; // 学习时长（秒）
}

// 练习记录接口
export interface ExerciseRecord {
  exerciseId: string;
  exerciseTitle: string;
  category: string;
  completedAt: string;
  score: number;
  isCorrect: boolean;
}

// 用户进度接口
export interface UserProgress {
  completedLessons: string[];
  completedExercises: string[];
  learningHistory: LearningRecord[];
  exerciseHistory: ExerciseRecord[];
  totalLearningTime: number;
  lastVisit: string;
  streak: number; // 连续学习天数
}

// 上下文类型
interface UserContextType {
  user: User | null;
  progress: UserProgress;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProgress: (updates: Partial<UserProgress>) => void;
  recordLessonVisit: (lessonId: string, lessonTitle: string, category: string) => void;
  recordExerciseComplete: (exerciseId: string, exerciseTitle: string, category: string, isCorrect: boolean) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isExerciseCompleted: (exerciseId: string) => boolean;
}

const defaultProgress: UserProgress = {
  completedLessons: [],
  completedExercises: [],
  learningHistory: [],
  exerciseHistory: [],
  totalLearningTime: 0,
  lastVisit: '',
  streak: 0,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// 本地存储键
const STORAGE_KEYS = {
  USER: 'ds_user',
  PROGRESS: 'ds_progress',
  USERS_DB: 'ds_users_db',
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  // 初始化：从本地存储加载用户数据
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }

    // 更新连续学习天数
    updateStreak();
  }, []);

  // 保存用户数据到本地存储
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  }, [user]);

  // 保存进度到本地存储
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  }, [progress]);

  // 更新连续学习天数
  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastVisit = progress.lastVisit;

    if (!lastVisit) {
      setProgress(prev => ({ ...prev, lastVisit: today, streak: 1 }));
    } else if (lastVisit !== today) {
      const lastDate = new Date(lastVisit);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        setProgress(prev => ({ ...prev, lastVisit: today, streak: prev.streak + 1 }));
      } else if (diffDays > 1) {
        setProgress(prev => ({ ...prev, lastVisit: today, streak: 1 }));
      }
    }
  };

  // 获取用户数据库
  const getUsersDB = (): Record<string, { user: User; password: string; progress: UserProgress }> => {
    const db = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    return db ? JSON.parse(db) : {};
  };

  // 保存用户到数据库
  const saveUserToDB = (email: string, userData: { user: User; password: string; progress: UserProgress }) => {
    const db = getUsersDB();
    db[email] = userData;
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(db));
  };

  // 登录
  const login = async (email: string, password: string): Promise<boolean> => {
    const db = getUsersDB();
    const userData = db[email];

    if (userData && userData.password === password) {
      setUser(userData.user);
      setProgress(userData.progress);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData.user));
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(userData.progress));
      return true;
    }
    return false;
  };

  // 注册
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    const db = getUsersDB();

    if (db[email]) {
      return false; // 邮箱已存在
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      createdAt: new Date().toISOString(),
    };

    const newProgress = { ...defaultProgress, lastVisit: new Date().toDateString(), streak: 1 };

    saveUserToDB(email, { user: newUser, password, progress: newProgress });
    setUser(newUser);
    setProgress(newProgress);

    return true;
  };

  // 退出登录
  const logout = () => {
    // 保存当前进度到数据库
    if (user) {
      const db = getUsersDB();
      if (db[user.email]) {
        db[user.email].progress = progress;
        localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(db));
      }
    }

    setUser(null);
    setProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  };

  // 更新进度
  const updateProgress = (updates: Partial<UserProgress>) => {
    setProgress(prev => {
      const newProgress = { ...prev, ...updates };
      // 同步到数据库
      if (user) {
        const db = getUsersDB();
        if (db[user.email]) {
          db[user.email].progress = newProgress;
          localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(db));
        }
      }
      return newProgress;
    });
  };

  // 记录课程访问
  const recordLessonVisit = (lessonId: string, lessonTitle: string, category: string) => {
    const record: LearningRecord = {
      lessonId,
      lessonTitle,
      category,
      completedAt: new Date().toISOString(),
      duration: 0,
    };

    setProgress(prev => {
      const newHistory = [record, ...prev.learningHistory].slice(0, 100); // 保留最近100条
      const newCompleted = prev.completedLessons.includes(lessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId];

      return {
        ...prev,
        learningHistory: newHistory,
        completedLessons: newCompleted,
        lastVisit: new Date().toDateString(),
      };
    });
  };

  // 记录练习完成
  const recordExerciseComplete = (exerciseId: string, exerciseTitle: string, category: string, isCorrect: boolean) => {
    const record: ExerciseRecord = {
      exerciseId,
      exerciseTitle,
      category,
      completedAt: new Date().toISOString(),
      score: isCorrect ? 100 : 0,
      isCorrect,
    };

    setProgress(prev => {
      const newHistory = [record, ...prev.exerciseHistory].slice(0, 100);
      const newCompleted = isCorrect && !prev.completedExercises.includes(exerciseId)
        ? [...prev.completedExercises, exerciseId]
        : prev.completedExercises;

      return {
        ...prev,
        exerciseHistory: newHistory,
        completedExercises: newCompleted,
      };
    });
  };

  // 检查课程是否完成
  const isLessonCompleted = (lessonId: string) => progress.completedLessons.includes(lessonId);

  // 检查练习是否完成
  const isExerciseCompleted = (exerciseId: string) => progress.completedExercises.includes(exerciseId);

  return (
    <UserContext.Provider
      value={{
        user,
        progress,
        isLoggedIn: !!user,
        login,
        register,
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
