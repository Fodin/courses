import { useState } from 'react'

// ============================================
// Задание 0.2: Архитектура Docker
// Task 0.2: Docker Architecture
// ============================================

// TODO: Определите интерфейс DockerComponent с полями:
//   id (string), name (string), shortDesc (string),
//   fullDesc (string), color (string)
// TODO: Define a DockerComponent interface with fields:
//   id (string), name (string), shortDesc (string),
//   fullDesc (string), color (string)

// TODO: Создайте массив dockerComponents с 5 компонентами:
//   1. Docker Client (CLI) — интерфейс пользователя
//   2. Docker Daemon (dockerd) — серверный процесс управления
//   3. containerd — высокоуровневый container runtime
//   4. runc — низкоуровневый container runtime
//   5. Docker Registry — хранилище образов
//   Для каждого укажите краткое и полное описание.
// TODO: Create a dockerComponents array with 5 components:
//   1. Docker Client (CLI) — user interface
//   2. Docker Daemon (dockerd) — server management process
//   3. containerd — high-level container runtime
//   4. runc — low-level container runtime
//   5. Docker Registry — image storage
//   For each, provide a short and full description.

// TODO: Определите интерфейс DockerObject с полями:
//   name (string), icon (string), description (string)
// TODO: Define a DockerObject interface with fields:
//   name (string), icon (string), description (string)

// TODO: Создайте массив dockerObjects с 4 объектами:
//   Image, Container, Volume, Network
// TODO: Create a dockerObjects array with 4 objects:
//   Image, Container, Volume, Network

export function Task0_2() {
  // TODO: Создайте состояние для хранения ID выбранного компонента
  // TODO: Create state to store the selected component ID
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Архитектура Docker</h2>

      {/* TODO: Создайте ASCII-схему архитектуры Docker в блоке <pre>.
          Покажите цепочку: Docker Client → Docker Daemon → containerd → runc → Контейнеры
          И отдельно: Docker Host ↔ Docker Registry */}
      {/* TODO: Create an ASCII architecture diagram in a <pre> block.
          Show the chain: Docker Client → Docker Daemon → containerd → runc → Containers
          And separately: Docker Host ↔ Docker Registry */}

      <div
        style={{
          padding: '1.5rem',
          background: '#fafafa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          marginBottom: '1.5rem',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
        }}
      >
        <pre style={{ margin: 0 }}>
          {/* TODO: Нарисуйте архитектурную схему Docker */}
          {/* TODO: Draw the Docker architecture diagram */}
          {`Здесь будет схема архитектуры Docker...`}
        </pre>
      </div>

      {/* TODO: Создайте интерактивные кнопки для каждого компонента.
          При клике на кнопку:
          - Если компонент уже выбран — снять выделение (setSelectedComponent(null))
          - Если не выбран — выбрать его (setSelectedComponent(component.id))
          Стилизуйте активную кнопку цветом компонента. */}
      {/* TODO: Create interactive buttons for each component.
          On button click:
          - If already selected — deselect (setSelectedComponent(null))
          - If not selected — select it (setSelectedComponent(component.id))
          Style the active button with the component's color. */}

      <h3>Компоненты архитектуры</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        {/* TODO: Замените заглушку на маппинг dockerComponents */}
        {/* TODO: Replace placeholder with dockerComponents mapping */}
        <button style={{ padding: '0.75rem 1rem', borderRadius: '8px' }}>
          Компонент...
        </button>
      </div>

      {/* TODO: Если компонент выбран (selectedComponent !== null),
          покажите блок с его полным описанием (fullDesc).
          Используйте цвет компонента для рамки и фона. */}
      {/* TODO: If a component is selected (selectedComponent !== null),
          show a block with its full description (fullDesc).
          Use the component's color for border and background. */}

      {/* TODO: Создайте секцию "Docker-объекты" с grid-раскладкой (2 колонки).
          Для каждого объекта покажите иконку, название и описание. */}
      {/* TODO: Create a "Docker objects" section with grid layout (2 columns).
          For each object show icon, name, and description. */}

      <h3>Docker-объекты</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* TODO: Замените заглушку на маппинг dockerObjects */}
        {/* TODO: Replace placeholder with dockerObjects mapping */}
        <div
          style={{
            padding: '1rem',
            background: '#f5f5f5',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          }}
        >
          <h4>Объект...</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>Описание...</p>
        </div>
      </div>
    </div>
  )
}
