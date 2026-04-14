import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'

type Theme = 'modern' | 'wafu'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'theme'
const TRANSITION_MS = 600

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'wafu') return 'wafu'
  } catch {
    // localStorage unavailable
  }
  return 'modern'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // Apply data-theme to <html>
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'wafu') {
      root.dataset.theme = 'wafu'
    } else {
      delete root.dataset.theme
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'modern' ? 'wafu' : 'modern'

    // Add transition class
    const root = document.documentElement
    root.classList.add('theme-transitioning')

    setTheme(next)

    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // localStorage unavailable
    }

    // Remove transition class after animation
    setTimeout(() => {
      root.classList.remove('theme-transitioning')
    }, TRANSITION_MS)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
