import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-0.3.md
// Exercise description: task-0.3.md
//
// Создай калькулятор trade-offs для выбора архитектуры.
// Create a trade-offs calculator for choosing an architecture.
//
// Требования:
// Requirements:
// 1. Набор критериев выбора архитектуры (7 штук), каждый со шкалой от 1 до 5
// 1. A set of architecture selection criteria (7 items), each with a scale from 1 to 5
// 2. Для каждого критерия — заголовок, описание шкалы и ряд из 5 кнопок
// 2. For each criterion — a title, scale description, and a row of 5 buttons
// 3. Активная кнопка подсвечивается цветом в зависимости от того,
//    что она означает: больше → микросервисы (зелёный), меньше → монолит (синий)
// 3. The active button is highlighted with a color depending on what it means:
//    more → microservices (green), less → monolith (blue)
// 4. Рассчитывай итоговые очки монолита и микросервисов по формулам monoScore/microScore
// 4. Calculate final monolith and microservices scores using monoScore/microScore formulas
// 5. Показывай два прогресс-бара с процентами (монолит vs микросервисы)
// 5. Show two progress bars with percentages (monolith vs microservices)
// 6. Рекомендуй одну из трёх архитектур:
// 6. Recommend one of three architectures:
//    - 'monolith'         — если monoScore опережает на 5+
//    - 'monolith'         — if monoScore leads by 5+
//    - 'microservices'    — если microScore опережает на 5+
//    - 'microservices'    — if microScore leads by 5+
//    - 'modular-monolith' — если разница меньше 5
//    - 'modular-monolith' — if the difference is less than 5

// TODO: определи интерфейс Criterion / define the Criterion interface
// interface Criterion {
//   id: string
//   label: string
//   description: string
//   value: number           // current value (1–5)
//   monoScore: (v: number) => number    // monolith score for a given value
//   microScore: (v: number) => number   // microservices score for a given value
// }

// TODO: задай 7 критериев (CRITERIA) / define 7 criteria (CRITERIA)
// Подсказка по логике formul / Hint on formula logic:
//   monoScore обычно = max(0, 6 - v)  — чем меньше значение, тем лучше для монолита
//   monoScore usually = max(0, 6 - v) — the smaller the value, the better for monolith
//   microScore обычно = v             — чем больше значение, тем лучше для микросервисов
//   microScore usually = v            — the larger the value, the better for microservices
//
// const CRITERIA: Criterion[] = [
//   { id: 'team-size', label: 'Размер команды', description: '1 = маленькая (1-5 чел.), 5 = большая (50+ чел.)', value: 2, monoScore: v => Math.max(0, 6 - v), microScore: v => v },
//   { id: 'deploy-freq', label: 'Частота деплоев', description: '1 = раз в квартал, 5 = несколько раз в день', value: 2, monoScore: v => Math.max(0, 5 - v + 1), microScore: v => v },
//   { id: 'fault-isolation', label: 'Критичность изоляции отказов', description: '1 = весь сайт — один контекст, 5 = нужна полная изоляция', value: 2, monoScore: v => Math.max(0, 6 - v), microScore: v => v },
//   { id: 'scalability', label: 'Потребность в масштабировании', description: '1 = нагрузка равномерна, 5 = разные компоненты масштабируются по-разному', value: 2, monoScore: v => Math.max(0, 6 - v), microScore: v => v },
//   { id: 'tech-diversity', label: 'Технологическое разнообразие', description: '1 = один стек, 5 = нужны разные языки и БД', value: 1, monoScore: v => Math.max(0, 6 - v), microScore: v => v },
//   { id: 'project-age', label: 'Стадия проекта', description: '1 = MVP / стартап, 5 = зрелый продукт с устоявшимися доменами', value: 1, monoScore: v => Math.max(0, 6 - v), microScore: v => v },
//   { id: 'infra-maturity', label: 'Зрелость инфраструктуры', description: '1 = нет DevOps, 5 = Kubernetes, CI/CD, observability', value: 2, monoScore: v => Math.max(0, 5 - v + 1), microScore: v => v },
// ]

// TODO: задай текстовые метки для значений шкалы (индекс совпадает со значением)
// TODO: define text labels for scale values (index matches the value)
// const LABELS = ['', 'Совсем нет', 'Слабо', 'Средне', 'Сильно', 'Максимально']
// const LABELS = ['', 'Not at all', 'Slightly', 'Moderately', 'Strongly', 'Maximally']

// TODO: задай конфиг трёх рекомендаций
// TODO: define config for three recommendations
// type RecommendationType = 'monolith' | 'microservices' | 'modular-monolith'
// const recConfig: Record<RecommendationType, { label: string; color: string; message: string }> = {
//   monolith: { label: 'Монолит', color: '#4f86f7', message: '...' },
//   microservices: { label: 'Микросервисы', color: '#38a169', message: '...' },
//   'modular-monolith': { label: 'Модульный монолит', color: '#ed8936', message: '...' },
// }

export function Task0_3() {
  const { t } = useLanguage()

  // TODO: добавь состояние для массива критериев
  // TODO: add state for the criteria array
  // const [criteria, setCriteria] = useState<Criterion[]>(CRITERIA)

  // TODO: реализуй updateValue(id: string, value: number)
  // TODO: implement updateValue(id: string, value: number)
  // Обновляет поле value у критерия с нужным id
  // Updates the value field of the criterion with the given id
  // const updateValue = (id: string, value: number) => { ... }

  // TODO: рассчитай суммарные очки / calculate total scores
  // const totalMonoScore = criteria.reduce((acc, c) => acc + c.monoScore(c.value), 0)
  // const totalMicroScore = criteria.reduce((acc, c) => acc + c.microScore(c.value), 0)
  // const maxScore = criteria.length * 5

  // TODO: переведи очки в проценты (Math.round) / convert scores to percentages (Math.round)
  // const monoPercent = ...
  // const microPercent = ...

  // TODO: определи recommendation на основе разницы очков (порог: 5)
  // TODO: determine recommendation based on score difference (threshold: 5)
  // const recommendation: RecommendationType = ...

  return (
    <div className="exercise-container">
      <h2>{t('task.0.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        {/* TODO: добавь описание — настройте параметры проекта, калькулятор рассчитает архитектуру */}
        {/* TODO: add description — adjust project parameters, the calculator will determine the architecture */}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* TODO: итерируйся по criteria и для каждого отрендери:
            1. Заголовок (label) + текущая метка значения (LABELS[c.value]) справа
            2. Описание шкалы (description)
            3. 5 кнопок (значения 1–5) — активная подсвечивается зелёным или синим
               в зависимости от того, что означает это значение для каждой архитектуры
        */}
        {/* TODO: iterate over criteria and for each render:
            1. Title (label) + current value label (LABELS[c.value]) on the right
            2. Scale description (description)
            3. 5 buttons (values 1–5) — active one highlighted green or blue
               depending on what this value means for each architecture
        */}
      </div>

      {/* TODO: блок результатов (показывать всегда) */}
      {/* TODO: results block (always show) */}
      {/* Содержимое / Contents:
          - Заголовок "Результат анализа" / Title "Analysis Result"
          - Прогресс-бар монолита (monoPercent, синий) / Monolith progress bar (monoPercent, blue)
          - Прогресс-бар микросервисов (microPercent, зелёный) / Microservices progress bar (microPercent, green)
          - Блок рекомендации: цветной бордер, название архитектуры, текст-объяснение
          - Recommendation block: colored border, architecture name, explanation text
      */}
    </div>
  )
}
