import { useMemo, useState } from 'react'

import { useProgress } from '../hooks/useProgress'

import { Editor } from './Editor'
import { FileTree } from './FileTree'
import { SolutionView } from './SolutionView'
import { useSandbox } from './useSandbox'
import { createVirtualFs } from './vfs'
import type { CheckResult, FileLanguage, LabSpec, VirtualFile } from './types'

/** Определить язык файла по расширению, если он не задан явно. */
function langOf(file: VirtualFile): FileLanguage {
  if (file.language) return file.language
  if (file.path.endsWith('.tsx')) return 'tsx'
  if (file.path.endsWith('.ts')) return 'ts'
  if (file.path.endsWith('.css')) return 'css'
  if (file.path.endsWith('.json')) return 'json'
  if (file.path.endsWith('.md')) return 'md'
  return 'ts'
}

/**
 * Лаборатория многофайлового задания.
 * Слева — дерево файлов, справа — редактор; кнопка «Проверить» прогоняет
 * статические проверки. При `showReference` под редактором показывается эталон —
 * так внешняя кнопка «Показать эталон» платформы не прячет сам редактор.
 */
export function Lab({ spec, showReference = false }: { spec: LabSpec; showReference?: boolean }) {
  const { files, setFile, reset } = useSandbox(spec)
  const { toggleTask, isTaskComplete } = useProgress()
  const levelId = spec.id.split('.')[0]

  // Видимые в дереве файлы (без hidden), в порядке объявления.
  const visible = useMemo(() => spec.files.filter(f => f.role !== 'hidden'), [spec])
  const metaByPath = useMemo(
    () => Object.fromEntries(spec.files.map(f => [f.path, f])),
    [spec]
  )

  const firstEditable = visible.find(f => f.role !== 'readonly') ?? visible[0]
  const [activePath, setActivePath] = useState(firstEditable?.path ?? '')
  const [results, setResults] = useState<CheckResult[] | null>(null)

  const active = metaByPath[activePath]
  const activeReadonly = active?.role === 'readonly'

  function runChecks() {
    const fs = createVirtualFs(files, spec.aliases)
    const res = spec.checks.map(check => check(fs))
    setResults(res)
    const allPassed = res.length > 0 && res.every(r => r.passed)
    if (allPassed && !isTaskComplete(levelId, spec.id)) {
      toggleTask(levelId, spec.id)
    }
  }

  const passedCount = results?.filter(r => r.passed).length ?? 0
  const total = spec.checks.length

  return (
    <div className="exercise-container">
      <h2>{spec.title}</h2>
      <p style={{ color: 'var(--clr-text-muted)' }}>
        Отредактируйте файлы слева и нажмите «Проверить». Код не запускается — проверяется
        структура и импорты.
      </p>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Дерево файлов */}
        <div
          style={{
            flex: '0 0 260px',
            minWidth: 220,
            border: '1px solid var(--clr-border)',
            borderRadius: 6,
            padding: 8,
            background: 'var(--clr-bg-secondary)',
            overflowX: 'auto',
          }}
        >
          <FileTree
            entries={visible.map(f => ({ path: f.path, readonly: f.role === 'readonly' }))}
            activePath={activePath}
            onSelect={setActivePath}
          />
        </div>

        {/* Редактор */}
        <div style={{ flex: '1 1 420px', minWidth: 320 }}>
          {active ? (
            <>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: 12,
                  marginBottom: 6,
                  color: 'var(--clr-text-secondary)',
                }}
              >
                {active.path}
                {activeReadonly && ' (только чтение)'}
              </div>
              <Editor
                key={activePath}
                value={files[activePath] ?? ''}
                language={langOf(active)}
                readOnly={activeReadonly}
                onChange={val => {
                  setFile(activePath, val)
                  // Стираем прежние результаты — устаревшие провалы и подсказки не висят.
                  if (results) setResults(null)
                }}
              />
            </>
          ) : (
            <p>Нет файлов.</p>
          )}
        </div>
      </div>

      {/* Кнопки */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <button onClick={runChecks} style={btnPrimary}>
          Проверить
        </button>
        <button
          onClick={() => {
            reset()
            setResults(null)
          }}
          style={btn}
        >
          Сбросить
        </button>
      </div>

      {/* Результаты проверок */}
      {results && (
        <div style={{ marginTop: 16 }}>
          <strong>
            Проверок пройдено: {passedCount}/{total}
            {passedCount === total && total > 0 ? ' ✅' : ''}
          </strong>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: 8 }}>
            {results.map((r, i) => (
              <li
                key={i}
                style={{
                  padding: '8px 10px',
                  marginBottom: 6,
                  borderRadius: 6,
                  border: '1px solid var(--clr-border)',
                  background: r.passed ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)',
                }}
              >
                <span>{r.passed ? '✓' : '✗'} </span>
                <span>{r.message}</span>
                {!r.passed && r.hint && (
                  <div style={{ fontSize: 13, color: 'var(--clr-text-muted)', marginTop: 4 }}>
                    💡 {r.hint}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Эталон — показывается под редактором, не пряча его */}
      {showReference && (
        <div style={{ marginTop: 24, borderTop: '2px solid var(--clr-border)', paddingTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Эталон</h3>
          <p style={{ color: 'var(--clr-text-muted)', marginTop: 0 }}>
            Готовое решение задания (только чтение). Ваш код в редакторе выше сохранён.
          </p>
          <SolutionView spec={spec} />
        </div>
      )}
    </div>
  )
}

const btn: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 6,
  border: '1px solid var(--clr-border)',
  background: 'var(--clr-bg-secondary)',
  color: 'var(--clr-text)',
  cursor: 'pointer',
  fontSize: 14,
}

const btnPrimary: React.CSSProperties = {
  ...btn,
  background: '#3b82f6',
  borderColor: '#3b82f6',
  color: '#fff',
  fontWeight: 600,
}
