# Task 3.3: `<Stepper>` Component — wizard pattern

## Goal

Implement a multi-step wizard component with a declarative API. The user describes steps declaratively, the component manages navigation between them.

## Requirements

1. Create a `StepperContext` with fields: `currentStep: number`, `totalSteps: number`, functions `next()`, `prev()`, `goTo(step: number)`, flag `isCompleted: boolean`
2. Implement `StepperRoot` — root component; accepts `initialStep?: number` (default 0), `onComplete?: () => void`, `children`; computes `totalSteps` from the count of `Stepper.Step` among children
3. Implement `Stepper.Step` — accepts `title: string`, `children` and optional `stepIndex: number` (set automatically); displayed only when `currentStep === stepIndex`
4. Implement `Stepper.Controls` — navigation button component; shows:
   - "Back" button (disabled on the first step)
   - "Next" / "Finish" button (on the last step — "Finish", on click calls `onComplete`)
5. Implement `Stepper.Progress` — visual progress indicator: list of dots/circles, where current step is highlighted, completed — marked with a check
6. `next()` must not go beyond the last step; `prev()` — beyond the first
7. If `currentStep >= totalSteps`, set `isCompleted = true` and show a success message
8. Assemble `Stepper` via `Object.assign` with sub-components `Step`, `Controls`, `Progress`

## Hints

- To count `totalSteps` and set `stepIndex`, use `React.Children.map` inside `StepperRoot`: clone each `Stepper.Step` via `React.cloneElement`, adding `stepIndex`
- Alternative without cloneElement: store `totalSteps` as a number, and `Stepper.Step` reads context and renders `children` only if `currentStep` matches its position — but then `stepIndex` must be passed explicitly
- `Stepper.Progress` can take `totalSteps` and `currentStep` from context — renders an array via `Array.from({ length: totalSteps })`
- Don't forget to call `onComplete?.()` on "Finish" click — optional call

## Checklist

- [ ] `StepperContext` contains `currentStep`, `totalSteps`, `next`, `prev`, `goTo`, `isCompleted`
- [ ] `StepperRoot` correctly counts the number of steps
- [ ] `Stepper.Step` displays only on its own step
- [ ] `Stepper.Controls`: "Back" button is disabled on the first step
- [ ] `Stepper.Controls`: "Next" → "Finish" on the last step
- [ ] `Stepper.Progress` visually shows the current step
- [ ] After completion, a success message is shown
- [ ] `Stepper` assembled via `Object.assign`

## How to check yourself

Create a Stepper with 3 steps and verify:
- On the first step, the "Back" button is disabled
- Forward/backward navigation works correctly
- On the last step, the button is labeled "Finish"
- After clicking "Finish", a success message appears or `onComplete` fires
- Progress indicator reflects the current step
