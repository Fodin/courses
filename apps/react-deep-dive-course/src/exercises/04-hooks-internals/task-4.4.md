# Задание 4.4: Computed During Render

## Цель

Провести рефакторинг антипаттерна "useState + useEffect для derived value" и своими глазами увидеть разницу в количестве рендеров.

## Задание

Тебе дан компонент с антипаттерном: `fullName` вычисляется через `useState + useEffect`. Твоя задача — отрефакторить его и сравнить поведение через счётчик рендеров.

**Исходный (плохой) компонент:**
```tsx
function BadUserCard() {
  const [firstName, setFirstName] = useState('Иван')
  const [lastName, setLastName] = useState('Иванов')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(firstName + ' ' + lastName)
  }, [firstName, lastName])

  return <div>{fullName}</div>
}
```

**Твоя задача:**
1. Реализовать `GoodUserCard` — такой же компонент, но `fullName` вычисляется во время рендера
2. Показать оба компонента рядом со счётчиком рендеров каждого
3. При изменении firstName — показать, что плохой компонент рендерится 2 раза, хороший — 1 раз
4. Добавить объяснение разницы

## Требования

1. Компонент `BadUserCard`:
   - `firstName`, `lastName` — state
   - `fullName` — state, обновляется через `useEffect`
   - Счётчик рендеров (useRef)
2. Компонент `GoodUserCard`:
   - `firstName`, `lastName` — state
   - `fullName = firstName + ' ' + lastName` — вычисляется во время рендера
   - Счётчик рендеров (useRef)
3. Поля ввода для firstName и lastName (общие или раздельные)
4. Визуальное сравнение: счётчики рядом, цветом выделить "лишний рендер"
5. Блок с объяснением: почему плохой вариант делает 2 рендера

## Чеклист

- [ ] BadUserCard: fullName через useState + useEffect
- [ ] GoodUserCard: fullName = firstName + ' ' + lastName
- [ ] Счётчик рендеров в каждом компоненте (useRef, не useState)
- [ ] При вводе в поле — BadUserCard показывает +2 рендера, GoodUserCard — +1
- [ ] Объяснение: первый рендер со старым fullName, второй после setFullName
- [ ] Визуальное выделение лишнего рендера (цвет, анимация)

## Как проверить себя

1. Открой компонент и начни вводить в поле имени
2. BadUserCard должен показывать чётные числа (0→2→4→6), GoodUserCard — нечётные (0→1→2→3)
3. Измени GoodUserCard: добавь `useMemo` — убедись, что это не нужно для простой конкатенации
4. Объясни: при каком объёме вычислений `useMemo` оправдан?
