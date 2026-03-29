# Task 4.3: Infer in Template Literals

## Goal

Learn to parse string types using `infer` and template literal types to extract structured data from strings at the type level.

## Requirements

1. Create an `ExtractDomain<T>` type that extracts the domain from an email string (`'user@example.com'` -> `'example.com'`)
2. Create a `ParseRoute<T>` type that extracts route parameter names (`'/users/:userId/posts/:postId'` -> `'userId' | 'postId'`)
3. Create a `Split<S, D>` type that splits a string by delimiter into a tuple (`'a.b.c'` with `'.'` -> `['a', 'b', 'c']`)
4. Create a `KebabToCamel<S>` type that converts kebab-case to camelCase (`'get-user-by-id'` -> `'getUserById'`)
5. Create a `ParseQuery<T>` type that extracts query parameter keys from a URL string (`'page=1&limit=10'` -> `'page' | 'limit'`)

## Checklist

- [ ] `ExtractDomain` correctly extracts domain from email
- [ ] `ParseRoute` recursively finds all `:param` in a route
- [ ] `Split` returns a tuple of string parts
- [ ] `KebabToCamel` recursively handles all hyphens
- [ ] `ParseQuery` extracts keys from a query parameter string

## How to verify

1. Click the "Run" button
2. Verify that `ParseRoute` finds all parameters in a complex route
3. Verify that `KebabToCamel` correctly converts strings with multiple hyphens
4. Check that `Split` returns a tuple of the correct length
