import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.3: Builder через pipe
// Task 4.3: Builder via pipe
// ============================================
// Реализуйте FP Builder: каждая функция-шаг принимает конфиг и возвращает расширенный.
// Implement FP Builder: each step-function takes config and returns extended config.
//
// type ConfigStep = (cfg: AppConfig) => AppConfig
//
// Пример использования / Usage example:
// const config = pipe(
//   withDatabase('postgres'),
//   withPort(3000),
//   withLogging('info'),
// )({})

// TODO: Определите тип AppConfig
// TODO: Define AppConfig type
// interface AppConfig {
//   db?: { type: string; host: string; port: number }
//   server?: { port: number }
//   logging?: { level: string; format: string }
//   cors?: { origins: string[]; methods: string[] }
//   auth?: { strategy: string; secret: string }
// }

// TODO: Реализуйте 5 функций-шагов (каждая возвращает ConfigStep):
// TODO: Implement 5 step-functions (each returns ConfigStep):
// withDatabase(type: string)    — db: { type, host, port }
// withPort(port: number)        — server: { port }
// withLogging(level: string)    — logging: { level, format }
// withCors(originsStr: string)  — cors: { origins (split by ','), methods }
// withAuth(strategy: string)    — auth: { strategy, secret }
// ВАЖНО: используйте spread {...cfg, ...}, не мутируйте входной объект!
// IMPORTANT: use spread {...cfg, ...}, do NOT mutate the input object!

export function Task4_3() {
  const { t } = useLanguage()

  // TODO: Состояние для шагов билдера (enabled, param)
  // TODO: State for builder steps (enabled, param)

  // TODO: Вычислите enabledSteps — только включённые шаги в порядке их объявления
  // TODO: Compute enabledSteps — only enabled steps in declaration order

  // TODO: Вычислите intermediateConfigs — массив конфигов [начальный, после шага 1, после шага 2, ...]
  // TODO: Compute intermediateConfigs — array of configs [initial, after step 1, after step 2, ...]

  // TODO: Вычислите finalConfig = последний элемент intermediateConfigs
  // TODO: Compute finalConfig = last element of intermediateConfigs

  return (
    <div className="exercise-container">
      <h2>{t('task.4.3')}</h2>

      {/* TODO: Список шагов с чекбоксом и параметром (select/input) */}
      {/* TODO: Steps list with checkbox and parameter (select/input) */}

      {/* TODO: Блок с кодом pipe(withDatabase(...), ...)({}), обновляется динамически */}
      {/* TODO: Code block pipe(withDatabase(...), ...)({}), updates dynamically */}

      {/* TODO: JSON-просмотрщик итогового конфига */}
      {/* TODO: JSON viewer of final config */}

      {/* TODO: При наведении на шаг — показать промежуточный конфиг после него */}
      {/* TODO: On step hover — show intermediate config after that step */}

      {/* TODO: Список накопления — какие секции добавляет каждый шаг */}
      {/* TODO: Accumulation list — which sections each step adds */}
    </div>
  )
}
