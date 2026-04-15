// Cheat sheet for Level 10: Concurrent React — Transitions and Suspense internals

// ─── Task 10.1: createResource pattern ───────────────────────────────────────
//
// The resource wraps a Promise and exposes a read() method.
// KEY: the same promise object must be thrown every time (not a new one).
//
//   function createResource<T>(promise: Promise<T>) {
//     let status: 'pending' | 'fulfilled' | 'rejected' = 'pending'
//     let value: T
//     let error: unknown
//
//     // "suspender" is the same object on every read() call
//     const suspender = promise.then(
//       v => { status = 'fulfilled'; value = v },
//       e => { status = 'rejected'; error = e },
//     )
//
//     return {
//       read(): T {
//         if (status === 'pending')  throw suspender   // React catches this
//         if (status === 'rejected') throw error        // ErrorBoundary catches this
//         return value
//       },
//     }
//   }
//
// MiniSuspense — must be a CLASS component (Error boundaries only work as classes):
//
//   class MiniSuspense extends Component<Props, { caught: unknown | null }> {
//     state = { caught: null }
//
//     static getDerivedStateFromError(error: unknown) {
//       return { caught: error }           // set caught = the thrown Promise
//     }
//
//     componentDidCatch(error: unknown) {
//       if (error instanceof Promise) {
//         error.then(() => this.setState({ caught: null }))  // re-render on resolve
//       }
//     }
//
//     render() {
//       if (this.state.caught instanceof Promise) return this.props.fallback
//       if (this.state.caught) return <div>Error: {String(this.state.caught)}</div>
//       return this.props.children
//     }
//   }
//
// DataDisplay calls resource.read() in its body:
//   function DataDisplay({ resource }) {
//     const data = resource.read()   // throws Promise if pending
//     return <div>{data.name}</div>
//   }

// ─── Task 10.2: startTransition pattern ──────────────────────────────────────
//
// Key insight: split onChange into TWO updates:
//   1. setQuery(q)               — sync, keeps input value current
//   2. startTransition(() => {   — interruptible, React can abort if new input arrives
//        setResults(filter(q))
//      })
//
//   const [isPending, startTransition] = useTransition()
//
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const q = e.target.value
//     setQuery(q)                                             // always sync
//     startTransition(() => setResults(filterItems(ALL, q))) // transition lane
//   }
//
// FPS monitor with requestAnimationFrame:
//   useEffect(() => {
//     let animId: number
//     let lastTime = performance.now()
//     let frameCount = 0
//     const tick = (now: number) => {
//       frameCount++
//       if (now - lastTime >= 300) {
//         setFps(Math.round(frameCount / (now - lastTime) * 1000))
//         frameCount = 0
//         lastTime = now
//       }
//       animId = requestAnimationFrame(tick)
//     }
//     animId = requestAnimationFrame(tick)
//     return () => cancelAnimationFrame(animId)
//   }, [])

// ─── Task 10.3: Waterfall vs Parallel ────────────────────────────────────────
//
// Waterfall — posts resource created INSIDE WaterfallProfile (after profile.read()):
//   function WaterfallProfile({ profileResource }) {
//     const profile = profileResource.read()          // suspend here first
//     const [postsResource] = useState(() =>          // posts fetch starts only NOW
//       createResource(fetchPosts(profile.id))
//     )
//     return (
//       <>
//         <ProfileCard profile={profile} />
//         <MiniSuspense fallback={<SkeletonPosts />}>
//           <PostsList resource={postsResource} />
//         </MiniSuspense>
//       </>
//     )
//   }
//
// Parallel — both resources created in the PARENT simultaneously:
//   function ParallelScenario() {
//     const handleLoad = () => {
//       setResources({
//         profile: createResource(fetchProfile('1')),  // starts immediately
//         posts:   createResource(fetchPosts('1')),    // starts immediately (parallel!)
//       })
//     }
//     // Both components suspend concurrently, resolved in ~max(1200, 800) = 1200ms
//   }
//
// Measuring time:
//   const startRef = useRef(Date.now())
//   // In the last child's useEffect:
//   useEffect(() => {
//     setElapsed(Date.now() - startRef.current)
//   }, [])

// ─── Task 10.4: Tree walk with interruption ───────────────────────────────────
//
// Use refs to track running state (not useState — avoids async issues):
//   const isRunningRef = useRef(false)           // sync walk in progress
//   const isTransitionRunningRef = useRef(false) // transition walk in progress
//   const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
//
//   const clearTimeouts = () => {
//     timeoutsRef.current.forEach(clearTimeout)
//     timeoutsRef.current = []
//   }
//
// Sync walk (cannot be interrupted):
//   if (isRunningRef.current) return   // ignore new clicks
//   isRunningRef.current = true
//   DFS_ORDER.forEach((id, i) => {
//     const t1 = setTimeout(() => setNodeStates(s => ({ ...s, [id]: 'processing' })), i * 80)
//     const t2 = setTimeout(() => setNodeStates(s => ({ ...s, [id]: 'sync-done'  })), i * 80 + 60)
//     timeoutsRef.current.push(t1, t2)
//   })
//
// Transition walk (can be interrupted by sync):
//   if (isRunningRef.current) return   // don't start during sync
//   isTransitionRunningRef.current = true
//   DFS_ORDER.forEach((id, i) => {
//     const t1 = setTimeout(() => {
//       if (!isTransitionRunningRef.current) return   // ← check before each step
//       setNodeStates(s => ({ ...s, [id]: 'processing' }))
//     }, i * 150)
//     const t2 = setTimeout(() => {
//       if (!isTransitionRunningRef.current) return
//       setNodeStates(s => ({ ...s, [id]: 'transition-done' }))
//     }, i * 150 + 110)
//     timeoutsRef.current.push(t1, t2)
//   })
//
// When sync starts during transition:
//   clearTimeouts()
//   isTransitionRunningRef.current = false
//   setNodeStates(prev => {
//     const next = { ...prev }
//     TREE_NODES.forEach(n => {
//       if (next[n.id] === 'idle' || next[n.id] === 'processing') {
//         next[n.id] = 'interrupted'
//       }
//     })
//     return next
//   })
//   // then start sync walk

// ─── Mental model ─────────────────────────────────────────────────────────────
//
// Suspense thrown promise:
//   component.render() → throw promise P
//         ↓
//   React catches P in throwException()
//         ↓
//   Finds nearest SuspenseFiber in the return path
//         ↓
//   Re-renders SuspenseFiber with showFallback = true
//         ↓
//   P.then(ping) → when P resolves, schedules new render
//         ↓
//   component.render() → resource.read() returns value → renders normally
//
// startTransition → TransitionLane → workLoopConcurrent → shouldYield() → prune
// No startTransition → SyncLane → workLoopSync → no yield → blocking

export {}
