# Task 7.1: Validation Errors

## Goal
Implement client-side form validation with error display under the fields.

## Requirements
1. Create a form with fields: name, email, age
2. Implement a `validate()` function with rules:
   - name: required, minimum 2 characters
   - email: required, email format
   - age: required, number 18-120
3. Validate on submit, remove errors on input (after first submit)
4. Highlight error fields with a red border
5. Display messages under each field

## Checklist
- [ ] 3 fields with different validation rules
- [ ] Errors show on submit
- [ ] Errors are removed when corrected
- [ ] Fields are highlighted red on error
- [ ] Error text appears under each field
