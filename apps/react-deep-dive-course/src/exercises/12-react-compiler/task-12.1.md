# Задание 12.1: Manual vs Compiler

## Задание

У вас есть компонент `ProductCard` без какой-либо мемоизации. Добавьте ручную мемоизацию, затем
изучите рядом расположенную "compiler version" — и поймите, что компилятор сделал иначе.

## Цель

Почувствовать разницу между ручной мемоизацией (useMemo + useCallback + React.memo) и тем, что
генерирует React Compiler (useMemoCache паттерн). Понять, почему compiler output точнее и
эффективнее.

## Требования

1. Реализуйте компонент `ManualProductCard` с ручной мемоизацией:
   - Вычисление `formattedPrice` через `useMemo` (зависимость: `product.price`)
   - Вычисление `discountLabel` через `useMemo` (зависимость: `product.discount`)
   - Обработчик `handleAddToCart` через `useCallback` (зависимость: `onAddToCart`, `product.id`)
   - Весь компонент обёрнут в `React.memo`
   - Счётчик рендеров: `renderCount.current++` + отображение в UI

2. Рядом покажите `CompiledProductCard` — "сымитированный" compiler output:
   - Используйте `useRef` для хранения кэша: `const $ = useRef(new Array(8).fill(Symbol('cache')))`
   - Реализуйте if-check паттерн вручную для каждого scope
   - Тот же счётчик рендеров

3. Родительский компонент `Task12_1_Solution`:
   - Кнопка "Обновить цену" — меняет `product.price` (триггерит пересчёт price scope)
   - Кнопка "Обновить скидку" — меняет `product.discount` (триггерит пересчёт discount scope)
   - Кнопка "Форс-рендер родителя" — родитель перерендеривается без изменения props
   - Показывает оба компонента рядом (две колонки)

4. Отобразите панель "Что закэшировано":
   - Список из 3 строк: `formattedPrice`, `discountLabel`, `handleAddToCart`
   - Цветной индикатор: зелёный = взято из кэша, оранжевый = пересчитано

## Чеклист

- [ ] `ManualProductCard` использует useMemo, useCallback, React.memo
- [ ] `CompiledProductCard` имитирует useMemoCache паттерн через useRef-массив
- [ ] При "Форс-рендер родителя" `ManualProductCard` НЕ перерендеривается (React.memo)
- [ ] При "Форс-рендер родителя" `CompiledProductCard` рендерится, но JSX берётся из кэша
- [ ] При "Обновить цену" оба компонента пересчитывают только price-связанные значения
- [ ] Счётчик рендеров отображается в обоих компонентах
- [ ] Панель "Что закэшировано" отображает статус каждого значения

## Как проверить себя

- Нажмите "Форс-рендер родителя" несколько раз: счётчик ManualProductCard не растёт,
  счётчик CompiledProductCard растёт (рендер происходит), но JSX остаётся из кэша
- Нажмите "Обновить цену": formattedPrice пересчитывается (оранжевый), discountLabel и handler — нет (зелёный)
- Нажмите "Обновить скидку": discountLabel пересчитывается, formattedPrice — нет
- Обратите внимание: ManualProductCard использует N хуков, CompiledProductCard — один массив
