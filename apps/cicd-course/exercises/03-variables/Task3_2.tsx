// ============================================
// Задание 3.2: Визуализатор приоритетов переменных
// Task 3.2: Variable priority visualizer
// ============================================
//
// Цель: визуализировать цепочку приоритетов переменных GitLab CI.
// Пользователь задаёт значение APP_ENV на разных уровнях и видит победителя.
//
// Уровни (от наименьшего к наивысшему приоритету):
//   Instance → Group → Project → .gitlab-ci.yml global → Pipeline → Job
//
// Требования:
// 1. 5+ уровней с полями ввода для переменной APP_ENV
// 2. Кнопка "Определить победителя"
// 3. Уровень-победитель выделяется визуально
// 4. Итоговое значение показывается отдельно
// 5. Кнопка "Сбросить"

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// TODO: объяви интерфейс уровня
// interface PriorityLevel {
//   id: string
//   label: string
//   description: string
//   priority: number   // чем больше — тем выше приоритет
//   color: string
// }

// TODO: создай массив PRIORITY_LEVELS с 5+ уровнями
// const PRIORITY_LEVELS: PriorityLevel[] = [
//   { id: 'instance', label: 'Instance', priority: 1, ... },
//   { id: 'group', label: 'Group', priority: 2, ... },
//   { id: 'project', label: 'Project', priority: 3, ... },
//   { id: 'global', label: '.gitlab-ci.yml (global)', priority: 4, ... },
//   { id: 'pipeline', label: 'Pipeline (ручной/API)', priority: 5, ... },
//   { id: 'job', label: 'Job', priority: 6, ... },
// ]

export function Task3_2() {
  const { t } = useLanguage()
  // TODO: state для значений переменной на каждом уровне
  // Используй объект: { instance: '', group: '', project: '', global: '', pipeline: '', job: '' }
  // const [values, setValues] = useState<Record<string, string>>({ ... })

  // TODO: state для ID победившего уровня и флага "результат показан"
  // const [winner, setWinner] = useState<string | null>(null)
  // const [resolved, setResolved] = useState(false)

  // TODO: handleResolve — находит уровень с наивысшим priority среди непустых
  // Алгоритм:
  //   1. Отфильтровать PRIORITY_LEVELS где values[level.id] !== ''
  //   2. Найти уровень с максимальным priority через reduce или sort
  //   3. Записать его id в winner

  // TODO: handleReset — очищает все поля и сбрасывает winner

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', maxWidth: '720px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.3.2')}</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        {t('task.3.2.description')}
      </p>

      {/* TODO: отрендери список уровней */}
      {/* PRIORITY_LEVELS.map(level => ( */}
      {/*   <div key={level.id} style={{ border: winner === level.id ? '2px solid green' : '...' }}> */}
      {/*     <label>{level.label}</label> */}
      {/*     <input */}
      {/*       value={values[level.id]} */}
      {/*       onChange={e => setValues(prev => ({ ...prev, [level.id]: e.target.value }))} */}
      {/*     /> */}
      {/*     {winner === level.id && <span>{t('task.3.2.winner')}</span>} */}
      {/*   </div> */}
      {/* )) */}

      {/* TODO: кнопки "Определить победителя" и "Сбросить" */}

      {/* TODO: блок с итоговым значением (показывать только после нажатия кнопки) */}

      <p style={{ color: '#999' }}>TODO: implement priority visualizer</p>
    </div>
  )
}
