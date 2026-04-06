import { useState } from 'react'

// ============================================
// Задание 3.1: Иерархия топиков
// ============================================

// TODO: Опишите структуру узла дерева топиков
// Каждый узел имеет имя, опциональные дочерние узлы, значение и описание
interface TopicNode {
  name: string
  // TODO: добавьте поля: children, value, description
}

// TODO: Создайте дерево топиков умного дома по образцу:
// home/
//   living_room/
//     temperature  (значение: "22.5", °C)
//     humidity     (значение: "65", %)
//     light/
//       state      (значение: "ON")
//       brightness (значение: "75", %)
//   kitchen/
//     temperature
//     smoke_alarm
//   bedroom/
//     temperature
//     humidity
const iotTopicTree: TopicNode = {
  name: 'home',
  // TODO: добавьте children
}

// TODO: Создайте рекурсивный компонент для отображения узла дерева
// Компонент должен:
// - показывать имя узла и значение (если есть)
// - иметь кнопку раскрыть/свернуть для узлов с дочерними элементами
// - при клике вызывать onSelect с полным путём топика
// - выделять выбранный узел
interface TreeNodeProps {
  node: TopicNode
  path: string
  depth: number
  selectedPath: string | null
  onSelect: (path: string) => void
}

function TreeNodeComponent({ node, path, depth, selectedPath, onSelect }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2)
  const fullPath = path ? `${path}/${node.name}` : node.name
  const isSelected = selectedPath === fullPath

  // TODO: реализуйте отображение узла
  // Подсказка: используйте рекурсию — для каждого child рендерьте TreeNodeComponent
  return (
    <div style={{ marginLeft: depth * 16, fontFamily: 'monospace' }}>
      <div
        onClick={() => {
          // TODO: переключайте expanded для узлов с детьми и вызывайте onSelect
          void setExpanded
          void isSelected
          onSelect(fullPath)
        }}
        style={{ padding: '4px 8px', cursor: 'pointer' }}
      >
        {node.name}
      </div>
      {/* TODO: рендерите дочерние узлы если expanded */}
      {expanded && null}
    </div>
  )
}

export function Task3_1() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  return (
    <div className="exercise-container">
      <h2>Задание 3.1: Иерархия топиков</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Визуализация дерева топиков умного дома. Нажмите на узел для выбора.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h3 style={{ marginBottom: 12, fontSize: 14, color: '#6b7280' }}>Дерево топиков</h3>
          {/* TODO: отрендерите TreeNodeComponent с корневым узлом iotTopicTree */}
          <TreeNodeComponent
            node={iotTopicTree}
            path=""
            depth={0}
            selectedPath={selectedPath}
            onSelect={setSelectedPath}
          />
        </div>

        <div>
          <h3 style={{ marginBottom: 12, fontSize: 14, color: '#6b7280' }}>Выбранный топик</h3>
          {/* TODO: покажите информацию о selectedPath:
               - полный путь в code-блоке
               - количество уровней (split('/').length)
               - длину строки в байтах */}
          {selectedPath ? (
            <div>
              <code>{selectedPath}</code>
              <p>Уровней: {/* TODO */}</p>
            </div>
          ) : (
            <p style={{ color: '#9ca3af' }}>Выберите узел в дереве</p>
          )}
        </div>
      </div>
    </div>
  )
}
