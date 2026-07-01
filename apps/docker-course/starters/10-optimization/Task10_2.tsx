// Задание 10.2: Multi-stage builds
// Task 10.2: Multi-stage builds
//
// TODO: Покажите паттерн multi-stage builds для разных языков
// TODO: Show multi-stage build patterns for different languages
//
// 1. Четыре вкладки: Node.js, Go, Python, Java
// 2. Для каждого языка: Dockerfile "до" и "после" оптимизации
// 3. Визуальное сравнение размеров (прогресс-бары с числами)
// 4. Кнопка "Показать схему" с ASCII-диаграммой builder-runner
// 5. Таблица команд: --target, COPY --from=<stage>, COPY --from=<image>
// 6. Предупреждение о COPY --from с внешними образами

export function Task10_2() {
  return (
    <div style={{ padding: '1rem' }}>
      <h3>Задание 10.2: Multi-stage builds</h3>
      <p>Реализуйте компонент с примерами multi-stage builds для разных языков...</p>
    </div>
  )
}
