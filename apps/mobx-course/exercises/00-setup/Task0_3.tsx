import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.3: Несколько полей
// Task 0.3: Multiple Fields
// ============================================

// TODO: Импортируйте makeAutoObservable из 'mobx'
// TODO: Import makeAutoObservable from 'mobx'

// TODO: Импортируйте observer из 'mobx-react-lite'
// TODO: Import observer from 'mobx-react-lite'

// TODO: Создайте класс ProfileStore
// TODO: Create ProfileStore class
//   - name: string = ''
//   - age: number = 0
//   - bio: string = ''
//   - setName(value: string)
//   - setAge(value: number)
//   - setBio(value: string)
//   - get summary() — returns "Name, N years old"

// TODO: Создайте экземпляр стора вне компонента
// TODO: Create store instance outside the component

// TODO: Оберните компонент в observer
// TODO: Wrap the component in observer
export function Task0_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.0.3')}</h2>

      <div style={{ maxWidth: '400px' }}>
        {/* TODO: Input для name */}
        {/* TODO: Input for name */}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" placeholder="Enter name" />
        </div>

        {/* TODO: Input для age */}
        {/* TODO: Input for age */}
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input id="age" type="number" placeholder="Enter age" />
        </div>

        {/* TODO: Textarea для bio */}
        {/* TODO: Textarea for bio */}
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" placeholder="Tell about yourself" rows={3} />
        </div>

        {/* TODO: Блок предпросмотра с summary и bio */}
        {/* TODO: Preview block with summary and bio */}
      </div>
    </div>
  )
}
