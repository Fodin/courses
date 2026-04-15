import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.1: Pipeline — filter, map, reduce
// Task 2.1: Pipeline — filter, map, reduce
// ============================================
// Реализуйте интерактивный визуализатор пайплайна.
// Implement an interactive pipeline visualizer.
//
// Пользователь управляет двумя ползунками:
// The user controls two sliders:
//   - minPrice: порог фильтрации (filter)
//   - discount: процент скидки (map)
//
// Три этапа отображаются последовательно:
// Three stages are shown in sequence:
//   Stage 1: filter(p => p.price >= minPrice)
//   Stage 2: map(p => ({ ...p, price: Math.round(p.price * (1 - discount/100)) }))
//   Stage 3: reduce((acc, p) => acc + p.price, 0)

interface Product {
  name: string
  price: number
  category: string
}

// Исходный массив продуктов / Source products array
const PRODUCTS: Product[] = [
  { name: 'Laptop',          price: 1200, category: 'electronics' },
  { name: 'Book: Clean Code', price: 25,  category: 'education'   },
  { name: 'Headphones',      price: 280,  category: 'electronics' },
  { name: 'Online Course',   price: 49,   category: 'education'   },
  { name: 'Keyboard',        price: 150,  category: 'electronics' },
  { name: 'Notebook',        price: 8,    category: 'office'      },
  { name: 'Monitor',         price: 450,  category: 'electronics' },
  { name: 'Pen Set',         price: 12,   category: 'office'      },
]

export function Task2_1() {
  const { t } = useLanguage()

  // TODO: Добавьте состояние для minPrice (начальное: 50)
  // TODO: Add state for minPrice (initial: 50)
  // const [minPrice, setMinPrice] = useState(50)

  // TODO: Добавьте состояние для discount (начальное: 10)
  // TODO: Add state for discount (initial: 10)
  // const [discount, setDiscount] = useState(10)

  // TODO: Stage 1 — вычислите filtered через PRODUCTS.filter(...)
  // TODO: Stage 1 — compute filtered via PRODUCTS.filter(...)
  // const filtered = PRODUCTS.filter(p => p.price >= minPrice)

  // TODO: Stage 2 — вычислите mapped через filtered.map(...)
  // TODO: Stage 2 — compute mapped via filtered.map(...)
  // Подсказка: сохраните originalPrice перед изменением
  // Hint: save originalPrice before transforming

  // TODO: Stage 3 — вычислите total через mapped.reduce(...)
  // TODO: Stage 3 — compute total via mapped.reduce(...)

  return (
    <div className="exercise-container">
      <h2>{t('task.2.1')}</h2>

      {/* TODO: Добавьте два ползунка */}
      {/* TODO: Add two sliders */}
      {/* Slider 1: minPrice (0-1000, step 10) */}
      {/* Slider 2: discount (0-50, step 5) */}

      {/* TODO: Stage 1 — отобразите все PRODUCTS */}
      {/* TODO: Stage 1 — display all PRODUCTS */}
      {/* Прошедшие фильтр: цветные; не прошедшие: серые + line-through */}
      {/* Passed filter: colored; failed: grey + line-through */}

      {/* TODO: Stage 2 — отобразите отфильтрованные продукты с новыми ценами */}
      {/* TODO: Stage 2 — display filtered products with new prices */}
      {/* Показать исходную цену (line-through) и новую */}
      {/* Show original price (line-through) and new price */}

      {/* TODO: Stage 3 — отобразите итоговую сумму */}
      {/* TODO: Stage 3 — display total sum */}
      {/* Показать формулу суммирования: a + b + c = total */}
      {/* Show summing formula: a + b + c = total */}

      {/* TODO: Покажите итоговый пайплайн как блок кода с текущими параметрами */}
      {/* TODO: Show the full pipeline as a code block with current param values */}
    </div>
  )
}
