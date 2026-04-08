import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-1.3.md
//
// Создай интерактивный реестр сервисов с регистрацией инстансов,
// health-проверками и балансировщиком нагрузки Round-Robin.
//
// Требования:
// 1. Реестр сгруппирован по именам сервисов (user-service, order-service, payment-service)
// 2. Каждый инстанс: цветной индикатор статуса, IP:port, responseTime, счётчик запросов, кнопка ×
// 3. Статусы: 'healthy' (зелёный), 'unhealthy' (красный), 'unknown' (жёлтый)
// 4. Выпадающий список для выбора шаблона при регистрации
// 5. Кнопка «+ Регистрация инстанса» — добавляет новый инстанс с уникальными IP и портом
// 6. Кнопка «Health Check» — сначала все → unknown, затем случайный re-check:
//    healthy: 85% шанс остаться healthy, 15% → unhealthy
//    unhealthy: 30% шанс → healthy, 70% остаться unhealthy
// 7. Load Balancer: выбор сервиса + кнопка «Маршрутизировать запрос»
// 8. Round-Robin: последовательно выбирает healthy инстансы выбранного сервиса
// 9. Лог маршрутизации: timestamp → host:port (responseTime ms) или ERROR
// 10. Статистика: всего инстансов, Healthy, Unhealthy, всего запросов

// TODO: определи интерфейс ServiceInstance
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
// [{ name: 'user-service', basePort: 8001 }, ...]
// Шаблоны используются для создания новых инстансов

// TODO: определи счётчик instanceCounter и функцию makeInstance(templateIndex)
// Функция генерирует инстанс с уникальными id, host (10.0.X.Y), port

// TODO: определи объект statusColor для трёх статусов

export function Task1_3() {
  const { t } = useLanguage()

  // TODO: добавь начальные инстансы в состояние instances
  // Начально: 2 x user-service, 1 x order-service, 1 x payment-service — все healthy
  // const [instances, setInstances] = useState<ServiceInstance[]>([...])

  // TODO: добавь состояние selectedTemplate (number) — индекс в SERVICE_TEMPLATES
  // TODO: добавь состояние lbLog (string[]) — лог Load Balancer
  // TODO: добавь состояние selectedService (string) — имя сервиса для LB
  // TODO: добавь состояние rrIndex (number) — счётчик Round-Robin
  // TODO: добавь состояние isChecking (boolean)

  // TODO: реализуй асинхронную функцию runHealthChecks()
  // 1. setIsChecking(true)
  // 2. Все инстансы → статус 'unknown', await 400ms
  // 3. Для каждого инстанса: случайно определи новый статус по вероятностям
  //    + обнови responseTime для healthy (случайное 8–48ms)
  // 4. setIsChecking(false)

  // TODO: реализуй функцию registerInstance()
  // Вызывает makeInstance(selectedTemplate), добавляет в instances
  // Начальный статус нового инстанса: 'unknown'

  // TODO: реализуй функцию deregisterInstance(id: string)
  // Фильтрует instances, убирая инстанс с указанным id

  // TODO: реализуй функцию sendRequest()
  // 1. Фильтрует healthy инстансы выбранного сервиса
  // 2. Если нет healthy — лог ERROR
  // 3. Иначе: Round-Robin — idx = rrIndex % healthy.length
  //    Увеличивает requests у целевого инстанса
  //    Добавляет в lbLog: `[HH:MM:SS] serviceName → host:port (Xms)`
  //    setRrIndex(v => v + 1)

  // TODO: вычисли groupedByName — массив { name, instances } для каждого шаблона
  // SERVICE_TEMPLATES.map(t => ({ name: t.name, instances: instances.filter(i => i.name === t.name) }))

  return (
    <div className="exercise-container">
      <h2>{t('task.1.3')}</h2>

      {/* TODO: панель управления */}
      {/* <select> с шаблонами сервисов для выбора */}
      {/* Кнопка «+ Регистрация инстанса» (зелёная) */}
      {/* Кнопка «Health Check» (синяя, disabled при isChecking) */}

      {/* TODO: Service Registry */}
      {/* groupedByName.map — для каждой группы: заголовок (имя сервиса) */}
      {/* Если нет инстансов → курсивный текст 'Нет инстансов' */}
      {/* Иначе → flex-row с карточками инстансов */}
      {/* Карточка: цветной dot-индикатор, IP:port, responseTime/статус, счётчик req, кнопка × */}
      {/* Healthy dot: box-shadow glow эффект */}

      {/* TODO: блок Load Balancer */}
      {/* <select> для выбора сервиса */}
      {/* Кнопка «Маршрутизировать запрос» (жёлтая) */}
      {/* Лог: прокручиваемый блок, зелёный текст для успеха, красный для ERROR */}

      {/* TODO: статистика — 4 карточки в ряд */}
      {/* Всего инстансов, Healthy, Unhealthy, Всего запросов */}
      {/* Каждая карточка: маленький лейбл + крупное цветное число */}
    </div>
  )
}
