import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-0.2.md
//
// Создай интерактивную карту зависимостей микросервисов.
//
// Требования:
// 1. Визуализация 6 сервисов в виде прямоугольников на SVG-холсте
// 2. Линии между сервисами показывают зависимости (dependsOn)
// 3. Клик на сервис подсвечивает его и связанные сервисы по типам влияния:
//    - selected: выбранный сервис
//    - depends-on: сервисы, которые зависят от выбранного (напрямую затронуты)
//    - depended-by: сервисы, от которых зависит выбранный
//    - affected: косвенно затронутые сервисы
// 4. Легенда с цветовым обозначением типов влияния
// 5. Блок с описанием blast radius выбранного сервиса
// 6. Повторный клик снимает выделение

// TODO: определи тип Service для описания узла графа
// interface Service {
//   id: string
//   label: string
//   x: number       // координата X на SVG
//   y: number       // координата Y на SVG
//   color: string
//   dependsOn: string[]  // id сервисов, от которых зависит этот
// }

// TODO: определи тип ImpactLevel для категоризации влияния при падении сервиса
// type ImpactLevel = 'selected' | 'depends-on' | 'depended-by' | 'affected' | 'none'

// TODO: задай данные сервисов со связями между ними
// const SERVICES: Service[] = [
//   { id: 'api-gateway', label: 'API Gateway', x: 200, y: 20, color: '#4f86f7', dependsOn: [] },
//   { id: 'users', label: 'User Service', x: 50, y: 130, color: '#f7844f', dependsOn: ['api-gateway'] },
//   { id: 'orders', label: 'Order Service', x: 200, y: 130, color: '#4fbe7c', dependsOn: ['api-gateway', 'users', 'inventory', 'payments'] },
//   { id: 'payments', label: 'Payment Service', x: 360, y: 130, color: '#b34ff7', dependsOn: ['api-gateway', 'users'] },
//   { id: 'inventory', label: 'Inventory Service', x: 50, y: 260, color: '#f7d44f', dependsOn: ['users'] },
//   { id: 'notifications', label: 'Notification Service', x: 360, y: 260, color: '#f74fa0', dependsOn: ['users', 'orders', 'payments'] },
// ]

// TODO: задай цвета для каждого уровня влияния
// const impactColors: Record<ImpactLevel, string> = {
//   'selected': '#e53e3e',
//   'depends-on': '#e53e3e',
//   'depended-by': '#4f86f7',
//   'affected': '#ed8936',
//   'none': '#ddd',
// }

// TODO: задай текстовые метки для легенды
// const impactLabels: Record<ImpactLevel, string> = { ... }

export function Task0_2() {
  const { t } = useLanguage()

  // TODO: добавь состояние для выбранного сервиса
  // const [selectedId, setSelectedId] = useState<string | null>(null)

  // TODO: реализуй функцию getServiceImpact(serviceId: string): ImpactLevel
  // Алгоритм:
  // - если selectedId === null → 'none'
  // - если serviceId === selectedId → 'selected'
  // - если текущий сервис зависит от выбранного → 'depends-on'
  // - если выбранный сервис зависит от текущего → 'depended-by'
  // - если текущий зависит от тех, кто зависит от выбранного → 'affected'
  // - иначе → 'none'
  // const getServiceImpact = (serviceId: string): ImpactLevel => { ... }

  // TODO: реализуй getNodeColor(id: string): string
  // Если есть выделение — используй impactColors[impact], иначе — собственный цвет сервиса
  // const getNodeColor = (id: string): string => { ... }

  // TODO: реализуй isEdgeHighlighted(from: Service, toId: string): boolean
  // Ребро выделяется если оно связано с выбранным сервисом
  // const isEdgeHighlighted = (from: Service, toId: string): boolean => { ... }

  const SVG_W = 500
  const SVG_H = 360

  return (
    <div className="exercise-container">
      <h2>{t('task.0.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        {/* TODO: добавь инструкцию — кликни на сервис, чтобы увидеть blast radius */}
      </p>

      <svg
        width="100%"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ border: '1px solid #eee', borderRadius: '12px', background: '#fafafa', maxHeight: '360px' }}
      >
        {/* TODO: нарисуй рёбра — для каждого сервиса итерируйся по dependsOn */}
        {/* Каждое ребро — тег <line> от центра узла к центру зависимости */}
        {/* Выделенные рёбра: сплошная линия, невыделенные: пунктир */}

        {/* TODO: нарисуй узлы — для каждого сервиса <g> с <rect> и <text> внутри */}
        {/* При наличии выделения: незатронутые узлы делай полупрозрачными */}
        {/* Для выделенного сервиса добавь маркер (например, <circle>) */}
      </svg>

      {/* TODO: покажи легенду цветов (только когда есть selectedId) */}
      {/* Пройди по impactLabels, отфильтруй пустые, нарисуй цветной кружок + текст */}

      {/* TODO: покажи блок blast radius (только когда есть selectedId) */}
      {/* Найди прямых зависимых: SERVICES.filter(s => s.dependsOn.includes(selectedId)) */}
      {/* Если зависимых нет — "изолированное падение", иначе — список затронутых */}

      {/* TODO: покажи подсказку "Кликни на сервис" когда ничего не выбрано */}
    </div>
  )
}
