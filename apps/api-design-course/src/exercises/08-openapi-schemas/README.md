# OpenAPI — схемы и переиспользование

## Зачем переиспользовать схемы?

Представьте: схема `User` используется в 10 разных endpoints. Без `$ref` вы копируете её 10 раз. Стоит добавить поле `phone` — придётся обновить 10 мест. С `$ref` — только одно.

```yaml
# ❌ Дублирование — боль при изменениях
/users:
  get:
    responses:
      "200":
        content:
          application/json:
            schema:
              type: object
              properties:
                id: { type: string, format: uuid }
                name: { type: string }
                email: { type: string, format: email }

/orders:
  get:
    responses:
      "200":
        content:
          application/json:
            schema:
              type: object
              properties:
                userId:
                  type: string
                user:
                  type: object
                  properties:
                    id: { type: string, format: uuid }   # снова!
                    name: { type: string }               # снова!
                    email: { type: string, format: email } # снова!
```

```yaml
# ✅ DRY — один источник истины
components:
  schemas:
    User:
      type: object
      properties:
        id: { type: string, format: uuid }
        name: { type: string }
        email: { type: string, format: email }

/users:
  get:
    responses:
      "200":
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/User"
```

## Секция components

`components` — это "библиотека" переиспользуемых объектов:

| Подсекция | Что хранит |
|---|---|
| `schemas` | Модели данных (User, Order, Error) |
| `responses` | Стандартные ответы (404 NotFound, 401 Unauthorized) |
| `parameters` | Параметры (page, limit, id в path) |
| `requestBodies` | Тела запросов |
| `headers` | Заголовки ответов |
| `securitySchemes` | Схемы авторизации (JWT, OAuth2, API key) |

## Синтаксис $ref

```yaml
$ref: "#/components/schemas/User"
#     ^  ^             ^      ^
#     |  |             |      имя объекта
#     |  |             тип объекта
#     |  корень components
#     # = текущий документ
```

Для внешних файлов:
```yaml
$ref: "./schemas/user.yaml"
$ref: "https://api.example.com/schemas/common.yaml#/components/schemas/Error"
```

## Композиция схем

### allOf — расширение (наследование)

Объединяет все перечисленные схемы. Итоговый объект должен соответствовать **всем** схемам одновременно:

```yaml
ProductWithReviews:
  allOf:
    - $ref: "#/components/schemas/Product"   # берём всё из Product
    - type: object                           # и добавляем новые поля
      properties:
        avgRating:
          type: number
          minimum: 0
          maximum: 5
```

### oneOf — полиморфизм

Объект должен соответствовать **ровно одной** из схем:

```yaml
PaymentMethod:
  oneOf:
    - $ref: "#/components/schemas/CardPayment"
    - $ref: "#/components/schemas/BankTransfer"
  discriminator:
    propertyName: type   # поле, по которому определяем схему
```

### anyOf — гибкое соответствие

Объект должен соответствовать **хотя бы одной** из схем:

```yaml
SearchFilter:
  anyOf:
    - $ref: "#/components/schemas/PriceFilter"
    - $ref: "#/components/schemas/CategoryFilter"
```

## Практические паттерны

### Базовая модель + варианты запросов

```yaml
components:
  schemas:
    # Полная модель (сервер → клиент)
    Product:
      type: object
      required: [id, name, price, createdAt]
      properties:
        id: { type: string, format: uuid }
        name: { type: string }
        price: { type: number }
        createdAt: { type: string, format: date-time }

    # Только для создания (клиент → сервер)
    ProductCreate:
      type: object
      required: [name, price]
      properties:
        name: { type: string, minLength: 1 }
        price: { type: number, minimum: 0 }

    # Для частичного обновления (PATCH)
    ProductUpdate:
      type: object
      properties:
        name: { type: string, minLength: 1 }
        price: { type: number, minimum: 0 }
```

### Переиспользуемые ответы

```yaml
components:
  responses:
    Unauthorized:
      description: Требуется авторизация
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
    NotFound:
      description: Ресурс не найден
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"

# Использование:
paths:
  /products/{id}:
    get:
      responses:
        "200":
          description: OK
        "401":
          $ref: "#/components/responses/Unauthorized"
        "404":
          $ref: "#/components/responses/NotFound"
```

### Переиспользуемые параметры пагинации

```yaml
components:
  parameters:
    PageParam:
      name: page
      in: query
      schema: { type: integer, default: 1, minimum: 1 }
    LimitParam:
      name: limit
      in: query
      schema: { type: integer, default: 20, minimum: 1, maximum: 100 }

paths:
  /products:
    get:
      parameters:
        - $ref: "#/components/parameters/PageParam"
        - $ref: "#/components/parameters/LimitParam"
```
