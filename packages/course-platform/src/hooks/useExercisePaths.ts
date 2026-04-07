import { useExercisesConfigMap } from '../context/CourseConfigContext'
import { useLanguage } from './useLanguage'

export function useExercisePaths() {
  const configMap = useExercisesConfigMap()
  const { language } = useLanguage()

  const suffix = language === 'ru' ? '.ru' : '.en'

  return {
    getTaskPath(levelId: string, taskId: string): string {
      const config = configMap.get(levelId)
      if (!config) return ''
      return `/src/exercises/${config.folder}/task-${taskId}${suffix}.md`
    },
    getTheoryPath(levelId: string): string {
      const config = configMap.get(levelId)
      if (!config) return ''
      return `/src/exercises/${config.folder}/README${suffix}.md`
    },
    getTheoryLongPath(levelId: string): string {
      const config = configMap.get(levelId)
      if (!config) return ''
      return `/src/exercises/${config.folder}/README-long${suffix}.md`
    },
    getQuizPath(levelId: string): string {
      const config = configMap.get(levelId)
      if (!config) return ''
      return `/src/exercises/${config.folder}/quiz${suffix}.json`
    },
  }
}
