// Задание 12.1: CI Pipeline — сборка и тестирование
// Task 12.1: CI Pipeline — Build and Testing
//
// TODO: Создайте компонент-справочник по CI/CD пайплайну для Docker
// TODO: Create a reference component for CI/CD pipeline with Docker
//
// 1. Три переключаемые секции: "CI Pipeline", "Кэширование", "Matrix Builds"
// 2. Секция "CI Pipeline": 6 стадий (Lint, Build, Test, Scan, Push, Deploy) с описанием и инструментами
// 3. По клику на стадию раскрывается подробная информация и кнопка "Показать конфиг"
// 4. Кнопка "Запустить Pipeline" анимирует последовательное прохождение стадий
// 5. Секция "Кэширование": таблица типов кэша (gha, registry, local, s3) с плюсами/минусами
// 6. Пример cache-from/cache-to и пояснение mode=max
// 7. Секция "Matrix Builds": 3 примера matrix strategy с конфигурацией

export function Task12_1() {
  return (
    <div style={{ padding: '1rem' }}>
      <h3>Задание 12.1: CI Pipeline — сборка и тестирование</h3>
      <p>Реализуйте компонент-справочник по стадиям CI/CD пайплайна, кэшированию слоёв и matrix builds...</p>
    </div>
  )
}
