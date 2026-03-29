# Задание 8.2: Codec Pattern

## 🎯 Цель

Реализовать паттерн кодеков — двунаправленных типобезопасных преобразователей данных с возможностью композиции через `pipe`.

## Требования

1. Создайте интерфейс `Codec<TDecoded, TEncoded>` с методами `encode`, `decode` и `pipe`
2. Реализуйте фабрику `createCodec(encode, decode)` с поддержкой `pipe`
3. Метод `pipe` должен проверять совместимость типов: выход первого кодека = вход второго
4. Создайте минимум 4 базовых кодека: dateCodec, numberCodec, base64Codec, jsonCodec
5. Продемонстрируйте композицию: `jsonCodec.pipe(base64Codec)`

## Чеклист

- [ ] `Codec<TDecoded, TEncoded>` типизирует encode и decode
- [ ] `pipe` создаёт новый кодек с типом `Codec<TDecoded, TFinal>`
- [ ] `dateCodec.encode(new Date())` возвращает `string`
- [ ] `dateCodec.decode("...")` возвращает `Date`
- [ ] `jsonCodec.pipe(base64Codec)` компилируется (string -> string)
- [ ] `decode(encode(x))` возвращает эквивалент `x` (roundtrip)

## Как проверить себя

Создайте композитный кодек через `pipe` и проверьте roundtrip: `decode(encode(obj))` должен вернуть объект, эквивалентный исходному. Попробуйте скомпоновать несовместимые кодеки — TypeScript должен показать ошибку.
