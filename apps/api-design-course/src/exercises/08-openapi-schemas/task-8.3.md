# Задание 8.3: Проектирование схем

## Цель

Создать self-check компонент с эталонными OpenAPI-схемами для e-commerce API. Показать все ключевые паттерны: базовые схемы, allOf/oneOf/anyOf, generic-пагинацию.

## Требования

1. Навигация по 8 схемам, сгруппированным по категориям:
   - **Базовые схемы:** `Product`, `Category`, `User`, `Order`, `OrderItem`, `Address`
   - **Композиция:** `allOf / oneOf / anyOf` (примеры всех операторов)
   - **Generic-паттерн:** `PaginatedResponse<T>` через `PaginationMeta + allOf`
2. При выборе схемы: название, описание, категория, YAML-определение
3. Для категорий "Композиция" и "Generic" — дополнительный пояснительный блок
4. Активная схема выделена цветом и рамкой

## Что реализовать

- [ ] Массив `SCHEMA_EXAMPLES` с полями: `id`, `title`, `description`, `color`, `category`, `yaml`
- [ ] Состояние `selectedId: string` (по умолчанию первая схема)
- [ ] Группировка схем по `category` через `Array.from(new Set(...))`
- [ ] Левая панель — навигация по категориям и схемам
- [ ] Правая панель — детали выбранной схемы

## Схемы для реализации

### Product
```yaml
Product:
  required: [id, name, price, category]
  properties:
    id: { type: string, format: uuid }
    name: { type: string, minLength: 1, maxLength: 200 }
    price: { type: number, format: float, minimum: 0 }
    category:
      $ref: "#/components/schemas/Category"
    inStock: { type: boolean, default: true }
    images: { type: array, items: { type: string, format: uri } }
```

### allOf — расширение схемы
```yaml
ProductWithReviews:
  allOf:
    - $ref: "#/components/schemas/Product"
    - type: object
      properties:
        avgRating: { type: number, minimum: 0, maximum: 5 }
        reviewsCount: { type: integer }
```

### oneOf — полиморфизм с discriminator
```yaml
PaymentMethod:
  oneOf:
    - $ref: "#/components/schemas/CardPayment"
    - $ref: "#/components/schemas/CryptoPayment"
    - $ref: "#/components/schemas/BankTransfer"
  discriminator:
    propertyName: type
```

### PaginatedResponse
```yaml
PaginationMeta:
  required: [total, page, limit, totalPages]
  properties:
    total: { type: integer }
    page: { type: integer }
    limit: { type: integer }
    totalPages: { type: integer }
    hasNextPage: { type: boolean }

PaginatedProducts:
  allOf:
    - $ref: "#/components/schemas/PaginationMeta"
    - type: object
      required: [data]
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/Product"
```

## Как проверить себя

- Клик по каждой схеме показывает корректный YAML
- Для "Композиция" отображается пояснение про allOf/oneOf/anyOf
- Для "Generic-паттерн" отображается пояснение про имитацию generics
- Навигация по категориям: базовые → композиция → generic-паттерн
- `Category` содержит рекурсивную ссылку `parent: $ref: "#/components/schemas/Category"`
