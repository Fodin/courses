import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// TODO 1: Реализуйте класс IO<T>
//
// IO — обёртка над thunk () => T.
// Ключевое свойство: эффект НЕ выполняется при создании.
// ============================================

// class IO<T> {
//   constructor(private effect: () => T) {}
//
//   // Поднимает значение в IO (чистое значение, без эффектов)
//   static of<T>(value: T): IO<T> {
//     return new IO(() => value)
//   }
//
//   // Трансформирует результат, НЕ вызывая effect
//   map<U>(fn: (value: T) => U): IO<U> {
//     return new IO(() => fn(this.effect()))
//   }
//
//   // Цепочка IO-шагов, НЕ вызывая effect до run()
//   flatMap<U>(fn: (value: T) => IO<U>): IO<U> {
//     return new IO(() => fn(this.effect()).run())
//   }
//
//   // ТОЛЬКО здесь происходят побочные эффекты
//   run(): T {
//     return this.effect()
//   }
// }

// ============================================
// TODO 2: Определите типы данных для пайплайна
// ============================================

// interface Config { dbHost: string; port: number }
// interface Connection { connected: boolean; host: string }
// interface User { id: number; name: string }

// ============================================
// TODO 3: Реализуйте IO-шаги пайплайна
//
// Каждая функция возвращает IO<T>, не выполняя эффект.
// Используйте new IO(() => ...) или IO.of(...)
// ============================================

// function readConfig(): IO<Config> {
//   // Должен вернуть IO с { dbHost: 'localhost', port: 5432 }
// }

// function connectDB(config: Config): IO<Connection> {
//   // Должен вернуть IO с { connected: true, host: config.dbHost }
// }

// function queryUsers(db: Connection): IO<User[]> {
//   // Должен вернуть IO с [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
// }

// function formatReport(users: User[]): IO<string> {
//   // Должен вернуть IO со строкой отчёта:
//   // `Report [${new Date().toISOString()}]: ${users.map(u => u.name).join(', ')}`
// }

// ============================================
// TODO 4: Постройте пайплайн из 4 шагов
//
// const pipeline = readConfig()
//   .flatMap(connectDB)
//   .flatMap(queryUsers)
//   .flatMap(formatReport)
// ============================================

export function Task7_1() {
  const { t } = useLanguage()
  const [log, setLog] = useState<string[]>([])
  const [runCount, setRunCount] = useState(0)
  void log
  void setLog
  void runCount
  void setRunCount

  return (
    <div className="exercise-container">
      <h2>{t('task.7.1')}</h2>

      {/* TODO 5: Добавьте секцию "Построение пайплайна"
          Покажите код пайплайна и индикатор:
          "Побочных эффектов: 0. Ничего не выполнено." */}

      {/* TODO 6: Добавьте кнопку "run()"
          При нажатии — вызвать pipeline.run() и показать лог шагов.
          Повторное нажатие — перезапустить (IO выполняется заново).
          Подсказка: чтобы показывать шаги по одному, используйте
          setTimeout или другой механизм задержки. */}

      {/* TODO 7: Добавьте индикатор:
          - До run(): "Побочных эффектов: 0. Ничего не выполнено."
          - После run(): "Выполнено! (запусков: N)" */}
    </div>
  )
}
