import { useState } from 'react'

// TODO: Define interface ChecklistItem: / TODO: Определить интерфейс ChecklistItem:
//   id: string, step: number, title: string,
//   description: string, code: string, lang: string

// TODO: Create SETUP_STEPS array with 6 entries: / TODO: Создать массив SETUP_STEPS с 6 записями:
//
//   1. id: 'install', step: 1, lang: 'bash'
//      title: 'Установить openapi-typescript'
//      description: 'Добавить пакет как dev-зависимость'
//      code: npm install -D openapi-typescript (+ optional openapi-fetch)
//
//   2. id: 'script', step: 2, lang: 'json'
//      title: 'Добавить скрипт в package.json'
//      description: 'Прописать команду генерации в scripts для воспроизводимости'
//      code: package.json scripts with generate:api and generate:api:remote + updated dev script
//
//   3. id: 'gitignore', step: 3, lang: 'bash'
//      title: 'Решить: коммитить ли сгенерированные файлы?'
//      description: 'Два подхода: коммитить (стабильно, видны diff) или игнорировать (генерация в CI)'
//      code: .gitignore example (Variant A) and pre-commit hook (Variant B)
//
//   4. id: 'client', step: 4, lang: 'typescript'
//      title: 'Создать типизированный клиент'
//      description: 'Использовать сгенерированные типы с openapi-fetch или обычным fetch'
//      code: createClient<paths> from openapi-fetch, typed GET /users/{id} example
//
//   5. id: 'usage', step: 5, lang: 'typescript'
//      title: 'Использование в React компоненте'
//      description: 'Пример с React Query + сгенерированными типами'
//      code: UserProfile component using useQuery + apiClient.GET with full type safety
//
//   6. id: 'ci', step: 6, lang: 'yaml'
//      title: 'Настроить CI/CD пайплайн'
//      description: 'Автоматическая регенерация при обновлении спецификации'
//      code: GitHub Actions workflow triggered on openapi.yaml changes

// TODO: Define LANG_COLORS mapping: / TODO: Определить маппинг LANG_COLORS:
//   bash → '#a3e635', json → '#fbbf24', typescript → '#93c5fd', yaml → '#f0abfc'

export function Task9_3() {
  // TODO: checked state: Set<string> (default empty Set)
  // TODO: Состояние checked: Set<string> (по умолчанию пустой Set)
  // TODO: activeStep state: string (default 'install') / TODO: Состояние activeStep: string (по умолчанию 'install')

  // TODO: toggle function: adds/removes id from checked Set
  //   Important: create a new Set (don't mutate existing)
  // TODO: Функция toggle: добавляет/удаляет id из checked Set
  //   Важно: создать новый Set (не мутировать существующий)

  // TODO: Compute activeItem from SETUP_STEPS
  // TODO: Получить activeItem из SETUP_STEPS

  // TODO: Compute progress: Math.round((checked.size / SETUP_STEPS.length) * 100)
  // TODO: Вычислить progress: Math.round((checked.size / SETUP_STEPS.length) * 100)

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1100px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Настройка генерации типов</h2>
      <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Пошаговая инструкция: от установки openapi-typescript до CI/CD пайплайна
      </p>

      {/* TODO: Progress bar
           Container: bg #f1f5f9, height 8px, borderRadius 999px, overflow hidden
           Fill: width = progress%, bg = progress === 100 ? '#10b981' : '#6366f1'
           Label below: 'N из M шагов выполнено' + '🎉 Настройка завершена!' when 100% */}
      {/* TODO: Полоса прогресса
           Контейнер: фон #f1f5f9, высота 8px, borderRadius 999px, overflow hidden
           Заполнение: width = progress%, bg = progress === 100 ? '#10b981' : '#6366f1'
           Метка ниже: 'N из M шагов выполнено' + '🎉 Настройка завершена!' при 100% */}

      {/* TODO: Two-column layout: 280px left + 1fr right

           LEFT — Checklist panel (bg #f8fafc, border, borderRadius 12px):
             Header: 'ШАГИ НАСТРОЙКИ' in small caps
             For each step: clickable row (onClick → setActiveStep)
               - Highlight active: bg '#6366f115', border '#6366f130'
               - Checkbox: 18x18px, click stops propagation and calls toggle(step.id)
                 checked → bg '#10b981', border '#10b981', show checkmark SVG
                 unchecked → bg white, border '#cbd5e1'
               - Step title: step.step + '. ' + step.title
                 checked → color '#94a3b8', text-decoration line-through

           RIGHT — Step detail:
             Card with border and rounded corners

             Header section (bg #f8fafc, border-bottom):
               - Circular step number (purple bg #6366f1, white text)
               - Step title and description
               - Button 'Отметить выполненным' / '✅ Готово' (calls toggle on activeItem.id)
                 Checked state: green background

             Code block:
               - Language bar (dark bg): colored language badge using LANG_COLORS
               - Pre block: bg #1e293b, font 0.8rem, color = LANG_COLORS[lang], show activeItem.code

             Navigation buttons (below card):
               - 'Назад' button (if not first step): go to previous step
               - 'Отметить и продолжить →' button (if not last step):
                 calls toggle(activeStep) + setActiveStep(next step) */}
      {/* TODO: 2-колоночный layout: 280px слева + 1fr справа

           СЛЕВА — Панель чеклиста (фон #f8fafc, рамка, borderRadius 12px):
             Заголовок: 'ШАГИ НАСТРОЙКИ' small caps
             Для каждого шага: кликабельная строка (onClick → setActiveStep)
               - Подсветка активного: фон '#6366f115', рамка '#6366f130'
               - Чекбокс: 18x18px, клик останавливает propagation и вызывает toggle(step.id)
                 отмечен → фон '#10b981', рамка '#10b981', показать SVG-галочку
                 не отмечен → фон белый, рамка '#cbd5e1'
               - Заголовок шага: step.step + '. ' + step.title
                 отмечен → цвет '#94a3b8', text-decoration line-through

           СПРАВА — Детали шага:
             Карточка с рамкой и скруглёнными углами

             Секция заголовка (фон #f8fafc, border-bottom):
               - Круглый номер шага (фиолетовый фон #6366f1, белый текст)
               - Заголовок и описание шага
               - Кнопка 'Отметить выполненным' / '✅ Готово' (вызывает toggle на activeItem.id)
                 Состояние отметки: зелёный фон

             Блок кода:
               - Языковая панель (тёмный фон): цветной языковой бейдж через LANG_COLORS
               - Блок pre: фон #1e293b, шрифт 0.8rem, цвет = LANG_COLORS[lang], показать activeItem.code

             Кнопки навигации (под карточкой):
               - Кнопка 'Назад' (если не первый шаг): перейти к предыдущему шагу
               - Кнопка 'Отметить и продолжить →' (если не последний шаг):
                 вызывает toggle(activeStep) + setActiveStep(следующий шаг) */}

      {/* TODO: Tips block at bottom (bg #f0f9ff, border #bae6fd):
           Header: '📌 Рекомендации по workflow'
           3-column grid with tips:
           - Маленькая команда: коммитить schema.d.ts в git
           - Большая команда: генерировать в CI, публиковать как npm-пакет
           - Монорепо: выделить пакет @company/api-types */}
      {/* TODO: Блок советов внизу (фон #f0f9ff, рамка #bae6fd):
           Заголовок: '📌 Рекомендации по workflow'
           3-колоночная сетка с советами:
           - Маленькая команда: коммитить schema.d.ts в git
           - Большая команда: генерировать в CI, публиковать как npm-пакет
           - Монорепо: выделить пакет @company/api-types */}
    </div>
  )
}
