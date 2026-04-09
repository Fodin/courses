# Task 3.2 — Error Response Builder per RFC 7807

## Goal

Learn to compose structured error responses per RFC 7807 Problem Details. Understand the purpose of each field and their relationship with the HTTP code.

## Requirements

1. The component offers several error scenarios: validation error, resource not found, conflict, rate limit, access forbidden.
2. When a scenario is selected, form fields are pre-filled with template values.
3. The user can edit all RFC 7807 fields: type, title, status, detail, instance.
4. For validation error scenarios — a checkbox to add an errors array for fields.
5. The resulting JSON updates in real time and is displayed with syntax highlighting.

## Checklist

- [ ] At least 4 error scenarios
- [ ] Editable fields: type, title, status, detail, instance
- [ ] Live preview of the resulting JSON
- [ ] Support for errors array for validation errors
- [ ] Display of Content-Type: application/problem+json
- [ ] Changing the scenario repopulates the form

## How to Check Yourself

Compose an error response for a case where a user tries to update someone else's record. The correct status is 403. In the detail field, describe the specific reason. Make sure type is a URI, not just a string. Show it to a colleague — is it clear from the response what happened?
