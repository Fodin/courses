# Task 0.2: React Codemod

## Objective

Create a component that demonstrates typical code patterns that the codemod automatically replaces when migrating to React 19.

## Requirements

1. Create an array of codemod transformation examples (at least 4)
2. For each transformation, show:
   - The transformation name
   - Code **before** (React 18)
   - Code **after** (React 19)
3. Add navigation between examples (buttons or tabs)
4. Show the command to run the codemod

## Transformation Examples

| Before (React 18) | After (React 19) |
|-------------------|------------------|
| `ReactDOM.render(<App />, el)` | `createRoot(el).render(<App />)` |
| String ref: `ref="myInput"` | `createRef()` / `useRef` |
| `Button.defaultProps = { color: 'blue' }` | `function Button({ color = 'blue' })` |
| `forwardRef((props, ref) => ...)` | `function Comp({ ref, ...props })` |

## Hints

- Use `useState` to track the active example
- Store example code as strings in an array of objects
- Use `<pre>` to display code

## Checklist

- [ ] At least 4 transformation examples
- [ ] Navigation between examples
- [ ] "Before" and "after" code for each example
- [ ] Command to run the codemod
