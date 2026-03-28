// Задание 7.2: Web + DB + Cache (multi-service stack)
// Task 7.2: Web + DB + Cache (multi-service stack)
//
// TODO: Соберите полный стек из 5 сервисов с healthcheck, depends_on и restart policy
// TODO: Build a full stack of 5 services with healthcheck, depends_on and restart policy
//
// 1. Три таба: docker-compose.yml (полный YAML), Сервисы (таблица), Порядок запуска (7 шагов)
// 2. Сервисы: db (PostgreSQL), redis, migrations, api (Node.js), web (Nginx)
// 3. Цепочка: db/redis -> migrations -> api -> web

export function Task7_2() {
  return (
    <div style={{ padding: '1rem' }}>
      <h3>Задание 7.2: Web + DB + Cache</h3>
      <p>Реализуйте компонент с полным production-ready стеком...</p>
    </div>
  )
}
