# Task 5.1: array().of()

## Objective

Learn to create array schemas that validate each element using `array().of()`.

## Requirements

1. Create `tagsSchema` — an array of strings, each string is required (`string().required()`)

2. Create `numbersSchema` — an array of numbers, each number is required and positive

3. Parse input from a text field by comma: `input.split(',').map(s => s.trim())`

4. On success, display the validated array in a green block

5. On error, display the message in a red block

## Checklist

- [ ] `tagsSchema` uses `array().of(string().required())`
- [ ] `numbersSchema` uses `array().of(number().required().positive())`
- [ ] Input is parsed from a string by splitting on commas
- [ ] Empty input is passed as undefined
- [ ] `abortEarly: false` is used for numbers

## How to verify

1. Tags: "react, typescript, yup" — success, shows the array
2. Tags: empty — required error
3. Numbers: "1, 2, 3" — success
4. Numbers: "1, -5, 3" — error "Each number must be positive"
5. Numbers: "1, abc, 3" — error (NaN is not a number)
