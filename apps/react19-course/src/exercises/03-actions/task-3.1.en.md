# Task 3.1: form action

## Objective

Use the new React 19 `action` prop on a form to handle submission without `onSubmit` and `preventDefault`.

## Requirements

1. Create an async function that accepts `FormData`
2. Pass it to `<form action={fn}>`
3. Extract data from `FormData` (name, email)
4. Display the result after "submission"

## Checklist

- [ ] The form uses `action={asyncFunction}` instead of `onSubmit`
- [ ] The function accepts `FormData`
- [ ] Data is extracted via `formData.get()`
- [ ] The result is displayed after submission

## How to Verify

1. Fill in the form fields
2. Click "Submit"
3. The data is displayed on the page
