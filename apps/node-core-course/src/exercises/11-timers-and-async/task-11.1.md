# Задание 11.1: Timer Internals

## Цель

Разобраться во внутреннем устройстве таймеров Node.js: `setTimeout`, `setInterval`, `setImmediate`, а также методах `ref()`/`unref()` и оптимизации timer coalescing.

## Требования

1. Продемонстрируйте работу setTimeout, setInterval и setImmediate с пояснением фаз Event Loop
2. Покажите порядок выполнения: sync → nextTick → Promise → setTimeout/setImmediate
3. Объясните разницу поведения в main module и внутри I/O callback
4. Продемонстрируйте ref()/unref() и hasRef() для управления жизнью процесса
5. Покажите refresh() для эффективного сброса таймера
6. Объясните концепцию timer coalescing в libuv

## Чеклист

- [ ] Три типа таймеров показаны с примерами
- [ ] Порядок выполнения в Event Loop продемонстрирован
- [ ] Разница main module vs I/O callback объяснена
- [ ] ref()/unref() с типичными сценариями
- [ ] refresh() для сброса без пересоздания таймера
- [ ] Timer coalescing описан

## Как проверить себя

1. Нажмите "Запустить" — должен отобразиться полный обзор таймеров
2. Убедитесь, что объяснён порядок выполнения
3. Проверьте наличие примеров unref() для heartbeat и graceful shutdown
4. Убедитесь, что refresh() показан как альтернатива clearTimeout + setTimeout
