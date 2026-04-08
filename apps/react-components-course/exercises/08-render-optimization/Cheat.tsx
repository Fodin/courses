export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 8 — Оптимизация рендеринга</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Задание 8.1: Чат — диагностика и исправление</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Render counter:</strong>{' '}
            <code>const renderCount = useRef(0); renderCount.current++</code> — в начале тела компонента.
            Отображай через <code>{'<span>renders: {renderCount.current}</span>'}</code>
          </li>
          <li>
            <strong>State down:</strong> удали <code>inputText</code> и <code>setInputText</code> из <code>Task8_1</code>.
            Перенеси <code>useState('')</code> внутрь <code>MessageInput</code>. Сигнатура станет:{' '}
            <code>{'{'} onSend: (text: string) =&gt; void {'}'}</code>
          </li>
          <li>
            <strong>React.memo:</strong>{' '}
            <code>{'const MessageList = memo(function MessageList({ messages }) { ... })'}</code>
            — то же для <code>OnlineUsers</code>
          </li>
          <li>
            <strong>useCallback для onSend:</strong>{' '}
            <code>{'const handleSend = useCallback((text: string) => { setMessages(prev => [...prev, ...]) }, [])'}</code>
            — пустые зависимости, т.к. используем функциональный setState
          </li>
          <li>
            <strong>Почему пустые зависимости безопасны:</strong> <code>setMessages(prev =&gt; ...)</code>
            читает предыдущий state через аргумент, не из замыкания — нет stale closure
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Задание 8.2: State down / Children up</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>State down — структура:</strong> <code>ColorPicker</code> сам хранит{' '}
            <code>useState(color)</code>. В родителе: <code>{'<ColorPicker /> <HeavyPreview />'}</code> — рядом,
            не вложено
          </li>
          <li>
            <strong>Children up — структура:</strong>{' '}
            <code>{'function ColorWrapper({ children }: { children: React.ReactNode }) { const [color, setColor] = useState(...) ... return <div>...пикер... {children}</div> }'}</code>
          </li>
          <li>
            <strong>Использование children up:</strong>{' '}
            <code>{'<ColorWrapper><HeavyPreview label="..." /></ColorWrapper>'}</code>{' '}
            — <code>HeavyPreview</code> создаётся в <code>Task8_2</code>, передаётся как проп, не зависит от state <code>ColorWrapper</code>
          </li>
          <li>
            <strong>Ключевой принцип:</strong> React не пересоздаёт JSX-элемент переданный как{' '}
            <code>children</code> — он уже существует в области видимости родителя
          </li>
          <li>
            <strong>React.memo НЕ использовать</strong> — это учебный пример структурных оптимизаций
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Задание 8.3: FilterPanel — useCallback + memo</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Порядок действий:</strong> сначала оберни все 5 компонентов в <code>memo</code>,
            затем стабилизируй все <code>onChange</code> через <code>useCallback</code>
          </li>
          <li>
            <strong>useCallback с пустыми зависимостями:</strong>{' '}
            <code>{'const handleCategoryChange = useCallback((value: string) => { setFilters(prev => ({ ...prev, category: value })) }, [])'}</code>
          </li>
          <li>
            <strong>Почему [] безопасны:</strong> функциональный <code>setFilters(prev =&gt; ...)</code>
            не читает <code>filters</code> из замыкания — нет stale closure. Setter из{' '}
            <code>useState</code> стабилен, его не нужно добавлять в зависимости
          </li>
          <li>
            <strong>PriceFilter — два параметра:</strong>{' '}
            <code>{'const handlePriceChange = useCallback((min: number, max: number) => { setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max })) }, [])'}</code>
          </li>
          <li>
            <strong>Memo на SortFilter — type:</strong> тип значения{' '}
            <code>Filters['sort']</code> — используй его в обоих местах: в пропсах компонента и в {' '}
            <code>onChange</code>
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#388e3c' }}>Общие советы по уровню</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Диагностика первична:</strong> всегда сначала убеждайся что проблема реальна.
            Render counters — самый простой способ. React DevTools Profiler — для детального анализа
          </li>
          <li>
            <strong>Структурные решения лучше мемоизации:</strong> state down / children up устраняют
            причину. memo и useCallback — лечат симптом
          </li>
          <li>
            <strong>memo без useCallback бесполезен:</strong> если передаёшь функцию как проп в memo-компонент
            без <code>useCallback</code> — memo не работает (новая ссылка = всегда "изменилось")
          </li>
          <li>
            <strong>useCallback без memo бесполезен:</strong> стабилизация функций нужна только если
            компонент-получатель обёрнут в <code>memo</code>
          </li>
          <li>
            <strong>Не оборачивай всё в memo:</strong> накладные расходы на сравнение пропсов для простых
            компонентов могут превысить выгоду
          </li>
        </ul>
      </section>
    </div>
  )
}
