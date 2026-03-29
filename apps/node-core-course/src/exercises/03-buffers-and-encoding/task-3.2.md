# Задание 3.2: TypedArray Interop

## Цель

Понять взаимосвязь Buffer, ArrayBuffer, TypedArray и DataView, научиться работать с endianness.

## Требования

1. Покажите иерархию: ArrayBuffer → TypedArray → Buffer
2. Продемонстрируйте разные представления одного ArrayBuffer
3. Покажите работу DataView с big-endian и little-endian
4. Объясните endianness и его значение для сетевых протоколов
5. Покажите конвертацию Buffer ↔ ArrayBuffer

## Чеклист

- [ ] Иерархия типов показана
- [ ] Один ArrayBuffer через разные TypedArray
- [ ] DataView с BE и LE
- [ ] Endianness объяснён
- [ ] Конвертация Buffer ↔ ArrayBuffer

## Как проверить себя

1. Запустите демонстрацию
2. Проверьте, что одни и те же байты дают разные числа через разные TypedArray
3. Убедитесь, что BE и LE дают разный порядок байтов
