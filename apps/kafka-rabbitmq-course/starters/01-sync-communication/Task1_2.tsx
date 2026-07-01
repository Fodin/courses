import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-1.2.md
// Task description: task-1.2.md
//
// Создай интерактивный симулятор каскадного отказа в цепочке микросервисов
// с поддержкой Circuit Breaker.
// Create an interactive cascading failure simulator in a chain of microservices
// with Circuit Breaker support.
//
// Требования:
// Requirements:
// 1. Цепочка из 5 узлов: Client → Service A → Service B → Service C → Service D
// 1. Chain of 5 nodes: Client → Service A → Service B → Service C → Service D
// 2. Карточка каждого сервиса: имя, статус, время ответа
// 2. Each service card: name, status, response time
// 3. Кнопка «Отказ» под каждым сервисом (кроме Client) → статус: 'failed'
// 3. "Failure" button under each service (except Client) → status: 'failed'
// 4. Тумблер Circuit Breaker ON/OFF
// 4. Circuit Breaker toggle ON/OFF
// 5. Кнопка «Симулировать запрос» — пошаговая анимация с логом
// 5. "Simulate Request" button — step-by-step animation with log
// 6. Без CB: таймаут каскадирует, суммируется 3000ms за каждый узел
// 6. Without CB: timeout cascades, accumulates 3000ms per node
// 7. С CB: быстрый отказ (0ms), Circuit Breaker переходит в OPEN
// 7. With CB: fast failure (0ms), Circuit Breaker transitions to OPEN
// 8. Итоговый баннер с суммарным временем ожидания
// 8. Final banner with total wait time
// 9. Кнопка «Сброс» возвращает все сервисы в Healthy
// 9. "Reset" button returns all services to Healthy

// TODO: определи тип ServiceName (union тип из имён 5 сервисов)
// TODO: define ServiceName type (union type of 5 service names)
// type ServiceName = 'Client' | 'Service A' | 'Service B' | 'Service C' | 'Service D'

// TODO: определи тип ServiceStatus
// TODO: define ServiceStatus type
// type ServiceStatus = 'healthy' | 'failed' | 'timeout' | 'open'

// TODO: определи интерфейс Service
// TODO: define Service interface
// interface Service { name, status, responseTime, circuitOpen }

// TODO: определи константу INITIAL_SERVICES: Service[]
// TODO: define INITIAL_SERVICES constant: Service[]
// Client (5ms), Service A (15ms), Service B (20ms), Service C (25ms), Service D (10ms)
// Все начально healthy, circuitOpen: false
// All initially healthy, circuitOpen: false

// TODO: определи объекты statusColor и statusLabel для визуализации статусов
// TODO: define statusColor and statusLabel objects for status visualization
// healthy: '#10b981', failed: '#ef4444', timeout: '#f59e0b', open: '#6366f1'

export function Task1_2() {
  const { t } = useLanguage()

  // TODO: добавь состояние services (Service[]) — копия INITIAL_SERVICES
  // TODO: add services state (Service[]) — copy of INITIAL_SERVICES
  // TODO: добавь состояние circuitBreakerEnabled (boolean)
  // TODO: add circuitBreakerEnabled state (boolean)
  // TODO: добавь состояние isSimulating (boolean)
  // TODO: add isSimulating state (boolean)
  // TODO: добавь состояние log (string[])
  // TODO: add log state (string[])
  // TODO: добавь состояние totalTime (number | null)
  // TODO: add totalTime state (number | null)

  // TODO: реализуй функцию reset()
  // TODO: implement reset() function
  // Восстанавливает все сервисы в INITIAL_SERVICES, очищает лог и totalTime
  // Restores all services to INITIAL_SERVICES, clears log and totalTime

  // TODO: реализуй функцию failService(index: number)
  // TODO: implement failService(index: number) function
  // Переводит сервис с указанным индексом в статус 'failed'
  // Sets the service at the specified index to status 'failed'
  // Сбрасывает лог и totalTime
  // Resets log and totalTime

  // TODO: реализуй асинхронную функцию simulateCascade()
  // TODO: implement async simulateCascade() function
  // Алгоритм:
  // Algorithm:
  // 1. Если нет failed сервиса — успешный запрос, totalTime = 55ms
  // 1. If no failed service — successful request, totalTime = 55ms
  // 2. Иначе — итерируй по сервисам начиная с индекса 1:
  // 2. Otherwise — iterate through services starting from index 1:
  //    a. Если сервис healthy: лог 'Успешно (Xms)', total += responseTime, await 300ms
  //    a. If service healthy: log 'Success (Xms)', total += responseTime, await 300ms
  //    b. Если сервис failed:
  //    b. If service failed:
  //       - Если CB включён и circuitOpen: лог 'Circuit Breaker OPEN — быстрый отказ (0ms)', break
  //       - If CB enabled and circuitOpen: log 'Circuit Breaker OPEN — fast failure (0ms)', break
  //       - Иначе: лог таймаута (await 800ms), total += 3000ms
  //       - Otherwise: timeout log (await 800ms), total += 3000ms
  //         Все upstream сервисы (idx <= i) → статус 'timeout'
  //         All upstream services (idx <= i) → status 'timeout'
  //         Если CB включён: текущий сервис → circuitOpen: true + лог о переходе в OPEN
  //         If CB enabled: current service → circuitOpen: true + log about transition to OPEN
  //         Итерируй назад и добавляй лог получения timeout для каждого
  //         Iterate backwards and add log of receiving timeout for each

  return (
    <div className="exercise-container">
      <h2>{t('task.1.2')}</h2>

      {/* TODO: панель управления — кнопки и тумблер в одну строку */}
      {/* TODO: control panel — buttons and toggle in one row */}
      {/* Кнопка «Симулировать запрос» (disabled при isSimulating) */}
      {/* "Simulate Request" button (disabled when isSimulating) */}
      {/* Кнопка «Сброс» */}
      {/* "Reset" button */}
      {/* Тумблер Circuit Breaker: зелёный при ON, серый при OFF */}
      {/* Circuit Breaker toggle: green when ON, gray when OFF */}
      {/* Тумблер реализуется как div с абсолютно позиционированным кружком */}
      {/* Toggle implemented as a div with an absolutely positioned circle */}

      {/* TODO: цепочка сервисов */}
      {/* TODO: service chain */}
      {/* services.map — карточка с именем, статусом и временем ответа */}
      {/* services.map — card with name, status, and response time */}
      {/* Между карточками — стрелка → */}
      {/* Between cards — arrow → */}
      {/* Под карточкой (кроме Client, i > 0) и только при статусе healthy — кнопка «Отказ» */}
      {/* Under card (except Client, i > 0) and only when status is healthy — "Failure" button */}
      {/* Цвет рамки карточки = statusColor[svc.status] */}
      {/* Card border color = statusColor[svc.status] */}

      {/* TODO: итоговый баннер totalTime */}
      {/* TODO: final totalTime banner */}
      {/* Красный если totalTime > 5000 (с надписью 'Каскадный отказ!') */}
      {/* Red if totalTime > 5000 (with label 'Cascading failure!') */}
      {/* Зелёный если totalTime <= 100 (с надписью 'Circuit Breaker предотвратил каскад!') */}
      {/* Green if totalTime <= 100 (with label 'Circuit Breaker prevented cascade!') */}
      {/* Показывать только если totalTime !== null */}
      {/* Show only if totalTime !== null */}

      {/* TODO: лог событий */}
      {/* TODO: event log */}
      {/* Прокручиваемый блок с log.map */}
      {/* Scrollable block with log.map */}
      {/* Показывать только если log.length > 0 */}
      {/* Show only if log.length > 0 */}
      {/* Каждая строка — моноширинный шрифт, 12px */}
      {/* Each line — monospace font, 12px */}

      {/* TODO: легенда статусов */}
      {/* TODO: status legend */}
      {/* Горизонтальный список: цветной кружок + текстовая метка для каждого статуса */}
      {/* Horizontal list: colored circle + text label for each status */}
    </div>
  )
}
