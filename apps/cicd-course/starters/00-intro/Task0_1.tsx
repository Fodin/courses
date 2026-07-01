import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 0.1: CI vs CD vs CD — разбираемся в терминах
// Task 0.1: CI vs CD vs CD — understanding the terms
// ============================================

// TODO: Определите тип PhaseId для трёх идентификаторов фаз
// TODO: Define a PhaseId type for the three phase identifiers
// type PhaseId = 'ci' | 'delivery' | 'deployment'

// TODO: Определите интерфейс PhaseInfo с полями:
//   id (PhaseId), title (string), shortName (string), goal (string),
//   automatedSteps (string[]), manualStep (string | null),
//   frequency (string), color (string), bgColor (string), borderColor (string)
// TODO: Define a PhaseInfo interface with fields:
//   id (PhaseId), title (string), shortName (string), goal (string),
//   automatedSteps (string[]), manualStep (string | null),
//   frequency (string), color (string), bgColor (string), borderColor (string)

// TODO: Создайте массив phases с данными для трёх фаз:
//   1. Continuous Integration (CI) — синяя (#1565C0), нет ручного шага
//   2. Continuous Delivery (C.Delivery) — оранжевая (#E65100), ручной шаг: "Деплой на prod"
//   3. Continuous Deployment (C.Deployment) — зелёная (#2E7D32), нет ручного шага
// TODO: Create a phases array with data for three phases:
//   1. Continuous Integration (CI) — blue (#1565C0), no manual step
//   2. Continuous Delivery (C.Delivery) — orange (#E65100), manual step: "Deploy to prod"
//   3. Continuous Deployment (C.Deployment) — green (#2E7D32), no manual step

// TODO: Определите интерфейс Activity с полями text и correctPhase
// TODO: Define an Activity interface with text and correctPhase fields

// TODO: Создайте массив activities из 6-8 активностей для классификации.
//   Каждая должна принадлежать одной из трёх фаз.
//   Примеры: "Запустить unit-тесты" (ci), "Задеплоить на prod автоматически" (deployment),
//   "Нажать кнопку Release" (delivery)
// TODO: Create an activities array with 6-8 activities for classification.
//   Each should belong to one of three phases.
//   Examples: "Run unit tests" (ci), "Auto-deploy to prod" (deployment),
//   "Click the Release button" (delivery)

export function Task0_1() {
  const { t } = useLanguage()
  // TODO: Создайте состояние selectedPhase — id выбранной фазы или null
  // TODO: Create selectedPhase state — selected phase id or null
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)

  // TODO: Создайте состояние answers — объект где ключ это индекс активности,
  //   значение — выбранная фаза или null
  // TODO: Create answers state — object where key is activity index,
  //   value is the chosen phase or null

  // TODO: Создайте состояние showResults (boolean)
  // TODO: Create showResults state (boolean)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.0.1')}</h2>

      {/* TODO: Отобрази три карточки фаз в ряд через flex.
          Каждая карточка:
          - Цветной бейдж с shortName
          - Название фазы (title) цветом phase.color
          - Краткое описание цели (goal)
          - Подсказка "Подробнее" или "Свернуть"
          При клике — устанавли или снимай выбор фазы (toggle).
          Если фаза выбрана — покажи бордер цветом фазы и фон bgColor. */}
      {/* TODO: Display three phase cards in a row using flex.
          Each card:
          - Colored badge with shortName
          - Phase title (title) in phase.color
          - Short goal description (goal)
          - Hint "Details" or "Collapse"
          On click — toggle phase selection.
          If selected — show border in phase color and bgColor background. */}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div
          style={{
            flex: '1 1 200px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedPhase(null)}
        >
          <p>{t('task.0.1.placeholder.phaseCard')}</p>
        </div>
      </div>

      {/* TODO: Если фаза выбрана (selectedPhase !== null), покажи детальную панель.
          В ней:
          - Список automaticSteps с иконкой ✅
          - Ручной шаг с иконкой ⚠️ или "Полностью автоматизировано" с ✅
          - Частота (frequency)
          Оберни панель в цветной бордер и фон выбранной фазы. */}
      {/* TODO: If a phase is selected, show the detail panel.
          It should contain:
          - List of automatedSteps with ✅ icon
          - Manual step with ⚠️ icon or "Fully automated" with ✅
          - Frequency label
          Wrap the panel in colored border and background of the selected phase. */}

      {/* TODO: Добавь секцию "Классифицируй активности".
          Для каждой активности из массива activities отобрази:
          - Текст активности
          - Три кнопки (по одной на каждую фазу)
          - При клике на кнопку сохрани ответ в answers
          Кнопка с выбранным ответом должна подсвечиваться цветом соответствующей фазы. */}
      {/* TODO: Add an "Classify activities" section.
          For each activity from the activities array display:
          - Activity text
          - Three buttons (one per phase)
          - On click save the answer in answers
          The button with selected answer should be highlighted in the phase color. */}

      {/* TODO: Добавь кнопку "Проверить ответы".
          По клику установи showResults = true.
          Подсвети правильные ответы зелёным (#E8F5E9), неправильные — красным (#FFEBEE).
          Покажи счётчик: "X / Y правильно". */}
      {/* TODO: Add a "Check answers" button.
          On click set showResults = true.
          Highlight correct answers green (#E8F5E9), wrong ones red (#FFEBEE).
          Show a counter: "X / Y correct". */}
    </div>
  )
}
