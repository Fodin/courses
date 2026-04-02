import { useExercisePaths } from '../hooks/useExercisePaths'
import { useLanguage } from '../hooks/useLanguage'
import { useFileExists } from '../hooks/useFileExists'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useCourseConfig } from '../context/CourseConfigContext'
import { CollapsibleMarkdown } from './CollapsibleMarkdown'
import { ScrollToTop } from './ScrollToTop'

import styles from './CollapsibleMarkdown.module.css'

type TheoryMode = 'brief' | 'detailed'

interface TheoryBlockProps {
  level: string
}

export function TheoryBlock({ level }: TheoryBlockProps) {
  const { getTheoryPath, getTheoryLongPath } = useExercisePaths()
  const { t } = useLanguage()
  const { courseId } = useCourseConfig()

  const theoryPath = getTheoryPath(level)
  const theoryLongPath = getTheoryLongPath(level)
  const { exists: hasLongVersion } = useFileExists(theoryLongPath)

  const [mode, setMode] = useLocalStorage<TheoryMode>(`${courseId}-theory-mode`, 'brief')

  const selectedPath = mode === 'detailed' && hasLongVersion ? theoryLongPath : theoryPath

  const radioToggle = hasLongVersion ? (
    <div className={styles.radioGroup}>
      <button
        className={`${styles.radioOption} ${mode === 'brief' ? styles.radioOptionActive : ''}`}
        onClick={() => setMode('brief')}
      >
        {t('theory.brief')}
      </button>
      <button
        className={`${styles.radioOption} ${mode === 'detailed' ? styles.radioOptionActive : ''}`}
        onClick={() => setMode('detailed')}
      >
        {t('theory.detailed')}
      </button>
    </div>
  ) : null

  return (
    <CollapsibleMarkdown
      path={selectedPath}
      title={t('theory.title')}
      headerExtra={radioToggle}
      emptyMessage={t('theory.notFound')}
    >
      <ScrollToTop />
    </CollapsibleMarkdown>
  )
}
