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

export interface QuizOption {
  text: string
  correct: boolean
  explanation?: string
}

export interface QuizQuestion {
  question: string
  type: 'single' | 'multiple'
  options: QuizOption[]
}

export interface CourseConfig {
  courseId: string
  title: string
  defaultLanguage: Language
  defaultRoute: string
  exercises: LevelConfig[]
  translations: Translations
}
