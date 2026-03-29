# Task 3.3: Template Literal Parsing

## Goal

Learn to parse string types using template literals and `infer`: splitting strings, extracting route parameters, creating a type-safe route builder.

## Requirements

1. Implement type `Split<S, D>` — splits a string into a tuple by delimiter. Create a runtime function
2. Implement type `Join<T, D>` — joins a tuple of strings into one string with a delimiter
3. Implement type `ParseRouteParams<S>` — extracts parameter names from a URL template (`:param`). Create a runtime `extractRouteParams` function
4. Implement a type-safe `buildRoute(template, params)` function that substitutes parameters into a URL template
5. Implement types `TrimStart<S>`, `TrimEnd<S>`, `Trim<S>` for removing whitespace
6. Implement type `ExtractDomain<S>` for extracting the domain from an email address

## Checklist

- [ ] `Split<'a.b.c', '.'>` resolves to `['a', 'b', 'c']`
- [ ] `Join<['x', 'y'], '-'>` resolves to `'x-y'`
- [ ] `ParseRouteParams<'/users/:id/posts/:postId'>` resolves to `'id' | 'postId'`
- [ ] `buildRoute` correctly substitutes parameters into the template
- [ ] `Trim<'  hello  '>` resolves to `'hello'`
- [ ] `ExtractDomain<'user@example.com'>` resolves to `'example.com'`

## How to Verify

1. Check Split for strings with 1, 2, and 3+ delimiters
2. Call buildRoute with a route containing 2-3 parameters
3. Test Trim for strings with spaces only on the left, only on the right, and on both sides
