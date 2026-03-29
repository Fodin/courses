# Задание 11.2: AbortController

## Цель

Освоить механизм отмены асинхронных операций через `AbortController` и `AbortSignal`: отмена запросов, таймеров, композиция сигналов и обработка причин отмены.

## Требования

1. Продемонстрируйте базовое использование AbortController для отмены fetch-запроса
2. Покажите отменяемый setTimeout через timers/promises с signal
3. Продемонстрируйте abort() с причиной (reason) и доступ к signal.reason
4. Покажите AbortSignal.timeout() для автоматического таймаута
5. Продемонстрируйте AbortSignal.any() для композиции нескольких сигналов
6. Покажите throwIfAborted() и addEventListener('abort') для реакции на отмену

## Чеклист

- [ ] Базовая отмена fetch через AbortController
- [ ] Отменяемый таймер через timers/promises
- [ ] abort() с reason и чтение signal.reason
- [ ] AbortSignal.timeout() для автоматической отмены
- [ ] AbortSignal.any() для композиции сигналов
- [ ] throwIfAborted() в цикле обработки

## Как проверить себя

1. Нажмите "Запустить" — должны отобразиться все сценарии отмены
2. Убедитесь, что показана разница между AbortError и другими ошибками
3. Проверьте, что AbortSignal.timeout() показан как замена ручного setTimeout
4. Убедитесь, что AbortSignal.any() объяснён для комбинирования сигналов
