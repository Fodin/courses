# Task 9.3: Recursive String Types

## Goal

Learn to parse and transform string literal types using recursion: Split, Join, ReplaceAll, CamelCase, KebabCase, Trim, StringLength, PathKeys.

## Requirements

1. Implement `Split<S, D>` — splits a string by delimiter into a tuple (handle empty string)
2. Implement `Join<T, D>` — joins a string tuple into a string with delimiter
3. Implement `ReplaceAll<S, From, To>` — recursively replaces all occurrences of a substring
4. Implement `CamelCase<S>` — converts `snake_case` to `camelCase`
5. Implement `KebabCase<S>` — converts `camelCase` to `kebab-case`
6. Implement `Trim<S>` via `TrimLeft` and `TrimRight` — removes spaces from edges
7. Implement `StringLength<S>` — computes string length via recursion with accumulator
8. Implement `PathKeys<T>` — generates all dot-notation paths for a nested object

## Checklist

- [ ] `Split<'a.b.c', '.'>` returns `['a', 'b', 'c']`
- [ ] `Join<['a', 'b'], '-'>` returns `'a-b'`
- [ ] `ReplaceAll` replaces all occurrences, not just the first
- [ ] `CamelCase<'user_first_name'>` = `'userFirstName'`
- [ ] `KebabCase<'helloWorld'>` = `'hello-world'`
- [ ] `Trim<'  hello  '>` = `'hello'`
- [ ] `StringLength<'hello'>` = `5`
- [ ] `PathKeys` generates all paths including nested ones
- [ ] Results displayed on the page

## How to verify

1. Click the "Run" button
2. Verify all string transformations are correct
3. Check that `PathKeys<Config>` includes nested paths like `'server.host'`
4. Verify that `Split<'', '.'>` returns an empty array, not `['']`
