import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 0.2: Архитектура — брокер, клиенты, топики
// ============================================

// TODO: Определи рекурсивный интерфейс TopicNode:
//   name (string) — только сегмент: 'temperature', не полный путь
//   full (string) — полный путь: 'home/sensor/temperature'
//   type: 'file' | 'dir'
//   children? (TopicNode[]) — только для директорий
//   hasMessage? (boolean) — есть ли текущее сообщение
//   retained? (boolean) — является ли retained
// interface TopicNode { ... }

// TODO: Создай дерево топиков topicTree минимум из 3 уровней:
//   home/
//     sensor/
//       temperature  (hasMessage: true, retained: true)
//       humidity     (hasMessage: true, retained: false)
//       pressure
//     light/
//       living_room  (hasMessage: true, retained: true)
//       bedroom
//     door/
//       status       (hasMessage: true, retained: true)
// const topicTree: TopicNode = { name: 'home', full: 'home', type: 'dir', children: [...] }

// TODO: Создай объект connectionInfo с полями:
//   host, port (1883), keepalive (60), clientId, protocolVersion ('MQTTv5')
// const connectionInfo = { ... }

// TODO: Реализуй функцию matchWildcard(pattern: string, topic: string): boolean
//   Правила:
//   - Разбей оба аргумента по '/'
//   - '#' совпадает с остальными уровнями (return true)
//   - '+' совпадает с любым одним уровнем
//   - Если уровни не совпадают и не wildcard — return false
//   - В конце: количество уровней должно совпадать
// function matchWildcard(pattern: string, topic: string): boolean { ... }

// TODO: Создай массив allLeafTopics — все конечные топики из дерева (без директорий):
// const allLeafTopics = ['home/sensor/temperature', 'home/sensor/humidity', ...]

// TODO: Реализуй вспомогательную функцию renderTopicNode:
//   Рекурсивно рендерит узлы дерева с отступами (depth * 20px)
//   Клик вызывает onSelect(node.full)
//   Выделение активного узла (синий фон)
//   Иконки: 📁 для dir, 📄 для file
//   Бейджи: 'retained' (жёлтый) или 'msg' (зелёный) если hasMessage
// function renderTopicNode(...) { ... }

export function Task0_2() {
  const { t } = useLanguage()

  // TODO: Создай состояние selectedTopic — string или null
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  // TODO: Создай состояние subscribeInput — string (дефолт: 'home/sensor/+')
  const [subscribeInput, setSubscribeInput] = useState('home/sensor/+')

  // TODO: Создай состояние matchedTopics — string[]
  const [matchedTopics, setMatchedTopics] = useState<string[]>([])

  // TODO: Реализуй функцию testSubscription():
  //   Фильтруй allLeafTopics через matchWildcard(subscribeInput, topic)
  //   Сохрани результат в matchedTopics
  const testSubscription = () => {
    // TODO: реализовать
    setMatchedTopics([])
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '900px' }}>
      <h2>{t('task.0.2')}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Дерево топиков */}
        <div>
          <h3 style={{ marginBottom: '0.75rem' }}>Дерево топиков</h3>

          {/* TODO: Здесь вызови renderTopicNode(topicTree, 0, selectedTopic, setSelectedTopic)
              Обернуть в блок с бордером и тёмным фоном */}
          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              background: '#1a1a2e',
              color: '#ccc',
              minHeight: '200px',
            }}
          >
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
              📁 home (TODO: реализовать дерево)
            </div>
          </div>

          {/* TODO: Если selectedTopic !== null, покажи выбранный топик
              в синем блоке с моноширинным шрифтом */}
          {selectedTopic && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.75rem',
                background: '#E3F2FD',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
              }}
            >
              Выбран: {selectedTopic}
            </div>
          )}
        </div>

        {/* Параметры подключения и тестер */}
        <div>
          {/* TODO: Отобрази connectionInfo в виде таблицы ключ-значение:
              - Ключ: моноширинный, серый цвет (#666)
              - Значение: жирный, синий (#1565C0), моноширинный
              - Разделительная линия между строками */}
          <h3 style={{ marginBottom: '0.75rem' }}>Параметры подключения</h3>
          <div
            style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}
          >
            <div style={{ color: '#aaa', fontSize: '0.85rem' }}>
              TODO: таблица connectionInfo
            </div>
          </div>

          {/* Тестер подписки */}
          <h3 style={{ marginBottom: '0.75rem' }}>Тестер wildcard-подписки</h3>

          {/* TODO: Реализуй поле ввода + кнопку "Тест":
              - Input с value={subscribeInput} и onChange
              - Кнопка "Тест" вызывает testSubscription()
              - Под полем: подсказка "+ = один уровень, # = все уровни ниже"
          */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              value={subscribeInput}
              onChange={e => setSubscribeInput(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem',
                fontFamily: 'monospace',
                border: '1px solid #ddd',
                borderRadius: '6px',
              }}
              placeholder="home/sensor/+"
            />
            <button
              onClick={testSubscription}
              style={{
                padding: '0.5rem 1rem',
                background: '#6A1B9A',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Тест
            </button>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
            + = один уровень, # = все уровни ниже
          </div>

          {/* TODO: Отобрази результаты:
              - Количество совпадений
              - Каждый совпавший топик с ✅ в зелёном блоке
              - Если совпадений нет — серое сообщение "Нажмите Тест"
          */}
          {matchedTopics.length > 0 ? (
            <div>
              <div style={{ fontSize: '0.8rem', color: '#2E7D32', marginBottom: '0.25rem' }}>
                Совпадений: {matchedTopics.length}
              </div>
              {matchedTopics.map(t => (
                <div key={t} style={{ fontFamily: 'monospace', fontSize: '0.85rem', padding: '4px 8px', background: '#E8F5E9', borderRadius: '4px', marginBottom: '4px' }}>
                  ✅ {t}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: '#999' }}>
              Введите паттерн и нажмите "Тест"
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
