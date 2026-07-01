import type { CourseMeta } from './courses'

interface Props {
  courses: CourseMeta[]
  onSelect: (dir: string) => void
}

// Русское склонение: 1 курс, 2-4 курса, 5-20 курсов (с учётом последних цифр).
function pluralCourses(n: number): string {
  const mod100 = n % 100
  const mod10 = n % 10
  if (mod100 >= 11 && mod100 <= 14) return 'курсов'
  if (mod10 === 1) return 'курс'
  if (mod10 >= 2 && mod10 <= 4) return 'курса'
  return 'курсов'
}

export function CourseGrid({ courses, onSelect }: Props) {
  return (
    <div className="hub">
      <header className="hub-header">
        <h1 className="hub-title">Курсы</h1>
        <p className="hub-subtitle">
          {courses.length} {pluralCourses(courses.length)} — выбери, с чего продолжить
        </p>
      </header>
      <div className="hub-grid">
        {courses.map((c) => (
          <button key={c.dir} type="button" className="hub-card" onClick={() => onSelect(c.dir)}>
            <span className="hub-card-title">{c.title}</span>
            <span className="hub-card-id">{c.courseId}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
