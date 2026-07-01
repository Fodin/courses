import { useEffect, useState } from 'react'

import { CoursePlatform, type CourseConfig } from '@courses/platform'

import { courses, loadCourseConfig, makeStudentLoader } from './courses'
import { CourseGrid } from './CourseGrid'

const LAST_COURSE_KEY = 'courses-hub:last-course'

export function App() {
  const [dir, setDir] = useState<string | null>(null)
  const [config, setConfig] = useState<CourseConfig | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function openCourse(courseDir: string) {
    setDir(courseDir)
    setConfig(null)
    setError(null)
    setLoading(true)
    localStorage.setItem(LAST_COURSE_KEY, courseDir)
    try {
      setConfig(await loadCourseConfig(courseDir))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  function backToGrid() {
    setDir(null)
    setConfig(null)
    setError(null)
  }

  // Тайтл вкладки: название курса внутри курса, «Курсы» на гриде.
  useEffect(() => {
    document.title = dir && config ? config.title : 'Курсы'
  }, [dir, config])

  // Авто-возврат к последнему курсу (если он есть и не запрошено меню через ?menu).
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('menu')) return
    const last = localStorage.getItem(LAST_COURSE_KEY)
    if (last && courses.some((c) => c.dir === last)) {
      void openCourse(last)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (dir) {
    if (error) {
      return (
        <div className="hub-loading">
          <div>
            <p>Не удалось загрузить курс «{dir}»:</p>
            <pre>{error}</pre>
            <button type="button" className="hub-card" onClick={backToGrid}>
              ← Все курсы
            </button>
          </div>
        </div>
      )
    }
    if (loading || !config) {
      return <div className="hub-loading">Загрузка курса…</div>
    }
    return (
      <CoursePlatform
        config={config}
        loadStudentTask={makeStudentLoader(dir)}
        exercisesBaseUrl={`/course-files/${dir}`}
        onExit={backToGrid}
      />
    )
  }

  return <CourseGrid courses={courses} onSelect={openCourse} />
}
