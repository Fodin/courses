import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-1.3.md
// Task description: task-1.3.md
//
// Создай интерактивный реестр сервисов с регистрацией инстансов,
// health-проверками и балансировщиком нагрузки Round-Robin.
// Create an interactive service registry with instance registration,
// health checks, and a Round-Robin load balancer.
//
// Требования:
// Requirements:
// 1. Реестр сгруппирован по именам сервисов (user-service, order-service, payment-service)
// 1. Registry grouped by service names (user-service, order-service, payment-service)
// 2. Каждый инстанс: цветной индикатор статуса, IP:port, responseTime, счётчик запросов, кнопка ×
// 2. Each instance: colored status indicator, IP:port, responseTime, request counter, × button
// 3. Статусы: 'healthy' (зелёный), 'unhealthy' (красный), 'unknown' (жёлтый)
// 3. Statuses: 'healthy' (green), 'unhealthy' (red), 'unknown' (yellow)
// 4. Выпадающий список для выбора шаблона при регистрации
// 4. Dropdown for selecting a template during registration
// 5. Кнопка «+ Регистрация инстанса» — добавляет новый инстанс с уникальными IP и портом
// 5. "+ Register Instance" button — adds a new instance with unique IP and port
// 6. Кнопка «Health Check» — сначала все → unknown, затем случайный re-check:
//    healthy: 85% шанс остаться healthy, 15% → unhealthy
//    unhealthy: 30% шанс → healthy, 70% остаться unhealthy
// 6. "Health Check" button — first all → unknown, then random re-check:
//    healthy: 85% chance to stay healthy, 15% → unhealthy
//    unhealthy: 30% chance → healthy, 70% chance to stay unhealthy
// 7. Load Balancer: выбор сервиса + кнопка «Маршрутизировать запрос»
// 7. Load Balancer: service selection + "Route Request" button
// 8. Round-Robin: последовательно выбирает healthy инстансы выбранного сервиса
// 8. Round-Robin: sequentially selects healthy instances of the chosen service
// 9. Лог маршрутизации: timestamp → host:port (responseTime ms) или ERROR
// 9. Routing log: timestamp → host:port (responseTime ms) or ERROR
// 10. Статистика: всего инстансов, Healthy, Unhealthy, всего запросов
// 10. Statistics: total instances, Healthy, Unhealthy, total requests

// TODO: определи интерфейс ServiceInstance
// TODO: define the ServiceInstance interface
// interface ServiceInstance {
//   id: string
//   name: string
//   host: string
//   port: number
//   status: 'healthy' | 'unhealthy' | 'unknown'
//   lastCheck: number
//   responseTime: number
//   requests: number
// }

// TODO: определи массив SERVICE_TEMPLATES с шаблонами сервисов
// TODO: define the SERVICE_TEMPLATES array with service templates
// [{ name: 'user-service', basePort: 8001 }, ...]
// Шаблоны используются для создания новых инстансов
// Templates are used for creating new instances

// TODO: определи счётчик instanceCounter и функцию makeInstance(templateIndex)
// TODO: define the instanceCounter variable and makeInstance(templateIndex) function
// Функция генерирует инстанс с уникальными id, host (10.0.X.Y), port
// The function generates an instance with unique id, host (10.0.X.Y), port

// TODO: определи объект statusColor для трёх статусов
// TODO: define the statusColor object for the three statuses

export function Task1_3() {
  const { t } = useLanguage()

  // TODO: добавь начальные инстансы в состояние instances
  // TODO: add initial instances to the instances state
  // Начально: 2 x user-service, 1 x order-service, 1 x payment-service — все healthy
  // Initially: 2 x user-service, 1 x order-service, 1 x payment-service — all healthy
  // const [instances, setInstances] = useState<ServiceInstance[]>([...])

  // TODO: добавь состояние selectedTemplate (number) — индекс в SERVICE_TEMPLATES
  // TODO: add selectedTemplate state (number) — index in SERVICE_TEMPLATES
  // TODO: добавь состояние lbLog (string[]) — лог Load Balancer
  // TODO: add lbLog state (string[]) — Load Balancer log
  // TODO: добавь состояние selectedService (string) — имя сервиса для LB
  // TODO: add selectedService state (string) — service name for LB
  // TODO: добавь состояние rrIndex (number) — счётчик Round-Robin
  // TODO: add rrIndex state (number) — Round-Robin counter
  // TODO: добавь состояние isChecking (boolean)
  // TODO: add isChecking state (boolean)

  // TODO: реализуй асинхронную функцию runHealthChecks()
  // TODO: implement the async function runHealthChecks()
  // 1. setIsChecking(true)
  // 2. Все инстансы → статус 'unknown', await 400ms
  // 2. All instances → status 'unknown', await 400ms
  // 3. Для каждого инстанса: случайно определи новый статус по вероятностям
  // 3. For each instance: randomly determine new status based on probabilities
  //    + обнови responseTime для healthy (случайное 8–48ms)
  //    + update responseTime for healthy (random 8–48ms)
  // 4. setIsChecking(false)

  // TODO: реализуй функцию registerInstance()
  // TODO: implement the registerInstance() function
  // Вызывает makeInstance(selectedTemplate), добавляет в instances
  // Calls makeInstance(selectedTemplate), adds to instances
  // Начальный статус нового инстанса: 'unknown'
  // Initial status of new instance: 'unknown'

  // TODO: реализуй функцию deregisterInstance(id: string)
  // TODO: implement the deregisterInstance(id: string) function
  // Фильтрует instances, убирая инстанс с указанным id
  // Filters instances, removing the one with the given id

  // TODO: реализуй функцию sendRequest()
  // TODO: implement the sendRequest() function
  // 1. Фильтрует healthy инстансы выбранного сервиса
  // 1. Filters healthy instances of the selected service
  // 2. Если нет healthy — лог ERROR
  // 2. If no healthy — log ERROR
  // 3. Иначе: Round-Robin — idx = rrIndex % healthy.length
  // 3. Otherwise: Round-Robin — idx = rrIndex % healthy.length
  //    Увеличивает requests у целевого инстанса
  //    Increments requests on the target instance
  //    Добавляет в lbLog: `[HH:MM:SS] serviceName → host:port (Xms)`
  //    Adds to lbLog: `[HH:MM:SS] serviceName → host:port (Xms)`
  //    setRrIndex(v => v + 1)

  // TODO: вычисли groupedByName — массив { name, instances } для каждого шаблона
  // TODO: compute groupedByName — array of { name, instances } for each template
  // SERVICE_TEMPLATES.map(t => ({ name: t.name, instances: instances.filter(i => i.name === t.name) }))

  return (
    <div className="exercise-container">
      <h2>{t('task.1.3')}</h2>

      {/* TODO: панель управления */}
      {/* TODO: control panel */}
      {/* <select> с шаблонами сервисов для выбора */}
      {/* <select> with service templates for selection */}
      {/* Кнопка «+ Регистрация инстанса» (зелёная) */}
      {/* "+ Register Instance" button (green) */}
      {/* Кнопка «Health Check» (синяя, disabled при isChecking) */}
      {/* "Health Check" button (blue, disabled when isChecking) */}

      {/* TODO: Service Registry */}
      {/* groupedByName.map — для каждой группы: заголовок (имя сервиса) */}
      {/* groupedByName.map — for each group: heading (service name) */}
      {/* Если нет инстансов → курсивный текст 'Нет инстансов' */}
      {/* If no instances → italic text 'No instances' */}
      {/* Иначе → flex-row с карточками инстансов */}
      {/* Otherwise → flex-row with instance cards */}
      {/* Карточка: цветной dot-индикатор, IP:port, responseTime/статус, счётчик req, кнопка × */}
      {/* Card: colored dot indicator, IP:port, responseTime/status, req counter, × button */}
      {/* Healthy dot: box-shadow glow эффект */}
      {/* Healthy dot: box-shadow glow effect */}

      {/* TODO: блок Load Balancer */}
      {/* TODO: Load Balancer block */}
      {/* <select> для выбора сервиса */}
      {/* <select> for service selection */}
      {/* Кнопка «Маршрутизировать запрос» (жёлтая) */}
      {/* "Route Request" button (yellow) */}
      {/* Лог: прокручиваемый блок, зелёный текст для успеха, красный для ERROR */}
      {/* Log: scrollable block, green text for success, red for ERROR */}

      {/* TODO: статистика — 4 карточки в ряд */}
      {/* TODO: statistics — 4 cards in a row */}
      {/* Всего инстансов, Healthy, Unhealthy, Всего запросов */}
      {/* Total instances, Healthy, Unhealthy, Total requests */}
      {/* Каждая карточка: маленький лейбл + крупное цветное число */}
      {/* Each card: small label + large colored number */}
    </div>
  )
}
