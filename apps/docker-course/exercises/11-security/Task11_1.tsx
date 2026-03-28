// Задание 11.1: Пользователи и Capabilities
// Task 11.1: Users and Capabilities
//
// TODO: Создайте компонент-справочник по безопасности пользователей и capabilities
// TODO: Create a reference component for user security and capabilities
//
// 1. Три переключаемые секции: "Пользователи", "Capabilities", "Seccomp и AppArmor"
// 2. Секция "Пользователи": таблица примеров настройки USER в Dockerfile (плохой/хороший)
// 3. Кнопки "Показать Dockerfile" для каждого примера
// 4. Секция "Capabilities": таблица Linux capabilities (8+) с именем, описанием, риском, рекомендацией
// 5. Цветная индикация риска: красный (высокий), оранжевый (средний), зелёный (низкий)
// 6. Блоки "Минимальные наборы" для web-сервера, Node.js, БД
// 7. Секция "Seccomp и AppArmor": описание технологий с примерами команд
// 8. Блок "Ключевой принцип" внизу -- принцип наименьших привилегий

export function Task11_1() {
  return (
    <div style={{ padding: '1rem' }}>
      <h3>Задание 11.1: Пользователи и Capabilities</h3>
      <p>Реализуйте компонент-справочник по безопасности пользователей, capabilities, seccomp и AppArmor...</p>
    </div>
  )
}
