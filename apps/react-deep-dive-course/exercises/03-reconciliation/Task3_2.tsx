import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Задача с уникальным id и именем
type Task = {
  id: number
  name: string
}

// Счётчик для генерации новых id
let taskIdCounter = 6

// Начальный список задач
const INITIAL_TASKS: Task[] = [
  { id: 1, name: 'Купить молоко' },
  { id: 2, name: 'Позвонить маме' },
  { id: 3, name: 'Прочитать книгу' },
  { id: 4, name: 'Сделать зарядку' },
  { id: 5, name: 'Написать отчёт' },
]

export function Task3_2() {
  const { t } = useLanguage()

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)

  // TODO: добавить переключатель showBug (useState, default: true)
  // Когда showBug=true  → использовать key={index}   (версия с багом)
  // Когда showBug=false → использовать key={task.id} (версия без бага)

  function addToStart() {
    // TODO: добавить новую задачу в начало массива tasks
    // Используй taskIdCounter++ для нового id
  }

  function removeTask(id: number) {
    // TODO: удалить задачу с данным id из tasks
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.3.2')}</h2>

      {/* TODO: кнопки переключения "С багом (key=index)" и "Без бага (key=task.id)" */}
      {/* Активная кнопка выделена цветом */}

      {/* TODO: кнопка "+ Добавить в начало" */}

      {/* TODO: панель объяснения бага — текст меняется в зависимости от showBug */}
      {/*
        С багом: key=index. Введи заметки → удали первую задачу → заметки сдвинутся.
        Без бага: key=task.id. Заметки всегда у правильных задач.
      */}

      {/* TODO: список задач */}
      {/* Каждый элемент: индикатор ключа + имя задачи + <input placeholder="Заметки..."> + кнопка Удалить */}
      {/* ВАЖНО: key={index} в версии с багом, key={task.id} в версии без бага */}
      <div>
        {tasks.map((task, index) => (
          // TODO: заменить key={index} на правильный key в зависимости от showBug
          <div key={index} style={{ display: 'flex', gap: '8px', padding: '8px', marginBottom: '4px', background: '#1f2937', borderRadius: '4px' }}>
            <span style={{ color: '#6b7280', fontSize: '12px' }}>[{index}]</span>
            <span style={{ color: '#e5e7eb', minWidth: '150px' }}>{task.name}</span>
            <input
              placeholder="Заметки..."
              style={{ flex: 1, padding: '4px 8px', background: '#0f172a', border: '1px solid #374151', borderRadius: '4px', color: '#e5e7eb', fontSize: '13px' }}
            />
            <button
              onClick={() => removeTask(task.id)}
              style={{ padding: '4px 10px', background: '#7f1d1d', color: '#fca5a5', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '16px' }}>
        Добавь переключатель showBug и реализуй addToStart / removeTask.
        Воспроизведи баг с index-key, затем исправь его.
      </p>

      {/* Suppress unused variable warning */}
      <span style={{ display: 'none' }}>{taskIdCounter}</span>
    </div>
  )
}
