# Задание 11.3: Async Iterators

## Цель

Освоить async iterators в Node.js: `for-await-of`, создание собственных async generators, использование streams и EventEmitter как async iterators через `events.on()`.

## Требования

1. Покажите создание объекта с `Symbol.asyncIterator` и итерацию через `for-await-of`
2. Реализуйте async generator (`async function*`) для постраничной загрузки данных
3. Продемонстрируйте чтение файла как async iterable (ReadableStream)
4. Покажите `events.on()` для превращения EventEmitter в async iterator
5. Продемонстрируйте pipeline с async generator для потоковой трансформации

## Чеклист

- [ ] Объект с Symbol.asyncIterator и for-await-of
- [ ] Async generator для пагинации
- [ ] Readable stream как async iterable
- [ ] events.on() с AbortSignal для остановки
- [ ] Pipeline с async generator трансформацией

## Как проверить себя

1. Нажмите "Запустить" — должны отобразиться все паттерны async iterators
2. Убедитесь, что показан async generator с yield
3. Проверьте, что streams используются как async iterable
4. Убедитесь, что events.on() показан с возможностью остановки
