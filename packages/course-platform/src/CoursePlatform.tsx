import { type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'

import { ErrorBoundary } from './components/ErrorBoundary'
import { ExerciseRenderer } from './components/ExerciseRenderer'
import { LevelSidebar } from './components/LevelSidebar'
import { CourseConfigProvider, useCourseConfig, useExercisesConfigMap } from './context/CourseConfigContext'
import { LanguageProvider } from './hooks/LanguageProvider'
import { ProgressProvider } from './hooks/ProgressProvider'
import { ThemeProvider } from './hooks/ThemeProvider'
import { useLanguage } from './hooks/useLanguage'
import type { CourseConfig } from './types'

import appStyles from './styles/App.module.css'

function TaskPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const { t } = useLanguage()
  const configMap = useExercisesConfigMap()

  const levelId = taskId ? taskId.split('.')[0] : '0'

  if (!configMap.has(levelId)) {
    const config = useCourseConfig()
    return <Navigate to={config.defaultRoute} replace />
  }

  return (
    <div className={appStyles.container}>
      <aside className={appStyles.sidebar}>
        <div className={appStyles.sidebarHeader}>
          <h2 className={appStyles.sidebarTitle}>{t('nav.title')}</h2>
        </div>
        <LevelSidebar currentLevel={levelId} />
      </aside>
      <main className={appStyles.main}>
        <ErrorBoundary>
          <ExerciseRenderer level={levelId} />
        </ErrorBoundary>
      </main>
    </div>
  )
}

function AppContent({ defaultRoute }: { defaultRoute: string }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultRoute} replace />} />
      <Route path="/task/:taskId" element={<TaskPage />} />
      <Route path="*" element={<Navigate to={defaultRoute} replace />} />
    </Routes>
  )
}

function AppProviders({ config, children }: { config: CourseConfig; children: ReactNode }) {
  return (
    <ThemeProvider storageKey={`${config.courseId}-theme`}>
      <LanguageProvider
        storageKey={`${config.courseId}-language`}
        defaultLanguage={config.defaultLanguage}
        translations={config.translations}
      >
        <ProgressProvider storageKey={`${config.courseId}-progress`}>
          {children}
        </ProgressProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export function CoursePlatform({ config }: { config: CourseConfig }) {
  return (
    <BrowserRouter>
      <CourseConfigProvider config={config}>
        <AppProviders config={config}>
          <AppContent defaultRoute={config.defaultRoute} />
        </AppProviders>
      </CourseConfigProvider>
    </BrowserRouter>
  )
}
