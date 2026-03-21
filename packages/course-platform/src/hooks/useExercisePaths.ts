import { useExercisesConfigMap } from '../context/CourseConfigContext'

export function useExercisePaths() {
  const configMap = useExercisesConfigMap()

  return {
    getTaskPath(levelId: string, taskId: string): string {
      const config = configMap.get(levelId)
      if (!config) return ''
      return `/src/exercises/${config.folder}/task-${taskId}.md`
    },
    getTheoryPath(levelId: string): string {
      const config = configMap.get(levelId)
      if (!config) return ''
      return `/src/exercises/${config.folder}/README.md`
    },
  }
}
