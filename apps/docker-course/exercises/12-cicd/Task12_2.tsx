// Задание 12.2: Container Registry и тегирование
// Task 12.2: Container Registry and Tagging
//
// TODO: Создайте компонент-справочник по Container Registries и стратегиям тегирования
// TODO: Create a reference component for Container Registries and tagging strategies
//
// 1. Три переключаемые секции: "Container Registries", "Стратегии тегов", "Автоматизация"
// 2. Секция "Registries": таблица из 6 реестров (Docker Hub, GHCR, ECR, ACR, GCR, Harbor)
// 3. Кнопка "Подробнее" раскрывает URL, особенности и команду авторизации
// 4. Секция "Стратегии тегов": 5 стратегий с описанием, примерами и цветной индикацией
// 5. Предупреждение о latest как плохой практике для production
// 6. Секция "Автоматизация": симулятор генерации тегов (ввод + кнопка "Генерировать")
// 7. Пример конфигурации docker/metadata-action

export function Task12_2() {
  return (
    <div style={{ padding: '1rem' }}>
      <h3>Задание 12.2: Container Registry и тегирование</h3>
      <p>Реализуйте компонент-справочник по Container Registries, стратегиям тегирования и автоматизации...</p>
    </div>
  )
}
