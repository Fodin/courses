import { useState } from 'react'
import { useLanguage } from 'src/hooks'
import type { ReactNode } from 'react'

// ============================================
// Задание 9.3: SelectableList<T> — generic компонент
// Task 9.3: SelectableList<T> — generic component
// ============================================
//
// Реализуйте generic компонент SelectableList<T>.
// Implement a generic component SelectableList<T>.
// Компонент не знает о структуре элементов — вся логика
// The component doesn't know about element structure — all logic
// отображения и ключей делегируется через props-функции.
// for rendering and keys is delegated via props functions.
//
// Props компонента:
// Component props:
// - items: T[]
// - selectedItem: T | null
// - onSelect: (item: T) => void
// - renderItem: (item: T, isSelected: boolean) => ReactNode
// - keyExtractor: (item: T) => string
//
// Подсказка для сравнения:
// Hint for comparison:
// const isSelected = selectedItem !== null
//   && keyExtractor(selectedItem) === keyExtractor(item)

// TODO: Определите интерфейс SelectableListProps<T>
// TODO: Define SelectableListProps<T> interface
// interface SelectableListProps<T> { ... }

// TODO: Реализуйте компонент SelectableList
// TODO: Implement SelectableList component
// function SelectableList<T>({ items, selectedItem, onSelect, renderItem, keyExtractor }: SelectableListProps<T>) {
//   return (
//     <ul>
//       {items.map(item => {
//         const key = keyExtractor(item)
//         const isSelected = selectedItem !== null && keyExtractor(selectedItem) === key
//         return (
//           <li key={key} onClick={() => onSelect(item)}>
//             {renderItem(item, isSelected)}
//           </li>
//         )
//       })}
//     </ul>
//   )
// }

// Тестовые данные — используйте в демонстрации
// Test data — use in demonstration
interface User {
  id: string
  name: string
  role: string
}

interface Product {
  id: string
  name: string
  price: number
}

const DEMO_USERS: User[] = [
  { id: 'u1', name: 'Алексей Смирнов', role: 'Frontend Dev' },
  { id: 'u2', name: 'Мария Иванова', role: 'Backend Dev' },
  { id: 'u3', name: 'Сергей Петров', role: 'DevOps' },
]

const DEMO_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Keychron K2', price: 8990 },
  { id: 'p2', name: 'Logitech MX Master 3', price: 6490 },
  { id: 'p3', name: 'Samsung 27" 4K', price: 34990 },
]

export function Task9_3() {
  const { t } = useLanguage()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 9.3</h2>

      {/* TODO: Два экземпляра SelectableList — с User[] и Product[] */}
      {/* TODO: Two instances of SelectableList — with User[] and Product[] */}
      {/* <SelectableList
        items={DEMO_USERS}
        selectedItem={selectedUser}
        onSelect={setSelectedUser}
        keyExtractor={user => user.id}
        renderItem={(user, isSelected) => <div>{user.name}</div>}
      /> */}

      {/* <SelectableList
        items={DEMO_PRODUCTS}
        selectedItem={selectedProduct}
        onSelect={setSelectedProduct}
        keyExtractor={product => product.id}
        renderItem={(product, isSelected) => <div>{product.name}</div>}
      /> */}
    </div>
  )
}
