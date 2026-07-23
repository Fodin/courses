import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.3: addGlobalAttributes
// Task 8.3: addGlobalAttributes
// ============================================

// TODO: Импортируйте useState, Extension, useEditor, EditorContent, StarterKit
// TODO: Import useState, Extension, useEditor, EditorContent, StarterKit

// TODO: const IdAttribute = Extension.create({
//   name: 'idAttribute',
//   addGlobalAttributes() {
//     return [{
//       types: ['heading', 'paragraph'],
//       attributes: {
//         id: {
//           default: null,
//           parseHTML: (element) => element.getAttribute('id'),
//           renderHTML: (attributes) => attributes.id ? { id: attributes.id } : {},
//         },
//       },
//     }]
//   },
// })
// TODO: Define IdAttribute extension (see above)

export function Task8_3() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit + IdAttribute
  // TODO: Create editor with StarterKit + IdAttribute

  // TODO: Функция assignId — определяет activeType ('heading' или 'paragraph')
  // через editor?.isActive('heading'), затем
  // editor?.chain().focus().updateAttributes(activeType, { id: `block-${Date.now()}` }).run()
  // TODO: assignId function — determine active block type, then updateAttributes with a new id

  return (
    <div className="exercise-container">
      <h2>{t('task.8.3')}</h2>

      {/* TODO: Кнопка "Присвоить ID текущему блоку" вызывает assignId */}
      {/* TODO: "Assign ID to current block" button calls assignId */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}

      {/* TODO: Выведите editor?.getHTML() в <pre> */}
      {/* TODO: Output editor?.getHTML() in <pre> */}
    </div>
  )
}
