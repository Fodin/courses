# Task 7.2: OpenAPI Path Builder

## Goal

Implement a step-by-step builder that shows how a single endpoint description is constructed in OpenAPI. At each step, the YAML grows — the user sees the process of forming the specification.

## Requirements

1. Implement a choice of three scenarios: `GET /users`, `POST /users`, `GET /users/{id}`
2. Implement 4 steps: "Method and Path", "Parameters", "Request Body", "Responses"
3. At each step, the YAML preview contains all sections from step 1 up to the current one
4. When switching scenarios, steps reset to the first
5. "Back" and "Next" buttons for step navigation
6. Completed steps are displayed differently (color, icon)
7. A contextual hint for the current step is shown below the YAML

## Checklist

- [ ] Three scenario buttons with method and path
- [ ] Four steps, switchable by buttons and clicking on a step
- [ ] YAML grows as steps are completed
- [ ] Scenario switch resets progress to step 1
- [ ] `GET /users/{id}` adds path parameter `id`
- [ ] `POST /users` adds `requestBody` but no path/query parameters
- [ ] `GET /users` adds query parameter `limit` but no requestBody
- [ ] Responses include codes 200/201, 400 and (for paths with {id}) 404
- [ ] Hint changes depending on the current step

## How to Check Yourself

- Select scenario `GET /users/{id}` and go to the "Parameters" step — the YAML should have a parameter `in: path` with `required: true`
- Select `POST /users`, go to the "Request Body" step — the YAML should contain `requestBody` with `required: [name, email]`
- Switch to another scenario — the step counter should reset to 1
- On the "Responses" step in the `POST /users` scenario, code `"201"` should appear, not `"200"`
