// ============================================
// Задание 3.3: Variable Expansion — разворачивание переменных
// Task 3.3: Variable expansion demonstrator
// ============================================
//
// Цель: создать интерактивный демонстратор variable expansion.
// Пользователь пишет скрипт с переменными, нажимает "Resolve" и видит результат.
//
// Требования:
// 1. Textarea для ввода скрипта с переменными ($VAR, ${VAR}, ${VAR:-default})
// 2. Блок предустановленных переменных (CI_COMMIT_SHA, CI_COMMIT_SHORT_SHA и др.)
// 3. Форма добавления кастомной переменной (имя + значение)
// 4. Кнопка "Resolve" — подставляет значения
// 5. Панель "Resolved" с результатом
// 6. Нераскрытые переменные выделить цветом

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// Предустановленные переменные с реалистичными значениями
// TODO: при желании расширь этот объект
const DEFAULT_VARIABLES: Record<string, string> = {
  CI_COMMIT_SHA: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
  CI_COMMIT_SHORT_SHA: 'a1b2c3d4',
  CI_COMMIT_REF_NAME: 'feature/login',
  CI_PROJECT_NAME: 'my-service',
  CI_REGISTRY_IMAGE: 'registry.gitlab.com/mygroup/my-service',
}

// Пример скрипта для textarea по умолчанию
const DEFAULT_SCRIPT = `docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
echo "Branch: $CI_COMMIT_REF_NAME"
echo "Env: \${APP_ENV:-development}"
`

// TODO: объяви интерфейс для кастомной переменной
// interface CustomVariable {
//   id: string
//   name: string
//   value: string
// }

// TODO: реализуй функцию resolveVariables(script: string, vars: Record<string, string>): string
// Порядок обработки важен:
//   1. ${VAR:-default}  — regex: /\$\{(\w+):-([^}]*)\}/g
//   2. ${VAR}           — regex: /\$\{(\w+)\}/g
//   3. $VAR             — regex: /\$([A-Z_][A-Z0-9_]*)/g
// Если переменная не найдена — оставь как есть (не заменяй)

export function Task3_3() {
  const { t } = useLanguage()
  const [script, setScript] = useState(DEFAULT_SCRIPT)

  // TODO: state для кастомных переменных
  // const [customVars, setCustomVars] = useState<CustomVariable[]>([])

  // TODO: state для полей формы добавления переменной
  // const [newVarName, setNewVarName] = useState('')
  // const [newVarValue, setNewVarValue] = useState('')

  // TODO: state для resolved результата
  // const [resolved, setResolved] = useState<string | null>(null)

  // TODO: объедини DEFAULT_VARIABLES и кастомные переменные в один объект allVars

  // TODO: handleAddVar — добавляет переменную в customVars, очищает поля формы

  // TODO: handleRemoveVar — удаляет переменную по id

  // TODO: handleResolve — вызывает resolveVariables(script, allVars) и записывает в resolved

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.3.3')}</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        {t('task.3.3.description')}
      </p>

      {/* TODO: textarea для скрипта */}
      <textarea
        value={script}
        onChange={e => setScript(e.target.value)}
        rows={8}
        style={{
          width: '100%',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          padding: '0.75rem',
          border: '1px solid #ccc',
          borderRadius: '6px',
          boxSizing: 'border-box',
          resize: 'vertical',
        }}
      />

      {/* TODO: кнопка Resolve */}
      {/* <button onClick={handleResolve}>{t('task.3.3.resolve')}</button> */}

      {/* TODO: панель с предустановленными переменными */}
      <div style={{ marginTop: '1rem' }}>
        <strong>{t('task.3.3.predefinedVars')}</strong>
        {Object.entries(DEFAULT_VARIABLES).map(([name, value]) => (
          <div key={name} style={{ fontFamily: 'monospace', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            <span style={{ color: '#1565C0', fontWeight: 700 }}>{name}</span> = {value}
          </div>
        ))}
      </div>

      {/* TODO: форма добавления кастомной переменной */}
      {/* <input placeholder={t('task.3.3.varName')} value={newVarName} onChange={...} /> */}
      {/* <input placeholder={t('task.3.3.varValue')} value={newVarValue} onChange={...} /> */}
      {/* <button onClick={handleAddVar}>{t('task.3.3.addVar')}</button> */}

      {/* TODO: список кастомных переменных с кнопкой удаления */}

      {/* TODO: блок с resolved результатом */}
      {/* {resolved !== null && ( */}
      {/*   <pre style={{ background: '#1e1e1e', color: '#a8d8a8', padding: '1rem', borderRadius: '6px' }}> */}
      {/*     {resolved} */}
      {/*   </pre> */}
      {/* )} */}

      <p style={{ color: '#999', marginTop: '1rem' }}>TODO: implement variable expansion</p>
    </div>
  )
}
