import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.2: Стор + React
// Task 0.2: Store + React
// ============================================

// TODO: Импортируйте makeAutoObservable из 'mobx'
// TODO: Import makeAutoObservable from 'mobx'

// TODO: Импортируйте observer из 'mobx-react-lite'
// TODO: Import observer from 'mobx-react-lite'

// TODO: Создайте класс CounterStore (как в задании 0.1)
// TODO: Create CounterStore class (same as task 0.1)

// TODO: Создайте экземпляр стора ВНЕ компонента
// TODO: Create a store instance OUTSIDE the component

// TODO: Оберните компонент в observer
// TODO: Wrap the component in observer
export function Task0_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.0.2')}</h2>

      {/* TODO: Отобразите counterStore.count */}
      {/* TODO: Display counterStore.count */}
      <p>Count: ???</p>

      {/* TODO: Добавьте кнопки "-1" и "+1" */}
      {/* TODO: Add "-1" and "+1" buttons */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button>-1</button>
        <button>+1</button>
      </div>
    </div>
  )
}
