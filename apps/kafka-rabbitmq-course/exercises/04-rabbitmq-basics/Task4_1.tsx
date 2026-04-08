import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 4.1: Архитектура RabbitMQ
// ============================================
//
// Цель: создать интерактивную визуальную карту архитектуры RabbitMQ.
// Слои: Erlang VM → Node → Virtual Host → Exchange / Queue → Binding
// Клик по слою: показывает описание справа.
// Второй клик (зум): показывает все детали.

// TODO: Определи тип ArchLayer — union type всех слоёв:
// 'erlang' | 'node' | 'vhost' | 'exchange' | 'queue' | 'binding'
// type ArchLayer = ...

// TODO: Определи интерфейс LayerInfo:
//   id: ArchLayer
//   label: string
//   emoji: string
//   color: string
//   bgColor: string
//   borderColor: string
//   description: string  — одна строка-объяснение
//   details: string[]    — список ключевых фактов (минимум 4)
//   children: ArchLayer[] — дочерние слои
// interface LayerInfo { ... }

// TODO: Создай массив LAYERS с данными для каждого из 6 слоёв.
// Каждый слой должен содержать реальную информацию о компоненте RabbitMQ.
// const LAYERS: LayerInfo[] = [...]

// TODO: Вспомогательная функция layerById(id: ArchLayer): LayerInfo
// const layerById = (id: ArchLayer): LayerInfo => LAYERS.find(l => l.id === id)!

export function Task4_1() {
  const { t } = useLanguage()

  // TODO: Состояние selected — выбранный слой (ArchLayer | null)
  const [selected, setSelected] = useState<string | null>(null)

  // TODO: Состояние zoomed — зумированный слой (ArchLayer | null)
  const [zoomed, setZoomed] = useState<string | null>(null)

  // TODO: Реализуй handleClick(id: ArchLayer):
  //   - Первый клик: selected = id, zoomed = null
  //   - Второй клик (тот же слой): zoomed = id
  //   - Клик на уже зумированный: zoomed = null, selected = id
  const handleClick = (_id: string) => {
    // TODO: реализовать логику
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2>{t('task.4.1')}</h2>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Кликните по слою для информации. Второй клик — зум с подробностями.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* Левая часть: вложенная диаграмма слоёв */}
        <div style={{ flex: '0 0 auto', minWidth: '340px' }}>

          {/*
            TODO: Отобрази вложенную структуру слоёв:
            - Erlang VM (внешний контейнер, пунктирная граница)
              - Node (внутри)
                - VHost (внутри node)
                  - Exchange (в сетке 2 колонки)
                  - Queue (в сетке 2 колонки)
                  - Binding (на всю ширину)
                - Подсказка о втором vhost (пунктирный блок)

            Каждый блок:
            - onClick вызывает handleClick с остановкой propagation
            - Стиль меняется при selected/zoomed (border, background, shadow)
            - Внутри: emoji, label, краткое описание
          */}
          <div style={{ border: '2px dashed #ccc', borderRadius: '10px', padding: '0.75rem' }}>
            <div style={{ fontWeight: 700, color: '#4A148C', marginBottom: '0.5rem' }}>
              ⚙️ Erlang VM (TODO: реализовать вложенную структуру)
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
        <div style={{ flex: 1 }}>
          {/*
            TODO: Если selected !== null, показывай LayerInfo:
            - Emoji (большой), label, цветное описание
            - Если zoomed: показать ВСЕ details
            - Если только selected: первые 3 details + подсказка "кликните для зума"
            - Если children.length > 0: показывай дочерние слои как кликабельные бейджи

            Если ничего не выбрано — заглушка с инструкцией
          */}
          <div style={{ border: '2px dashed #ddd', borderRadius: '10px', padding: '2rem', textAlign: 'center', color: '#bbb' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👈</div>
            <div style={{ fontSize: '0.9rem' }}>
              TODO: Кликните на любой слой архитектуры слева
            </div>
          </div>

          {/* TODO: Легенда внизу — все слои как маленькие кликабельные кнопки */}
        </div>
      </div>
    </div>
  )
}
