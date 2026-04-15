# Задание 5.4: Race Condition Fix (YMNAE)

## Цель

Наблюдать race condition при data fetching в useEffect и исправить его двумя способами: через ignore flag и через AbortController.

## Задание

Тебе дан компонент поиска `SearchDemo` с симулированным API. При быстром наборе запросов ответы приходят в случайном порядке — результаты отображаются для не того запроса.

### Симуляция API (уже написана):

```tsx
// Симуляция fetch с случайной задержкой
async function fakeFetch(query: string): Promise<string[]> {
  const delay = Math.random() * 1500 + 200  // 200–1700 мс
  await new Promise(resolve => setTimeout(resolve, delay))
  return MOCK_DATA.filter(item => item.toLowerCase().includes(query.toLowerCase()))
}

const MOCK_DATA = [
  'Apple', 'Apricot', 'Avocado',
  'Banana', 'Blueberry', 'Blackberry',
  'Cherry', 'Coconut', 'Cranberry',
  // ...
]
```

### Исходный компонент (с race condition):

```tsx
function SearchDemo() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) { setResults([]); return }
    setLoading(true)
    fakeFetch(query).then(data => {
      setResults(data)
      setLoading(false)
    })
    // Нет cleanup!
  }, [query])

  // ...
}
```

## Требования

Реализуй **три варианта** компонента в одном UI, каждый с отдельным полем ввода:

### Вариант 1: "Баг — Race Condition"
- Исходный код без cleanup
- Показывает "ID запроса" и "задержку ответа" для каждого результата
- Визуально подсвечивает несоответствие: если query в поле ≠ запрос, давший результаты

### Вариант 2: "Фикс — ignore flag"
- Добавить `let ignore = false` в effect
- Cleanup устанавливает `ignore = true`
- Вызывать `setResults` только если `!ignore`
- Показывает лог: "Запрос для 'ab' проигнорирован (устарел)"

### Вариант 3: "Фикс — AbortController"
- Создать `AbortController` в effect
- Передать `{ signal: controller.signal }` в fetch (используй реальный fetch или симуляцию с поддержкой signal)
- Cleanup вызывает `controller.abort()`
- Показывает лог: "Запрос для 'ab' отменён (AbortError)"

## Требования к UI

1. Три колонки с отдельными полями ввода
2. Лог запросов: каждый показывает статус (в полёте, завершён, проигнорирован, отменён)
3. Индикатор загрузки (spinner или "Загрузка...")
4. Список результатов
5. Для варианта 1: красная плашка если результаты не соответствуют текущему query

## Чеклист

- [ ] Вариант 1 воспроизводит race condition (набери быстро несколько символов)
- [ ] Вариант 2 показывает в логе "проигнорирован" для устаревших запросов
- [ ] Вариант 3 показывает в логе "отменён" для отменённых запросов
- [ ] Результаты в вариантах 2 и 3 всегда соответствуют текущему query
- [ ] Лог запросов показывает реальный порядок прихода ответов
- [ ] Симуляция задержки достаточно случайна чтобы воспроизводить проблему

## Как проверить себя

1. В колонке "Баг": быстро набери "a", потом "ab", потом "abc" — подожди
2. Если повезёт (ответы пришли вразнобой), увидишь красную плашку несоответствия
3. Нажми "Медленный режим" (если реализовал) чтобы увеличить разброс задержек
4. В колонках с фиксами: результаты всегда соответствуют текущему query
5. В логах: видны отменённые/проигнорированные запросы

> **Подсказка по симуляции AbortController**: `fakeFetch` принимает вторым аргументом объект `{ signal }`. Если `signal.aborted === true` — выброси `new DOMException('Aborted', 'AbortError')`. Проверяй `signal.aborted` перед `resolve`.
