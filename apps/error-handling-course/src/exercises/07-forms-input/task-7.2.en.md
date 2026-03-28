# Task 7.2: Server Errors

## Goal
Handle validation errors returned by the server.

## Requirements
1. Create a registration form with fields username and email
2. Simulate server-side validation:
   - username="admin" → "Name is already taken"
   - email with @test.com → "Domain is forbidden"
3. On 422 response, map errors to form fields
4. Add a loading indicator when submitting
5. Show successful result when data is valid

## Checklist
- [ ] Server validation simulated
- [ ] Errors are mapped to form fields
- [ ] Loading indicator
- [ ] Successful submit with valid data
