import { useState } from 'react'

// ============================================
// Задание 9.1: Recursive Data Structures
// ============================================

// TODO: Создайте рекурсивный тип для дерева:
//   interface TreeNode<T> { value: T; children: TreeNode<T>[] }

// TODO: Создайте тип для JSON:
//   type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

// TODO: Создайте тип для связного списка:
//   type LinkedList<T> = { value: T; next: LinkedList<T> | null }

// TODO: Реализуйте функцию traverseTree<T>(node: TreeNode<T>): T[]
//   Обходит дерево в глубину (DFS), возвращает массив всех значений

// TODO: Реализуйте функцию treeDepth<T>(node: TreeNode<T>): number
//   Возвращает максимальную глубину дерева

// TODO: Реализуйте функцию linkedListToArray<T>(list: LinkedList<T>): T[]
//   Конвертирует связный список в массив

export function Task9_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Создайте дерево и протестируйте traverseTree:
    // const tree: TreeNode<string> = {
    //   value: 'root',
    //   children: [
    //     { value: 'child1', children: [
    //       { value: 'grandchild1', children: [] },
    //       { value: 'grandchild2', children: [] }
    //     ]},
    //     { value: 'child2', children: [] }
    //   ]
    // }
    // log.push(`traverseTree: [${traverseTree(tree).join(', ')}]`)
    // log.push(`treeDepth: ${treeDepth(tree)}`)

    // TODO: Протестируйте Json тип:
    // const jsonData: Json = { name: 'Alice', scores: [1, 2, 3], nested: { active: true } }
    // log.push(`Json type: ${JSON.stringify(jsonData)}`)

    // TODO: Создайте LinkedList и протестируйте:
    // const list: LinkedList<number> = { value: 1, next: { value: 2, next: { value: 3, next: null } } }
    // log.push(`linkedListToArray: [${linkedListToArray(list).join(', ')}]`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.1: Recursive Data Structures</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
