# Задание 9.4: Autocomplete с forwardRef и generics

## Цель

Реализовать generic компонент `Autocomplete<T>` с поддержкой `forwardRef`. Компонент работает с любым типом данных и позволяет родителю управлять фокусом через ref. Задание включает решение проблемы совместимости generics и forwardRef в React 18.

## Требования

1. Компонент принимает generic параметр `T`
2. Props компонента:
   - `options: T[]` — массив вариантов
   - `value: string` — текст в поле ввода
   - `onChange: (value: string) => void` — колбэк при изменении текста
   - `onSelect: (item: T) => void` — колбэк при выборе варианта
   - `getOptionLabel: (item: T) => string` — функция получения текста для отображения
   - `placeholder?: string`
3. Ref указывает на `HTMLInputElement` внутри компонента
4. Решить проблему generics + forwardRef через type assertion или declare function workaround
5. Добавить `displayName` для отладки
6. Демонстрация: компонент с массивом городов, с кнопкой "Сфокусировать через ref"

## Подсказки

- `forwardRef` в React 18 не поддерживает generics напрямую — нужен workaround
- Самый чистый способ: реализуй компонент как обычный forwardRef, потом приведи тип: `const Autocomplete = AutocompleteInner as <T>(props: AutocompleteProps<T> & { ref?: React.Ref<HTMLInputElement> }) => React.ReactElement`
- Или используй `declare function` для объявления типа отдельно от реализации
- Для показа выпадающего списка: используй `useState` для `isOpen` и фильтруй `options` по `value`
- `getOptionLabel` используется и для отображения элемента в списке, и для заполнения поля при выборе

## Чеклист

- [ ] Компонент реализован с `forwardRef`
- [ ] Generic параметр `T` сохраняется после workaround
- [ ] `ref` указывает на `HTMLInputElement`
- [ ] `onSelect` типизирован как `(item: T) => void`
- [ ] `getOptionLabel` типизирован как `(item: T) => string`
- [ ] `displayName` задан для React DevTools
- [ ] В демо: кнопка "Сфокусировать" вызывает `ref.current?.focus()`
- [ ] Выпадающий список фильтруется по введённому тексту
- [ ] При выборе варианта: поле заполняется текстом, список закрывается
- [ ] Нет `any` в типах

## Как проверить себя

Откройте задание в браузере. Вы должны увидеть:
- Поле ввода с placeholder
- При наборе текста — выпадающий список отфильтрованных вариантов
- При клике на вариант — поле заполняется, список закрывается
- Кнопка "Сфокусировать" переводит фокус в поле

Проверьте в React DevTools: компонент должен называться `Autocomplete`, не `ForwardRef` или `Anonymous`.
