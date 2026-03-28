# Задание 7.2: Web + DB + Cache (multi-service stack)

## Цель

Собрать полный production-ready стек из 5 сервисов: PostgreSQL, Redis, миграции, Node.js API, Nginx frontend -- с healthcheck, depends_on conditions, restart policy и именованными томами.

## Требования

1. Создайте компонент с тремя табами: "docker-compose.yml", "Сервисы", "Порядок запуска"
2. Таб "docker-compose.yml" -- полный YAML-файл стека из 5 сервисов:
   - `db` (postgres:16-alpine) с healthcheck, томом, переменными окружения
   - `redis` (redis:7-alpine) с healthcheck, томом, настройками maxmemory
   - `migrations` (one-shot, `restart: 'no'`) с depends_on db (service_healthy)
   - `api` (Node.js) с depends_on всех трёх (healthy/completed), собственный healthcheck
   - `web` (Nginx frontend) с depends_on api (service_healthy)
3. Под YAML покажите статистику: количество сервисов, томов, healthcheck
4. Таб "Сервисы" -- таблица с колонками: Сервис, Образ, Роль, Порт, Healthcheck
5. Под таблицей -- описание паттерна "инфраструктура -> миграции -> backend -> frontend"
6. Таб "Порядок запуска" -- пошаговая визуализация (7 шагов) с цветовой группировкой по слоям. Внизу объяснение роли `service_completed_successfully` для миграций

## Подсказки

- Используйте `${DB_PASSWORD:?required}` для обязательных переменных
- Для Redis: `command: redis-server --appendonly yes --maxmemory 256mb`
- Для api healthcheck: `wget --spider -q` (Alpine-образ без curl)

## Чеклист

- [ ] Полный YAML с 5 сервисами, 2 томами, 4 healthcheck
- [ ] PostgreSQL с pg_isready healthcheck и start_period
- [ ] Redis с redis-cli ping healthcheck и настройками памяти
- [ ] Миграции с restart: 'no' и depends_on service_healthy
- [ ] API с depends_on на все 3 сервиса (разные условия)
- [ ] Таблица сервисов с ролями и healthcheck
- [ ] Пошаговый порядок запуска (7 шагов)
- [ ] Статистика (сервисы, тома, healthcheck)

## Как проверить себя

1. YAML должен быть синтаксически корректным (попробуйте скопировать в реальный проект)
2. Цепочка зависимостей: db/redis -> migrations -> api -> web
3. Порядок запуска логичен и соответствует YAML-конфигурации
4. Все 5 сервисов описаны в таблице с корректными данными
