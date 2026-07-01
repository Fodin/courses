import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.4: keepAlive и equals
// Task 3.4: keepAlive & equals
// ============================================

// TODO: Создайте два стора с computed viewport: {width, height}
// Один — обычный, второй — с comparer.structural
// Покажите разницу в ререндерах через console.log

export function Task3_4() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 3.4: keepAlive & equals</h2>
      {/* TODO: два варианта viewport + логи ререндеров */}
    </div>
  )
}
