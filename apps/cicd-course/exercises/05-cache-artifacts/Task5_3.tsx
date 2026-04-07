// Task 5.3: Cache vs Artifacts — decision matrix
// Задание 5.3: Cache vs Artifacts — выбираем правильно

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// TODO: Define Scenario interface
// { id, description, detail, correct: 'cache' | 'artifacts', explanation }
interface Scenario {
  id: number
  description: string
  detail: string
  correct: 'cache' | 'artifacts'
  explanation: string
}

// TODO: Fill in SCENARIOS array with 8 scenarios
// Сценарии: передача dist/, ускорение npm install, JUnit-отчёт,
// Maven-зависимости, Docker digest, логи падения, pip-пакеты, coverage-report
const SCENARIOS: Scenario[] = [
  // TODO: заполни 8 сценариев
]

// TODO: Define ScenarioAnswer interface
// { scenarioId, chosen: 'cache' | 'artifacts', isCorrect }
interface ScenarioAnswer {
  scenarioId: number
  chosen: 'cache' | 'artifacts'
  isCorrect: boolean
}

export function Task5_3() {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<ScenarioAnswer[]>([])
  const [lastAnswer, setLastAnswer] = useState<ScenarioAnswer | null>(null)
  const [showResults, setShowResults] = useState(false)

  // TODO: Implement handleAnswer(choice: 'cache' | 'artifacts')
  // 1. Если уже ответили (lastAnswer !== null) — игнорировать
  // 2. Создать ScenarioAnswer с isCorrect = choice === scenario.correct
  // 3. Сохранить в lastAnswer и добавить в answers
  const handleAnswer = (_choice: 'cache' | 'artifacts') => {
    // TODO
  }

  // TODO: Implement handleNext
  // Если currentIndex < SCENARIOS.length - 1 — перейти к следующему, сбросить lastAnswer
  // Иначе — показать результаты (setShowResults(true))
  const handleNext = () => {
    // TODO
  }

  // TODO: Implement handleReset
  // Сбросить всё в начальное состояние
  const handleReset = () => {
    setCurrentIndex(0)
    setAnswers([])
    setLastAnswer(null)
    setShowResults(false)
  }

  // Suppress unused warnings
  void answers
  void lastAnswer
  void showResults

  // If SCENARIOS is empty, show a placeholder
  if (SCENARIOS.length === 0) {
    return (
      <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
        <h2>{t('task.5.3')}</h2>
        <p style={{ color: '#aaa' }}>TODO: заполни массив SCENARIOS (8 сценариев)</p>
        <button onClick={handleReset} style={{ display: 'none' }} />
        <button onClick={handleNext} style={{ display: 'none' }} />
        <button onClick={() => handleAnswer('cache')} style={{ display: 'none' }} />
      </div>
    )
  }

  // TODO: Results screen
  // Показывать если showResults === true
  // Счёт: correctCount из SCENARIOS.length
  // Список всех сценариев с результатом ответа
  // Кнопка "Сначала"

  // TODO: Quiz screen
  // Заголовок, прогресс-бар (currentIndex + 1 / SCENARIOS.length)
  // Блок с описанием текущего сценария
  // Две кнопки: "Cache" и "Artifacts"
  // При answered — цветовая индикация и объяснение
  // Кнопка "Следующий" появляется после ответа

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '680px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.3')}</h2>
      <p style={{ color: '#aaa' }}>
        {t('task.5.3.subtitle')}
      </p>

      {/* TODO: scenario card */}
      {/* TODO: two choice buttons */}
      {/* TODO: explanation after answer */}
      {/* TODO: next button */}
    </div>
  )
}
