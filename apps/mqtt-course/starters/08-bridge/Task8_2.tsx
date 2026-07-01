import { useState } from 'react'

// ============================================
// Задание 8.2: Настройка моста в Mosquitto
// ============================================

// TODO: Опишите интерфейс BridgeParam с полями:
//   key (string), value (string), required (boolean), description (string)

// TODO: Создайте массив bridgeParams с параметрами конфигурации:
//   Обязательные:
//   - connection bridge-to-cloud — имя соединения
//   - address mqtt.example.com:1883 — адрес брокера
//   - topic sensors/# out 0 — правило пересылки
//   Необязательные:
//   - remote_username bridge_user — логин
//   - remote_password strong_password — пароль
//   - bridge_cafile /etc/mosquitto/certs/ca.crt — CA для TLS
//   - keepalive_interval 60 — keepalive
//   - start_type automatic — стратегия подключения

export function Task8_2() {
  // TODO: Создайте состояние showOptional (boolean) — показывать необязательные параметры
  const [showOptional, setShowOptional] = useState(false)

  // TODO: Создайте состояние selectedParam (string | null) — раскрытый параметр
  const [selectedParam, setSelectedParam] = useState<string | null>(null)

  // TODO: Создайте состояние remoteAddr (string) — редактируемый адрес, 'mqtt.example.com:1883'
  const [remoteAddr, setRemoteAddr] = useState('mqtt.example.com:1883')

  // TODO: Создайте состояние connName (string) — редактируемое имя, 'bridge-to-cloud'
  const [connName, setConnName] = useState('bridge-to-cloud')

  // TODO: Вычислите displayed — список для отображения (зависит от showOptional)

  // TODO: Вычислите configText — текст конфига, обновляемый при изменении connName, remoteAddr, showOptional:
  //   "# Мост настраивается как отдельная секция в mosquitto.conf\n\n"
  //   + "connection {connName}\n"
  //   + "address {remoteAddr}\n"
  //   + "topic sensors/# out 0\n"
  //   + "topic commands/# in 0"
  //   + (showOptional ? "\nremote_username bridge_user\n..." : "")

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Настройка моста в Mosquitto</h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Левая часть: параметры */}
        <div style={{ flex: '1', minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0 }}>Параметры</h3>
            {/* TODO: Добавьте чекбокс "Показать все" для управления showOptional */}
          </div>

          {/* TODO: Отобразите список displayed.
              Каждый параметр — кликабельная карточка с:
              - Именем (key) в синем
              - Значением (value) в коде
              - Бейджем "обязательно" для required (зелёный)
              - При клике раскрывается description
              - Обязательные параметры имеют зелёную рамку */}
          <div style={{ color: '#999', fontStyle: 'italic' }}>
            Параметры появятся здесь...
          </div>
        </div>

        {/* Правая часть: редактируемый конфиг */}
        <div style={{ flex: '1', minWidth: '260px' }}>
          {/* TODO: Добавьте поля ввода для connName и remoteAddr */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
              Имя соединения:
            </label>
            <input
              value={connName}
              onChange={(e) => setConnName(e.target.value)}
              style={{ width: '100%', padding: '0.4rem 0.6rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.87rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
              Адрес удалённого брокера:
            </label>
            <input
              value={remoteAddr}
              onChange={(e) => setRemoteAddr(e.target.value)}
              style={{ width: '100%', padding: '0.4rem 0.6rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.87rem', boxSizing: 'border-box' }}
            />
          </div>

          <h3 style={{ margin: '0 0 0.5rem' }}>mosquitto.conf</h3>

          {/* TODO: Отобразите configText в <pre> с тёмным фоном.
              Конфиг должен обновляться при изменении connName, remoteAddr, showOptional. */}
          <pre
            style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            # Конфиг появится здесь...
          </pre>
        </div>
      </div>
    </div>
  )
}
