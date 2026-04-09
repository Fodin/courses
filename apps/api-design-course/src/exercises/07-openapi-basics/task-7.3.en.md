# Task 7.3: Writing a Complete Specification

## Goal

Implement a self-check component with a reference OpenAPI specification for a Todo API (task CRUD). The specification should be well-commented — each section explained.

## Requirements

1. Display the complete Todo API OpenAPI specification in YAML format with comments
2. Implement three view modes: "Full Specification", "Paths Only", "Components Only"
3. Add a "Copy" button to copy the full YAML to the clipboard
4. Show statistics: number of endpoints, schemas, reusable responses
5. Add a link to Swagger Editor for validating the specification

## The Specification Must Include

- CRUD operations for `/tasks` (GET list, POST create) and `/tasks/{id}` (GET, PUT, DELETE)
- Schemas: `Task` (full model), `TaskInput` (input data), `Error`
- Reusable responses: `NotFound`, `BadRequest`
- Comments explaining sections
- Query parameters for GET /tasks (filter `completed`, `limit`)
- Path parameter `id` for `/tasks/{id}`

## Checklist

- [ ] GET /tasks with query parameters (completed, limit)
- [ ] POST /tasks with requestBody, response 201
- [ ] GET /tasks/{id} with path parameter, response 404 via $ref
- [ ] PUT /tasks/{id} with requestBody and responses 200, 400, 404
- [ ] DELETE /tasks/{id} with response 204 (no body)
- [ ] Schemas Task, TaskInput, Error in components/schemas
- [ ] Standard responses NotFound, BadRequest in components/responses
- [ ] "Copy" button changes text to "Copied" for 2 seconds
- [ ] Three modes display the corresponding part of the specification
- [ ] Statistics correctly reflects the content

## How to Check Yourself

- Copy the YAML and paste into https://editor.swagger.io — documentation should display without validation errors
- Switch to "Components Only" mode — schemas and responses should be present, no paths
- Press "Copy" — the button text should change to "Copied ✅" for 2 seconds
- The Task schema should have fields: id (uuid), title (string), completed (boolean), createdAt (date-time)
