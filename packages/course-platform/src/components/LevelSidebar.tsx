import { Link } from 'react-router-dom'

import { useExercisesConfig } from '../context/CourseConfigContext'
import { useLanguage } from '../hooks/useLanguage'
import { useProgress } from '../hooks/useProgress'
import { LanguageToggle } from './LanguageToggle'
import { ThemeToggle } from './ThemeToggle'

import styles from './LevelSidebar.module.css'

interface LevelSidebarProps {
  currentLevel: string
}

export function LevelSidebar({ currentLevel }: LevelSidebarProps) {
  const exercises = useExercisesConfig()
  const { t } = useLanguage()
  const { getLevelProgress, isQuizComplete } = useProgress()

  return (
    <div>
      <nav className={styles.nav}>
        {exercises.map(level => {
          const totalTasks = level.tasks.length
          const tasksComplete = totalTasks > 0 && getLevelProgress(level.levelId, totalTasks) === 100
          const quizComplete = isQuizComplete(level.levelId)

          let badge: { text: string; className: string } | null = null
          if (tasksComplete && quizComplete) {
            badge = { text: '✓✓', className: styles.checkmarkDouble }
          } else if (tasksComplete) {
            badge = { text: '✓', className: styles.checkmark }
          } else if (quizComplete) {
            badge = { text: '🧪', className: styles.checkmarkQuiz }
          }

          return (
            <Link
              key={level.levelId}
              to={`/task/${level.tasks[0]?.id ?? `${level.levelId}.1`}`}
              className={`
                ${styles.button}
                ${currentLevel === level.levelId ? styles.buttonActive : styles.buttonInactive}
              `}
            >
              {badge && <span className={badge.className}>{badge.text}</span>}
              <div className={styles.buttonTitle}>
                {t('nav.level')} {level.levelId}: {t(level.navKey)}
              </div>
              <div className={styles.buttonDescription}>{t(level.descKey)}</div>
            </Link>
          )
        })}
      </nav>

      <div className={styles.toggles}>
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </div>
  )
}
