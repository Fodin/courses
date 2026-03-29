# Задание 8.1: Basic Worker

## Цель

Освоить создание Worker Threads: конструктор Worker, workerData, parentPort и обмен сообщениями между главным потоком и worker.

## Требования

1. Создайте симуляцию жизненного цикла Worker: создание → workerData → обработка → postMessage → exit
2. Покажите параметры конструктора Worker (workerData, resourceLimits, env)
3. Продемонстрируйте API главного потока: postMessage, terminate, on('message'), on('error'), on('exit')
4. Покажите API внутри Worker: parentPort, workerData, isMainThread, threadId
5. Продемонстрируйте inline Worker через `eval: true`

## Чеклист

- [ ] Полный lifecycle Worker показан пошагово
- [ ] Все параметры конструктора описаны
- [ ] API обеих сторон (main / worker) продемонстрирован
- [ ] Inline Worker пример показан
- [ ] Обработка ошибок worker (error, exit с ненулевым кодом)

## Как проверить себя

1. Нажмите кнопку запуска
2. Проследите lifecycle: создание → данные → обработка → результат → выход
3. Убедитесь, что описаны все ключевые параметры конструктора
