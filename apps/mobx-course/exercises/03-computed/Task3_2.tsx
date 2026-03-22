import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.2: Цепочка computed
// Task 3.2: Computed Chain
// ============================================

// TODO: Создайте InvoiceStore с:
//   - items и taxRate
//   - computed: subtotal -> tax -> total

export function Task3_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 3.2: Computed Chain</h2>
      {/* TODO: Invoice с subtotal, tax, total */}
    </div>
  )
}
