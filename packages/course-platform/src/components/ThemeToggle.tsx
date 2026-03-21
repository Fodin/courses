import { useTheme } from '../hooks/useTheme'

import styles from './ThemeToggle.module.css'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={styles.button}
      title={`Переключить на ${theme === 'light' ? 'тёмную' : 'светлую'} тему`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
