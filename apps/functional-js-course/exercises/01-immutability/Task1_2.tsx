import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.2: Глубокое клонирование
// Task 1.2: Deep Cloning
// ============================================
// Сравните три стратегии клонирования объекта с вложенными данными и Date.
// Compare three cloning strategies for an object with nested data and a Date field.

interface DeepObj {
  user: {
    name: string
    settings: {
      theme: string
      notifications: { email: boolean; sms: boolean }
    }
    createdAt: Date
  }
}

// TODO: Реализуйте функцию, создающую свежий оригинальный объект
// TODO: Implement a function that creates a fresh original object
function makeOriginal(): DeepObj {
  return {
    user: {
      name: 'Bob',
      settings: {
        theme: 'dark',
        notifications: { email: true, sms: false },
      },
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
    },
  }
}

export function Task1_2() {
  const { t } = useLanguage()

  // Три независимых оригинала для каждой стратегии
  // Three independent originals for each strategy
  const [origShallow, setOrigShallow] = useState<DeepObj>(makeOriginal())
  const [origJson, setOrigJson] = useState<DeepObj>(makeOriginal())
  const [origStructured, setOrigStructured] = useState<DeepObj>(makeOriginal())

  // TODO: Добавьте состояние для результатов каждой стратегии
  // TODO: Add state for results of each strategy

  const runShallow = () => {
    // TODO: Создайте shallow copy через spread: const clone = { ...origShallow }
    // TODO: Create shallow copy via spread: const clone = { ...origShallow }

    // TODO: Измените theme в клоне: clone.user.settings.theme = 'light'
    // TODO: Mutate theme in the clone: clone.user.settings.theme = 'light'

    // TODO: Проверьте — изменился ли origShallow.user.settings.theme?
    // TODO: Check — did origShallow.user.settings.theme change?

    // TODO: Запишите результат с пояснением проблемы
    // TODO: Record the result with a problem explanation

    setOrigShallow(prev => ({ ...prev })) // force re-render — placeholder
  }

  const runJson = () => {
    // TODO: Создайте клон через JSON: const clone = JSON.parse(JSON.stringify(origJson))
    // TODO: Create clone via JSON: const clone = JSON.parse(JSON.stringify(origJson))

    // TODO: Измените theme в клоне
    // TODO: Mutate theme in the clone

    // TODO: Проверьте тип createdAt в клоне (typeof clone.user.createdAt)
    // TODO: Check the type of createdAt in the clone (typeof clone.user.createdAt)

    // TODO: Запишите результат с пояснением потери типа Date
    // TODO: Record result with Date type loss explanation

    setOrigJson(prev => ({ ...prev })) // placeholder
  }

  const runStructured = () => {
    // TODO: Создайте клон через structuredClone(origStructured)
    // TODO: Create clone via structuredClone(origStructured)

    // TODO: Измените theme в клоне
    // TODO: Mutate theme in the clone

    // TODO: Проверьте: оригинал не тронут? createdAt instanceof Date?
    // TODO: Check: original untouched? createdAt instanceof Date?

    // TODO: Запишите результат с подтверждением корректности
    // TODO: Record result with correctness confirmation

    setOrigStructured(prev => ({ ...prev })) // placeholder
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.1.2')}</h2>
      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
        Клонируем объект и меняем <code>theme</code> в копии. Смотрим что происходит с оригиналом и типом <code>Date</code>.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Колонка 1: Shallow copy */}
        <div style={{ flex: 1, minWidth: '220px', background: '#fefce8', borderRadius: '8px', padding: '1rem', border: '1px solid #fde68a' }}>
          <strong style={{ color: '#92400e' }}>1. Shallow copy (&#123; ...obj &#125;)</strong>
          <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.6rem', fontSize: '0.75rem', color: '#fde68a', margin: '0.5rem 0', overflowX: 'auto' }}>
{`const clone = { ...orig }
clone.user.settings.theme = 'light'`}
          </pre>
          <button
            onClick={runShallow}
            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.82rem', marginBottom: '0.5rem' }}
          >
            Клонировать и модифицировать
          </button>

          {/* TODO: Показать результат: theme оригинала после клонирования, предупреждение красным */}
          {/* TODO: Show result: original theme after cloning, red warning */}
          <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>Нажмите кнопку для демонстрации</div>
        </div>

        {/* Колонка 2: JSON clone */}
        <div style={{ flex: 1, minWidth: '220px', background: '#fef2f2', borderRadius: '8px', padding: '1rem', border: '1px solid #fecaca' }}>
          <strong style={{ color: '#991b1b' }}>2. JSON.parse(JSON.stringify)</strong>
          <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.6rem', fontSize: '0.75rem', color: '#fca5a5', margin: '0.5rem 0', overflowX: 'auto' }}>
{`const clone = JSON.parse(
  JSON.stringify(orig)
)`}
          </pre>
          <button
            onClick={runJson}
            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.82rem', marginBottom: '0.5rem' }}
          >
            Клонировать и модифицировать
          </button>

          {/* TODO: Показать тип createdAt в клоне (string), предупреждение красным */}
          {/* TODO: Show createdAt type in clone (string), red warning */}
          <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>Нажмите кнопку для демонстрации</div>
        </div>

        {/* Колонка 3: structuredClone */}
        <div style={{ flex: 1, minWidth: '220px', background: '#f0fdf4', borderRadius: '8px', padding: '1rem', border: '1px solid #bbf7d0' }}>
          <strong style={{ color: '#166534' }}>3. structuredClone(obj)</strong>
          <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.6rem', fontSize: '0.75rem', color: '#6ee7b7', margin: '0.5rem 0', overflowX: 'auto' }}>
{`const clone = structuredClone(orig)
// Date сохранён, оригинал цел`}
          </pre>
          <button
            onClick={runStructured}
            style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.82rem', marginBottom: '0.5rem' }}
          >
            Клонировать и модифицировать
          </button>

          {/* TODO: Показать что оригинал нетронут и Date сохранён, зелёным */}
          {/* TODO: Show that original is untouched and Date is preserved, green */}
          <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>Нажмите кнопку для демонстрации</div>
        </div>
      </div>
    </div>
  )
}
