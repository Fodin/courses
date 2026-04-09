# Задание 7.3: Написание полной спецификации

## Цель

Реализовать self-check компонент с эталонной OpenAPI-спецификацией для Todo API (CRUD задач).
Спецификация должна быть хорошо прокомментирована — каждая секция объяснена.

## Требования

1. Отобразить полную OpenAPI-спецификацию Todo API в YAML-формате с комментариями
2. Реализовать три режима просмотра: "Полная спецификация", "Только paths", "Только components"
3. Добавить кнопку "Копировать" для копирования полного YAML в буфер обмена
4. Показать статистику: количество endpoints, схем, переиспользуемых ответов
5. Добавить ссылку на Swagger Editor для проверки спецификации

## Спецификация должна включать

- CRUD-операции для `/tasks` (GET list, POST create) и `/tasks/{id}` (GET, PUT, DELETE)
- Схемы: `Task` (полная модель), `TaskInput` (входные данные), `Error`
- Переиспользуемые responses: `NotFound`, `BadRequest`
- Комментарии, объясняющие секции
- Query-параметры для GET /tasks (фильтр `completed`, `limit`)
- Path-параметр `id` для `/tasks/{id}`

## Чеклист

- [ ] GET /tasks с query-параметрами (completed, limit)
- [ ] POST /tasks с requestBody, response 201
- [ ] GET /tasks/{id} с path-параметром, response 404 через $ref
- [ ] PUT /tasks/{id} с requestBody и responses 200, 400, 404
- [ ] DELETE /tasks/{id} с response 204 (без тела)
- [ ] Схемы Task, TaskInput, Error в components/schemas
- [ ] Стандартные ответы NotFound, BadRequest в components/responses
- [ ] Кнопка "Копировать" меняет текст на "Скопировано" на 2 секунды
- [ ] Три режима отображают соответствующую часть спецификации
- [ ] Статистика корректно отражает содержимое

## Как проверить себя

- Скопируйте YAML и вставьте в https://editor.swagger.io — должна отобразиться документация
  без ошибок валидации
- Переключитесь в режим "Только components" — должны быть schemas и responses, без paths
- Нажмите "Копировать" — текст кнопки должен смениться на "Скопировано ✅" на 2 секунды
- В схеме Task должны быть поля: id (uuid), title (string), completed (boolean), createdAt (date-time)
