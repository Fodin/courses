// Cheat sheet for Level 12: React Compiler — Automatic Memoization

// ─── Task 12.1: Manual vs Compiler ───────────────────────────────────────────
//
// useMemoCache pattern (what the compiler generates):
//
//   const $ref = useRef<unknown[]>(null as unknown as unknown[])
//   if ($ref.current === null) {
//     $ref.current = new Array(N).fill(Symbol('cache'))
//   }
//   const $ = $ref.current
//
//   // Check-and-update pattern per scope:
//   let formattedPrice: string
//   if ($[0] !== product.price) {
//     formattedPrice = formatPrice(product.price)
//     $[0] = product.price   // store dep
//     $[1] = formattedPrice  // store value
//   } else {
//     formattedPrice = $[1] as string  // read from cache
//   }
//
// ManualProductCard: wrap with React.memo
//   const ManualProductCard = memo(function ManualProductCard({ product, onAddToCart }) { ... })
//
// Tracking what changed (for cache panel display):
//   const prevPrice = useRef<number | undefined>(undefined)
//   const priceChanged = prevPrice.current !== product.price
//   // ... after computing all values:
//   prevPrice.current = product.price
//
// React.memo vs useMemoCache behaviour difference:
//   React.memo:       child does NOT render at all (skip function call)
//   useMemoCache:     child DOES render (function called), but JSX is from cache
//   → render counter grows for useMemoCache even when output is same

// ─── Task 12.2: Rules of React ───────────────────────────────────────────────
//
// Component A fix (mutation):
//   // ❌ items.push('extra')  — mutates prop
//   // ✅ const list = [...items, 'extra']  — copy first
//
// Component B fix (Date.now() key):
//   // ❌ key={Date.now()}
//   // ✅ key={idx} or key={event.id} — stable identifier
//
// Component C fix (ref.current in render):
//   // ❌ <div>{counterRef.current}</div>  — stale, no re-render on change
//   // ✅ use useState + useEffect:
//   const [count, setCount] = useState(0)
//   useEffect(() => {
//     const id = setInterval(() => setCount(c => c + 1), 1000)
//     return () => clearInterval(id)
//   }, [])
//   return <div>{count}</div>
//
// Rules of React checklist:
//   ✅ Pure render: same props+state → same output
//   ✅ No side effects in render (no console.log, no fetch, no DOM mutation)
//   ✅ Immutable props/state: never mutate, always create copies
//   ✅ Stable output: no Date.now(), Math.random() in render
//   ✅ No ref.current reads for display (only for imperative operations)

// ─── Task 12.3: Compiler Output Analysis ─────────────────────────────────────
//
// useMemoCache cell layout pattern:
//   Scope deps come BEFORE scope value in the array.
//   Deps can be REUSED across scopes if they reference the same value.
//
//   Example: UserProfile with 7 cells
//   $[0] = user.firstName (dep for fullName)
//   $[1] = user.lastName  (dep for fullName)
//   $[2] = fullName       (value)
//   $[3] = user.id        (dep for avatar AND handleFollow — shared!)
//   $[4] = avatar         (value)
//   $[5] = onFollow       (dep for handleFollow)
//   $[6] = handleFollow   (value)
//
// Early return and scope ordering:
//   Compiler places ALL reactive scopes BEFORE early returns.
//   Why: if early return is taken (e.g. data.hidden = true), cached deps must still be updated.
//   Otherwise: when data.hidden flips back to false, handleAction would be a stale closure.
//
// inline onClick in .map():
//   () => onRowClick(r.id)  — depends on r.id from map closure
//   Compiler cannot extract this to a stable callback (different r per iteration)
//   Solution: cache the whole JSX as a unit (deps: [filtered, onRowClick])
//   Better approach manually: useCallback outside map + pass row.id to it

// ─── compilation pipeline mental model ───────────────────────────────────────
//
// Source → AST (Babel parser)
//        → HIR (flatten control flow: ternary → explicit if blocks)
//        → ReactiveScopes (build dependency graph per variable)
//        → Codegen (emit useMemoCache + if-check blocks)
//
// HIR flattening example:
//   const color = type === 'error' ? 'red' : 'blue'
//   becomes in HIR:
//     cond = (type === 'error')
//     if cond: color_a = 'red'
//     else:    color_b = 'blue'
//     color = phi(color_a, color_b)
//   → compiler creates deps: [type] for color scope

export {}
