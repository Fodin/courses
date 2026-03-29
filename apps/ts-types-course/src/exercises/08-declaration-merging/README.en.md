# 🔥 Level 8: Declaration Merging

## 🎯 Introduction

Declaration merging is a unique TypeScript feature that allows you to **extend existing types** from multiple locations. It's a key mechanism for augmenting third-party libraries, working with global types, and building plugin systems.

Unlike most languages where a type is defined once, TypeScript allows **multiple declarations with the same name**, which are then merged into a single definition.

## 🔥 Interface Merging

### Basic Merging

Multiple declarations of the same interface are automatically combined:

```typescript
interface User {
  id: number
  name: string
}

interface User {
  email: string
  role: string
}

// Merged result — a single interface:
// interface User {
//   id: number
//   name: string
//   email: string
//   role: string
// }

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  role: 'admin'
}
```

### Property Merging Rules

```typescript
interface Config {
  debug: boolean
  version: string
}

interface Config {
  version: string   // ✅ OK — same type
  timeout: number   // ✅ OK — new property
  // debug: string  // ❌ Error — type conflict!
}
```

📌 **Rule**: properties with the same name **must have the same type**. TypeScript doesn't allow redefining an existing property's type.

### Method Merging — Overloads

```typescript
interface Logger {
  log(message: string): void
}

interface Logger {
  log(message: string, level: number): void
  warn(message: string): void
}

// Result: log has two overloads
// Order: later declaration overloads come first
```

### Overload Order During Merging

Priority rules for overloads:

1. Within a single block — original order is preserved
2. Later blocks have **higher priority**
3. **Exception**: overloads with **string literal** parameters are always hoisted to the top

```typescript
interface Processor {
  process(input: string): string       // 3rd priority
  process(input: number): number       // 4th priority
}

interface Processor {
  process(input: 'special'): boolean   // 1st priority (string literal!)
  process(input: boolean): void        // 2nd priority
}
```

### Generic Interface Merging

```typescript
interface Container<T> {
  value: T
  getValue(): T
}

interface Container<T> {
  setValue(newValue: T): void
  isEmpty(): boolean
}

// Both declarations must have the same generic parameters
const box: Container<string> = {
  value: 'hello',
  getValue() { return this.value },
  setValue(v) { this.value = v },
  isEmpty() { return this.value === '' }
}
```

## 🔥 Module Augmentation

### Extending Third-Party Modules

`declare module` lets you add types to an existing module:

```typescript
// In express-augmentation.d.ts or .ts:
import { Request } from 'express'

declare module 'express' {
  interface Request {
    user?: {
      id: string
      role: string
    }
  }
}

// Now in your code:
// app.get('/profile', (req, res) => {
//   req.user?.id  // ✅ TypeScript knows about user
// })
```

### Extending Built-in Types

```typescript
// Add a method to all arrays
declare global {
  interface Array<T> {
    unique(): T[]
  }
}

// Implementation
Array.prototype.unique = function<T>(this: T[]): T[] {
  return [...new Set(this)]
}

// Usage
[1, 2, 2, 3].unique() // [1, 2, 3]
```

### Pattern: Plugin System

```typescript
// Base type
interface PluginRegistry {
  core: { version: string }
}

// Plugin A (in its own file)
declare module './plugins' {
  interface PluginRegistry {
    auth: { login(user: string): boolean }
  }
}

// Plugin B (in its own file)
declare module './plugins' {
  interface PluginRegistry {
    analytics: { track(event: string): void }
  }
}

// Final type contains all plugins
type AllPlugins = PluginRegistry
// { core: ..., auth: ..., analytics: ... }
```

### Module Augmentation Limitations

1. Cannot add **new top-level exports** — only extend existing interfaces/namespaces
2. The augmenting file **must be a module** (contain `import` or `export`)
3. Augmentation must reference a specific module by name

```typescript
// ❌ Doesn't work — can't add a new export
declare module 'express' {
  export function newHelper(): void // Error
}

// ✅ Works — extending an existing interface
declare module 'express' {
  interface Request {
    customField: string
  }
}
```

## 🔥 Ambient Declarations

### The declare Keyword

`declare` tells TypeScript about types that exist at runtime but are defined outside TypeScript:

```typescript
// Global variables injected by bundler
declare const __VERSION__: string
declare const __DEV__: boolean
declare const process: {
  env: Record<string, string | undefined>
}

// Global functions
declare function require(path: string): unknown
declare function setTimeout(cb: () => void, ms: number): number
```

### .d.ts Files

Files with the `.d.ts` extension contain **only type declarations**, no implementations:

```typescript
// types/api.d.ts
declare namespace API {
  interface User {
    id: number
    name: string
    email: string
  }

  interface Response<T> {
    data: T
    status: number
    error?: string
  }

  function fetchUser(id: number): Promise<Response<User>>
}
```

### Namespace Merging

Namespaces with the same name automatically merge:

```typescript
namespace MathUtils {
  export function add(a: number, b: number): number {
    return a + b
  }
}

namespace MathUtils {
  export function multiply(a: number, b: number): number {
    return a * b
  }
  export const PI = 3.14159
}

// MathUtils contains add, multiply, PI
MathUtils.add(2, 3)     // 5
MathUtils.multiply(4, 5) // 20
MathUtils.PI             // 3.14159
```

### Enum + Namespace Merging

A namespace can extend an enum with static methods:

```typescript
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE'
}

namespace Color {
  export function fromHex(hex: string): Color {
    const map: Record<string, Color> = {
      '#FF0000': Color.Red,
      '#00FF00': Color.Green,
      '#0000FF': Color.Blue
    }
    return map[hex] ?? Color.Red
  }
}

Color.fromHex('#00FF00') // Color.Green
```

### Class + Namespace Merging

A namespace can add static properties and nested types to a class:

```typescript
class Validator {
  validate(input: string): boolean {
    return input.length > 0
  }
}

namespace Validator {
  export interface Options {
    strict: boolean
    maxLength: number
  }

  export const defaults: Options = {
    strict: false,
    maxLength: 255
  }

  export function create(options?: Partial<Options>): Validator {
    return new Validator()
  }
}

// Validator is both a class and a namespace
const v = Validator.create({ strict: true })
const opts: Validator.Options = Validator.defaults
```

### Global Augmentation

To add types to the global scope from a module:

```typescript
// File must be a module (have import/export)
export {}

declare global {
  interface Window {
    analytics: {
      track(event: string): void
      identify(userId: string): void
    }
  }

  var __APP_VERSION__: string

  // Extending existing global interfaces
  interface ObjectConstructor {
    keys<T extends object>(obj: T): Array<keyof T>
  }
}
```

### Triple-Slash Directives

Special comments for managing type inclusion:

```typescript
/// <reference path="./globals.d.ts" />   // include file
/// <reference types="node" />             // include @types/node
/// <reference lib="es2022" />             // include lib.es2022
```

## 🔥 Merging Compatibility Table

| Declaration 1 | Declaration 2 | Merge? |
|--------------|--------------|--------|
| Interface | Interface | ✅ Yes |
| Namespace | Namespace | ✅ Yes |
| Class | Namespace | ✅ Yes |
| Enum | Namespace | ✅ Yes |
| Function | Namespace | ✅ Yes |
| Class | Class | ❌ No |
| Type Alias | Type Alias | ❌ No |
| Enum | Enum | ❌ No |

📌 **Important**: `type` aliases never merge. This is one reason to prefer `interface` over `type` when extensibility is needed.

## ⚠️ Common Beginner Mistakes

### Mistake 1: Type conflict during merging

```typescript
// ❌ Property types must match during merging
interface Config {
  port: number
}

interface Config {
  port: string // Error: Subsequent property declarations
               // must have the same type
}

// ✅ Use a union type in the first declaration
interface Config {
  port: number | string
}
```

### Mistake 2: Forgetting export in declare global

```typescript
// ❌ Without export the file is not a module
declare global {
  interface Window {
    myApp: unknown
  }
}

// ✅ Add export to make the file a module
export {}

declare global {
  interface Window {
    myApp: unknown
  }
}
```

### Mistake 3: Trying to merge type aliases

```typescript
// ❌ Type aliases don't merge!
type Config = { debug: boolean }
type Config = { timeout: number } // Error: Duplicate identifier

// ✅ Use interface for merging
interface Config { debug: boolean }
interface Config { timeout: number } // OK
```

### Mistake 4: Module augmentation in a non-module file

```typescript
// ❌ File without import/export is a global script
declare module 'express' {
  interface Request { user?: unknown }
}

// ✅ Make the file a module
import 'express'

declare module 'express' {
  interface Request { user?: unknown }
}
```

## 📌 Summary

Declaration merging is a powerful tool for:
- **Extending third-party libraries** without forking
- **Plugin systems** with type-safe registries
- **Ambient declarations** for describing external code
- **Namespace merging** for code organization

💡 Use `interface` instead of `type` when you need extensibility through merging. Remember that `declare module` requires a module file, and properties must match types during merging.
