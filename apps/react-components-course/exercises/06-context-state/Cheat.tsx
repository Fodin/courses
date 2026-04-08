// ============================================
// Level 6: Hints — Context + State Management
// Подсказки: Level 6 — Context + State Management
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Hints: Level 6 — Context + State Management</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Task 6.1: Cart with useReducer</h3>
        {/* Задание 6.1: Корзина с useReducer */}
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>cartReducer, case ADD:</strong> first find the item by id.
            If found — <code>map</code> + increase quantity. If not — spread into a new array with <code>quantity: 1</code>
          </li>
          <li>
            <strong>cartReducer, case DECREMENT:</strong> first <code>map</code> (decrease quantity), then
            <code>.filter(i =&gt; i.quantity &gt; 0)</code> — in one chain
          </li>
          <li>
            <strong>Two contexts:</strong> <code>CartStateContext</code> holds the state object,
            <code>CartDispatchContext</code> holds the dispatch function. Provider wraps both nested
          </li>
          <li>
            <strong>useCartState / useCartDispatch:</strong> check for null and throw
            <code>new Error('useCartState must be inside CartProvider')</code>
          </li>
          <li>
            <strong>CartBadge:</strong> use only <code>useCartState()</code>. Sum quantity via
            <code>items.reduce((sum, i) =&gt; sum + i.quantity, 0)</code>
          </li>
          <li>
            <strong>CartDrawer:</strong> positioning — <code>position: 'fixed', top: 0, right: 0, bottom: 0, width: 320</code>.
            "Checkout" button dispatches <code>{'{'} type: 'CLEAR' {'}'}</code>
          </li>
          <li>
            Calculate total: <code>items.reduce((sum, i) =&gt; sum + i.price * i.quantity, 0)</code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Task 6.2: Notification System</h3>
        {/* Задание 6.2: Система нотификаций */}
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Unique ID:</strong> <code>{"`notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`"}</code>
          </li>
          <li>
            <strong>timersRef:</strong> <code>useRef&lt;Map&lt;string, ReturnType&lt;typeof setTimeout&gt;&gt;&gt;(new Map())</code>
          </li>
          <li>
            <strong>dismiss:</strong> wrap in <code>useCallback(fn, [])</code>. Inside:
            <code>setNotifications(prev =&gt; prev.filter(n =&gt; n.id !== id))</code>, then <code>clearTimeout</code> and <code>timersRef.current.delete(id)</code>
          </li>
          <li>
            <strong>notify:</strong> wrap in <code>useCallback(fn, [dismiss])</code>. If duration &gt; 0 — save the timer:
            <code>timersRef.current.set(id, setTimeout(() =&gt; dismiss(id), duration))</code>
          </li>
          <li>
            <strong>Cleanup on unmount:</strong> <code>useEffect(() =&gt; {'{'} const timers = timersRef.current; return () =&gt; timers.forEach(clearTimeout) {'}'}, [])</code>
          </li>
          <li>
            <strong>NotificationContainer</strong> render inside Provider, after <code>{'{children}'}</code>
          </li>
          <li>
            Each type — its own object <code>{'{'} bg, border, icon {'}'}</code>. Convenient to store in a dictionary object
            <code>{'`'}const COLORS: Record{'<'}Notification['type'], T{'>'} = {'{'} info: ..., success: ... {'}'}{'`'}</code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Task 6.3: createStore</h3>
        {/* Задание 6.3: createStore */}
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>createStore inside:</strong> call <code>createContext</code> twice. Each <code>createStore</code> call
            creates a new independent pair of contexts — this is normal
          </li>
          <li>
            <strong>Provider:</strong> declare as <code>const Provider: React.FC&lt;...&gt; = ({'{'} children {'}'}) =&gt; {'{'} ... {'}'}</code> —
            exactly this way, not <code>function Provider</code>, so TypeScript infers the type correctly
          </li>
          <li>
            <strong>useStore with selector:</strong> <code>function useStore&lt;R&gt;(selector: (state: S) =&gt; R): R {'{'} return selector(useContext(StateCtx)) {'}'}</code>
          </li>
          <li>
            <strong>TodoList with filtering via selector:</strong><br />
            <code>const visible = useTodoStore(s =&gt; s.filter === 'active' ? s.todos.filter(t =&gt; !t.done) : ...)</code>
          </li>
          <li>
            <strong>TodoStats:</strong> three separate <code>useTodoStore</code> calls with different selectors — this is fine
          </li>
          <li>
            <strong>TodoAddForm:</strong> use only <code>useTodoDispatch()</code>. Local state for the input field via <code>useState</code>
          </li>
          <li>
            <strong>Add form:</strong> handle via <code>onSubmit</code> with <code>e.preventDefault()</code>,
            check <code>text.trim()</code> before dispatch
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#388e3c' }}>General Tips for This Level / Общие советы по уровню</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Dispatch is stable:</strong> <code>React.Dispatch</code> from <code>useReducer</code> never changes its reference.
            This allows safely passing it in <code>useCallback</code> dependencies
          </li>
          <li>
            <strong>State via updater function:</strong> in <code>useCallback</code> with empty dependencies
            use <code>setState(prev =&gt; newState)</code> instead of direct state read — this avoids stale closure
          </li>
          <li>
            <strong>Don't create an object in Provider value:</strong> <code>value={'{'}{'{'}state, dispatch{'}'}{'}'}</code> creates a new object on every render.
            Split into two Providers or wrap in <code>useMemo</code>
          </li>
          <li>
            TypeScript: use <code>Omit&lt;CartItem, 'quantity'&gt;</code> for catalog item type —
            quantity appears only in the cart
          </li>
        </ul>
      </section>
    </div>
  )
}
