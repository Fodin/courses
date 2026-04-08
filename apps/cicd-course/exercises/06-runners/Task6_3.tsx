// ============================================
// Задание 6.3: Настройка self-hosted раннера
// Task 6.3: Self-hosted runner registration wizard
// ============================================
//
// ЦЕЛЬ: Пошаговый wizard из 6 шагов для регистрации GitLab Runner.
//        Итог — готовая команда gitlab-runner register и config.toml.
// GOAL: A 6-step wizard for registering a GitLab Runner.
//       Output — ready gitlab-runner register command and config.toml.
//
// ТРЕБОВАНИЯ / REQUIREMENTS:
// 1. Определи тип WizardStep: 'url'|'token'|'executor'|'tags'|'settings'|'result'
//    Define WizardStep type
//
// 2. Определи интерфейс WizardData с полями:
//    url, token, executor: 'docker'|'shell'|'kubernetes'|'',
//    tags: string[], runUntagged: boolean,
//    dockerImage, dockerPrivileged, k8sNamespace, k8sImage
//    Define WizardData interface
//
// 3. Реализуй 6 шагов с переключением через кнопки "Назад" / "Далее":
//    Step 1 (url): ввод URL, валидация startsWith('https://')
//    Step 2 (token): ввод токена, валидация length>=20 или startsWith('glrt-')
//    Step 3 (executor): выбор Docker/Shell/Kubernetes
//    Step 4 (tags): ввод тегов + чекбокс runUntagged
//    Step 5 (settings): настройки для выбранного executor
//    Step 6 (result): команда + config.toml + кнопки "Скопировать"
//    Implement 6 steps
//
// 4. Кнопка "Далее" заблокирована если текущий шаг не валиден
//    "Next" button is disabled when current step is invalid
//
// 5. Реализуй generateCommand(data) → строка с командой gitlab-runner register
//    Implement generateCommand(data) → registration command string
//
// 6. Реализуй generateConfig(data) → строка config.toml
//    Implement generateConfig(data) → config.toml string
//
// 7. Кнопки "Скопировать" меняют текст на "Скопировано!" на 2 секунды
//    Copy buttons change text to "Скопировано!" for 2 seconds
//
// ПОДСКАЗКИ / TIPS:
// - Шаги: массив STEP_ORDER = ['url','token','executor','tags','settings','result']
//   Use STEP_ORDER array to navigate between steps
// - stepIndex = STEP_ORDER.indexOf(step) — для отображения прогресса и навигации
//   stepIndex for progress display and navigation
// - setTimeout для сброса состояния "Скопировано!"
//   Use setTimeout to reset "Скопировано!" state
// - config.toml зависит от executor: Docker добавляет [runners.docker], k8s — [runners.kubernetes]
//   config.toml depends on executor type

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// TODO: Define WizardStep type
// type WizardStep = 'url' | 'token' | 'executor' | 'tags' | 'settings' | 'result'

// TODO: Define WizardData interface
// interface WizardData { url: string; token: string; executor: ...; tags: string[]; ... }

// TODO: Define STEP_ORDER array
// const STEP_ORDER: WizardStep[] = ['url', 'token', 'executor', 'tags', 'settings', 'result']

// TODO: Define STEP_LABELS record
// const STEP_LABELS: Record<WizardStep, string> = { url: 'GitLab URL', ... }

// TODO: Implement generateCommand(data: WizardData): string
// function generateCommand(data: WizardData): string { ... }

// TODO: Implement generateConfig(data: WizardData): string
// function generateConfig(data: WizardData): string { ... }

export function Task6_3() {
  const { t } = useLanguage()
  // TODO: Add step state
  // const [step, setStep] = useState<WizardStep>('url')

  // TODO: Add wizard data state with initial values
  // const [data, setData] = useState<WizardData>({ url: 'https://gitlab.com', ... })

  // TODO: Add tag input state
  // const [tagInput, setTagInput] = useState('')

  // TODO: Add copied state to track which block was copied ('cmd' | 'cfg' | null)
  // const [copied, setCopied] = useState<'cmd' | 'cfg' | null>(null)

  // TODO: Implement isStepValid() based on current step
  // const isStepValid = () => { ... }

  // TODO: Implement next() and prev() navigation
  // const next = () => { ... }
  // const prev = () => { ... }

  // TODO: Implement addTag and removeTag
  // const addTag = (tag: string) => { ... }
  // const removeTag = (tag: string) => { ... }

  // TODO: Implement simulateCopy('cmd' | 'cfg')
  // const simulateCopy = (which: 'cmd' | 'cfg') => { ... }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.6.3.title')}</h2>

      {/* TODO: Render progress indicator (step circles with numbers/checkmarks) */}
      {/* Индикатор прогресса (кружки шагов с номерами/галочками) */}

      {/* TODO: Render current step content inside a bordered card */}
      {/* Step 'url': URL input with validation */}
      {/* Step 'token': token input with hint where to find it */}
      {/* Шаг 'token': ввод токена с подсказкой где его найти */}
      {/* Step 'executor': 3 clickable cards (Docker / Shell / Kubernetes) */}
      {/* Шаг 'executor': 3 кликабельные карточки (Docker / Shell / Kubernetes) */}
      {/* Step 'tags': tag input + suggestions + runUntagged checkbox */}
      {/* Шаг 'tags': ввод тегов + подсказки + чекбокс runUntagged */}
      {/* Step 'settings': executor-specific settings */}
      {/* Шаг 'settings': настройки для выбранного executor */}
      {/* Step 'result': command + config.toml with copy buttons */}
      {/* Шаг 'result': команда + config.toml с кнопками копирования */}

      {/* TODO: Render Back / Next navigation buttons */}
      {/* "Next" disabled when !isStepValid() */}
      {/* TODO: Render Назад / Далее navigation buttons */}
      {/* "Далее" disabled when !isStepValid() */}
    </div>
  )
}
