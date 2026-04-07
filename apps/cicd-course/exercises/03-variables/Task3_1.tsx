// ============================================
// Задание 3.1: Каталог предопределённых переменных
// Task 3.1: Predefined variables catalog
// ============================================
//
// Цель: создать интерактивный каталог предопределённых переменных GitLab CI
// с фильтрацией по категориям и поиском.
//
// Требования:
// 1. Массив с 20+ переменными (name, category, description, example)
// 2. Кнопки фильтрации по категориям: all, commit, pipeline, job, project, runner, merge-request
// 3. Поле поиска (по имени и описанию, регистронезависимо)
// 4. Счётчик найденных переменных
// 5. Сообщение при пустых результатах
// 6. Имена переменных в моноширинном шрифте

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// TODO: объяви тип категории
// type VariableCategory = 'all' | 'commit' | ...

// TODO: объяви интерфейс для переменной
// interface PredefinedVariable {
//   name: string
//   category: ...
//   description: string
//   example: string
// }

// TODO: создай массив PREDEFINED_VARIABLES с 20+ переменными
// Категории: commit, pipeline, job, project, runner, merge-request
// const PREDEFINED_VARIABLES: PredefinedVariable[] = [...]

export function Task3_1() {
  const { t } = useLanguage()
  // TODO: добавь state для активной категории (по умолчанию 'all')
  // const [activeCategory, setActiveCategory] = useState<VariableCategory>('all')

  // TODO: добавь state для строки поиска
  // const [searchQuery, setSearchQuery] = useState('')

  // TODO: реализуй фильтрацию:
  // - сначала по категории (если 'all' — все)
  // - потом по строке поиска (name + description, toLowerCase)
  // const filtered = PREDEFINED_VARIABLES.filter(v => { ... })

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.3.1')}</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        {t('task.3.1.description')}
      </p>

      {/* TODO: поле поиска */}
      {/* <input type="text" placeholder={t('task.3.1.searchPlaceholder')} ... /> */}

      {/* TODO: кнопки-фильтры по категориям */}
      {/* ['all', 'commit', 'pipeline', 'job', 'project', 'runner', 'merge-request'].map(cat => ( */}
      {/*   <button key={cat} onClick={() => setActiveCategory(cat)} ...> */}
      {/*     {cat} */}
      {/*   </button> */}
      {/* )) */}

      {/* TODO: счётчик найденных переменных */}
      {/* <p>{t('task.3.1.foundCount', { count: filtered.length })}</p> */}

      {/* TODO: список переменных или сообщение о пустых результатах */}
      {/* {filtered.length === 0 ? ( */}
      {/*   <div>{t('task.3.1.noResults')}</div> */}
      {/* ) : ( */}
      {/*   filtered.map(v => ( */}
      {/*     <div key={v.name}> */}
      {/*       <code>{v.name}</code> — {v.description} */}
      {/*     </div> */}
      {/*   )) */}
      {/* )} */}

      <p style={{ color: '#999' }}>TODO: implement variables catalog</p>
    </div>
  )
}
