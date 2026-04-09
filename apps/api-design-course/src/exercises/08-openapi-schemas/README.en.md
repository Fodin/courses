# OpenAPI — Schemas and Reuse

## Why Reuse Schemas?

Imagine: the `User` schema is used in 10 different endpoints. Without `$ref` you copy it 10 times. Need to add a `phone` field — you have to update 10 places. With `$ref` — just one.

```yaml
# ❌ Duplication — painful to maintain
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
                    id: { type: string, format: uuid }   # again!
                    name: { type: string }               # again!
                    email: { type: string, format: email } # again!
```

```yaml
# ✅ DRY — single source of truth
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

## The components Section

`components` is a "library" of reusable objects:

| Subsection | What it stores |
|---|---|
| `schemas` | Data models (User, Order, Error) |
| `responses` | Standard responses (404 NotFound, 401 Unauthorized) |
| `parameters` | Parameters (page, limit, id in path) |
| `requestBodies` | Request bodies |
| `headers` | Response headers |
| `securitySchemes` | Authorization schemes (JWT, OAuth2, API key) |

## $ref Syntax

```yaml
$ref: "#/components/schemas/User"
#     ^  ^             ^      ^
#     |  |             |      object name
#     |  |             object type
#     |  components root
#     # = current document
```

For external files:
```yaml
$ref: "./schemas/user.yaml"
$ref: "https://api.example.com/schemas/common.yaml#/components/schemas/Error"
```

## Schema Composition

### allOf — Extension (Inheritance)

Combines all listed schemas. The resulting object must match **all** schemas simultaneously:

```yaml
ProductWithReviews:
  allOf:
    - $ref: "#/components/schemas/Product"   # take everything from Product
    - type: object                           # and add new fields
      properties:
        avgRating:
          type: number
          minimum: 0
          maximum: 5
```

### oneOf — Polymorphism

The object must match **exactly one** of the schemas:

```yaml
PaymentMethod:
  oneOf:
    - $ref: "#/components/schemas/CardPayment"
    - $ref: "#/components/schemas/BankTransfer"
  discriminator:
    propertyName: type   # field used to determine the schema
```

### anyOf — Flexible Matching

The object must match **at least one** of the schemas:

```yaml
SearchFilter:
  anyOf:
    - $ref: "#/components/schemas/PriceFilter"
    - $ref: "#/components/schemas/CategoryFilter"
```

## Practical Patterns

### Base Model + Request Variants

```yaml
components:
  schemas:
    # Full model (server → client)
    Product:
      type: object
      required: [id, name, price, createdAt]
      properties:
        id: { type: string, format: uuid }
        name: { type: string }
        price: { type: number }
        createdAt: { type: string, format: date-time }

    # Create-only (client → server)
    ProductCreate:
      type: object
      required: [name, price]
      properties:
        name: { type: string, minLength: 1 }
        price: { type: number, minimum: 0 }

    # Partial update (PATCH)
    ProductUpdate:
      type: object
      properties:
        name: { type: string, minLength: 1 }
        price: { type: number, minimum: 0 }
```

### Reusable Responses

```yaml
components:
  responses:
    Unauthorized:
      description: Authorization required
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"

# Usage:
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

### Reusable Pagination Parameters

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
