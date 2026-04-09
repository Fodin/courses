# Task 8.3: Schema Design

## Goal

Create a self-check component with reference OpenAPI schemas for an e-commerce API. Show all key patterns: base schemas, allOf/oneOf/anyOf, generic pagination.

## Requirements

1. Navigation across 8 schemas, grouped by category:
   - **Base schemas:** `Product`, `Category`, `User`, `Order`, `OrderItem`, `Address`
   - **Composition:** `allOf / oneOf / anyOf` (examples of all operators)
   - **Generic pattern:** `PaginatedResponse<T>` via `PaginationMeta + allOf`
2. When a schema is selected: name, description, category, YAML definition
3. For "Composition" and "Generic" categories — an additional explanatory block
4. Active schema highlighted with color and border

## What to Implement

- [ ] `SCHEMA_EXAMPLES` array with fields: `id`, `title`, `description`, `color`, `category`, `yaml`
- [ ] `selectedId: string` state (defaults to first schema)
- [ ] Group schemas by `category` via `Array.from(new Set(...))`
- [ ] Left panel — navigation by categories and schemas
- [ ] Right panel — details of the selected schema

## Schemas to Implement

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

### allOf — Schema Extension
```yaml
ProductWithReviews:
  allOf:
    - $ref: "#/components/schemas/Product"
    - type: object
      properties:
        avgRating: { type: number, minimum: 0, maximum: 5 }
        reviewsCount: { type: integer }
```

### oneOf — Polymorphism with discriminator
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

## How to Check Yourself

- Clicking on each schema shows the correct YAML
- For "Composition," an explanation about allOf/oneOf/anyOf is displayed
- For "Generic pattern," an explanation about generics emulation is displayed
- Category navigation: base → composition → generic pattern
- `Category` contains a recursive link `parent: $ref: "#/components/schemas/Category"`
