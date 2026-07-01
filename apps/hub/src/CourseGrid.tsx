import { useState } from 'react'

import { courseProgress, type CourseMeta } from './courses'
import { CourseResetPanel } from './CourseResetPanel'

interface Props {
  courses: CourseMeta[]
  onSelect: (dir: string) => void
}

// Русское склонение по числу: [1, 2-4, 5-0] с учётом «11-14 → форма для 5+».
function plural(n: number, one: string, few: string, many: string): string {
  const mod100 = n % 100
  const mod10 = n % 10
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}

export function CourseGrid({ courses, onSelect }: Props) {
  // Курс, для которого открыта панель сброса (null — закрыта).
  const [resetFor, setResetFor] = useState<CourseMeta | null>(null)

  return (
    <div className="hub">
      <div className="hub-grid">
        {courses.map((c) => {
          const prog = courseProgress(c)
          return (
            <div key={c.dir} className="hub-card">
              <button type="button" className="hub-card-open" onClick={() => onSelect(c.dir)}>
                <span className="hub-card-title">{c.title}</span>
                <span className="hub-card-id">{c.courseId}</span>

                <span className="hub-card-meta">
                  <span className="hub-card-chip">
                    {c.levels}&nbsp;{plural(c.levels, 'урок', 'урока', 'уроков')}
                  </span>
                  {c.tasks > 0 && (
                    <span className="hub-card-chip">
                      {c.tasks}&nbsp;{plural(c.tasks, 'задание', 'задания', 'заданий')}
                    </span>
                  )}
                </span>

                {prog.pct > 0 && (
                  <>
                    <span className="hub-card-progress" aria-hidden="true">
                      <span className="hub-card-progress-fill" style={{ width: `${prog.pct}%` }} />
                    </span>
                    <span className="hub-card-progress-label">
                      {prog.pct === 100 ? '✓ Пройден' : `Пройдено ${prog.done} из ${prog.total}`}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="hub-card-reset"
                onClick={() => setResetFor(c)}
                title="Сбросить упражнения курса к шаблонам"
                aria-label={`Сбросить упражнения курса ${c.title}`}
              >
                ↺
              </button>
            </div>
          )
        })}
      </div>

      {resetFor && (
        <CourseResetPanel dir={resetFor.dir} title={resetFor.title} onClose={() => setResetFor(null)} />
      )}
    </div>
  )
}
