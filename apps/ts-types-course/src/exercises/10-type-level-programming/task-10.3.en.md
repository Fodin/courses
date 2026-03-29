# Task 10.3: Type-Level Strings

## Goal

Implement advanced operations on string literal types: Split, Join, Replace, ReplaceAll, Trim.

## Requirements

1. Implement `Split<S, D>` — splits a string literal by a delimiter into a tuple of strings
2. Implement `Join<T, D>` — joins a tuple of strings with a delimiter into a single string literal
3. Implement `Replace<S, From, To>` — replaces the first occurrence of a substring
4. Implement `ReplaceAll<S, From, To>` — replaces all occurrences of a substring
5. Implement `TrimLeft<S>`, `TrimRight<S>`, and `Trim<S>` for whitespace removal
6. Show a runtime analog for each type-level operation

## Checklist

- [ ] `Split<"a-b-c", "-">` = `["a", "b", "c"]`
- [ ] `Split<"single", "-">` = `["single"]`
- [ ] `Join<["hello", "world"], "-">` = `"hello-world"`
- [ ] `Replace<"hello world", "world", "TS">` = `"hello TS"`
- [ ] `ReplaceAll<"a-b-c", "-", "_">` = `"a_b_c"`
- [ ] `Trim<"  hello  ">` = `"hello"`
- [ ] Split and Join are inverse operations: `Join<Split<S, D>, D>` = S
- [ ] Compile-time assertions verify results

## How to Verify

1. Check `Split<"", "-">` — should be `[]`
2. Check `Replace` with empty `From` — should return the original string
3. Verify `Trim` handles tabs and newlines
