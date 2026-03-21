import { useEffect, type ReactNode } from 'react'

import { useLocalStorage } from './useLocalStorage'
import { ThemeContext, type Theme } from './useTheme'

interface ThemeProviderProps {
  storageKey: string
  children: ReactNode
}

export function ThemeProvider({ storageKey, children }: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>(storageKey, 'light')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme')
    } else {
      document.documentElement.classList.remove('dark-theme')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
