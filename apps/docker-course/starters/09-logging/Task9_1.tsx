// Задание 9.1: docker logs
// Task 9.1: docker logs
//
// TODO: Покажите флаги docker logs, logging drivers и настройку ротации логов
// TODO: Show docker logs flags, logging drivers and log rotation configuration
//
// 1. Три переключаемые секции: "Флаги docker logs", "Logging drivers", "Ротация логов"
// 2. Таблица флагов: -f, --tail, --since, --until, -t, --details с описанием и примером
// 3. Таблица logging drivers с колонкой поддержки docker logs
// 4. Примеры ротации: CLI, Compose, daemon.json
// 5. Кнопка "STDOUT vs STDERR" с блоком примеров (bash, Node.js, Python)
// 6. Предупреждение внизу: docker logs показывает только STDOUT/STDERR

export function Task9_1() {
  return (
    <div style={{ padding: '1rem' }}>
      <h3>Задание 9.1: docker logs</h3>
      <p>Реализуйте компонент с обзором docker logs, logging drivers и ротации логов...</p>
    </div>
  )
}
