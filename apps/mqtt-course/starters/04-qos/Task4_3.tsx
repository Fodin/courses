import { useState } from 'react'

// ============================================
// Задание 4.3: Last Will and Testament
// ============================================

// TODO: Опишите состояние устройства
// Поля: id, name, status ('online'|'offline'), lwtTopic, lwtPayload, lwtQos, lwtRetain, lastSeen
interface DeviceState {
  id: string
  name: string
  status: 'online' | 'offline'
  lwtTopic: string
  lwtPayload: string
  lwtQos: 0 | 1 | 2
  lwtRetain: boolean
  lastSeen: string
}

// TODO: Создайте начальный список устройств (минимум 3)
// Каждое устройство должно иметь:
// - осмысленный id и имя
// - lwtTopic вида 'device/{id}/status'
// - lwtPayload: 'offline'
// - lwtQos: 1
// - lwtRetain: true
// - status: 'online'
const initialDevices: DeviceState[] = [
  // TODO: добавьте устройства
]

export function Task4_3() {
  const [devices, setDevices] = useState<DeviceState[]>(initialDevices)
  const [log, setLog] = useState<string[]>([
    '> Брокер запущен. Устройства подключены с LWT.',
  ])

  const now = () => new Date().toLocaleTimeString('ru')

  // TODO: Реализуйте функцию симуляции аварийного отключения
  // Логика:
  // 1. Установить status устройства в 'offline'
  // 2. Добавить в лог записи:
  //    - "{id} — соединение оборвалось (keepalive timeout)"
  //    - "Брокер публикует LWT: {lwtTopic} = {lwtPayload} (QoS {lwtQos})"
  const simulateCrash = (deviceId: string) => {
    // TODO: реализуйте
    void setDevices
    void deviceId
  }

  // TODO: Реализуйте функцию нормального отключения (DISCONNECT)
  // Логика:
  // 1. Установить status в 'offline'
  // 2. Добавить в лог: "{id} отправил DISCONNECT — LWT НЕ отправляется"
  const simulateNormalDisconnect = (deviceId: string) => {
    // TODO: реализуйте
    void deviceId
  }

  // TODO: Реализуйте переподключение устройства
  // Логика:
  // 1. Установить status в 'online', обновить lastSeen
  // 2. Добавить в лог: "{id} переподключился, публикует retained 'online'"
  const reconnectDevice = (deviceId: string) => {
    // TODO: реализуйте
    void deviceId
  }

  const statusColor = (status: string) => status === 'online' ? '#16a34a' : '#dc2626'

  void now
  void log
  void setLog

  return (
    <div className="exercise-container">
      <h2>Задание 4.3: Last Will and Testament</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Симуляция LWT: нажмите «Краш» для аварийного отключения или «DISCONNECT» для нормального.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 12 }}>
            Устройства
          </h3>

          {/* TODO: отрендерите список devices */}
          {devices.length === 0 && (
            <div style={{ color: '#9ca3af', fontSize: 13 }}>
              Добавьте устройства в initialDevices
            </div>
          )}

          {devices.map((device) => (
            <div key={device.id} style={{
              padding: 12,
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              marginBottom: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                {/* TODO: добавьте цветной индикатор статуса */}
                <strong style={{ fontSize: 14 }}>{device.name}</strong>
                <span style={{ fontSize: 12, color: statusColor(device.status) }}>{device.status}</span>
              </div>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
                LWT: <code>{device.lwtTopic}</code> → "{device.lwtPayload}"
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {/* TODO: кнопки Краш, DISCONNECT, Переподключить */}
                <button
                  onClick={() => simulateCrash(device.id)}
                  disabled={device.status === 'offline'}
                  style={{
                    padding: '4px 10px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: device.status === 'offline' ? 'not-allowed' : 'pointer',
                    fontSize: 12,
                    opacity: device.status === 'offline' ? 0.5 : 1,
                  }}
                >
                  ⚡ Краш
                </button>
                <button
                  onClick={() => simulateNormalDisconnect(device.id)}
                  disabled={device.status === 'offline'}
                  style={{
                    padding: '4px 10px',
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: device.status === 'offline' ? 'not-allowed' : 'pointer',
                    fontSize: 12,
                    opacity: device.status === 'offline' ? 0.5 : 1,
                  }}
                >
                  DISCONNECT
                </button>
                <button
                  onClick={() => reconnectDevice(device.id)}
                  disabled={device.status === 'online'}
                  style={{
                    padding: '4px 10px',
                    background: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: device.status === 'online' ? 'not-allowed' : 'pointer',
                    fontSize: 12,
                    opacity: device.status === 'online' ? 0.5 : 1,
                  }}
                >
                  Переподключить
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>
            Лог брокера
          </h3>
          {/* TODO: отрендерите log */}
          <div style={{
            background: '#1e1e2e',
            color: '#cdd6f4',
            padding: 12,
            borderRadius: 8,
            fontFamily: 'monospace',
            fontSize: 11,
            height: 250,
            overflowY: 'auto',
          }}>
            {log.map((line, i) => (
              <div key={i} style={{ marginBottom: 2, color: line.includes('LWT') ? '#fab387' : '#cdd6f4' }}>
                {line}
              </div>
            ))}
          </div>

          {/* TODO: Добавьте блок с псевдокодом паттерна Online/Offline */}
          <div style={{ marginTop: 12, padding: 12, background: '#fffbeb', borderRadius: 8, fontSize: 12 }}>
            <strong>Паттерн Online/Offline:</strong>
            <div style={{ fontFamily: 'monospace', marginTop: 4, color: '#92400e' }}>
              {/* TODO: покажите шаги настройки LWT */}
              1. will_set(topic, "offline", qos=1, retain=True){'\n'}
              2. client.connect(broker){'\n'}
              3. publish(topic, "online", retain=True)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
