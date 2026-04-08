# Task 14.9: Nested Forms and Fields

## Goal

Learn to work with deeply nested objects and split a form into reusable sub-forms.

## Requirements

1. Create a company registration form with a nested structure:
   - Company name (string)
   - Address (nested object: country, city, street, zip)
   - Contacts: primary and billing (each is an object with name and email)
2. Extract address and contact into separate sub-form components
3. Use `FormProvider` / `useFormContext` to access the form from sub-components
4. Implement a "Copy primary contact to billing" checkbox
5. Register fields using dot notation (`address.city`, `contacts.primary.email`)
6. On submit, display the resulting JSON with nested structure

## Checklist

- [ ] Form contains nested objects (address, contacts.primary, contacts.billing)
- [ ] Sub-forms are separate components using useFormContext
- [ ] Dot notation in register for nested fields
- [ ] "Copy to billing" checkbox works via setValue
- [ ] Validation works at all nesting levels
- [ ] Errors display correctly for nested fields
- [ ] Submitted data preserves nested structure

## How to verify

1. Click Submit with an empty form — errors should appear at all levels
2. Fill in the primary contact, check the checkbox — billing should be copied
3. Fill in all fields and submit — JSON should contain nested objects
4. Verify that sub-forms are reusable (one component for both primary and billing)
