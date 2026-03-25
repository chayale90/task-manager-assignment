import { createContext, useContext, useEffect, useState, useCallback, ReactNode, createElement } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);


function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  console.log('Applying theme:', resolved);
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  console.log('HTML classes after theme change:', root.className);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as Theme;
      return stored || 'light';
    }
    return 'light';
  });

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return createElement(
    ThemeContext.Provider,
    { value: { theme, setTheme } },
    children
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
