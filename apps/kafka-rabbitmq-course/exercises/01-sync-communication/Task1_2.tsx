import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-1.2.md
//
// Создай интерактивный симулятор каскадного отказа в цепочке микросервисов
// с поддержкой Circuit Breaker.
//
// Требования:
// 1. Цепочка из 5 узлов: Client → Service A → Service B → Service C → Service D
// 2. Карточка каждого сервиса: имя, статус, время ответа
// 3. Кнопка «Отказ» под каждым сервисом (кроме Client) → статус: 'failed'
// 4. Тумблер Circuit Breaker ON/OFF
// 5. Кнопка «Симулировать запрос» — пошаговая анимация с логом
// 6. Без CB: таймаут каскадирует, суммируется 3000ms за каждый узел
// 7. С CB: быстрый отказ (0ms), Circuit Breaker переходит в OPEN
// 8. Итоговый баннер с суммарным временем ожидания
// 9. Кнопка «Сброс» возвращает все сервисы в Healthy

// TODO: определи тип ServiceName (union тип из имён 5 сервисов)
// type ServiceName = 'Client' | 'Service A' | 'Service B' | 'Service C' | 'Service D'

// TODO: определи тип ServiceStatus
// type ServiceStatus = 'healthy' | 'failed' | 'timeout' | 'open'

// TODO: определи интерфейс Service
// interface Service { name, status, responseTime, circuitOpen }

// TODO: определи константу INITIAL_SERVICES: Service[]
// Client (5ms), Service A (15ms), Service B (20ms), Service C (25ms), Service D (10ms)
// Все начально healthy, circuitOpen: false

// TODO: определи объекты statusColor и statusLabel для визуализации статусов
// healthy: '#10b981', failed: '#ef4444', timeout: '#f59e0b', open: '#6366f1'

export function Task1_2() {
  const { t } = useLanguage()

  // TODO: добавь состояние services (Service[]) — копия INITIAL_SERVICES
  // TODO: добавь состояние circuitBreakerEnabled (boolean)
  // TODO: добавь состояние isSimulating (boolean)
  // TODO: добавь состояние log (string[])
  // TODO: добавь состояние totalTime (number | null)

  // TODO: реализуй функцию reset()
  // Восстанавливает все сервисы в INITIAL_SERVICES, очищает лог и totalTime

  // TODO: реализуй функцию failService(index: number)
  // Переводит сервис с указанным индексом в статус 'failed'
  // Сбрасывает лог и totalTime

  // TODO: реализуй асинхронную функцию simulateCascade()
  // Алгоритм:
  // 1. Если нет failed сервиса — успешный запрос, totalTime = 55ms
  // 2. Иначе — итерируй по сервисам начиная с индекса 1:
  //    a. Если сервис healthy: лог 'Успешно (Xms)', total += responseTime, await 300ms
  //    b. Если сервис failed:
  //       - Если CB включён и circuitOpen: лог 'Circuit Breaker OPEN — быстрый отказ (0ms)', break
  //       - Иначе: лог таймаута (await 800ms), total += 3000ms
  //         Все upstream сервисы (idx <= i) → статус 'timeout'
  //         Если CB включён: текущий сервис → circuitOpen: true + лог о переходе в OPEN
  //         Итерируй назад и добавляй лог получения timeout для каждого

  return (
    <div className="exercise-container">
      <h2>{t('task.1.2')}</h2>

      {/* TODO: панель управления — кнопки и тумблер в одну строку */}
      {/* Кнопка «Симулировать запрос» (disabled при isSimulating) */}
      {/* Кнопка «Сброс» */}
      {/* Тумблер Circuit Breaker: зелёный при ON, серый при OFF */}
      {/* Тумблер реализуется как div с абсолютно позиционированным кружком */}

      {/* TODO: цепочка сервисов */}
      {/* services.map — карточка с именем, статусом и временем ответа */}
      {/* Между карточками — стрелка → */}
      {/* Под карточкой (кроме Client, i > 0) и только при статусе healthy — кнопка «Отказ» */}
      {/* Цвет рамки карточки = statusColor[svc.status] */}

      {/* TODO: итоговый баннер totalTime */}
      {/* Красный если totalTime > 5000 (с надписью 'Каскадный отказ!') */}
      {/* Зелёный если totalTime <= 100 (с надписью 'Circuit Breaker предотвратил каскад!') */}
      {/* Показывать только если totalTime !== null */}

      {/* TODO: лог событий */}
      {/* Прокручиваемый блок с log.map */}
      {/* Показывать только если log.length > 0 */}
      {/* Каждая строка — моноширинный шрифт, 12px */}

      {/* TODO: легенда статусов */}
      {/* Горизонтальный список: цветной кружок + текстовая метка для каждого статуса */}
    </div>
  )
}
