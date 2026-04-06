import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 1.1: Установка Mosquitto через opkg
// ============================================

// TODO: Определи тип для категорий шагов установки
// Допустимые значения: 'prepare', 'install', 'verify'
// type StepCategory = ...

// TODO: Определи интерфейс InstallStep с полями:
//   id (number) — порядковый номер
//   command (string) — команда для выполнения
//   description (string) — что делает команда
//   output (string) — ожидаемый вывод (может быть пустым)
//   category (StepCategory) — категория шага
// interface InstallStep { ... }

// TODO: Создай массив installSteps из 6+ шагов:
//   1. opkg update — категория: 'prepare'
//   2. opkg install mosquitto-nossl — категория: 'install'
//   3. opkg install mosquitto-client-nossl — категория: 'install'
//   4. /etc/init.d/mosquitto enable — категория: 'install'
//   5. /etc/init.d/mosquitto start — категория: 'install'
//   6. ps | grep mosquitto — категория: 'verify'
//   7. netstat -tlnp | grep 1883 — категория: 'verify'
//   Добавь реалистичный output для каждого шага
// const installSteps: InstallStep[] = [...]

// TODO: Создай объект categoryLabels — маппинг категории на { label, color, bg }:
//   prepare: синий (#1565C0, #E3F2FD)
//   install: фиолетовый (#6A1B9A, #F3E5F5)
//   verify: зелёный (#2E7D32, #E8F5E9)
// const categoryLabels: Record<StepCategory, { label: string; color: string; bg: string }> = {...}

export function Task1_1() {
  const { t } = useLanguage()

  // TODO: Создай состояние completedSteps — Set<number>
  // Хранит id выполненных шагов
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  // TODO: Создай состояние expandedStep — number | null
  // Хранит id раскрытого шага
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  // TODO: Создай состояние copied — number | null
  // Хранит id шага, команда которого скопирована (для визуальной обратной связи)
  const [copied, setCopied] = useState<number | null>(null)

  // TODO: Реализуй функцию toggleStep(id: number):
  //   Если id уже в completedSteps — удали его
  //   Иначе — добавь
  //   Обновляй через prevState (иммутабельно через new Set(prev))
  const toggleStep = (_id: number) => {
    // TODO: реализовать
  }

  // TODO: Реализуй функцию copyCommand(id: number, cmd: string):
  //   Скопируй cmd в буфер: navigator.clipboard?.writeText(cmd).catch(() => {})
  //   Установи copied = id
  //   Через 1500ms сбрось: setCopied(null)
  const copyCommand = (_id: number, _cmd: string) => {
    // TODO: реализовать
  }

  // TODO: Вычисли progress — процент выполненных шагов:
  //   Math.round((completedSteps.size / installSteps.length) * 100)
  const progress: number = 0 // TODO: заменить на Math.round((completedSteps.size / installSteps.length) * 100)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '820px' }}>
      <h2>{t('task.1.1')}</h2>
      <p style={{ color: '#555', marginBottom: '1rem' }}>
        Следуй шагам по порядку. Нажми на шаг для просмотра вывода. Отмечай выполненные шаги.
      </p>

      {/* TODO: Реализуй прогресс-бар:
          - Строка: "Прогресс установки" + "{completedSteps.size}/{installSteps.length} ({progress}%)"
          - Число процентов: синий цвет, зелёный при 100%
          - Полоса прогресса: серый фон, заполнение по width={progress%}
          - Анимация заполнения: transition 'width 0.3s ease'
      */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
          <span>Прогресс установки</span>
          <span style={{ fontWeight: 700, color: '#1565C0' }}>
            {completedSteps.size}/? ({progress}%) {/* TODO: заменить ? на длину массива */}
          </span>
        </div>
        <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: '#1565C0',
              transition: 'width 0.3s ease',
              borderRadius: '8px',
            }}
          />
        </div>
      </div>

      {/* TODO: Отрендери список шагов из массива installSteps:
          Каждый шаг — карточка с:
          1. Чекбокс (onClick: toggleStep, цвет зависит от done)
          2. Номер шага (step.id + '.')
          3. Команда (monospace, жирный)
          4. Бейдж категории (цвет из categoryLabels)
          5. Кнопка копирования (📋 → ✓ при copied === step.id)
          6. Стрелка раскрытия (▼ / ▲)

          При раскрытии (expandedStep === step.id):
          - Описание шага
          - Блок вывода в стиле терминала (если output не пустой)
          - Или текст "Нет вывода" если output === ''

          Карточка при done === true: зелёный фон (#F1F8E9), зелёная рамка
      */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div
          style={{
            border: '2px dashed #ddd',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center',
            color: '#aaa',
          }}
        >
          TODO: рендер шагов из массива installSteps
          <br />
          expandedStep: {expandedStep ?? 'none'}
          <br />
          copied: {copied ?? 'none'}
        </div>
      </div>

      {/* TODO: При progress === 100 — показать блок поздравления:
          🎉 + "Mosquitto успешно установлен!" + подпись
          Зелёный фон (#E8F5E9), зелёная рамка
      */}
      {progress === 100 && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#E8F5E9',
            border: '1px solid #A5D6A7',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem' }}>🎉</div>
          <div style={{ fontWeight: 700, color: '#2E7D32' }}>Mosquitto успешно установлен!</div>
        </div>
      )}
    </div>
  )
}
