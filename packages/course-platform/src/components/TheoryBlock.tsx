import { useExercisePaths } from '../hooks/useExercisePaths'
import { useLanguage } from '../hooks/useLanguage'
import { CollapsibleMarkdown } from './CollapsibleMarkdown'
import { ScrollToTop } from './ScrollToTop'

interface TheoryBlockProps {
  level: string
}

export function TheoryBlock({ level }: TheoryBlockProps) {
  const { getTheoryPath } = useExercisePaths()
  const { t } = useLanguage()

  return (
    <CollapsibleMarkdown path={getTheoryPath(level)} title={t('theory.title')}>
      <ScrollToTop />
    </CollapsibleMarkdown>
  )
}
