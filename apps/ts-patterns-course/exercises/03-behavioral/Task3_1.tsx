import { useState } from 'react'

// ============================================
// Задание 3.1: Strategy (Стратегия сортировки)
// ============================================

// TODO: Create interface SortStrategy<T> with:
//   name: string
//   sort(data: T[], compare: (a: T, b: T) => number): T[]

// TODO: Create class BubbleSort<T> implementing SortStrategy<T>
//   - name = 'BubbleSort'
//   - sort: implement bubble sort algorithm
//   - IMPORTANT: do not mutate original array — create a copy first

// TODO: Create class QuickSort<T> implementing SortStrategy<T>
//   - name = 'QuickSort'
//   - sort: implement quicksort with partition
//   - Use private helper methods: quickSort, partition

// TODO: Create class MergeSort<T> implementing SortStrategy<T>
//   - name = 'MergeSort'
//   - sort: implement merge sort
//   - Use private helper method: merge

// TODO: Create class Sorter<T> with:
//   private strategy: SortStrategy<T>
//   constructor(strategy: SortStrategy<T>)
//   setStrategy(strategy: SortStrategy<T>): void
//   sort(data: T[], compare: (a: T, b: T) => number): T[]
//   getStrategyName(): string

export function Task3_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create data array [38, 27, 43, 3, 9, 82, 10]
    // TODO: Create compare function for numbers (a - b)

    // TODO: Create Sorter with BubbleSort, sort and log result
    // TODO: Switch to QuickSort via setStrategy, sort and log
    // TODO: Switch to MergeSort via setStrategy, sort and log

    // TODO: Demonstrate string sorting with QuickSort

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.1: Strategy</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
