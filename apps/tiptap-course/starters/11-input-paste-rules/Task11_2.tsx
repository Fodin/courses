import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.2: Paste rules: автоссылки
// Task 11.2: Paste Rules: Auto-Links
// ============================================

// TODO: Импортируйте Mark, markPasteRule из '@tiptap/core',
// useEditor, EditorContent, StarterKit
// TODO: Import Mark, markPasteRule from '@tiptap/core',
// useEditor, EditorContent, StarterKit

// TODO: const AutoLink = Mark.create({
//   name: 'autoLink',
//   addAttributes() { return { href: { default: null } } },
//   parseHTML() { return [{ tag: 'a[href]' }] },
//   renderHTML({ HTMLAttributes }) { return ['a', HTMLAttributes, 0] },
//   addPasteRules() { return [
//     markPasteRule({
//       find: /https?:\/\/[^\s]+/g,
//       type: this.type,
//       getAttributes: (match) => ({ href: match[0] }),
//     }),
//   ] },
// })
// TODO: Define AutoLink mark (see above)

export function Task11_2() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit + AutoLink
  // TODO: Create editor with StarterKit + AutoLink

  // TODO: sampleText = 'Смотрите https://tiptap.dev для примеров'
  // TODO: sampleText constant

  return (
    <div className="exercise-container">
      <h2>{t('task.11.2')}</h2>

      {/* TODO: readOnly input с sampleText + кнопка "Скопировать"
          (navigator.clipboard?.writeText(sampleText)) */}
      {/* TODO: readOnly input with sampleText + "Copy" button */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
