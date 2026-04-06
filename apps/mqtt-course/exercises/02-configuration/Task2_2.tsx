import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 2.2: Listeners и порты
// ============================================

// TODO: Определи интерфейс ListenerConfig с полями:
//   id (string) — уникальный идентификатор пресета
//   port (number) — номер порта
//   bindAddress (string) — IP-адрес ('127.0.0.1', '192.168.1.1', '0.0.0.0')
//   protocol: 'mqtt' | 'websockets'
//   tls (boolean) — нужна ли TLS-конфигурация
//   description (string) — описание пресета
//   useCase (string) — типичный сценарий применения
//   color (string) — hex-цвет
//   bg (string) — hex-цвет фона
// interface ListenerConfig { ... }

// TODO: Создай массив listenerPresets из 5 пресетов:
//   1. MQTT localhost: port 1883, bind 127.0.0.1, mqtt, no TLS — зелёный
//   2. MQTT LAN: port 1883, bind 192.168.1.1, mqtt, no TLS — синий
//   3. MQTT TLS: port 8883, bind 0.0.0.0, mqtt, TLS=true — красный
//   4. WebSocket LAN: port 9001, bind 192.168.1.1, websockets, no TLS — оранжевый
//   5. WSS: port 9883, bind 0.0.0.0, websockets, TLS=true — фиолетовый
// const listenerPresets: ListenerConfig[] = [...]

// TODO: Реализуй функцию generateListenerConfig(listeners: ListenerConfig[]): string
//   Для каждого listener генерирует блок конфига:
//   # {description}
//   listener {port}[ {bindAddress если не 0.0.0.0}]
//   protocol {protocol}
//   Если tls === true, добавить:
//   cafile /etc/mosquitto/ca.crt
//   certfile /etc/mosquitto/server.crt
//   keyfile /etc/mosquitto/server.key
//   tls_version tlsv1.3
//   Блоки разделяются пустой строкой
// function generateListenerConfig(listeners: ListenerConfig[]): string { ... }

export function Task2_2() {
  const { t } = useLanguage()

  // TODO: Создай состояние selectedListeners — Set<string>
  // Начальное значение: Set с одним элементом 'mqtt-lan' (id второго пресета)
  const [selectedListeners, setSelectedListeners] = useState<Set<string>>(
    new Set(['mqtt-lan']),
  )

  // TODO: Создай состояние showConfig — boolean (начальное: false)
  const [showConfig, setShowConfig] = useState(false)

  // TODO: Реализуй функцию toggleListener(id: string):
  //   Если id уже выбран И это не последний выбранный — удали
  //   Если id не выбран — добавь
  //   Нельзя снять выбор с последнего элемента (selectedListeners.size === 1)
  const toggleListener = (_id: string) => {
    // TODO: реализовать
  }

  // TODO: Вычисли activeListeners — массив выбранных пресетов:
  // const activeListeners = listenerPresets.filter(l => selectedListeners.has(l.id))

  // TODO: Вычисли configText через generateListenerConfig(activeListeners)
  // const configText = generateListenerConfig(activeListeners)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2>{t('task.2.2')}</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        Выбери нужные listener-ы для своей конфигурации и получи готовый фрагмент mosquitto.conf.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
        {/* Карточки пресетов */}
        <div>
          <h3 style={{ marginBottom: '0.75rem' }}>Доступные listener-ы</h3>

          {/* TODO: Отрендери карточки из listenerPresets:
              Каждая карточка:
              - Чекбокс (checked = selectedListeners.has(preset.id))
              - Port: monospace жирный цветом preset.color (например :1883)
              - Бейдж: "{protocol}[ + TLS]"
              - bind_address: monospace серый справа
              - description
              - useCase с иконкой 💡

              При клике на карточку — вызов toggleListener(preset.id)
              Активная карточка: бордер и фон цвета пресета
          */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                border: '2px dashed #ddd',
                borderRadius: '8px',
                padding: '1rem',
                color: '#aaa',
                textAlign: 'center',
              }}
            >
              TODO: карточки из listenerPresets
            </div>
          </div>
        </div>

        {/* Конфигурация */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0 }}>Конфигурация</h3>
            <button
              onClick={() => setShowConfig(!showConfig)}
              style={{
                padding: '0.4rem 0.75rem',
                background: showConfig ? '#1565C0' : '#f5f5f5',
                color: showConfig ? '#fff' : '#333',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              {showConfig ? 'Скрыть конфиг' : 'Показать конфиг'}
            </button>
          </div>

          {/* TODO: Показать список активных listener-ов:
              Для каждого в activeListeners:
              - "{bindAddress}:{port}" monospace жирный цвета пресета
              - "{PROTOCOL}[ (TLS)]" описание
          */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem' }}>
              Активных listener-ов: {selectedListeners.size}
            </div>
            <div
              style={{
                padding: '0.5rem 0.75rem',
                background: '#f5f5f5',
                borderRadius: '6px',
                color: '#aaa',
                fontSize: '0.82rem',
              }}
            >
              TODO: список активных listener-ов
            </div>
          </div>

          {/* TODO: При showConfig — показать configText в терминале */}
          {showConfig && (
            <div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>
                Готовая конфигурация для mosquitto.conf:
              </div>
              <pre
                style={{
                  background: '#1a1a2e',
                  color: '#00ff88',
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  padding: '1rem',
                  borderRadius: '8px',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}
              >
                {/* TODO: вывести configText */}
                # TODO: сгенерировать конфиг из activeListeners
              </pre>
            </div>
          )}

          {/* Таблица стандартных портов */}
          <div style={{ marginTop: '1.25rem' }}>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Стандартные порты MQTT</h4>
            {/* TODO: Таблица 4 строки: 1883/MQTT, 8883/MQTT+TLS, 9001/WebSocket, 9883/WSS */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'left' }}>Порт</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'left' }}>Протокол</th>
                  <th style={{ padding: '6px 8px', border: '1px solid #ddd', textAlign: 'left' }}>Описание</th>
                </tr>
              </thead>
              <tbody>
                {/* TODO: добавить 4 строки */}
                <tr>
                  <td style={{ padding: '6px 8px', border: '1px solid #ddd', color: '#aaa' }} colSpan={3}>
                    TODO: строки таблицы
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
