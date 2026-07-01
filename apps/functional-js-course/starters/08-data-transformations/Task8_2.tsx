import { useState, useMemo } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// TODO 1: Объявите типы Reducer и Transducer
//
// Reducer<A, B> — функция (acc: A, item: B) => A
// Transducer<A, B> — generic-функция: принимает Reducer<R, B>,
//   возвращает Reducer<R, A> — для любого R
// ============================================

// type Reducer<A, B> = (acc: A, item: B) => A
// type Transducer<A, B> = <R>(reducer: Reducer<R, B>) => Reducer<R, A>

// ============================================
// TODO 2: Реализуйте примитив mapping
//
// mapping(fn) трансформирует каждый элемент через fn
// перед передачей в reducer.
//
// Сигнатура: <A, B>(fn: (a: A) => B) => Transducer<A, B>
// ============================================

// const mapping = <A, B>(fn: (a: A) => B): Transducer<A, B> =>
//   <R>(reducer: Reducer<R, B>): Reducer<R, A> =>
//     (acc, item) => reducer(acc, fn(item))

// ============================================
// TODO 3: Реализуйте примитив filtering
//
// filtering(pred) пропускает элемент в reducer только если pred(item) === true.
// Если pred === false — возвращает acc без изменений.
// ============================================

// const filtering = <A>(pred: (a: A) => boolean): Transducer<A, A> => ...

// ============================================
// TODO 4: Реализуйте примитив taking
//
// taking(n) передаёт в reducer только первые n элементов.
// Для элементов с индексом >= n — возвращает acc без вызова reducer.
//
// ВАЖНО: используйте замыкание для счётчика.
// ВАЖНО: создавайте новый экземпляр taking для каждого вызова transduce!
// ============================================

// const taking = <A>(n: number): Transducer<A, A> => ...

// ============================================
// TODO 5: Реализуйте composeTransducers
//
// composeTransducers(t1, t2) — t1 применяется к данным ПЕРВЫМ (как pipe).
// Это отличается от обычного compose!
//
// Подсказка: возвращает transducer, который:
//   берёт reducer, оборачивает его в t2, потом в t1
// ============================================

// function composeTransducers<A, B, C>(t1: Transducer<A, B>, t2: Transducer<B, C>): Transducer<A, C> { ... }

// ============================================
// TODO 6: Реализуйте transduce
//
// transduce(xf, reducer, init, arr):
//   1. Применяет xf к reducer (получает xfReducer)
//   2. Проходит по arr, аккумулируя результат
//   3. Возвращает финальный accumulator
// ============================================

// function transduce<A, B, R>(xf: Transducer<A, B>, reducer: Reducer<R, B>, init: R, arr: A[]): R { ... }

// ============================================
// TODO 7: Объявите интерфейс Product и генератор данных
//
// interface Product { id: number; name: string; price: number; category: string }
//
// function generateProducts(n: number): Product[] {
//   // Создайте n продуктов с id от 1 до n,
//   // name: `Product ${i}`, price: вариативная, category: из 5 вариантов
// }
// ============================================

export function Task8_2() {
  const { t } = useLanguage()
  const [minPrice, setMinPrice] = useState(300)
  const [discount, setDiscount] = useState(10)
  const [limitN, setLimitN] = useState(10)
  void minPrice
  void setMinPrice
  void discount
  void setDiscount
  void limitN
  void setLimitN

  // TODO 8: Создайте 1000 продуктов через useMemo
  const products = useMemo(() => [] /* generateProducts(1000) */, [])
  void products

  return (
    <div className="exercise-container">
      <h2>{t('task.8.2')}</h2>

      {/* TODO 9: Добавьте ползунки для настройки
          - Мин. цена (0-900)
          - Скидка % (0-50)
          - Лимит N (1-50) */}

      {/* TODO 10: Реализуйте runChain
          products.filter(p => p.price >= minPrice)
                  .map(p => ({ ...p, price: p.price * (1 - discount/100) }))
                  .slice(0, limitN)
          Считайте: количество промежуточных массивов (всегда 2),
          итерации каждого шага, время выполнения */}

      {/* TODO 11: Реализуйте runTransducer
          transduce(
            composeTransducers(
              composeTransducers(filtering(...), mapping(...)),
              taking(limitN)
            ),
            (acc, item) => [...acc, item], [], products
          )
          Считайте итерации внутри filtering */}

      {/* TODO 12: Отобразите результаты в двух колонках
          Для каждого подхода:
          - Промежуточных массивов: N
          - Итераций: N
          - Время (мс): N
          - Первые 5 результатов */}
    </div>
  )
}
