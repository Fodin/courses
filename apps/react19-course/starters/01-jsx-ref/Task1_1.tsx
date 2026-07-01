import React from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.1: JSX без import React
// Task 1.1: JSX without import React
// ============================================

// TODO: Уберите ненужный `import React from 'react'`
// TODO: Remove the unnecessary `import React from 'react'`

// TODO: Компонент должен работать без явного импорта React
// TODO: Component should work without explicit React import

export function Task1_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 1.1</h2>

      {/* TODO: Убедитесь, что компонент работает без import React */}
      {/* TODO: Verify the component works without import React */}
      <p>
        Этот компонент использует <code>import React from 'react'</code> — уберите этот импорт!
      </p>
    </div>
  )
}
