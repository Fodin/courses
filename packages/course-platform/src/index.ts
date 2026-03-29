// Main entry component
export { CoursePlatform } from './CoursePlatform'

// Types
export type { CourseConfig, LevelConfig, TaskEntry, Language, Translations, QuizQuestion, QuizOption } from './types'

// Config helper
export { task } from './helpers'

// Context
export { useCourseConfig, useExercisesConfig, useExercisesConfigMap } from './context/CourseConfigContext'

// Hooks (for use in exercise solutions)
export { useTheme } from './hooks/useTheme'
export { useLanguage } from './hooks/useLanguage'
export { useProgress } from './hooks/useProgress'
export { useLocalStorage } from './hooks/useLocalStorage'
export { useMarkdownLoader } from './hooks/useMarkdownLoader'
export { useCollapsible } from './hooks/useCollapsible'
export { useScrollToTop } from './hooks/useScrollToTop'
export { useExerciseNavigation } from './hooks/useExerciseNavigation'

// Components (for use in exercise solutions)
export { FormContainer } from './components/FormContainer'
export { CodeHighlight } from './components/CodeHighlight'
export { CodeExample } from './components/CodeExample'
export { InterfaceDef } from './components/InterfaceDef'
export { Requirements } from './components/Requirements'
export { Tip } from './components/Tip'
export { TaskBlock } from './components/TaskBlock'
export { TaskStub } from './components/TaskStub'

// Styles (import in app's main.tsx)
export const PLATFORM_STYLES_PATH = '@courses/platform/src/styles/index.css'
