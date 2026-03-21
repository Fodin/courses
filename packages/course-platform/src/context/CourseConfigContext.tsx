import { createContext, useContext } from 'react'

import type { CourseConfig, LevelConfig } from '../types'

const CourseConfigContext = createContext<CourseConfig | null>(null)

export function CourseConfigProvider({
  config,
  children,
}: {
  config: CourseConfig
  children: React.ReactNode
}) {
  return <CourseConfigContext.Provider value={config}>{children}</CourseConfigContext.Provider>
}

export function useCourseConfig(): CourseConfig {
  const config = useContext(CourseConfigContext)
  if (!config) {
    throw new Error('useCourseConfig must be used within CourseConfigProvider')
  }
  return config
}

export function useExercisesConfig(): LevelConfig[] {
  return useCourseConfig().exercises
}

export function useExercisesConfigMap(): Map<string, LevelConfig> {
  const exercises = useExercisesConfig()
  return new Map(exercises.map(level => [level.levelId, level]))
}
