import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.1: Ловушки мутаций
// Task 1.1: Mutation Traps
// ============================================
// Продемонстрируйте разницу между прямой мутацией объекта
// и созданием иммутабельной копии через spread.
// Demonstrate the difference between direct object mutation
// and creating an immutable copy via spread.

interface User {
  name: string
  age: number
  address: { city: string }
}

// Начальные данные / Initial data
const INITIAL_USER: User = { name: 'Alice', age: 30, address: { city: 'Moscow' } }

export function Task1_1() {
  const { t } = useLanguage()

  // TODO: Добавьте состояние для текущего объекта user (используйте INITIAL_USER)
  // TODO: Add state for the current user object (use INITIAL_USER)
  // const [userState, setUserState] = useState<User>(...)

  // TODO: Добавьте состояние для результата действия (kind, original, modified, sameRef, changedFields)
  // TODO: Add state for action result (kind, original, modified, sameRef, changedFields)

  const handleMutate = () => {
    // TODO: Сохраните снапшот объекта до мутации
    // TODO: Save a snapshot of the object before mutation

    // TODO: Мутируйте userState.age напрямую (userState.age = 31)
    // TODO: Directly mutate userState.age (userState.age = 31)

    // TODO: Обновите состояние для принудительного ре-рендера (та же ссылка будет !== исходной)
    // TODO: Update state to force re-render (same reference !== initial)

    // TODO: Запишите в результат: kind='mutate', sameRef=true, изменённые поля
    // TODO: Record result: kind='mutate', sameRef=true, changed fields
  }

  const handleCopy = () => {
    // TODO: Сохраните снапшот оригинала
    // TODO: Save snapshot of original

    // TODO: Создайте копию через spread с age + 1
    // TODO: Create copy via spread with age + 1
    // const copy = { ...userState, age: userState.age + 1 }

    // TODO: Запишите в результат: kind='copy', sameRef=false, изменённые поля
    // TODO: Record result: kind='copy', sameRef=false, changed fields
  }

  const handleReset = () => {
    // TODO: Верните INITIAL_USER (создайте свежую копию через JSON.parse/stringify)
    // TODO: Return INITIAL_USER (create a fresh copy via JSON.parse/stringify)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.1.1')}</h2>

      {/* TODO: Отобразите текущий объект user как карточку с тремя полями */}
      {/* TODO: Display the current user object as a card with three fields */}
      {/* name, age, address.city */}

      {/* Кнопки / Buttons */}
      <div style={{ margin: '1rem 0' }}>
        <button onClick={handleMutate} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', marginRight: '0.5rem' }}>
          Мутировать напрямую (age++)
        </button>
        <button onClick={handleCopy} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', marginRight: '0.5rem' }}>
          Создать копию (spread)
        </button>
        <button onClick={handleReset} style={{ background: '#374151', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Сбросить
        </button>
      </div>

      {/* TODO: После действия покажите три блока: */}
      {/* TODO: After action show three blocks: */}
      {/* 1. Оригинал с полями / Original with fields */}
      {/* 2. Копия/изменённый объект / Copy/modified object */}
      {/* 3. Анализ: original === copy, изменённые поля, предупреждение/успех */}
      {/*    Analysis: original === copy, changed fields, warning/success message */}
    </div>
  )
}
