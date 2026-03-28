# Task 1.2: Abstract Factory

## Objective

Implement the Abstract Factory pattern to create families of UI components for different themes (Light/Dark).

## Requirements

1. Create a `UIComponent` interface with a `render(): string` method
2. Implement three components per theme (6 classes total):
   - `LightButton` / `DarkButton` — buttons with different styles
   - `LightInput` / `DarkInput` — input fields with different styles
   - `LightCard` / `DarkCard` — cards with different styles
3. Create a `UIFactory` interface with methods:
   - `createButton(label: string): UIComponent`
   - `createInput(placeholder: string): UIComponent`
   - `createCard(title: string, content: string): UIComponent`
4. Implement `LightThemeFactory` and `DarkThemeFactory`
5. Create a function `getFactory(theme: 'light' | 'dark'): UIFactory`

## Checklist

- [ ] Interface `UIComponent` with `render()` is defined
- [ ] 6 component classes (3 per theme) implement `UIComponent`
- [ ] Interface `UIFactory` is defined with three creator methods
- [ ] Two factories implement `UIFactory`
- [ ] All components from one factory are visually consistent
- [ ] Demonstration shows the render output for both themes

## How to verify

1. Click the run button
2. Verify that Light components are visually distinct from Dark components
3. Verify that the factory guarantees all components come from the same theme
4. Try adding a third theme — it should be sufficient to create a new factory
