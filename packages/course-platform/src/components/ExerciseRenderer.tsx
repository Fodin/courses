import { useExercisesConfigMap } from '../context/CourseConfigContext'
import { ExerciseLayout } from './ExerciseLayout'

interface ExerciseRendererProps {
  level: string
}

export function ExerciseRenderer({ level }: ExerciseRendererProps) {
  const configMap = useExercisesConfigMap()
  const config = configMap.get(level) ?? configMap.get('0')!

  return <ExerciseLayout config={config} />
}
