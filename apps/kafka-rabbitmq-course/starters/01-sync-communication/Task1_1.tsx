import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-1.1.md
//
// Создай интерактивный симулятор сравнения протоколов REST и gRPC.
//
// Требования:
// 1. Кнопки переключения протокола: REST и gRPC (только один активен)
// 2. Диаграмма: два блока (Order Service и User Service) с анимированной стрелкой
// 3. Индикатор текущей фазы: idle → requesting → processing → responding → done
// 4. Карточки статистики: Протокол, Transport, Encoding, Latency
// 5. Прогресс-бары для полезной нагрузки и overhead (заголовки, метаданные)
// 6. Кнопка запуска симуляции с асинхронной анимацией
// 7. Лог запроса/ответа с реальными телами сообщений

// TODO: определи тип Protocol
// type Protocol = 'REST' | 'gRPC'

// TODO: определи тип RequestStats с полями:
// protocol, latency, payloadSize, overhead, encoding, transport
// interface RequestStats { ... }

// TODO: определи тип LogEntry с полями:
// id, protocol, direction ('request' | 'response'), message, time
// interface LogEntry { ... }

// TODO: определи константу PROTOCOL_STATS: Record<Protocol, RequestStats>
// REST: latency 45ms, payloadSize 1240, overhead 840, encoding 'JSON (text)', transport 'HTTP/1.1'
// gRPC: latency 12ms, payloadSize 320, overhead 80, encoding 'Protobuf (binary)', transport 'HTTP/2'

// TODO: определи строковые константы REST_REQUEST, REST_RESPONSE, GRPC_REQUEST, GRPC_RESPONSE
// Это реалистичные тела HTTP/gRPC сообщений для отображения в логе

export function Task1_1() {
  const { t } = useLanguage()

  // TODO: добавь состояние protocol (Protocol), isAnimating (boolean), logs (LogEntry[])
  // TODO: добавь состояние phase: 'idle' | 'requesting' | 'processing' | 'responding' | 'done'
  // TODO: добавь useRef для счётчика id логов

  // TODO: реализуй функцию addLog(direction, message, time)
  // Добавляет новую запись в logs с уникальным id

  // TODO: реализуй асинхронную функцию runSimulation()
  // Шаги:
  // 1. setIsAnimating(true), setLogs([]), setPhase('requesting')
  // 2. await 600ms, addLog('request', ...) — тело запроса для текущего протокола
  // 3. setPhase('processing'), await stats.latency * 8
  // 4. setPhase('responding'), await 400ms
  // 5. addLog('response', ...) — тело ответа, setPhase('done'), setIsAnimating(false)

  return (
    <div className="exercise-container">
      <h2>{t('task.1.1')}</h2>

      {/* TODO: кнопки переключения протокола REST / gRPC */}
      {/* Активная кнопка: цветной фон (REST — жёлтый, gRPC — синий) */}
      {/* При переключении: setProtocol(p), setLogs([]), setPhase('idle') */}

      {/* TODO: диаграмма — два блока с анимированной стрелкой между ними */}
      {/* Order Service → (стрелка) → User Service */}
      {/* Стрелка: '→→→' при requesting, '←←←' при responding, '→' в остальных */}
      {/* User Service меняет цвет при phase === 'processing' */}

      {/* TODO: индикатор фазы — бейдж с цветом и текстом для каждой фазы */}
      {/* requesting: жёлтый, processing: синий, responding: зелёный, done/idle: серый */}

      {/* TODO: карточки статистики — 2 колонки, 4 карточки */}
      {/* Протокол, Transport, Encoding, Latency — из PROTOCOL_STATS[protocol] */}

      {/* TODO: прогресс-бары */}
      {/* Бар 1: полезная нагрузка = payloadSize - overhead байт (зелёный) */}
      {/* Бар 2: overhead = overhead байт (жёлтый) */}
      {/* Ширина бара = значение / 1300 * 100% */}

      {/* TODO: кнопка запуска симуляции */}
      {/* Disabled и серый во время анимации */}
      {/* Текст: 'Симуляция...' или `Отправить ${protocol} запрос` */}

      {/* TODO: лог запроса и ответа */}
      {/* logs.map — блок с pre для тела сообщения */}
      {/* Граница: жёлтая для request, зелёная для response */}
      {/* Время ответа (+Xms) показывается только если time > 0 */}
    </div>
  )
}
