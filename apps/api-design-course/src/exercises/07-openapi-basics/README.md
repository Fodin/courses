# Уровень 7: OpenAPI — основы спецификации

## Что такое OpenAPI?

OpenAPI (бывший Swagger) — это стандарт описания REST API в машиночитаемом формате.
Спецификация записывается в YAML или JSON и полностью описывает API: endpoints, параметры,
форматы запросов и ответов, схемы данных, типы аутентификации.

Текущая версия — **OpenAPI 3.0.3** (стабильная). Версия 3.1 добавила полную совместимость
с JSON Schema draft 2020-12.

## Зачем нужна машиночитаемая спецификация?

- **Генерация документации** — Swagger UI, Redoc автоматически строят красивые docs
- **Генерация клиентского кода** — openapi-generator создаёт SDK для любого языка
- **Генерация моков** — Prism, WireMock поднимают mock-сервер из spec-файла
- **Валидация** — можно проверить, соответствует ли ответ сервера спецификации
- **Единый источник правды** — frontend и backend работают по одному документу

## Структура OpenAPI-документа

```yaml
openapi: "3.0.3"   # обязательно — версия спецификации

info:               # обязательно — метаданные
  title: My API
  version: "1.0.0"

servers:            # опционально — где живёт API
  - url: https://api.example.com/v1

paths:              # обязательно — все endpoints
  /users:
    get:
      ...

components:         # опционально — переиспользуемые объекты
  schemas:
    User:
      ...
```

## Описание endpoint (operation)

```yaml
paths:
  /users/{id}:
    get:
      summary: Получить пользователя
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Пользователь найден
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
        "404":
          description: Не найдено
```

## Типы данных

| Тип       | format     | Пример                          |
|-----------|------------|---------------------------------|
| string    | —          | "hello"                         |
| string    | date-time  | "2024-01-15T10:30:00Z"          |
| string    | uuid       | "550e8400-e29b-41d4-a716-..."   |
| string    | email      | "user@example.com"              |
| integer   | int32      | 42                              |
| number    | float      | 3.14                            |
| boolean   | —          | true                            |
| array     | —          | [1, 2, 3]                       |
| object    | —          | { "key": "value" }              |
