import { javascript } from '@codemirror/lang-javascript'
import { EditorView } from '@codemirror/view'
import CodeMirror from '@uiw/react-codemirror'

import { useTheme } from '../hooks/useTheme'

import type { FileLanguage } from './types'

interface EditorProps {
  value: string
  language?: FileLanguage
  readOnly?: boolean
  /** Растягивать редактор до минимальной высоты (для лаборатории). */
  fill?: boolean
  onChange?: (value: string) => void
}

/**
 * Минимальная высота задаётся самому `.cm-content`, а не `.cm-editor` — иначе при
 * коротком файле область прокрутки короче редактора: горизонтальный скроллбар
 * повисает посередине, а снизу остаётся мёртвая зона. Заполненный контент делает
 * всю область кликабельной (клик по пустому месту ставит курсор в конец).
 */
const fillHeight = EditorView.theme({
  '.cm-content': { minHeight: '420px' },
  '.cm-gutter': { minHeight: '420px' },
})

/** Языковые расширения CodeMirror по типу файла. TS/TSX — с JSX. */
function extensionsFor(language: FileLanguage | undefined, fill: boolean) {
  const base = fill ? [fillHeight] : []
  switch (language) {
    case 'tsx':
      return [...base, javascript({ jsx: true, typescript: true })]
    case 'ts':
      return [...base, javascript({ typescript: true })]
    default:
      return base // css/json/md — без языковой подсветки, простой текст
  }
}

/** Обёртка над CodeMirror 6 для одного файла песочницы. */
export function Editor({ value, language, readOnly, fill = true, onChange }: EditorProps) {
  const { theme } = useTheme()

  return (
    <CodeMirror
      value={value}
      theme={theme === 'dark' ? 'dark' : 'light'}
      editable={!readOnly}
      readOnly={readOnly}
      autoFocus={!readOnly}
      extensions={extensionsFor(language, fill)}
      onChange={onChange}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: !readOnly,
        autocompletion: false,
      }}
      style={{ fontSize: 13, border: '1px solid var(--clr-border)', borderRadius: 6 }}
    />
  )
}
