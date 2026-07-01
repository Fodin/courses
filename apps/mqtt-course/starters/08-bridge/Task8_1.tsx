import { useState } from 'react'

// ============================================
// Задание 8.1: Концепция MQTT Bridge
// ============================================

// TODO: Опишите интерфейс BridgeScenario с полями:
//   id (string), title (string), description (string),
//   diagram (string), useCases (string[])

// TODO: Создайте массив bridgeScenarios с тремя сценариями:
//
//   1. id='local-cloud', title='Локальная сеть → Облако'
//      diagram: текстовая схема "Датчики → Mosquitto (OpenWRT) --Bridge--> AWS IoT / Cloud"
//      description: локальный брокер пересылает топики в облачный MQTT
//      useCases: мониторинг умного дома через облако, сбор телеметрии, резервирование
//
//   2. id='two-sites', title='Два офиса / объекта'
//      diagram: схема "Офис А: Mosquitto <--Bridge--> Mosquitto: Офис Б"
//      description: два брокера на разных площадках, данные реплицируются
//      useCases: синхронизация состояния, централизованный мониторинг
//
//   3. id='hierarchy', title='Иерархическая архитектура'
//      diagram: схема нескольких edge-брокеров → центральный брокер
//      description: несколько локальных брокеров пересылают на центральный
//      useCases: промышленные SCADA-системы, городские IoT-сети

export function Task8_1() {
  // TODO: Создайте состояние selected (string) — выбранный сценарий, по умолчанию 'local-cloud'
  const [selected, setSelected] = useState<string>('local-cloud')

  // TODO: Найдите текущий сценарий: scenario = bridgeScenarios.find(s => s.id === selected)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Концепция MQTT Bridge</h2>

      {/* TODO: Добавьте информационный блок с объяснением Bridge (синий фон #e3f2fd):
          "Bridge (мост) — механизм Mosquitto для связи двух брокеров. Один брокер
          становится MQTT-клиентом для другого: подключается к нему и пересылает
          сообщения в нужных направлениях." */}

      {/* TODO: Отобразите три кнопки для выбора сценария.
          Активная кнопка выделена синей рамкой (#1976d2) и фоном. */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button style={{ flex: 1, minWidth: '150px', padding: '0.6rem', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' }}>
          Сценарий 1
        </button>
        <button style={{ flex: 1, minWidth: '150px', padding: '0.6rem', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' }}>
          Сценарий 2
        </button>
        <button style={{ flex: 1, minWidth: '150px', padding: '0.6rem', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' }}>
          Сценарий 3
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Левая часть: схема и описание */}
        <div style={{ flex: '1', minWidth: '260px' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>Схема</h3>
          {/* TODO: Отобразите scenario.diagram в <pre> с тёмным фоном (#263238) и бирюзовым текстом */}
          <pre
            style={{
              background: '#263238',
              color: '#80cbc4',
              padding: '1.25rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              lineHeight: 1.8,
              fontFamily: 'monospace',
            }}
          >
            # Схема появится здесь...
          </pre>

          {/* TODO: Отобразите scenario.description как параграф */}
        </div>

        {/* Правая часть: сценарии использования */}
        <div style={{ flex: '1', minWidth: '220px' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>Сценарии использования</h3>
          {/* TODO: Отобразите scenario.useCases как список */}

          {/* TODO: Добавьте блок "Как работает под капотом" (#f5f5f5):
              "Mosquitto-мост создаёт MQTT-соединение к удалённому брокеру — он ведёт себя
              как обычный MQTT-клиент. Клиенты каждого брокера не знают, что данные пришли
              с другого сервера." */}
        </div>
      </div>
    </div>
  )
}
