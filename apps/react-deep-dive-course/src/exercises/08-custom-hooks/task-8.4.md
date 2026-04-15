# Задание 8.4: Anti-pattern Gallery (YMNAE Capstone)

## Задание

Перед вами галерея из 4 компонентов — каждый содержит классический антипаттерн из "You Might Not Need An Effect". Ваша задача: идентифицировать антипаттерн по имени, объяснить проблему и отрефакторить компонент.

## Цель

Закрепить понимание YMNAE на реальных примерах антипаттернов. Развить навык "видеть" лишние Effects и мгновенно понимать, чем их заменить.

## Требования

### Антипаттерн 1: NotifyParent

Компонент `Toggle` вызывает `onChange` из `useEffect` при изменении `isOn`:

```tsx
// Дано (антипаттерн):
function Toggle({ onChange }: { onChange: (val: boolean) => void }) {
  const [isOn, setIsOn] = useState(false)

  useEffect(() => {
    onChange(isOn) // ← вызов родителя из эффекта
  }, [isOn, onChange])

  return <button onClick={() => setIsOn(v => !v)}>{isOn ? 'ON' : 'OFF'}</button>
}
```

Задача:
1. Назвать антипаттерн: "Уведомление родителя из Effect"
2. Объяснить проблему: двойной рендер, нарушение потока данных
3. Переписать: перенести вызов `onChange` в event handler

### Антипаттерн 2: EffectChain

Форма, где цепочка `useEffect` вычисляет `trimmed → error → isValid`:

```tsx
// Дано (антипаттерн):
function PasswordForm() {
  const [password, setPassword] = useState('')
  const [trimmed, setTrimmed] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)

  useEffect(() => { setTrimmed(password.trim()) }, [password])
  useEffect(() => { setError(trimmed.length < 8 ? 'Слишком короткий' : '') }, [trimmed])
  useEffect(() => { setIsValid(error === '') }, [error])

  return <div>...</div>
}
```

Задача:
1. Назвать антипаттерн: "Effect Chain (цепочка эффектов)"
2. Объяснить проблему: каскадные рендеры, лишнее состояние
3. Переписать: вычислять trimmed/error/isValid при рендере (без useState, без useEffect)

### Антипаттерн 3: ManualSubscription

Хук `useScrollY` подписывается на `window.scroll` через `useEffect + useState`:

```tsx
// Дано (антипаттерн):
function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const handler = () => setY(window.scrollY)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return y
}
```

Задача:
1. Назвать антипаттерн: "Ручная подписка через useEffect"
2. Объяснить проблему: tearing risk, лишний рендер при mount
3. Переписать через `useSyncExternalStore`

### Антипаттерн 4: RedundantState

Список с `filteredItems` в `useState`, синхронизируемый через `useEffect`:

```tsx
// Дано (антипаттерн):
function ItemList({ items }: { items: string[] }) {
  const [query, setQuery] = useState('')
  const [filtered, setFiltered] = useState(items)

  useEffect(() => {
    setFiltered(items.filter(i => i.toLowerCase().includes(query.toLowerCase())))
  }, [items, query])

  return <div>...</div>
}
```

Задача:
1. Назвать антипаттерн: "Избыточное состояние (Redundant State)"
2. Объяснить проблему: filtered вычислима из items+query, useEffect только добавляет лишний рендер
3. Переписать: `const filtered = useMemo(...)` или прямое вычисление при рендере

## Формат выполнения

Для каждого антипаттерна создать две версии рядом:
- "До" — исходный код с проблемой (можно показать как неработающую/медленную версию)
- "После" — отрефакторенный код

Добавить scoreboard: прогресс-бар "отрефакторено X из 4".

## Чеклист

- [ ] Антипаттерн 1: onChange перенесён в event handler (не в useEffect)
- [ ] Антипаттерн 2: ни один из trimmed/error/isValid не хранится в useState
- [ ] Антипаттерн 3: `useSyncExternalStore` с subscribe/getSnapshot вне компонента
- [ ] Антипаттерн 4: filtered вычисляется через `useMemo` или при рендере
- [ ] Все 4 "после"-версии интерактивны и работают корректно
- [ ] Scoreboard показывает прогресс

## Как проверить себя

1. Антипаттерн 1: добавьте `console.log` в родителе — должен вызываться один раз при нажатии, не два (до и после рендера)
2. Антипаттерн 2: откройте React DevTools Profiler — на каждый keystroke должен быть 1 рендер, не 3-4
3. Антипаттерн 3: `useSyncExternalStore` не вызывает mount→effect→setState (нет лишнего рендера при mount)
4. Антипаттерн 4: filteredItems вычисляется за один рендер — нет "мигания" промежуточного состояния
