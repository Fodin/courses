import { useState } from 'react'

// ============================================
// Задание 0.1: Контейнеры vs виртуальные машины — Решение
// ============================================

interface ComparisonRow {
  characteristic: string
  containers: string
  vms: string
  winner: 'container' | 'vm' | 'tie'
  details: string
}

const comparisonData: ComparisonRow[] = [
  {
    characteristic: 'Изоляция',
    containers: 'На уровне процессов (namespaces)',
    vms: 'Полная аппаратная виртуализация',
    winner: 'vm',
    details:
      'VM обеспечивают более сильную изоляцию, так как каждая VM имеет собственное ядро ОС. Контейнеры разделяют ядро хост-ОС, что теоретически создаёт больший вектор атаки.',
  },
  {
    characteristic: 'Время запуска',
    containers: 'Секунды (1-5 сек)',
    vms: 'Минуты (1-5 мин)',
    winner: 'container',
    details:
      'Контейнеры запускают только процесс приложения, а VM должна загрузить полную ОС с ядром, инициализировать драйверы и системные службы.',
  },
  {
    characteristic: 'Размер образа',
    containers: 'Мегабайты (10-500 МБ)',
    vms: 'Гигабайты (1-20 ГБ)',
    winner: 'container',
    details:
      'Образ контейнера содержит только приложение и его зависимости. Образ VM включает полную операционную систему с ядром, утилитами и драйверами.',
  },
  {
    characteristic: 'Потребление RAM',
    containers: 'Только для приложения (МБ)',
    vms: 'ОС + приложение (ГБ)',
    winner: 'container',
    details:
      'VM выделяет память для гостевой ОС (обычно от 512 МБ). Контейнер использует только ту память, которая нужна процессу приложения.',
  },
  {
    characteristic: 'Производительность',
    containers: 'Близка к нативной',
    vms: 'Ниже из-за виртуализации',
    winner: 'container',
    details:
      'Контейнеры работают напрямую с ядром хост-ОС без слоя аппаратной эмуляции. VM проходят через гипервизор, что добавляет накладные расходы на CPU и I/O.',
  },
  {
    characteristic: 'Плотность размещения',
    containers: 'Десятки-сотни на хосте',
    vms: 'Единицы-десятки на хосте',
    winner: 'container',
    details:
      'Благодаря низкому потреблению ресурсов на один хост можно поместить значительно больше контейнеров, чем VM. Это критично для микросервисных архитектур.',
  },
  {
    characteristic: 'Операционная система',
    containers: 'Разделяют ядро хост-ОС',
    vms: 'Каждая имеет свою ОС',
    winner: 'tie',
    details:
      'Контейнеры Linux работают только на Linux-хостах (Docker Desktop на Mac/Windows использует скрытую Linux VM). VM могут запускать любую ОС независимо от хоста.',
  },
  {
    characteristic: 'Переносимость',
    containers: 'Любой хост с Docker',
    vms: 'Зависит от гипервизора',
    winner: 'container',
    details:
      'Docker-образ запустится на любой машине с Docker Engine. VM-образы часто привязаны к конкретному гипервизору (VMware, VirtualBox, Hyper-V).',
  },
]

const useCases = {
  containers: [
    'Микросервисная архитектура с десятками сервисов',
    'CI/CD пайплайны с быстрым запуском тестов',
    'Масштабирование через Kubernetes',
    'Локальная разработка с одинаковым окружением',
    'Stateless-приложения (API, веб-серверы)',
  ],
  vms: [
    'Запуск разных ОС на одном сервере',
    'Legacy-приложения с особыми требованиями к ОС',
    'Максимальная безопасность и изоляция',
    'Графические приложения с GPU-проброcом',
    'Тестирование на разных ОС (Windows, macOS, Linux)',
  ],
}

export function Task0_1_Solution() {
  const [showDetails, setShowDetails] = useState<number | null>(null)

  const getWinnerStyle = (winner: ComparisonRow['winner'], column: 'container' | 'vm') => {
    if (winner === 'tie') return { background: '#fff3e0' }
    if (winner === column) return { background: '#e8f5e9', fontWeight: 'bold' as const }
    return { background: '#ffebee' }
  }

  const getWinnerIcon = (winner: ComparisonRow['winner'], column: 'container' | 'vm') => {
    if (winner === 'tie') return '🤝'
    if (winner === column) return '✅'
    return '❌'
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Контейнеры vs виртуальные машины</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
        <thead>
          <tr style={{ background: '#263238', color: 'white' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left', width: '20%' }}>Характеристика</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', width: '30%' }}>
              🐳 Контейнеры
            </th>
            <th style={{ padding: '0.75rem', textAlign: 'left', width: '30%' }}>
              🖥️ Виртуальные машины
            </th>
            <th style={{ padding: '0.75rem', textAlign: 'center', width: '20%' }}>Подробнее</th>
          </tr>
        </thead>
        <tbody>
          {comparisonData.map((row, index) => (
            <>
              <tr key={index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{row.characteristic}</td>
                <td style={{ padding: '0.75rem', ...getWinnerStyle(row.winner, 'container') }}>
                  {getWinnerIcon(row.winner, 'container')} {row.containers}
                </td>
                <td style={{ padding: '0.75rem', ...getWinnerStyle(row.winner, 'vm') }}>
                  {getWinnerIcon(row.winner, 'vm')} {row.vms}
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                  <button
                    onClick={() => setShowDetails(showDetails === index ? null : index)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      border: '1px solid #1976d2',
                      background: showDetails === index ? '#1976d2' : 'white',
                      color: showDetails === index ? 'white' : '#1976d2',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {showDetails === index ? 'Скрыть' : 'Детали'}
                  </button>
                </td>
              </tr>
              {showDetails === index && (
                <tr key={`detail-${index}`}>
                  <td
                    colSpan={4}
                    style={{
                      padding: '1rem',
                      background: '#e3f2fd',
                      borderBottom: '1px solid #90caf9',
                      fontStyle: 'italic',
                    }}
                  >
                    💡 {row.details}
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div
          style={{
            flex: 1,
            padding: '1rem',
            background: '#e8f5e9',
            borderRadius: '8px',
            border: '1px solid #4caf50',
          }}
        >
          <h3>🐳 Когда использовать контейнеры</h3>
          <ul>
            {useCases.containers.map((item, i) => (
              <li key={i} style={{ marginBottom: '0.5rem' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div
          style={{
            flex: 1,
            padding: '1rem',
            background: '#e3f2fd',
            borderRadius: '8px',
            border: '1px solid #42a5f5',
          }}
        >
          <h3>🖥️ Когда использовать VM</h3>
          <ul>
            {useCases.vms.map((item, i) => (
              <li key={i} style={{ marginBottom: '0.5rem' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 0.2: Архитектура Docker — Решение
// ============================================

interface DockerComponent {
  id: string
  name: string
  shortDesc: string
  fullDesc: string
  color: string
}

const dockerComponents: DockerComponent[] = [
  {
    id: 'client',
    name: 'Docker Client (CLI)',
    shortDesc: 'Интерфейс пользователя',
    fullDesc:
      'Docker Client -- это CLI-инструмент (команда docker), через который пользователь взаимодействует с Docker. Клиент отправляет команды (build, run, pull) Docker Daemon через REST API. Клиент может подключаться к локальному или удалённому Daemon.',
    color: '#1976d2',
  },
  {
    id: 'daemon',
    name: 'Docker Daemon (dockerd)',
    shortDesc: 'Серверный процесс управления',
    fullDesc:
      'Docker Daemon (dockerd) -- это серверный процесс, который управляет всеми Docker-объектами: образами, контейнерами, сетями и томами. Daemon слушает API-запросы от клиента и выполняет их. Он также может взаимодействовать с другими Daemon для управления кластером.',
    color: '#388e3c',
  },
  {
    id: 'containerd',
    name: 'containerd',
    shortDesc: 'Высокоуровневый container runtime',
    fullDesc:
      'containerd -- это высокоуровневый container runtime, который управляет полным жизненным циклом контейнера: скачивание образов, хранение, создание и запуск контейнеров, управление сетями. Docker Daemon делегирует containerd работу с контейнерами.',
    color: '#f57c00',
  },
  {
    id: 'runc',
    name: 'runc',
    shortDesc: 'Низкоуровневый container runtime',
    fullDesc:
      'runc -- это низкоуровневый container runtime, который непосредственно создаёт и запускает контейнеры. Он работает с Linux-примитивами: namespaces (изоляция) и cgroups (ограничение ресурсов). runc реализует спецификацию OCI (Open Container Initiative).',
    color: '#d32f2f',
  },
  {
    id: 'registry',
    name: 'Docker Registry',
    shortDesc: 'Хранилище образов',
    fullDesc:
      'Docker Registry -- это хранилище Docker-образов. Docker Hub -- крупнейший публичный реестр. При docker pull образ скачивается из реестра, при docker push -- загружается. Можно использовать приватные реестры: GitHub Container Registry, Amazon ECR, Harbor.',
    color: '#7b1fa2',
  },
]

interface DockerObject {
  name: string
  icon: string
  description: string
}

const dockerObjects: DockerObject[] = [
  {
    name: 'Image (Образ)',
    icon: '📦',
    description:
      'Шаблон только для чтения с инструкциями по созданию контейнера. Состоит из слоёв, строится из Dockerfile.',
  },
  {
    name: 'Container (Контейнер)',
    icon: '🚀',
    description:
      'Запущенный экземпляр образа. Изолированная среда с записываемым слоем поверх образа.',
  },
  {
    name: 'Volume (Том)',
    icon: '💾',
    description:
      'Механизм персистентного хранения данных. Данные в томах сохраняются между перезапусками контейнеров.',
  },
  {
    name: 'Network (Сеть)',
    icon: '🌐',
    description:
      'Обеспечивает связь между контейнерами. Поддерживает разные драйверы: bridge, host, overlay.',
  },
]

export function Task0_2_Solution() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)

  const selected = dockerComponents.find((c) => c.id === selectedComponent)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Архитектура Docker</h2>

      {/* Architecture diagram */}
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
        <pre style={{ margin: 0, lineHeight: 1.6 }}>
          {`
  ┌──────────────────────────────────────────────────────┐
  │                   Docker Host                         │
  │                                                       │
  │   ┌─────────────┐        ┌──────────────────────┐    │
  │   │   Docker     │  REST  │    Docker Daemon      │    │
  │   │   Client     │──API──▶│     (dockerd)         │    │
  │   │   (CLI)      │        │                       │    │
  │   └─────────────┘        └──────────┬───────────┘    │
  │                                      │                │
  │                                      ▼                │
  │                           ┌──────────────────────┐    │
  │                           │     containerd        │    │
  │                           └──────────┬───────────┘    │
  │                                      │                │
  │                                      ▼                │
  │                           ┌──────────────────────┐    │
  │                           │       runc            │    │
  │                           └──────────┬───────────┘    │
  │                                      │                │
  │                              ┌───────┴────────┐       │
  │                              │  Контейнеры    │       │
  │                              └────────────────┘       │
  └──────────────────────────────────┬────────────────────┘
                                     │
                              pull / push
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │   Docker Registry     │
                          │   (Docker Hub и др.)  │
                          └──────────────────────┘`}
        </pre>
      </div>

      {/* Interactive components */}
      <h3>Компоненты архитектуры (кликните для подробностей)</h3>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        {dockerComponents.map((component) => (
          <button
            key={component.id}
            onClick={() =>
              setSelectedComponent(selectedComponent === component.id ? null : component.id)
            }
            style={{
              padding: '0.75rem 1rem',
              border: `2px solid ${component.color}`,
              background: selectedComponent === component.id ? component.color : 'white',
              color: selectedComponent === component.id ? 'white' : component.color,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
          >
            {component.name}
            <br />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 'normal',
                opacity: 0.8,
              }}
            >
              {component.shortDesc}
            </span>
          </button>
        ))}
      </div>

      {/* Component details */}
      {selected && (
        <div
          style={{
            padding: '1rem',
            background: `${selected.color}15`,
            border: `1px solid ${selected.color}`,
            borderRadius: '8px',
            marginBottom: '1.5rem',
          }}
        >
          <h4 style={{ margin: '0 0 0.5rem', color: selected.color }}>{selected.name}</h4>
          <p style={{ margin: 0, lineHeight: 1.6 }}>{selected.fullDesc}</p>
        </div>
      )}

      {/* Docker objects */}
      <h3>Docker-объекты</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {dockerObjects.map((obj) => (
          <div
            key={obj.name}
            style={{
              padding: '1rem',
              background: '#f5f5f5',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
            }}
          >
            <h4 style={{ margin: '0 0 0.5rem' }}>
              {obj.icon} {obj.name}
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>{obj.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
