# Level 7: OpenAPI — Specification Basics

## What is OpenAPI?

OpenAPI (formerly Swagger) is a standard for describing REST APIs in a machine-readable format. The specification is written in YAML or JSON and fully describes the API: endpoints, parameters, request and response formats, data schemas, authentication types.

The current version is **OpenAPI 3.0.3** (stable). Version 3.1 added full compatibility with JSON Schema draft 2020-12.

## Why a Machine-Readable Specification?

- **Documentation generation** — Swagger UI, Redoc automatically build beautiful docs
- **Client code generation** — openapi-generator creates SDKs for any language
- **Mock generation** — Prism, WireMock spin up a mock server from a spec file
- **Validation** — you can check whether a server response conforms to the specification
- **Single source of truth** — frontend and backend work from the same document

## OpenAPI Document Structure

```yaml
openapi: "3.0.3"   # required — specification version

info:               # required — metadata
  title: My API
  version: "1.0.0"

servers:            # optional — where the API lives
  - url: https://api.example.com/v1

paths:              # required — all endpoints
  /users:
    get:
      ...

components:         # optional — reusable objects
  schemas:
    User:
      ...
```

## Endpoint Description (Operation)

```yaml
paths:
  /users/{id}:
    get:
      summary: Get a user
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: User found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
        "404":
          description: Not found
```

## Data Types

| Type      | format     | Example                       |
|-----------|------------|-------------------------------|
| string    | —          | "hello"                       |
| string    | date-time  | "2024-01-15T10:30:00Z"        |
| string    | uuid       | "550e8400-e29b-41d4-a716-..." |
| string    | email      | "user@example.com"            |
| integer   | int32      | 42                            |
| number    | float      | 3.14                          |
| boolean   | —          | true                          |
| array     | —          | [1, 2, 3]                     |
| object    | —          | { "key": "value" }            |
