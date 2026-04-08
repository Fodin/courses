# Задание 2.3: Pub/Sub — fan-out симулятор

## Цель

Реализовать симулятор паттерна Pub/Sub (Publisher-Subscriber) с поддержкой нескольких topics и динамическим управлением подписчиками. Ключевая идея: одно опубликованное сообщение доставляется всем subscribers данного топика одновременно — fan-out.

---

## Требования

1. Реализуйте минимум 3 topic (например: `order.created`, `payment.processed`, `user.registered`)
2. Для каждого топика отображайте кнопку "Publish" с именем топика и счётчиком subscribers
3. При публикации сообщение должно быть доставлено **всем** subscribers данного топика
4. Начальное состояние: 3 предустановленных subscriber (Email Service на order.created, Analytics на order.created, Fraud Detector на payment.processed)
5. Каждый subscriber отображает: название, свой топик, последние 3-5 полученных сообщений
6. При публикации должна быть видна анимация доставки — subscriber кратковременно подсвечивается или отображает "Получает сообщение..."
7. Добавьте форму для создания нового subscriber: поле имени + выбор топика из dropdown
8. Добавьте кнопку удаления у каждого subscriber
9. Если у топика нет subscribers — кнопка Publish всё равно работает (сообщение уходит в никуда)
10. Отображайте счётчик опубликованных сообщений в кнопке Publish
11. Каждый топик должен быть визуально отличим по цвету (border, badge)

---

## Чеклист

- [ ] Массив subscribers в state с полями `id`, `name`, `topic`, `receivedMessages`
- [ ] Функция `publish(topic)` находит всех subscribers с matching topic и доставляет им сообщение
- [ ] Анимация подсветки subscriber при получении сообщения (временное изменение состояния)
- [ ] Кнопка Publish для каждого топика показывает `N subs` badge
- [ ] Форма добавления subscriber с валидацией непустого имени
- [ ] Кнопка удаления для каждого subscriber
- [ ] История полученных сообщений (последние 3-5) для каждого subscriber
- [ ] Каждый топик имеет уникальную цветовую схему
- [ ] ID subscribers корректно управляется через ref (не через state) для предотвращения коллизий
- [ ] Компонент работает при 0 subscribers — кнопка Publish не крашится

---

## Как проверить себя

1. Нажмите "Publish: order.created" — оба subscriber (Email Service и Analytics) должны получить сообщение одновременно. Fraud Detector — нет
2. Нажмите "Publish: payment.processed" — только Fraud Detector получает сообщение
3. Добавьте нового subscriber "Audit Log" на `order.created`
4. Нажмите "Publish: order.created" снова — теперь 3 subscriber должны получить сообщение
5. Удалите Email Service и снова нажмите Publish — только Analytics и Audit Log получат
6. Добавьте subscriber с пустым именем — форма не должна его принять

### Ожидаемый результат

```
Publisher: [order.created ▶ 2 subs] [payment.processed ▶ 1 sub] [user.registered ▶ 0 subs]

Email Service      Analytics          Fraud Detector
topic: order.*     topic: order.*     topic: payment.*
[ORDER #1]         [ORDER #1]         (нет сообщений)
[ORDER #2]         [ORDER #2]

При публикации order.created #3:
Email Service и Analytics одновременно подсвечиваются, получают ORDER #3
```

### Ключевое поведение для проверки

Убедитесь, что publisher абсолютно не зависит от числа subscribers: одна и та же функция `publish` работает при 0, 1 и 10 subscribers без изменений. Это и есть главное свойство Pub/Sub — decoupling между publisher и subscribers.
