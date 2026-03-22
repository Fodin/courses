# Задание 1.2: ref как prop

## Цель

Создать компонент `FancyInput`, который принимает `ref` как обычный prop (без `forwardRef`).

## Требования

1. Создайте функциональный компонент `FancyInput`
2. Компонент должен принимать `ref` как обычный prop:
   ```tsx
   function FancyInput({ ref, ...props }: { ref?: Ref<HTMLInputElement> }) {
     return <input ref={ref} {...props} />
   }
   ```
3. **НЕ используйте** `forwardRef`
4. В родительском компоненте:
   - Создайте `useRef<HTMLInputElement>(null)`
   - Передайте ref в `FancyInput`
   - Добавьте кнопку "Фокус", которая вызывает `inputRef.current?.focus()`

## Подсказки

- Тип ref: `Ref<HTMLInputElement>` из `react`
- Деструктурируйте ref из props: `{ ref, ...props }`
- Передайте ref на внутренний `<input>`

## Чеклист

- [ ] `FancyInput` не использует `forwardRef`
- [ ] `ref` принимается как обычный prop
- [ ] Кнопка "Фокус" работает
- [ ] TypeScript не показывает ошибок
