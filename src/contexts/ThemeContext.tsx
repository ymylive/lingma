import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isAuto: boolean;
  setIsAuto: (isAuto: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isAuto, setIsAuto] = useState(true);

  // 检查时间并设置主题
  const checkTimeAndSetTheme = () => {
    if (!isAuto) return;

    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const morningThreshold = 7 * 60 + 30; // 7:30
    const eveningThreshold = 19 * 60 + 30; // 19:30

    // 晚上 19:30 到 早上 7:30 之间为深色模式
    if (minutes >= eveningThreshold || minutes < morningThreshold) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  // 初始化和定时检查
  useEffect(() => {
    checkTimeAndSetTheme();
    const interval = setInterval(checkTimeAndSetTheme, 60000); // 每分钟检查一次
    return () => clearInterval(interval);
  }, [isAuto]);

  // 应用主题到 HTML 标签
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // 同步 body 的背景和文字颜色，保证整体背景明显变化
  useEffect(() => {
    const body = window.document.body;
    if (!body) return;

    if (theme === 'dark') {
      body.style.backgroundColor = '#020617'; // slate-950 附近
      body.style.color = '#e5e7eb';           // slate-200 附近
    } else {
      body.style.backgroundColor = '#f8fafc'; // slate-50 附近
      body.style.color = '#020617';           // slate-900 附近
    }
  }, [theme]);

  const toggleTheme = () => {
    setIsAuto(false); // 手动切换后关闭自动模式
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isAuto, setIsAuto }}>
      <div
        className={theme === 'dark' ? 'dark' : ''}
        style={{
          backgroundColor: theme === 'dark' ? '#020617' : '#f8fafc',
          color: theme === 'dark' ? '#e5e7eb' : '#020617',
          minHeight: '100vh',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
