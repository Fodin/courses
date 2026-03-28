import { useState } from 'react'

// ============================================
// Задание 0.1: Контейнеры vs виртуальные машины
// Task 0.1: Containers vs Virtual Machines
// ============================================

// TODO: Определите интерфейс ComparisonRow с полями:
//   characteristic (string), containers (string), vms (string),
//   winner ('container' | 'vm' | 'tie'), details (string)
// TODO: Define a ComparisonRow interface with fields:
//   characteristic (string), containers (string), vms (string),
//   winner ('container' | 'vm' | 'tie'), details (string)

// TODO: Создайте массив данных comparisonData с минимум 6 строками сравнения.
//   Включите: изоляция, время запуска, размер образа, потребление RAM,
//   производительность, плотность размещения, ОС, переносимость
// TODO: Create a comparisonData array with at least 6 comparison rows.
//   Include: isolation, startup time, image size, RAM usage,
//   performance, density, OS, portability

export function Task0_1() {
  // TODO: Создайте состояние для управления видимостью подробностей
  // TODO: Create state to manage details visibility
  const [showDetails, setShowDetails] = useState<number | null>(null)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Контейнеры vs виртуальные машины</h2>

      {/* TODO: Создайте таблицу сравнения с колонками:
          Характеристика | Контейнеры | Виртуальные машины | Подробнее
          Используйте comparisonData для генерации строк.
          Добавьте визуальные индикаторы преимуществ (иконки/цвета). */}
      {/* TODO: Create a comparison table with columns:
          Characteristic | Containers | Virtual Machines | Details
          Use comparisonData to generate rows.
          Add visual indicators for advantages (icons/colors). */}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
        <thead>
          <tr style={{ background: '#263238', color: 'white' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Характеристика</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Контейнеры</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Виртуальные машины</th>
            <th style={{ padding: '0.75rem', textAlign: 'center' }}>Подробнее</th>
          </tr>
        </thead>
        <tbody>
          {/* TODO: Замените эту строку-заглушку на маппинг comparisonData.
              Для каждой строки:
              1. Подсветите ячейку победителя зелёным (#e8f5e9), проигравшего — красным (#ffebee)
              2. Добавьте кнопку "Детали" для раскрытия подробностей
              3. При клике на "Детали" покажите строку с описанием (colspan=4) */}
          {/* TODO: Replace this placeholder row with comparisonData mapping.
              For each row:
              1. Highlight winner cell green (#e8f5e9), loser cell red (#ffebee)
              2. Add a "Details" button to expand details
              3. On click show a details row (colspan=4) */}
          <tr>
            <td style={{ padding: '0.75rem' }}>...</td>
            <td style={{ padding: '0.75rem' }}>...</td>
            <td style={{ padding: '0.75rem' }}>...</td>
            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
              <button>Детали</button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* TODO: Добавьте секцию "Когда использовать что" с двумя блоками:
          1. Когда использовать контейнеры (список сценариев)
          2. Когда использовать VM (список сценариев)
          Используйте flex-layout для расположения рядом. */}
      {/* TODO: Add a "When to use what" section with two blocks:
          1. When to use containers (list of scenarios)
          2. When to use VMs (list of scenarios)
          Use flex layout to place them side by side. */}
    </div>
  )
}
