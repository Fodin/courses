# Задание 1.4: Убрать forwardRef

## Цель

Переписать существующий компонент с `forwardRef` на новый стиль React 19 (ref как prop).

## Требования

1. В файле задания есть компонент `OldInput`, обёрнутый в `forwardRef`
2. Создайте `NewInput` без `forwardRef`:
   - Уберите обёртку `forwardRef`
   - Переместите `ref` в деструктуризацию props
   - Удалите `displayName`
3. Замените использование `OldInput` на `NewInput`
4. Убедитесь, что ref по-прежнему работает (кнопка "Фокус")

## Пример миграции

```tsx
// До (React 18)
const OldInput = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
    return <input ref={ref} {...props} />
  }
)
OldInput.displayName = 'OldInput'

// После (React 19)
function NewInput({ ref, ...props }: Props & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}
```

## Чеклист

- [ ] Создан `NewInput` без `forwardRef`
- [ ] `ref` в деструктуризации props
- [ ] Нет `displayName`
- [ ] Кнопка "Фокус" работает с `NewInput`
- [ ] `OldInput` заменён на `NewInput` в JSX
