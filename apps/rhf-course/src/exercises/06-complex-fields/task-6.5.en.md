# Exercise 6.5: Controller Transform

## Goal

Learn to wrap custom components with non-standard values using Controller.

## Requirements

Create a settings form with three custom components:

1. **Rating** — star rating component (1-5), clicking a star saves a number to the form
2. **Theme color** — palette of 6 color circles, clicking saves a hex string (`#ef4444`)
3. **Notifications** — custom toggle switch, saves a `boolean`
4. Each component is wrapped in `Controller` with the `render` prop
5. Display current form values as JSON for visual feedback
6. Validation: rating >= 1, color is required

## Checklist

- [ ] Stars highlight on hover and click
- [ ] Selected color is highlighted with a border
- [ ] Toggle switches between on/off
- [ ] All values are correctly saved to the form
- [ ] JSON preview updates when any field changes
- [ ] Validation: form does not submit without rating and color

## How to verify

1. Click the 3rd star — rating = 3, JSON updated
2. Click the blue circle — color = `#3b82f6`, JSON updated
3. Click the toggle — notifications = true, JSON updated
4. Click "Save" without selecting a rating — validation error
