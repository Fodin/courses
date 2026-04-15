# Задание 8.2: Transducers — компонуемые трансформации

## Цель

Реализовать примитивы transducer'ов и функцию `transduce`. Сравнить производительность
цепочки массивов и transducer на датасете из 1000 элементов.

## Требования

1. Объявить типы `Reducer<A, B>` и `Transducer<A, B>`
2. Реализовать `mapping<A, B>(fn)` — transducer, трансформирующий элементы
3. Реализовать `filtering<A>(pred)` — transducer, фильтрующий элементы
4. Реализовать `taking<A>(n)` — transducer, берущий первые n элементов
5. Реализовать `composeTransducers(t1, t2)` — композиция двух transducer'ов (t1 применяется первым)
6. Реализовать `transduce(xf, reducer, init, arr)` — выполняет transducer над массивом
7. В компоненте: ползунки для настройки параметров, кнопка запуска обоих подходов
8. Отобразить для каждого подхода: количество промежуточных массивов, число итераций, время

## Чеклист

- [ ] Тип `Transducer<A, B>` объявлен корректно (generic по R)
- [ ] `mapping` оборачивает значение через fn и передаёт в reducer
- [ ] `filtering` не вызывает reducer если pred(item) === false
- [ ] `taking` прекращает передавать элементы после n штук
- [ ] `composeTransducers(t1, t2)` — t1 применяется первым (как в pipe)
- [ ] `transduce` выполняет один проход по массиву
- [ ] Transducer-версия показывает 0 промежуточных массивов
- [ ] При изменении ползунков результаты пересчитываются

## Как проверить себя

```ts
const products = [
  { id: 1, price: 100, name: 'A' },
  { id: 2, price: 500, name: 'B' },
  { id: 3, price: 200, name: 'C' },
  { id: 4, price: 800, name: 'D' },
]

const xf = composeTransducers(
  composeTransducers(
    filtering<Product>(p => p.price >= 200),
    mapping<Product, Product>(p => ({ ...p, price: p.price * 0.9 }))
  ),
  taking<Product>(2)
)

const result = transduce(xf, (acc, item) => [...acc, item], [], products)
// [{ id: 2, price: 450, name: 'B' }, { id: 3, price: 180, name: 'C' }]
// Взяты первые 2 из отфильтрованных (price >= 200), со скидкой 10%
```
