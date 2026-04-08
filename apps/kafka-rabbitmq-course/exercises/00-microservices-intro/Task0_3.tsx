import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-0.3.md
//
// Создай калькулятор trade-offs для выбора архитектуры.
//
// Требования:
// 1. Набор критериев выбора архитектуры (7 штук), каждый со шкалой от 1 до 5
// 2. Для каждого критерия — заголовок, описание шкалы и ряд из 5 кнопок
// 3. Активная кнопка подсвечивается цветом в зависимости от того,
//    что она означает: больше → микросервисы (зелёный), меньше → монолит (синий)
// 4. Рассчитывай итоговые очки монолита и микросервисов по формулам monoScore/microScore
// 5. Показывай два прогресс-бара с процентами (монолит vs микросервисы)
// 6. Рекомендуй одну из трёх архитектур:
//    - 'monolith'         — если monoScore опережает на 5+
//    - 'microservices'    — если microScore опережает на 5+
//    - 'modular-monolith' — если разница меньше 5

// TODO: определи интерфейс Criterion
// interface Criterion {
//   id: string
//   label: string
//   description: string
//   value: number           // текущее значение (1–5)
//   monoScore: (v: number) => number    // очки монолита при данном значении
//   microScore: (v: number) => number   // очки микросервисов при данном значении
// }

// TODO: задай 7 критериев (CRITERIA)
// Подсказка по логике formul:
//   monoScore обычно = max(0, 6 - v)  — чем меньше значение, тем лучше для монолита
//   microScore обычно = v             — чем больше значение, тем лучше для микросервисов
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
// const LABELS = ['', 'Совсем нет', 'Слабо', 'Средне', 'Сильно', 'Максимально']

// TODO: задай конфиг трёх рекомендаций
// type RecommendationType = 'monolith' | 'microservices' | 'modular-monolith'
// const recConfig: Record<RecommendationType, { label: string; color: string; message: string }> = {
//   monolith: { label: 'Монолит', color: '#4f86f7', message: '...' },
//   microservices: { label: 'Микросервисы', color: '#38a169', message: '...' },
//   'modular-monolith': { label: 'Модульный монолит', color: '#ed8936', message: '...' },
// }

export function Task0_3() {
  const { t } = useLanguage()

  // TODO: добавь состояние для массива критериев
  // const [criteria, setCriteria] = useState<Criterion[]>(CRITERIA)

  // TODO: реализуй updateValue(id: string, value: number)
  // Обновляет поле value у критерия с нужным id
  // const updateValue = (id: string, value: number) => { ... }

  // TODO: рассчитай суммарные очки
  // const totalMonoScore = criteria.reduce((acc, c) => acc + c.monoScore(c.value), 0)
  // const totalMicroScore = criteria.reduce((acc, c) => acc + c.microScore(c.value), 0)
  // const maxScore = criteria.length * 5

  // TODO: переведи очки в проценты (Math.round)
  // const monoPercent = ...
  // const microPercent = ...

  // TODO: определи recommendation на основе разницы очков (порог: 5)
  // const recommendation: RecommendationType = ...

  return (
    <div className="exercise-container">
      <h2>{t('task.0.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        {/* TODO: добавь описание — настройте параметры проекта, калькулятор рассчитает архитектуру */}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* TODO: итерируйся по criteria и для каждого отрендери:
            1. Заголовок (label) + текущая метка значения (LABELS[c.value]) справа
            2. Описание шкалы (description)
            3. 5 кнопок (значения 1–5) — активная подсвечивается зелёным или синим
               в зависимости от того, что означает это значение для каждой архитектуры
        */}
      </div>

      {/* TODO: блок результатов (показывать всегда) */}
      {/* Содержимое:
          - Заголовок "Результат анализа"
          - Прогресс-бар монолита (monoPercent, синий)
          - Прогресс-бар микросервисов (microPercent, зелёный)
          - Блок рекомендации: цветной бордер, название архитектуры, текст-объяснение
      */}
    </div>
  )
}
