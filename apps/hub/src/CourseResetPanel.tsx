import { useEffect, useState } from 'react'

import type { CourseConfig, LevelConfig } from '@courses/platform'

import { loadCourseConfig } from './courses'

interface Props {
  dir: string
  title: string
  onClose: () => void
}

/** id задания «8.1» → имя файла «Task8_1». */
function taskFile(id: string): string {
  return `Task${id.replace(/\./g, '_')}`
}

type Busy = { kind: 'course' } | { kind: 'task'; key: string } | null

/**
 * Модалка сброса рабочих файлов ученика к шаблонам для одного курса.
 * Список уровней/заданий берётся из конфига курса (loadCourseConfig), действия
 * шлют POST на dev-endpoint /__course-reset (см. courseResetPlugin).
 */
export function CourseResetPanel({ dir, title, onClose }: Props) {
  const [levels, setLevels] = useState<LevelConfig[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<Busy>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    loadCourseConfig(dir)
      .then((cfg: CourseConfig) => {
        if (alive) setLevels(cfg.exercises)
      })
      .catch((e) => {
        if (alive) setError(e instanceof Error ? e.message : String(e))
      })
    return () => {
      alive = false
    }
  }, [dir])

  // Закрытие по Esc.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function post(url: string): Promise<number> {
    const res = await fetch(url, { method: 'POST' })
    const data = (await res.json()) as { reset?: number; error?: string }
    if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`)
    return data.reset ?? 0
  }

  async function resetCourse() {
    if (!window.confirm(`Сбросить ВСЕ упражнения курса «${title}» к шаблонам? Ваши правки в этих файлах пропадут.`)) return
    setBusy({ kind: 'course' })
    setMessage(null)
    try {
      const n = await post(`/__course-reset/${dir}`)
      setMessage(`Сброшено файлов: ${n}`)
    } catch (e) {
      setMessage(`Ошибка: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setBusy(null)
    }
  }

  async function resetTask(folder: string, id: string) {
    setBusy({ kind: 'task', key: `${folder}/${id}` })
    setMessage(null)
    try {
      const n = await post(`/__course-reset/${dir}/${folder}/${taskFile(id)}`)
      setMessage(n ? `Упражнение ${id} сброшено` : `Упражнение ${id}: без изменений`)
    } catch (e) {
      setMessage(`Ошибка ${id}: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="reset-overlay" onClick={onClose}>
      <div className="reset-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="reset-head">
          <div>
            <h2 className="reset-title">Сброс упражнений</h2>
            <p className="reset-sub">{title}</p>
          </div>
          <button type="button" className="reset-close" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </header>

        <button type="button" className="reset-all" onClick={resetCourse} disabled={busy?.kind === 'course'}>
          {busy?.kind === 'course' ? 'Сбрасываю…' : '↺ Сбросить весь курс'}
        </button>

        {message && <p className="reset-msg">{message}</p>}

        <div className="reset-body">
          {error && <p className="reset-err">Не удалось загрузить список: {error}</p>}
          {!levels && !error && <p className="reset-loading">Загрузка списка упражнений…</p>}
          {levels?.map((lvl) => (
            <div key={lvl.folder} className="reset-level">
              <div className="reset-level-name">{lvl.folder}</div>
              <div className="reset-tasks">
                {lvl.tasks.map((t) => {
                  const isBusy = busy?.kind === 'task' && busy.key === `${lvl.folder}/${t.id}`
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className="reset-task"
                      onClick={() => resetTask(lvl.folder, t.id)}
                      disabled={isBusy}
                      title={`Сбросить упражнение ${t.id} к шаблону`}
                    >
                      {isBusy ? '…' : `↺ ${t.id}`}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
