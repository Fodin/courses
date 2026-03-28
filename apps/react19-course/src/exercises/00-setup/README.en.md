# Level 0: Setup — Upgrading and Breaking Changes

## What's New in React 19

React 19 is a major release that introduces many new features and a number of breaking changes. Key highlights:

- **New `use()` hook** — read promises and contexts with Suspense support
- **Actions** — a new pattern for form handling (`useActionState`, `useFormStatus`)
- **`useOptimistic`** — a hook for optimistic UI updates
- **ref as a regular prop** — no more `forwardRef`
- **ref cleanup functions** — return a cleanup function from a ref callback
- **Document Metadata** — native support for `<title>`, `<meta>`, `<link>` inside components
- **Improved Suspense** — support for async transitions
- **Server Components** and **Server Actions** — server-side components and server-side actions

---

## How to Upgrade to React 19

### Step 1: Update packages

```bash
# npm
npm install react@19 react-dom@19
npm install -D @types/react@19 @types/react-dom@19

# yarn
yarn add react@19 react-dom@19
yarn add -D @types/react@19 @types/react-dom@19

# pnpm
pnpm add react@19 react-dom@19
pnpm add -D @types/react@19 @types/react-dom@19
```

### Step 2: Update related dependencies

- `eslint-plugin-react-hooks` → v5+
- `@testing-library/react` → v16+
- If using Next.js → v15+
- If using React Router → v7+

### Step 3: Run the codemod (recommended)

```bash
npx codemod@latest react/19/migration-recipe
```

---

## react-codemod: Automated Migrations

React provides official codemod scripts for automated migration. They help update your code without manually editing every file.

### What the codemod does:

1. **`ReactDOM.render` → `createRoot`** — updates the entry point
2. **String refs → callback refs / `createRef`** — removes string refs
3. **`defaultProps` → default parameters** — for function components
4. **`forwardRef` → ref as prop** — removes the `forwardRef` wrapper
5. **Legacy Context → `createContext`** — updates deprecated context usage

### How to run:

```bash
# Run the full migration recipe
npx codemod@latest react/19/migration-recipe

# Or run a specific codemod
npx codemod@latest react/19/replace-reactdom-render
npx codemod@latest react/19/replace-string-ref
npx codemod@latest react/19/replace-default-props
```

**Important:** always review the codemod output before committing. Automated migration is not always perfect.

---

## Breaking Changes: Removed APIs

### Components

| Removed | Replacement |
|---------|-------------|
| `defaultProps` for function components | ES6 default parameters |
| `propTypes` | TypeScript |
| String refs (`ref="myRef"`) | `useRef` / callback refs |
| Legacy Context (`contextTypes`, `childContextTypes`) | `createContext` / `useContext` |

### ReactDOM

| Removed | Replacement |
|---------|-------------|
| `ReactDOM.render()` | `createRoot().render()` |
| `ReactDOM.hydrate()` | `hydrateRoot()` |
| `ReactDOM.unmountComponentAtNode()` | `root.unmount()` |
| `ReactDOM.findDOMNode()` | `useRef` |

### Types (TypeScript)

| Removed | Replacement |
|---------|-------------|
| Implicit `children` in `FC` | Explicitly declare `children: ReactNode` |
| `useRef()` without an argument | `useRef(null)` or `useRef(undefined)` |
| `ReactElement` type parameter | Use `ReactElement<P, T>` |

### Other

| Removed | Replacement |
|---------|-------------|
| `react-test-renderer` | `@testing-library/react` |
| `act` from `react-dom/test-utils` | `act` from `react` |
| UMD builds | ESM + CDN (esm.sh) |

---

## New Warnings and Strict Mode

React 19 adds new warnings in Strict Mode:

1. **String ref warning** — React now throws an error instead of a warning
2. **Legacy Context warning** — error instead of a warning
3. **Double effect invocation** — Strict Mode continues to invoke effects twice in dev mode
4. **`key` as prop warning** — accessing `this.props.key` now triggers a warning

---

## Additional Resources

- [React 19 Blog Post](https://react.dev/blog/2024/12/05/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Codemod CLI](https://github.com/codemod-com/codemod)

---

## What's Next?

In the next level you will learn:
- The new JSX transform (required in React 19)
- ref as a regular prop (without `forwardRef`)
- ref cleanup functions
