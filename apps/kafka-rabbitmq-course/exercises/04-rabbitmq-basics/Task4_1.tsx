import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 4.1: Архитектура RabbitMQ
// Task 4.1: RabbitMQ Architecture
// ============================================
//
// Цель: создать интерактивную визуальную карту архитектуры RabbitMQ.
// Goal: create an interactive visual map of RabbitMQ architecture.
// Слои: Erlang VM → Node → Virtual Host → Exchange / Queue → Binding
// Layers: Erlang VM → Node → Virtual Host → Exchange / Queue → Binding
// Клик по слою: показывает описание справа.
// Click on a layer: shows description on the right.
// Второй клик (зум): показывает все детали.
// Second click (zoom): shows all details.

// TODO: Определи тип ArchLayer — union type всех слоёв:
// TODO: Define ArchLayer type — union type of all layers:
// 'erlang' | 'node' | 'vhost' | 'exchange' | 'queue' | 'binding'
// type ArchLayer = ...

// TODO: Определи интерфейс LayerInfo:
// TODO: Define LayerInfo interface:
//   id: ArchLayer
//   label: string
//   emoji: string
//   color: string
//   bgColor: string
//   borderColor: string
//   description: string  — одна строка-объяснение / one-line explanation
//   details: string[]    — список ключевых фактов (минимум 4) / list of key facts (at least 4)
//   children: ArchLayer[] — дочерние слои / child layers
// interface LayerInfo { ... }

// TODO: Создай массив LAYERS с данными для каждого из 6 слоёв.
// TODO: Create LAYERS array with data for each of the 6 layers.
// Каждый слой должен содержать реальную информацию о компоненте RabbitMQ.
// Each layer should contain real information about a RabbitMQ component.
// const LAYERS: LayerInfo[] = [...]

// TODO: Вспомогательная функция layerById(id: ArchLayer): LayerInfo
// TODO: Helper function layerById(id: ArchLayer): LayerInfo
// const layerById = (id: ArchLayer): LayerInfo => LAYERS.find(l => l.id === id)!

export function Task4_1() {
  const { t } = useLanguage()

  // TODO: Состояние selected — выбранный слой (ArchLayer | null)
  // TODO: State selected — the selected layer (ArchLayer | null)
  const [selected, setSelected] = useState<string | null>(null)

  // TODO: Состояние zoomed — зумированный слой (ArchLayer | null)
  // TODO: State zoomed — the zoomed-in layer (ArchLayer | null)
  const [zoomed, setZoomed] = useState<string | null>(null)

  // TODO: Реализуй handleClick(id: ArchLayer):
  // TODO: Implement handleClick(id: ArchLayer):
  //   - Первый клик: selected = id, zoomed = null
  //   - First click: selected = id, zoomed = null
  //   - Второй клик (тот же слой): zoomed = id
  //   - Second click (same layer): zoomed = id
  //   - Клик на уже зумированный: zoomed = null, selected = id
  //   - Click on already zoomed: zoomed = null, selected = id
  const handleClick = (_id: string) => {
    // TODO: реализовать логику / implement the logic
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2>{t('task.4.1')}</h2>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Кликните по слою для информации. Второй клик — зум с подробностями.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* Левая часть: вложенная диаграмма слоёв */}
        {/* Left side: nested layer diagram */}
        <div style={{ flex: '0 0 auto', minWidth: '340px' }}>

          {/*
            TODO: Отобрази вложенную структуру слоёв:
            TODO: Render the nested layer structure:
            - Erlang VM (внешний контейнер, пунктирная граница)
            - Erlang VM (outer container, dashed border)
              - Node (внутри)
              - Node (inside)
                - VHost (внутри node)
                - VHost (inside node)
                  - Exchange (в сетке 2 колонки)
                  - Exchange (in 2-column grid)
                  - Queue (в сетке 2 колонки)
                  - Queue (in 2-column grid)
                  - Binding (на всю ширину)
                  - Binding (full width)
                - Подсказка о втором vhost (пунктирный блок)
                - Hint about a second vhost (dashed block)

            Каждый блок:
            Each block:
            - onClick вызывает handleClick с остановкой propagation
            - onClick calls handleClick with propagation stopped
            - Стиль меняется при selected/zoomed (border, background, shadow)
            - Style changes on selected/zoomed (border, background, shadow)
            - Внутри: emoji, label, краткое описание
            - Inside: emoji, label, brief description
          */}
          <div style={{ border: '2px dashed #ccc', borderRadius: '10px', padding: '0.75rem' }}>
            <div style={{ fontWeight: 700, color: '#4A148C', marginBottom: '0.5rem' }}>
              ⚙️ Erlang VM (TODO: реализовать вложенную структуру / implement nested structure)
            </div>
            <div style={{ border: '2px solid #eee', borderRadius: '8px', padding: '0.5rem', background: '#fafafa' }}>
              <div style={{ color: '#1565C0', fontWeight: 600, marginBottom: '0.4rem' }}>🖥️ rabbit@node-1</div>
              <div style={{ border: '2px solid #eee', borderRadius: '6px', padding: '0.4rem', background: '#fff' }}>
                <div style={{ color: '#00695C', fontWeight: 600, marginBottom: '0.4rem' }}>🏠 vhost: /production</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                  <div style={{ border: '1px solid #eee', borderRadius: '6px', padding: '0.4rem', textAlign: 'center' }}>
                    🔀 Exchange
                  </div>
                  <div style={{ border: '1px solid #eee', borderRadius: '6px', padding: '0.4rem', textAlign: 'center' }}>
                    📬 Queue
                  </div>
                </div>
                <div style={{ border: '1px solid #eee', borderRadius: '6px', padding: '0.4rem', textAlign: 'center', marginTop: '0.4rem' }}>
                  🔗 Binding
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Правая часть: информационная панель */}
        {/* Right side: info panel */}
        <div style={{ flex: 1 }}>
          {/*
            TODO: Если selected !== null, показывай LayerInfo:
            TODO: If selected !== null, show LayerInfo:
            - Emoji (большой), label, цветное описание
            - Emoji (large), label, colored description
            - Если zoomed: показать ВСЕ details
            - If zoomed: show ALL details
            - Если только selected: первые 3 details + подсказка "кликните для зума"
            - If only selected: first 3 details + hint "click to zoom"
            - Если children.length > 0: показывай дочерние слои как кликабельные бейджи
            - If children.length > 0: show child layers as clickable badges

            Если ничего не выбрано — заглушка с инструкцией
            If nothing selected — placeholder with instructions
          */}
          <div style={{ border: '2px dashed #ddd', borderRadius: '10px', padding: '2rem', textAlign: 'center', color: '#bbb' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👈</div>
            <div style={{ fontSize: '0.9rem' }}>
              TODO: Кликните на любой слой архитектуры слева / Click any architecture layer on the left
            </div>
          </div>

          {/* TODO: Легенда внизу — все слои как маленькие кликабельные кнопки */}
          {/* TODO: Legend at the bottom — all layers as small clickable buttons */}
        </div>
      </div>
    </div>
  )
}
