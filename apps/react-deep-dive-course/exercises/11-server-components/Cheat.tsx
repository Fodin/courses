// Cheat sheet for Level 11: Server Components — Streaming and RSC Protocol

// ─── Task 11.1: RSC Payload Parser ───────────────────────────────────────────
//
// Parsing a payload line: "<id>:<typeChar><data>"
//
//   function parsePayloadLine(line: string): PayloadRow | null {
//     const colonIdx = line.indexOf(':')
//     if (colonIdx === -1) return null
//     const id       = line.slice(0, colonIdx)
//     const rest     = line.slice(colonIdx + 1)
//     const typeChar = rest[0]
//     const data     = rest.slice(1)
//
//     try {
//       if (typeChar === 'I') {
//         const parsed = JSON.parse(data)
//         return { id, type: 'I', chunk: parsed.chunk, name: parsed.name }
//       }
//       if (typeChar === 'J') {
//         return { id, type: 'J', element: JSON.parse(data) }
//       }
//       if (typeChar === 'S') {
//         return { id, type: 'S', token: data.replace(/^"|"$/g, '') }
//       }
//       if (typeChar === 'P') {
//         return { id, type: 'P', placeholder: true }
//       }
//     } catch { /* ignore parse errors */ }
//     return { id, type: 'unknown', raw: line }
//   }
//
// Suspense detection in J rows:
//   const typeName = String(el.type ?? '')
//   if (typeName === '$0' || typeName.startsWith('$0')) → render as Suspense boundary
//
// Step-by-step mode:
//   const [visibleCount, setVisibleCount] = useState(0)
//   const visible = parsedRows.slice(0, visibleCount)
//   <button onClick={() => setVisibleCount(c => Math.min(c + 1, parsedRows.length))}>
//     Следующий чанк
//   </button>

// ─── Task 11.2: Streaming Simulator ──────────────────────────────────────────
//
// Key: store timer IDs in a ref for cleanup:
//   const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
//   const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = [] }
//   useEffect(() => () => clearTimers(), [])
//
// Scheduling per section (delay = ms from start):
//   const t1 = setTimeout(() => {
//     setStatuses(prev => ({ ...prev, [section.id]: 'loading' }))
//     addLog(startTime, `chunk: ${section.label} (получен)`)
//   }, section.delay)
//   const t2 = setTimeout(() => {
//     setStatuses(prev => ({ ...prev, [section.id]: 'ready' }))
//   }, section.delay + 400)
//   timersRef.current.push(t1, t2)
//
// Shimmer CSS:
//   @keyframes shimmer {
//     0%   { background-position: -400px 0; }
//     100% { background-position:  400px 0; }
//   }
//   style={{ background: 'linear-gradient(90deg,#e2e8f0 25%,#cbd5e1 50%,#e2e8f0 75%)',
//            backgroundSize: '400px 100%', animation: 'shimmer 1.2s infinite linear' }}
//
// Progress bar (readyCount / total * 100):
//   const readyCount = SECTIONS.filter(s => statuses[s.id] === 'ready').length
//   <div style={{ width: `${readyCount / SECTIONS.length * 100}%`, transition: 'width 400ms ease' }} />
//
// Log with relative timestamps:
//   const startRef = useRef(0)   // set to Date.now() on startStreaming
//   const addLog = (text: string) => {
//     const elapsed = Date.now() - startRef.current
//     setLog(prev => [...prev, { time: elapsed, text }])
//   }

// ─── Task 11.3: Selective Hydration ──────────────────────────────────────────
//
// SectionState:
//   { status: 'static' | 'hydrating' | 'hydrated'; isPriority: boolean; progress: number }
//
// hydrateSection using setInterval for smooth progress:
//   const hydrateSection = (id, cost, isPriority, onDone) => {
//     activeRef.current = id
//     const startProgress = Date.now()
//     setSectionStates(prev => ({ ...prev, [id]: { ...prev[id], status: 'hydrating', isPriority, progress: 0 } }))
//
//     const iv = setInterval(() => {
//       const elapsed = Date.now() - startProgress
//       const pct = Math.min(Math.round((elapsed / cost) * 100), 99)
//       setSectionStates(prev => ({ ...prev, [id]: { ...prev[id], progress: pct } }))
//     }, 50)
//     intervalsRef.current.push(iv)
//
//     const t = setTimeout(() => {
//       clearInterval(iv)
//       activeRef.current = null
//       setSectionStates(prev => ({ ...prev, [id]: { ...prev[id], status: 'hydrated', progress: 100 } }))
//       addLog(`${id} гидрирован ✓`)
//       onDone()
//     }, cost)
//     timersRef.current.push(t)
//   }
//
// Priority queue (selective mode):
//   const priorityQueueRef = useRef<string[]>([])
//
//   handlePriorityClick = (id) => {
//     if (!running || sectionStates[id].status === 'hydrated') return
//     if (!priorityQueueRef.current.includes(id)) {
//       priorityQueueRef.current.unshift(id)  // push to front
//       addLog(`Клик на ${id} → приоритет!`)
//     }
//   }
//
//   hydrateNext = () => {
//     const priorityId = priorityQueueRef.current.shift()
//     if (priorityId) {
//       const sec = SECTIONS.find(s => s.id === priorityId)!
//       hydrateSection(sec.id, Math.round(sec.baseCost * 0.3), true, hydrateNext)
//       return
//     }
//     // get next from bgQueue that hasn't been hydrated yet
//     while (bgQueue.length) {
//       const sec = bgQueue.shift()!
//       if (currentStatus(sec.id) === 'hydrated') continue  // already done by priority
//       hydrateSection(sec.id, sec.baseCost, false, hydrateNext)
//       return
//     }
//     setRunning(false)
//   }
//
// Pulse animation for hydrating state:
//   @keyframes sel-pulse {
//     0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
//     50%       { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
//   }
//
// IMPORTANT: bgQueue must be a snapshot of sections at start time (not a ref to SECTIONS),
// because we shift() from it during hydration. Use: const bgQueue = [...SECTIONS]
// inside runSelective(), captured in closure.

// ─── RSC wire format mental model ────────────────────────────────────────────
//
// Line format:   <id> ":" <typeChar> <data>
//
// I (Import):    1:I{"chunk":"client-abc.js","name":"Counter"}
//                → React lazy loads the chunk, creates client reference
//
// J (JSON el):   2:J{"type":"div","props":{"className":"app"},"children":"..."}
//                → Directly becomes React.createElement output
//
// S (String):    0:S"react.suspense"
//                → Used as type reference: "$0" in J rows points to row 0's token
//
// P (Pending):   7:P
//                → Placeholder: React Suspense boundary waiting for this chunk
//                → Later resolved by: 7:J{...actual content...}
//
// References in data:
//   "$<id>"  → reference to another row's value
//   "$L<id>" → lazy reference to a client module (from an I row)
//   "$P<id>" → pending reference (from a P row, resolved later)

export {}
