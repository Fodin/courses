import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.1: Чистая vs нечистая функция
// Task 0.1: Pure vs Impure Function
// ============================================
// Реализуйте обе версии функции calculateTotal и сравните их поведение
// при 5 последовательных вызовах с одинаковыми данными.
// Implement both versions of calculateTotal and compare their behavior
// across 5 sequential calls with the same data.

// TODO: Объявите внешнюю переменную для нечистой версии
// TODO: Declare an external variable for the impure version
// let globalDiscount = 0

// TODO: Реализуйте чистую функцию
// TODO: Implement the pure function
// Принимает: items: Array<{ price: number; qty: number }>
// Accepts: items: Array<{ price: number; qty: number }>
// Возвращает: сумму price * qty для каждого элемента
// Returns: sum of price * qty for each item
// function calculateTotal(items) { ... }

// TODO: Реализуйте нечистую функцию
// TODO: Implement the impure function
// Такая же логика, но:
// Same logic, but:
// 1. Читает и увеличивает globalDiscount на 5 при каждом вызове
//    Reads and increases globalDiscount by 5 on each call
// 2. Возвращает total - globalDiscount
//    Returns total - globalDiscount
// function calculateTotalImpure(items) { ... }

// Тестовые данные — используйте в компоненте
// Test data — use in the component
const DEMO_ITEMS = [
  { price: 100, qty: 2 },
  { price: 50, qty: 3 },
]
// Ожидаемый результат чистой функции: 350
// Expected pure result: 350

export function Task0_1() {
  const { t } = useLanguage()
  const [pureResults, setPureResults] = useState<number[]>([])
  const [impureResults, setImpureResults] = useState<number[]>([])
  const [ran, setRan] = useState(false)

  const runBoth = () => {
    // TODO: Сбросьте globalDiscount в 0 перед запуском
    // TODO: Reset globalDiscount to 0 before running

    const pure: number[] = []
    const impure: number[] = []

    for (let i = 0; i < 5; i++) {
      // TODO: Вызовите calculateTotal и calculateTotalImpure с DEMO_ITEMS
      // TODO: Call calculateTotal and calculateTotalImpure with DEMO_ITEMS
      // pure.push(calculateTotal(DEMO_ITEMS))
      // impure.push(calculateTotalImpure(DEMO_ITEMS))
      pure.push(0) // заглушка / placeholder
      impure.push(0) // заглушка / placeholder
    }

    setPureResults(pure)
    setImpureResults(impure)
    setRan(true)
  }

  // TODO: Реализуйте проверку — все ли числа в массиве одинаковы
  // TODO: Implement check — are all numbers in the array equal
  const allSame = (_arr: number[]) => false // заглушка / placeholder

  return (
    <div className="exercise-container">
      <h2>{t('task.0.1')}</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {/* Панель чистой функции / Pure function panel */}
        <div style={{ flex: 1, minWidth: '200px', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
          <strong style={{ color: '#15803d' }}>Чистая функция</strong>
          {/* TODO: Отобразите код функции в блоке <pre> */}
          {/* TODO: Display the function code in a <pre> block */}
        </div>

        {/* Панель нечистой функции / Impure function panel */}
        <div style={{ flex: 1, minWidth: '200px', padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
          <strong style={{ color: '#dc2626' }}>Нечистая функция</strong>
          {/* TODO: Отобразите код функции в блоке <pre> */}
          {/* TODO: Display the function code in a <pre> block */}
        </div>
      </div>

      <button
        onClick={runBoth}
        style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.6rem 1.4rem', cursor: 'pointer' }}
      >
        Запустить 5 раз с одними и теми же данными
      </button>

      {ran && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          {/* TODO: Для каждого результата покажите номер запуска, значение и иконку */}
          {/* TODO: For each result show run number, value, and icon */}
          {/* Зелёная галочка ✓ если allSame(pureResults) */}
          {/* Green checkmark ✓ if allSame(pureResults) */}
          {/* Красный крестик ✗ если !allSame(impureResults) */}
          {/* Red cross ✗ if !allSame(impureResults) */}
          <div>
            <strong>Чистая:</strong>
            {pureResults.map((v, i) => <div key={i}>Запуск {i + 1}: {v}</div>)}
            {allSame(pureResults) ? 'Предсказуемо' : 'Непредсказуемо'}
          </div>
          <div>
            <strong>Нечистая:</strong>
            {impureResults.map((v, i) => <div key={i}>Запуск {i + 1}: {v}</div>)}
          </div>
        </div>
      )}
    </div>
  )
}
