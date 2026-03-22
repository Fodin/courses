import { useLanguage } from 'src/hooks'

// Задание 2.4: Батчинг
// Task 2.4: Action Batching

// TODO: Стор с методом, делающим 3 мутации подряд
// TODO: Добавьте счетчик ререндеров через useRef

export function Task2_4() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 2.4: Action Batching</h2>
    </div>
  )
}
