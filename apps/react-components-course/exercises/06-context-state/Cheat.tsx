export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 6 — Context + State Management</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Задание 6.1: Корзина с useReducer</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>cartReducer, case ADD:</strong> сначала ищем товар по id.
            Если нашли — <code>map</code> + увеличиваем quantity. Если нет — спредим в новый массив с <code>quantity: 1</code>
          </li>
          <li>
            <strong>cartReducer, case DECREMENT:</strong> сначала <code>map</code> (уменьшаем quantity), затем
            <code>.filter(i =&gt; i.quantity &gt; 0)</code> — одной цепочкой
          </li>
          <li>
            <strong>Два контекста:</strong> <code>CartStateContext</code> хранит объект state,
            <code>CartDispatchContext</code> хранит функцию dispatch. Provider оборачивает оба вложенно
          </li>
          <li>
            <strong>useCartState / useCartDispatch:</strong> проверяйте на null и бросайте
            <code>new Error('useCartState must be inside CartProvider')</code>
          </li>
          <li>
            <strong>CartBadge:</strong> используйте только <code>useCartState()</code>. Сумму quantity считайте через
            <code>items.reduce((sum, i) =&gt; sum + i.quantity, 0)</code>
          </li>
          <li>
            <strong>CartDrawer:</strong> позиционирование — <code>position: 'fixed', top: 0, right: 0, bottom: 0, width: 320</code>.
            Кнопка "Оформить заказ" диспатчит <code>{'{'} type: 'CLEAR' {'}'}</code>
          </li>
          <li>
            Итоговую сумму считайте: <code>items.reduce((sum, i) =&gt; sum + i.price * i.quantity, 0)</code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Задание 6.2: Система нотификаций</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Уникальный ID:</strong> <code>{"`notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`"}</code>
          </li>
          <li>
            <strong>timersRef:</strong> <code>useRef&lt;Map&lt;string, ReturnType&lt;typeof setTimeout&gt;&gt;&gt;(new Map())</code>
          </li>
          <li>
            <strong>dismiss:</strong> оберните в <code>useCallback(fn, [])</code>. Внутри:
            <code>setNotifications(prev =&gt; prev.filter(n =&gt; n.id !== id))</code>, затем <code>clearTimeout</code> и <code>timersRef.current.delete(id)</code>
          </li>
          <li>
            <strong>notify:</strong> оберните в <code>useCallback(fn, [dismiss])</code>. Если duration &gt; 0 — сохраните таймер:
            <code>timersRef.current.set(id, setTimeout(() =&gt; dismiss(id), duration))</code>
          </li>
          <li>
            <strong>Очистка при размонтировании:</strong> <code>useEffect(() =&gt; {'{'} const timers = timersRef.current; return () =&gt; timers.forEach(clearTimeout) {'}'}, [])</code>
          </li>
          <li>
            <strong>NotificationContainer</strong> рендерите внутри Provider, после <code>{'{children}'}</code>
          </li>
          <li>
            Каждый тип — свой объект <code>{'{'} bg, border, icon {'}'}</code>. Удобно хранить в объекте-словаре
            <code>{'`'}const COLORS: Record{'<'}Notification['type'], T{'>'} = {'{'} info: ..., success: ... {'}'}{'`'}</code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Задание 6.3: createStore</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>createStore внутри:</strong> вызовите <code>createContext</code> дважды. Каждый вызов <code>createStore</code>
            создаёт новую независимую пару контекстов — это нормально
          </li>
          <li>
            <strong>Provider:</strong> объявите как <code>const Provider: React.FC&lt;...&gt; = ({'{'} children {'}'}) =&gt; {'{'} ... {'}'}</code> —
            именно так, а не <code>function Provider</code>, чтобы TypeScript правильно вывел тип
          </li>
          <li>
            <strong>useStore с селектором:</strong> <code>function useStore&lt;R&gt;(selector: (state: S) =&gt; R): R {'{'} return selector(useContext(StateCtx)) {'}'}</code>
          </li>
          <li>
            <strong>TodoList с фильтрацией через селектор:</strong><br />
            <code>const visible = useTodoStore(s =&gt; s.filter === 'active' ? s.todos.filter(t =&gt; !t.done) : ...)</code>
          </li>
          <li>
            <strong>TodoStats:</strong> три отдельных вызова <code>useTodoStore</code> с разными селекторами — это нормально
          </li>
          <li>
            <strong>TodoAddForm:</strong> используйте только <code>useTodoDispatch()</code>. Локальный state для поля ввода — через <code>useState</code>
          </li>
          <li>
            <strong>Форма добавления:</strong> обрабатывайте через <code>onSubmit</code> с <code>e.preventDefault()</code>,
            проверяйте <code>text.trim()</code> перед dispatch
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#388e3c' }}>Общие советы по уровню</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Dispatch стабилен:</strong> <code>React.Dispatch</code> из <code>useReducer</code> никогда не меняет референс.
            Это позволяет безопасно передавать его в зависимости <code>useCallback</code>
          </li>
          <li>
            <strong>State через функцию-обновитель:</strong> в <code>useCallback</code> с пустыми зависимостями
            используйте <code>setState(prev =&gt; newState)</code> вместо прямого чтения state — это избегает stale closure
          </li>
          <li>
            <strong>Не создавайте объект в value Provider:</strong> <code>value={'{'}{'{'}state, dispatch{'}'}{'}'}  </code> создаёт новый объект при каждом рендере.
            Разделите на два Provider или оберните в <code>useMemo</code>
          </li>
          <li>
            TypeScript: используйте <code>Omit&lt;CartItem, 'quantity'&gt;</code> для типа товара каталога —
            quantity появляется только в корзине
          </li>
        </ul>
      </section>
    </div>
  )
}
