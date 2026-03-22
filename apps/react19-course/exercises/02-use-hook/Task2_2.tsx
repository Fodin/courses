import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.2: use(Context)
// ============================================

// TODO: Создайте контекст с помощью createContext
// TODO: Замените useContext на use()

export function Task2_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 2.2</h2>

      {/* TODO: Используйте use(MyContext) вместо useContext(MyContext) */}
    </div>
  )
}
