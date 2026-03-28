# Task 2.3: Conditional use()

## Objective

Demonstrate the unique capability of `use()` — calling it inside a conditional, which is impossible with regular hooks.

## Requirements

1. Create a `UserContext` with user data
2. Create a `Greeting` component that accepts a `showUser: boolean` prop
3. Inside `Greeting`, call `use(UserContext)` **only if** `showUser === true`
4. If `showUser === false`, display the message "Context is not used"
5. Add a button to toggle `showUser`

## Checklist

- [ ] `use(UserContext)` is called inside an `if` block
- [ ] When `showUser = true`, the user's data is displayed
- [ ] When `showUser = false`, the alternative message is displayed
- [ ] The button toggles the state
- [ ] No errors occur when toggling

## How to Verify

1. By default, "Context is not used" is shown
2. After pressing the button, the user data from the context appears
