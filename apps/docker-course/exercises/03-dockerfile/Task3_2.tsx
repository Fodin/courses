import { useState } from 'react'

// ============================================
// Задание 3.2: CMD vs ENTRYPOINT
// Task 3.2: CMD vs ENTRYPOINT
// ============================================

// TODO: Определите интерфейс CommandScenario с полями:
//   name (string), dockerfile (string), runCommand (string), result (string)
// TODO: Define a CommandScenario interface with fields:
//   name (string), dockerfile (string), runCommand (string), result (string)

// TODO: Создайте массив cmdScenarios с минимум 6 сценариями:
//   1. CMD exec-form: CMD ["node", "server.js"] + docker run my-app
//   2. CMD shell-form: CMD node server.js + docker run my-app
//   3. CMD override: CMD ["node", "server.js"] + docker run my-app node test.js
//   4. ENTRYPOINT exec-form: ENTRYPOINT ["python", "app.py"] + docker run my-app
//   5. ENTRYPOINT + args: ENTRYPOINT ["python", "app.py"] + docker run my-app --verbose
//   6. ENTRYPOINT + CMD: ENTRYPOINT ["python"] + CMD ["app.py"]
//   7. ENTRYPOINT + CMD override: та же комбинация + docker run my-app test.py
// TODO: Create a cmdScenarios array with at least 6 scenarios:
//   1. CMD exec-form: CMD ["node", "server.js"] + docker run my-app
//   2. CMD shell-form: CMD node server.js + docker run my-app
//   3. CMD override: CMD ["node", "server.js"] + docker run my-app node test.js
//   4. ENTRYPOINT exec-form: ENTRYPOINT ["python", "app.py"] + docker run my-app
//   5. ENTRYPOINT + args: ENTRYPOINT ["python", "app.py"] + docker run my-app --verbose
//   6. ENTRYPOINT + CMD: ENTRYPOINT ["python"] + CMD ["app.py"]
//   7. ENTRYPOINT + CMD override: same combo + docker run my-app test.py

// TODO: Создайте массив formComparison для таблицы exec vs shell форм.
//   Минимум 4 строки: PID 1 процесс, обработка SIGTERM, graceful shutdown, подстановка переменных
// TODO: Create a formComparison array for exec vs shell form table.
//   At least 4 rows: PID 1 process, SIGTERM handling, graceful shutdown, variable substitution

export function Task3_2() {
  // TODO: Создайте состояние для активного сценария, видимости таблицы и паттерна entrypoint
  // TODO: Create state for active scenario, table visibility and entrypoint pattern
  const [activeScenario, setActiveScenario] = useState(0)
  const [showFormComparison, setShowFormComparison] = useState(false)
  const [showEntrypointPattern, setShowEntrypointPattern] = useState(false)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>CMD vs ENTRYPOINT</h2>

      <h3>Интерактивные сценарии</h3>

      {/* TODO: Создайте кнопки для каждого сценария из cmdScenarios.
          Активный сценарий должен быть визуально выделен. */}
      {/* TODO: Create buttons for each scenario from cmdScenarios.
          Active scenario should be visually highlighted. */}

      {/* TODO: Для активного сценария покажите блок кода с тёмным фоном, разделённый на секции:
          1. "Dockerfile" -- содержимое dockerfile
          2. "Команда запуска" -- runCommand (голубым цветом #4fc3f7)
          3. "Результат" -- result (зелёным цветом #81c784) */}
      {/* TODO: For active scenario show a dark code block divided into sections:
          1. "Dockerfile" -- dockerfile content
          2. "Run command" -- runCommand (blue #4fc3f7)
          3. "Result" -- result (green #81c784) */}

      {/* TODO: Кнопка "Exec vs Shell форма" -- показать/скрыть таблицу сравнения.
          Exec-форма подсвечена зелёным (#e8f5e9), shell-форма -- красным (#ffebee). */}
      {/* TODO: "Exec vs Shell form" button -- show/hide comparison table.
          Exec form highlighted green (#e8f5e9), shell form -- red (#ffebee). */}

      {/* TODO: Кнопка "Паттерн entrypoint.sh" -- показать/скрыть пример скрипта.
          Пример должен включать: entrypoint.sh с exec "$@",
          Dockerfile с ENTRYPOINT и CMD,
          примеры использования docker run. */}
      {/* TODO: "entrypoint.sh pattern" button -- show/hide script example.
          Example should include: entrypoint.sh with exec "$@",
          Dockerfile with ENTRYPOINT and CMD,
          docker run usage examples. */}
    </div>
  )
}
