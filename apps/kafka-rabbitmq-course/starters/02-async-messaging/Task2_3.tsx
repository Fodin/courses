import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-2.3.md
// Task description: task-2.3.md
//
// Реализуй симулятор паттерна Pub/Sub с fan-out: одно опубликованное сообщение
// Implement a Pub/Sub pattern simulator with fan-out: one published message
// доставляется всем subscribers данного топика одновременно.
// is delivered to all subscribers of that topic simultaneously.
//
// Требования:
// Requirements:
// 1. Минимум 3 топика: order.created, payment.processed, user.registered
// 1. At least 3 topics: order.created, payment.processed, user.registered
// 2. Для каждого топика — кнопка Publish с числом подписчиков (badge)
// 2. For each topic — a Publish button with subscriber count (badge)
// 3. При публикации сообщение доставляется ВСЕМ subscribers данного топика
// 3. On publish, the message is delivered to ALL subscribers of that topic
// 4. 3 начальных subscriber: Email Service (order.created), Analytics (order.created),
// 4. 3 initial subscribers: Email Service (order.created), Analytics (order.created),
//    Fraud Detector (payment.processed)
//    Fraud Detector (payment.processed)
// 5. Каждый subscriber отображает: название, топик, последние 3-5 сообщений
// 5. Each subscriber displays: name, topic, last 3-5 messages
// 6. Анимация доставки — кратковременная подсветка subscriber при получении
// 6. Delivery animation — brief highlight of subscriber upon receiving
// 7. Форма добавления нового subscriber: имя + выбор топика из dropdown
// 7. Form to add a new subscriber: name + topic selection from dropdown
// 8. Кнопка удаления у каждого subscriber
// 8. Delete button on each subscriber
// 9. Если у топика нет subscribers — Publish всё равно работает (сообщение уходит в никуда)
// 9. If a topic has no subscribers — Publish still works (message goes nowhere)
// 10. Счётчик опубликованных сообщений в кнопке Publish
// 10. Published message counter in the Publish button
// 11. Каждый топик — уникальный цвет (border, badge)
// 11. Each topic — a unique color (border, badge)

// TODO: определи тип Topic / define Topic type
// type Topic = 'order.created' | 'payment.processed' | 'user.registered'

// TODO: определи интерфейс Subscriber / define Subscriber interface
// interface Subscriber { id: number; name: string; topic: Topic; receivedMessages: string[] }

// TODO: определи объект TOPIC_COLORS: Record<Topic, { border, badge, bg }>
// TODO: define TOPIC_COLORS: Record<Topic, { border, badge, bg }>
// order.created: синий, payment.processed: фиолетовый, user.registered: зелёный
// order.created: blue, payment.processed: purple, user.registered: green

// TODO: определи константу TOPICS: Topic[] (массив всех топиков)
// TODO: define constant TOPICS: Topic[] (array of all topics)

// TODO: определи начальный массив INITIAL_SUBSCRIBERS: Subscriber[]
// TODO: define initial array INITIAL_SUBSCRIBERS: Subscriber[]
// [Email Service/order.created, Analytics/order.created, Fraud Detector/payment.processed]

export function Task2_3() {
  const { t } = useLanguage()

  // TODO: добавь состояние subscribers (Subscriber[]) — копия INITIAL_SUBSCRIBERS
  // TODO: add state subscribers (Subscriber[]) — copy of INITIAL_SUBSCRIBERS
  // TODO: добавь состояние publishCounts: Record<Topic, number> — счётчики публикаций
  // TODO: add state publishCounts: Record<Topic, number> — publish counters
  // TODO: добавь состояние highlightedIds (number[]) — ids подсвеченных subscribers
  // TODO: add state highlightedIds (number[]) — ids of highlighted subscribers
  // TODO: добавь состояние newSubName (string) — имя нового subscriber (форма)
  // TODO: add state newSubName (string) — name of new subscriber (form)
  // TODO: добавь состояние newSubTopic (Topic) — топик нового subscriber (форма)
  // TODO: add state newSubTopic (Topic) — topic of new subscriber (form)

  // TODO: добавь useRef idCounterRef (number) — для уникальных id без коллизий
  // TODO: add useRef idCounterRef (number) — for unique ids without collisions
  // Инициализировать значением > max id в INITIAL_SUBSCRIBERS
  // Initialize with value > max id in INITIAL_SUBSCRIBERS

  // TODO: реализуй функцию publish(topic: Topic)
  // TODO: implement publish(topic: Topic) function
  // 1. Инкрементировать publishCounts[topic]
  // 1. Increment publishCounts[topic]
  // 2. Сформировать текст сообщения: `${topic} #${publishCounts[topic] + 1}`
  // 2. Form message text: `${topic} #${publishCounts[topic] + 1}`
  // 3. Найти всех subscribers с matching topic
  // 3. Find all subscribers with matching topic
  // 4. Добавить сообщение в receivedMessages каждого (держать последние 5)
  // 4. Add message to receivedMessages of each (keep last 5)
  // 5. Добавить их ids в highlightedIds (подсветка)
  // 5. Add their ids to highlightedIds (highlight)
  // 6. Через 800ms убрать ids из highlightedIds (setHighlightedIds([]))
  // 6. After 800ms remove ids from highlightedIds (setHighlightedIds([]))

  // TODO: реализуй функцию addSubscriber()
  // TODO: implement addSubscriber() function
  // Валидация: newSubName.trim() не пустой
  // Validation: newSubName.trim() not empty
  // Создать нового subscriber с idCounterRef.current++
  // Create new subscriber with idCounterRef.current++
  // Добавить в subscribers, сбросить newSubName
  // Add to subscribers, reset newSubName

  // TODO: реализуй функцию removeSubscriber(id: number)
  // TODO: implement removeSubscriber(id: number) function
  // Фильтрует subscribers по id
  // Filters subscribers by id

  return (
    <div className="exercise-container">
      <h2>{t('task.2.3')}</h2>

      {/* TODO: секция Publisher */}
      {/* TODO: Publisher section */}
      {/* Заголовок "Publisher" */}
      {/* Heading "Publisher" */}
      {/* TOPICS.map — кнопка для каждого топика */}
      {/* TOPICS.map — button for each topic */}
      {/* Кнопка: "[Publish: {topic}]" + badge с числом подписчиков */}
      {/* Button: "[Publish: {topic}]" + badge with subscriber count */}
      {/* Если publishCounts[topic] > 0 — дополнительный badge с "опубликовано N" */}
      {/* If publishCounts[topic] > 0 — additional badge with "published N" */}
      {/* Цвет кнопки и badge = TOPIC_COLORS[topic].badge */}
      {/* Button and badge color = TOPIC_COLORS[topic].badge */}

      {/* TODO: секция Subscribers */}
      {/* TODO: Subscribers section */}
      {/* Заголовок "Подписчики" */}
      {/* Heading "Subscribers" */}
      {/* subscribers.map — карточка каждого subscriber */}
      {/* subscribers.map — card for each subscriber */}
      {/* Карточка: */}
      {/* Card: */}
      {/*   - Имя subscriber + кнопка удаления (x) */}
      {/*   - Subscriber name + delete button (x) */}
      {/*   - Badge с топиком (цвет из TOPIC_COLORS) */}
      {/*   - Badge with topic (color from TOPIC_COLORS) */}
      {/*   - Рамка карточки цвета TOPIC_COLORS[sub.topic].border */}
      {/*   - Card border color TOPIC_COLORS[sub.topic].border */}
      {/*   - Если highlightedIds.includes(sub.id) — подсвеченный фон (transition 0.3s) */}
      {/*   - If highlightedIds.includes(sub.id) — highlighted background (transition 0.3s) */}
      {/*   - sub.receivedMessages.map — список последних сообщений */}
      {/*   - sub.receivedMessages.map — list of recent messages */}
      {/*   - Если receivedMessages пуст — "(нет сообщений)" */}
      {/*   - If receivedMessages empty — "(no messages)" */}
      {/* Если subscribers пуст — сообщение "Нет подписчиков — добавьте первого" */}
      {/* If subscribers empty — message "No subscribers — add the first one" */}

      {/* TODO: форма добавления нового subscriber */}
      {/* TODO: form to add a new subscriber */}
      {/* input для имени (newSubName, onChange → setNewSubName) */}
      {/* input for name (newSubName, onChange → setNewSubName) */}
      {/* select для топика (newSubTopic, onChange → setNewSubTopic) */}
      {/* select for topic (newSubTopic, onChange → setNewSubTopic) */}
      {/* Кнопка "+ Добавить" — вызывает addSubscriber() */}
      {/* Button "+ Add" — calls addSubscriber() */}
      {/* Кнопка disabled если newSubName.trim() === '' */}
      {/* Button disabled if newSubName.trim() === '' */}
    </div>
  )
}
