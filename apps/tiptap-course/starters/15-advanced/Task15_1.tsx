import { useLanguage } from 'src/hooks'

// ============================================
// Задание 15.1: Decorations
// Task 15.1: Decorations
// ============================================

// TODO: Импортируйте useState, Extension, type Node из '@tiptap/pm/model',
// Plugin, PluginKey из '@tiptap/pm/state', Decoration, DecorationSet из '@tiptap/pm/view',
// useEditor, EditorContent, StarterKit
// TODO: Import useState, Extension, type Node from '@tiptap/pm/model',
// Plugin, PluginKey from '@tiptap/pm/state', Decoration, DecorationSet, useEditor, EditorContent, StarterKit

// TODO: interface SearchPluginState { query: string }
// TODO: const searchKey = new PluginKey<SearchPluginState>('search')
// TODO: Define SearchPluginState + searchKey

// TODO: function searchDecorations(doc, query) { ... находит все вхождения query,
// возвращает DecorationSet.create(doc, decorations) }
// TODO: Define searchDecorations function

// TODO: const SearchHighlight = Extension.create({
//   name: 'searchHighlight',
//   addProseMirrorPlugins() {
//     return [new Plugin({
//       key: searchKey,
//       state: { init: () => ({ query: '' }), apply(tr, prev) {
//         const meta = tr.getMeta(searchKey)
//         return meta ?? prev
//       } },
//       props: { decorations(state) {
//         const { query } = searchKey.getState(state) ?? { query: '' }
//         return searchDecorations(state.doc, query)
//       } },
//     })]
//   },
// })
// TODO: Define SearchHighlight extension (see above)

export function Task15_1() {
  const { t } = useLanguage()

  // TODO: Заведите state query, matchCount
  // TODO: Create query, matchCount state

  // TODO: Создайте editor со StarterKit + SearchHighlight
  // TODO: Create editor with StarterKit + SearchHighlight

  // TODO: handleSearch(value) — обновляет query, диспатчит tr.setMeta(searchKey, { query: value }),
  // считает matchCount
  // TODO: handleSearch(value) function (see above)

  return (
    <div className="exercise-container">
      <h2>{t('task.15.1')}</h2>

      {/* TODO: Поле ввода поиска + счётчик совпадений */}
      {/* TODO: Search input + match counter */}

      {/* TODO: Отрендерите EditorContent, стилизуйте .search-match */}
      {/* TODO: Render EditorContent, style .search-match */}
    </div>
  )
}
