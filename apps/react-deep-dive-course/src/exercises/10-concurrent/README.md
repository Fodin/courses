# Уровень 10: Concurrent React — Transitions и Suspense изнутри

## Проблема: синхронный рендер блокирует браузер

Представьте: пользователь печатает в поле поиска, а ваше приложение каждый раз фильтрует 10 000 элементов. Каждое нажатие клавиши запускает тяжёлый рендер. Браузер не может обработать следующий ввод, пока не закончит рендер. Интерфейс "фризит".

Это фундаментальная проблема **синхронного рендера**: он монопольно занимает main thread до завершения.

```
Синхронный рендер:
[input 'a'] → [рендер 50ms] → [input 'ab'] → [рендер 50ms] → ...
               ↑ браузер заблокирован

Concurrent рендер:
[input 'a'] → [рендер...] → [input 'ab'] → ПРЕРВАЛИ старый → [рендер ab]
                              ↑ браузер свободен
```

Аналогия: синхронный рендер — это официант, который готовит блюдо сам и не может принять новый заказ, пока не закончит. Concurrent рендер — это официант, который может прервать готовку, принять новый заказ, и вернуться к готовке.

---

## Прерываемый рендер: как это работает

В Concurrent Mode React использует **work loop с проверкой времени**. После каждого fiber-узла он проверяет: "Не пора ли уступить управление браузеру?"

```
performConcurrentWorkOnRoot
    ↓
workLoopConcurrent:
    while (workInProgress !== null && !shouldYield()) {
        performUnitOfWork(workInProgress)
        //                ↑ обрабатывает один fiber
    }
    if (workInProgress !== null) {
        // работа не закончена — уступаем браузеру
        return performConcurrentWorkOnRoot.bind(null, root)
    }
```

`shouldYield()` — это функция из Scheduler, которая проверяет, прошло ли 5ms с начала текущего кадра. Если прошло — возвращает `true`, work loop останавливается, и браузер может обработать события и нарисовать кадр.

---

## Transition lanes vs Sync lanes

React разделяет обновления на **lanes** (полосы приоритета). Ключевое различие:

| Тип | Lane | Прерываемый? | Пример |
|-----|------|-------------|--------|
| Синхронный | SyncLane (1) | Нет | `useState` в обработчике |
| Transition | TransitionLane (64+) | Да | `startTransition` |
| Idle | IdleLane | Да | фоновые задачи |

```tsx
// Sync update: НЕЛЬЗЯ прервать
setInputValue(e.target.value)   // → SyncLane → немедленный рендер

// Transition update: МОЖНО прервать
startTransition(() => {
  setSearchResults(filter(allItems, query))  // → TransitionLane → прерываемый
})
```

💡 Когда приходит новый Sync update, React прерывает работающий Transition render и обрабатывает синхронное обновление первым. Это и даёт отзывчивый input.

---

## Как работает Suspense: механизм thrown promise

Suspense — это механизм, основанный на принципе "бросить и поймать". Компонент-потребитель буквально бросает Promise как исключение:

```tsx
function UserProfile({ userId }: { userId: string }) {
  const user = cache.read(userId)  // ← бросает Promise если данные не готовы
  return <div>{user.name}</div>
}
```

Внутри `cache.read()` происходит следующее:

```
cache.read(key):
    if (cache[key] === undefined) {
        const promise = fetchUser(key)
        cache[key] = { status: 'pending', promise }
        throw promise   // ← React поймает это
    }
    if (cache[key].status === 'pending') {
        throw cache[key].promise  // ← продолжаем ждать
    }
    if (cache[key].status === 'error') {
        throw cache[key].error
    }
    return cache[key].value   // ← данные готовы, возвращаем
```

React ловит этот Promise в ближайшей границе `<Suspense>`. Затем:
1. Монтирует **fallback** ветку дерева (спиннер)
2. Сохраняет **primary** ветку как offscreen (скрытая)
3. Подписывается на разрешение Promise
4. Когда Promise resolve — перерендеривает primary ветку

---

## Waterfall problem

Если компоненты загружают данные последовательно, возникает "водопад":

```
❌ Waterfall: 600ms суммарно
─────────────────────────────────
UserProfile: fetch (300ms)
                 UserPosts: fetch (300ms)
─────────────────────────────────

✅ Parallel: 300ms суммарно
─────────────────────────────────
UserProfile: fetch (300ms)
UserPosts:   fetch (300ms)
─────────────────────────────────
```

Водопад возникает потому, что `<UserPosts>` рендерится только после того, как `<UserProfile>` получил данные и отрендерился. Решение — запускать оба запроса одновременно, **до** рендера.

---

## Хук use(): синтаксический сахар над thrown promise

React 19 добавил хук `use()`, который инкапсулирует механизм thrown promise:

```tsx
// До use(): нужен кэш с ручным throw
function UserProfile() {
  const user = cache.read(userId)   // кидает Promise или возвращает данные
  return <div>{user.name}</div>
}

// С use(): React сам управляет thrown promise
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise)     // бросит Promise если pending, вернёт если resolved
  return <div>{user.name}</div>
}
```

Внутри `use()` делает то же самое: читает статус thenable, бросает его если `pending`, возвращает значение если `fulfilled`. Разница от обычных хуков: `use()` можно вызывать условно.

---

## ⚠️ Распространённые ошибки новичков

### 1. Бросать Promise без кэша — бесконечный цикл

```tsx
// ❌ Каждый рендер создаёт НОВЫЙ Promise
function BadComponent() {
  throw fetch('/api/user')  // новый Promise на каждом вызове
  // React catch → показывает fallback → Promise resolve
  // → перерендер → новый Promise → ещё раз показывает fallback → ...
}

// ✅ Кэшировать Promise по ключу
const cache = new Map<string, Promise<unknown>>()
function goodFetch(url: string) {
  if (!cache.has(url)) cache.set(url, fetch(url).then(r => r.json()))
  return cache.get(url)!
}
```

### 2. Обёртывать все обновления в startTransition

```tsx
// ❌ Transition для критических обновлений — задержка видна пользователю
startTransition(() => {
  setError('Неверный пароль')  // пользователь ждёт feedback
  setIsLoading(false)          // спиннер зависнет на 100-200ms
})

// ✅ Transition только для некритичного контента
setError('Неверный пароль')   // немедленно
startTransition(() => {
  setSearchResults(heavyFilter(items, query))  // ок задержать
})
```

### 3. Забыть про isPending

```tsx
// ❌ Нет visual feedback — пользователь думает, что кнопка не работает
const [isPending, startTransition] = useTransition()
function handleSearch(q: string) {
  startTransition(() => setResults(filter(items, q)))
  // isPending === true, но никак не показываем это
}

// ✅ Используем isPending для индикации загрузки
<button disabled={isPending}>
  {isPending ? 'Поиск...' : 'Найти'}
</button>
```

---

## Резюме

```
startTransition(fn)
    ↓
setState внутри fn помечается TransitionLane
    ↓
React рендерит async, проверяя shouldYield() после каждого fiber
    ↓
Новый sync update? → прерываем transition, обрабатываем sync → возобновляем
    ↓
isPending = true пока transition не завершён
```

```
Компонент throw Promise
    ↓
React ловит в ближайшем <Suspense>
    ↓
Монтирует fallback, сохраняет primary как offscreen
    ↓
Promise resolve → перерендер primary → unmount fallback
```

📌 Concurrent React не делает рендер "быстрее" — он делает его **прерываемым**. Пользователь получает отзывчивый интерфейс за счёт того, что React может остановить тяжёлый рендер и сначала обработать важное событие.
