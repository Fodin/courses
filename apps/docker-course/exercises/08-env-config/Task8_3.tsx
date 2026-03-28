// Задание 8.3: Шаблоны конфигурации
// Task 8.3: Configuration templates
//
// TODO: Покажите организацию multi-env конфигурации: структура проекта, базовый compose, окружения (dev/staging/prod), YAML-якоря
// TODO: Show multi-env configuration: project structure, base compose, environments (dev/staging/prod), YAML anchors
//
// 1. Четыре секции: Структура проекта, Базовый compose, Окружения, YAML-якоря
// 2. Структура: дерево файлов + принципы 12-factor app
// 3. Окружения: три переключаемых (dev/staging/prod), двухколоночный layout (compose + .env), команда запуска
// 4. Production использует Docker Secrets вместо переменных
// 5. YAML-якоря: x- расширения, &name, *name, <<: *name

export function Task8_3() {
  return (
    <div style={{ padding: '1rem' }}>
      <h3>Задание 8.3: Шаблоны конфигурации</h3>
      <p>Реализуйте компонент с обзором multi-env конфигурации Docker-проекта...</p>
    </div>
  )
}
