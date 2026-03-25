# Task 8.3: Final Project — Todo with Error Handling

## Goal
Create a Todo application combining all error handling techniques from the course.

## Requirements
1. Simulate API for CRUD operations (list, add, toggle, delete)
2. Add errors:
   - Validation: empty text
   - Limit: maximum 5 tasks
   - Server error: 20% chance when adding
   - Not found: on toggle/delete of non-existent task
3. Use `AppError` with error codes
4. Display errors through `role="alert"` with close button
5. Add loading indicator
6. Application must remain functional on any error

## Checklist
- [ ] CRUD API with delay simulation
- [ ] 4 error types (VALIDATION, LIMIT, SERVER, NOT_FOUND)
- [ ] AppError with codes
- [ ] Errors display and close
- [ ] Loading indicator
- [ ] App doesn't crash on errors
