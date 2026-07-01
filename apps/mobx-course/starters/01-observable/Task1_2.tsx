import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.2: makeObservable
// Task 1.2: makeObservable
// ============================================

// TODO: Импортируйте makeObservable, observable, action, computed из 'mobx'
// TODO: Импортируйте observer из 'mobx-react-lite'

// TODO: Создайте класс UserStore:
//   - поля firstName, lastName
//   - makeObservable с ЯВНЫМИ аннотациями
//   - методы setFirstName, setLastName
//   - геттеры fullName, initials

export function Task1_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 1.2: makeObservable</h2>
      {/* TODO: inputs + display fullName и initials */}
    </div>
  )
}
