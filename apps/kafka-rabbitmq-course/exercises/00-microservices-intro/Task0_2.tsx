import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Описание задания: task-0.2.md
// Exercise description: task-0.2.md
//
// Создай интерактивную карту зависимостей микросервисов.
// Create an interactive microservice dependency map.
//
// Требования:
// Requirements:
// 1. Визуализация 6 сервисов в виде прямоугольников на SVG-холсте
// 1. Visualize 6 services as rectangles on an SVG canvas
// 2. Линии между сервисами показывают зависимости (dependsOn)
// 2. Lines between services show dependencies (dependsOn)
// 3. Клик на сервис подсвечивает его и связанные сервисы по типам влияния:
// 3. Clicking a service highlights it and related services by impact type:
//    - selected: выбранный сервис / the selected service
//    - depends-on: сервисы, которые зависят от выбранного (напрямую затронуты)
//    - depends-on: services that depend on the selected one (directly affected)
//    - depended-by: сервисы, от которых зависит выбранный
//    - depended-by: services that the selected one depends on
//    - affected: косвенно затронутые сервисы / indirectly affected services
// 4. Легенда с цветовым обозначением типов влияния
// 4. Legend with color-coded impact types
// 5. Блок с описанием blast radius выбранного сервиса
// 5. Block describing the blast radius of the selected service
// 6. Повторный клик снимает выделение
// 6. Clicking again deselects the service

// TODO: определи тип Service для описания узла графа / define the Service type for graph nodes
// interface Service {
//   id: string
//   label: string
//   x: number       // X coordinate on SVG
//   y: number       // Y coordinate on SVG
//   color: string
//   dependsOn: string[]  // ids of services this one depends on
// }

// TODO: определи тип ImpactLevel для категоризации влияния при падении сервиса
// TODO: define the ImpactLevel type for categorizing impact when a service fails
// type ImpactLevel = 'selected' | 'depends-on' | 'depended-by' | 'affected' | 'none'

// TODO: задай данные сервисов со связями между ними
// TODO: define service data with relationships
// const SERVICES: Service[] = [
//   { id: 'api-gateway', label: 'API Gateway', x: 200, y: 20, color: '#4f86f7', dependsOn: [] },
//   { id: 'users', label: 'User Service', x: 50, y: 130, color: '#f7844f', dependsOn: ['api-gateway'] },
//   { id: 'orders', label: 'Order Service', x: 200, y: 130, color: '#4fbe7c', dependsOn: ['api-gateway', 'users', 'inventory', 'payments'] },
//   { id: 'payments', label: 'Payment Service', x: 360, y: 130, color: '#b34ff7', dependsOn: ['api-gateway', 'users'] },
//   { id: 'inventory', label: 'Inventory Service', x: 50, y: 260, color: '#f7d44f', dependsOn: ['users'] },
//   { id: 'notifications', label: 'Notification Service', x: 360, y: 260, color: '#f74fa0', dependsOn: ['users', 'orders', 'payments'] },
// ]

// TODO: задай цвета для каждого уровня влияния
// TODO: define colors for each impact level
// const impactColors: Record<ImpactLevel, string> = {
//   'selected': '#e53e3e',
//   'depends-on': '#e53e3e',
//   'depended-by': '#4f86f7',
//   'affected': '#ed8936',
//   'none': '#ddd',
// }

// TODO: задай текстовые метки для легенды
// TODO: define text labels for the legend
// const impactLabels: Record<ImpactLevel, string> = { ... }

export function Task0_2() {
  const { t } = useLanguage()

  // TODO: добавь состояние для выбранного сервиса
  // TODO: add state for the selected service
  // const [selectedId, setSelectedId] = useState<string | null>(null)

  // TODO: реализуй функцию getServiceImpact(serviceId: string): ImpactLevel
  // TODO: implement getServiceImpact(serviceId: string): ImpactLevel
  // Алгоритм / Algorithm:
  // - если selectedId === null → 'none'
  // - if selectedId === null → 'none'
  // - если serviceId === selectedId → 'selected'
  // - if serviceId === selectedId → 'selected'
  // - если текущий сервис зависит от выбранного → 'depends-on'
  // - if the current service depends on the selected one → 'depends-on'
  // - если выбранный сервис зависит от текущего → 'depended-by'
  // - if the selected service depends on the current one → 'depended-by'
  // - если текущий зависит от тех, кто зависит от выбранного → 'affected'
  // - if the current depends on services that depend on selected → 'affected'
  // - иначе → 'none'
  // - otherwise → 'none'
  // const getServiceImpact = (serviceId: string): ImpactLevel => { ... }

  // TODO: реализуй getNodeColor(id: string): string
  // TODO: implement getNodeColor(id: string): string
  // Если есть выделение — используй impactColors[impact], иначе — собственный цвет сервиса
  // If there's a selection — use impactColors[impact], otherwise — service's own color
  // const getNodeColor = (id: string): string => { ... }

  // TODO: реализуй isEdgeHighlighted(from: Service, toId: string): boolean
  // TODO: implement isEdgeHighlighted(from: Service, toId: string): boolean
  // Ребро выделяется если оно связано с выбранным сервисом
  // An edge is highlighted if it's connected to the selected service
  // const isEdgeHighlighted = (from: Service, toId: string): boolean => { ... }

  const SVG_W = 500
  const SVG_H = 360

  return (
    <div className="exercise-container">
      <h2>{t('task.0.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        {/* TODO: добавь инструкцию — кликни на сервис, чтобы увидеть blast radius */}
        {/* TODO: add instructions — click a service to see its blast radius */}
      </p>

      <svg
        width="100%"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ border: '1px solid #eee', borderRadius: '12px', background: '#fafafa', maxHeight: '360px' }}
      >
        {/* TODO: нарисуй рёбра — для каждого сервиса итерируйся по dependsOn */}
        {/* TODO: draw edges — for each service, iterate over dependsOn */}
        {/* Каждое ребро — тег <line> от центра узла к центру зависимости */}
        {/* Each edge is a <line> tag from node center to dependency center */}
        {/* Выделенные рёбра: сплошная линия, невыделенные: пунктир */}
        {/* Highlighted edges: solid line, non-highlighted: dashed */}

        {/* TODO: нарисуй узлы — для каждого сервиса <g> с <rect> и <text> внутри */}
        {/* TODO: draw nodes — for each service, a <g> with <rect> and <text> inside */}
        {/* При наличии выделения: незатронутые узлы делай полупрозрачными */}
        {/* If there's a selection: make unaffected nodes semi-transparent */}
        {/* Для выделенного сервиса добавь маркер (например, <circle>) */}
        {/* For the highlighted service, add a marker (e.g., <circle>) */}
      </svg>

      {/* TODO: покажи легенду цветов (только когда есть selectedId) */}
      {/* TODO: show color legend (only when selectedId exists) */}
      {/* Пройди по impactLabels, отфильтруй пустые, нарисуй цветной кружок + текст */}
      {/* Iterate over impactLabels, filter empty ones, draw a colored circle + text */}

      {/* TODO: покажи блок blast radius (только когда есть selectedId) */}
      {/* TODO: show blast radius block (only when selectedId exists) */}
      {/* Найди прямых зависимых: SERVICES.filter(s => s.dependsOn.includes(selectedId)) */}
      {/* Find direct dependents: SERVICES.filter(s => s.dependsOn.includes(selectedId)) */}
      {/* Если зависимых нет — "изолированное падение", иначе — список затронутых */}
      {/* If no dependents — "isolated failure", otherwise — list of affected services */}

      {/* TODO: покажи подсказку "Кликни на сервис" когда ничего не выбрано */}
      {/* TODO: show "Click a service" hint when nothing is selected */}
    </div>
  )
}
