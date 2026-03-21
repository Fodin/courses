import type { ReactElement } from 'react'

export type Language = 'ru' | 'en'

export type Translations = Record<Language, Record<string, string>>

export interface TaskEntry {
  id: string
  component: ReactElement
  solution: ReactElement
}

export interface LevelConfig {
  levelId: string
  folder: string
  navKey: string
  descKey: string
  tasks: TaskEntry[]
}

export interface CourseConfig {
  courseId: string
  title: string
  defaultLanguage: Language
  defaultRoute: string
  exercises: LevelConfig[]
  translations: Translations
}
