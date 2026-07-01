import { forwardRef, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.4: Убрать forwardRef
// Task 1.4: Remove forwardRef
// ============================================

// TODO: Перепишите OldInput, убрав forwardRef — используйте ref как обычный prop
// TODO: Rewrite OldInput, removing forwardRef — use ref as a regular prop

// Этот компонент написан в стиле React 18 (с forwardRef)
// This component is written in React 18 style (with forwardRef)
const OldInput = forwardRef<HTMLInputElement, { placeholder?: string }>(
  (props, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        style={{
          padding: '0.5rem',
          border: '2px solid #1976d2',
          borderRadius: '8px',
          fontSize: '1rem',
        }}
      />
    )
  }
)

OldInput.displayName = 'OldInput'

export function Task1_4() {
  const { t } = useLanguage()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 1.4</h2>

      {/* TODO: Замените OldInput на NewInput без forwardRef */}
      {/* TODO: Replace OldInput with NewInput without forwardRef */}
      <OldInput ref={inputRef} placeholder="Старый компонент с forwardRef" />
      <button onClick={() => inputRef.current?.focus()} style={{ marginTop: '0.5rem' }}>
        Фокус
      </button>
    </div>
  )
}
