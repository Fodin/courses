import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-2.3.md
//
// Реализуй симулятор паттерна Pub/Sub с fan-out: одно опубликованное сообщение
// доставляется всем subscribers данного топика одновременно.
//
// Требования:
// 1. Минимум 3 топика: order.created, payment.processed, user.registered
// 2. Для каждого топика — кнопка Publish с числом подписчиков (badge)
// 3. При публикации сообщение доставляется ВСЕМ subscribers данного топика
// 4. 3 начальных subscriber: Email Service (order.created), Analytics (order.created),
//    Fraud Detector (payment.processed)
// 5. Каждый subscriber отображает: название, топик, последние 3-5 сообщений
// 6. Анимация доставки — кратковременная подсветка subscriber при получении
// 7. Форма добавления нового subscriber: имя + выбор топика из dropdown
// 8. Кнопка удаления у каждого subscriber
// 9. Если у топика нет subscribers — Publish всё равно работает (сообщение уходит в никуда)
// 10. Счётчик опубликованных сообщений в кнопке Publish
// 11. Каждый топик — уникальный цвет (border, badge)

// TODO: определи тип Topic
// type Topic = 'order.created' | 'payment.processed' | 'user.registered'

// TODO: определи интерфейс Subscriber
// interface Subscriber { id: number; name: string; topic: Topic; receivedMessages: string[] }

// TODO: определи объект TOPIC_COLORS: Record<Topic, { border, badge, bg }>
// order.created: синий, payment.processed: фиолетовый, user.registered: зелёный

// TODO: определи константу TOPICS: Topic[] (массив всех топиков)

// TODO: определи начальный массив INITIAL_SUBSCRIBERS: Subscriber[]
// [Email Service/order.created, Analytics/order.created, Fraud Detector/payment.processed]

export function Task2_3() {
  const { t } = useLanguage()

  // TODO: добавь состояние subscribers (Subscriber[]) — копия INITIAL_SUBSCRIBERS
  // TODO: добавь состояние publishCounts: Record<Topic, number> — счётчики публикаций
  // TODO: добавь состояние highlightedIds (number[]) — ids подсвеченных subscribers
  // TODO: добавь состояние newSubName (string) — имя нового subscriber (форма)
  // TODO: добавь состояние newSubTopic (Topic) — топик нового subscriber (форма)

  // TODO: добавь useRef idCounterRef (number) — для уникальных id без коллизий
  // Инициализировать значением > max id в INITIAL_SUBSCRIBERS

  // TODO: реализуй функцию publish(topic: Topic)
  // 1. Инкрементировать publishCounts[topic]
  // 2. Сформировать текст сообщения: `${topic} #${publishCounts[topic] + 1}`
  // 3. Найти всех subscribers с matching topic
  // 4. Добавить сообщение в receivedMessages каждого (держать последние 5)
  // 5. Добавить их ids в highlightedIds (подсветка)
  // 6. Через 800ms убрать ids из highlightedIds (setHighlightedIds([]))

  // TODO: реализуй функцию addSubscriber()
  // Валидация: newSubName.trim() не пустой
  // Создать нового subscriber с idCounterRef.current++
  // Добавить в subscribers, сбросить newSubName

  // TODO: реализуй функцию removeSubscriber(id: number)
  // Фильтрует subscribers по id

  return (
    <div className="exercise-container">
      <h2>{t('task.2.3')}</h2>

      {/* TODO: секция Publisher */}
      {/* Заголовок "Publisher" */}
      {/* TOPICS.map — кнопка для каждого топика */}
      {/* Кнопка: "[Publish: {topic}]" + badge с числом подписчиков */}
      {/* Если publishCounts[topic] > 0 — дополнительный badge с "опубликовано N" */}
      {/* Цвет кнопки и badge = TOPIC_COLORS[topic].badge */}

      {/* TODO: секция Subscribers */}
      {/* Заголовок "Подписчики" */}
      {/* subscribers.map — карточка каждого subscriber */}
      {/* Карточка: */}
      {/*   - Имя subscriber + кнопка удаления (x) */}
      {/*   - Badge с топиком (цвет из TOPIC_COLORS) */}
      {/*   - Рамка карточки цвета TOPIC_COLORS[sub.topic].border */}
      {/*   - Если highlightedIds.includes(sub.id) — подсвеченный фон (transition 0.3s) */}
      {/*   - sub.receivedMessages.map — список последних сообщений */}
      {/*   - Если receivedMessages пуст — "(нет сообщений)" */}
      {/* Если subscribers пуст — сообщение "Нет подписчиков — добавьте первого" */}

      {/* TODO: форма добавления нового subscriber */}
      {/* input для имени (newSubName, onChange → setNewSubName) */}
      {/* select для топика (newSubTopic, onChange → setNewSubTopic) */}
      {/* Кнопка "+ Добавить" — вызывает addSubscriber() */}
      {/* Кнопка disabled если newSubName.trim() === '' */}
    </div>
  )
}
