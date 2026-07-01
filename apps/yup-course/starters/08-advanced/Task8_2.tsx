import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 8.2: lazy() — рекурсивные схемы
// Task 8.2: lazy() — recursive schemas
// ============================================

// TODO: Определите интерфейс TreeNode
// interface TreeNode {
//   id: number
//   label: string
//   children: TreeNode[]
// }
// TODO: Define TreeNode interface

// TODO: Создайте treeNodeSchema — рекурсивную схему:
// const treeNodeSchema: yup.ObjectSchema<TreeNode> = yup.object({
//   id: yup.number().required('Node ID required').positive(),
//   label: yup.string().required('Node label required').min(1),
//   children: yup.array().of(
//     yup.lazy(() => treeNodeSchema.default(undefined)) as yup.Schema<TreeNode>
//   ).default([]),
// })
// Подсказка: обязательно .default(undefined) внутри lazy(), иначе бесконечный цикл!
// TODO: Create recursive treeNodeSchema using yup.lazy()

export function Task8_2() {
  const { t } = useLanguage()
  const [treeJson, setTreeJson] = useState(JSON.stringify({
    id: 1,
    label: 'Root',
    children: [
      {
        id: 2,
        label: 'Child 1',
        children: [
          { id: 4, label: 'Grandchild', children: [] },
        ],
      },
      { id: 3, label: 'Child 2', children: [] },
    ],
  }, null, 2))
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    // TODO:
    // 1. JSON.parse(treeJson) — обработайте SyntaxError
    // 2. treeNodeSchema.validate(data, { abortEarly: false })
    // 3. При успехе: посчитайте узлы рекурсивно и покажите результат
    //    const countNodes = (node) => 1 + node.children.reduce((sum, c) => sum + countNodes(c), 0)
    // 4. При ValidationError: покажите err.errors
    // TODO: Parse JSON, validate with treeNodeSchema, count nodes on success
    console.log('Validate tree:', treeJson.slice(0, 50))
    setResult(null)
    setIsValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.8.2')}</h2>
      <p style={{ fontSize: '0.85rem', color: '#666' }}>
        Edit the JSON tree below. Each node must have id (positive number), label (non-empty string), and children (array of nodes).
      </p>

      <div className="form-group">
        <label>Tree JSON:</label>
        <textarea
          value={treeJson}
          onChange={(e) => setTreeJson(e.target.value)}
          rows={15}
          style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.85rem', padding: '0.5rem' }}
        />
      </div>

      <button onClick={validate}>Validate Tree</button>
      {/* TODO: Покажите result в цветном блоке с maxHeight и overflow */}
      {/* TODO: Show result in colored block with maxHeight and overflow */}
    </div>
  )
}
