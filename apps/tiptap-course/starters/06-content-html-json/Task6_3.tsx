import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.3: Контролируемый контент
// Task 6.3: Controlled Content
// ============================================

// TODO: Импортируйте useState, useEffect, useEditor, EditorContent, StarterKit
// TODO: Import useState, useEffect, useEditor, EditorContent, StarterKit

// TODO: Реализуйте ControlledEditor({ value, onChange }) —
// editor с content: value, onUpdate вызывает onChange(editor.getHTML()),
// useEffect по value с проверкой editor.getHTML() === value перед setContent(value, { emitUpdate: false })
// TODO: Implement ControlledEditor({ value, onChange }) — see spec above

export function Task6_3() {
  const { t } = useLanguage()

  // TODO: Заведите state value (string), передайте ControlledEditor value/onChange=setValue
  // TODO: Create value state (string), pass to ControlledEditor as value/onChange=setValue

  return (
    <div className="exercise-container">
      <h2>{t('task.6.3')}</h2>

      {/* TODO: Кнопка "Сброс извне" — setValue('...') напрямую */}
      {/* TODO: "Reset externally" button — setValue('...') directly */}

      {/* TODO: <ControlledEditor value={value} onChange={setValue} /> */}
    </div>
  )
}
