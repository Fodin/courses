# Task 1.4: Type Guards for Errors

## Goal

Learn to write type guards for safe error handling in TypeScript.

## Requirements

1. Write a type guard `isError(value: unknown): value is Error`
2. Write a type guard `isApiError(value)` for objects of the form `{ error: { code, message } }`
3. Write a type guard `isErrorWithCode(error)` for errors with a `code` field
4. Create a `getErrorMessage(error: unknown): string` function that:
   - For `Error` returns `error.message`
   - For API error returns `[code] message`
   - For a string returns the string itself
   - For everything else returns `"Unknown error"`
5. Test it on an array of different values

## Checklist

- [ ] `isError` correctly identifies `Error`
- [ ] `isApiError` correctly identifies API errors
- [ ] `isErrorWithCode` checks for `code` field presence
- [ ] `getErrorMessage` handles all cases
- [ ] Test results on the page
