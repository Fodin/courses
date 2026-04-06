import { useState } from 'react'

// ============================================
// Задание 6.2: Настройка TLS в Mosquitto
// ============================================

// TODO: Опишите интерфейс TlsOption с полями:
//   key (string), value (string), description (string), required (boolean)

// TODO: Создайте массив tlsOptions с параметрами конфигурации:
//   - listener 8883 (обязательный)
//   - cafile /etc/mosquitto/certs/ca.crt (обязательный)
//   - certfile /etc/mosquitto/certs/server.crt (обязательный)
//   - keyfile /etc/mosquitto/certs/server.key (обязательный)
//   - tls_version tlsv1.2 (необязательный)
//   - ciphers ECDHE-RSA-AES256-GCM-SHA384 (необязательный)
//   Для каждого параметра напишите понятное описание.

export function Task6_2() {
  // TODO: Создайте состояние showAll (boolean) — показывать ли все параметры или только обязательные
  const [showAll, setShowAll] = useState(false)

  // TODO: Создайте состояние selectedOption (string | null) — выбранный параметр для показа описания
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // TODO: Создайте состояние testResult (string | null) — результат симуляции подключения
  const [testResult, setTestResult] = useState<string | null>(null)

  // TODO: Вычислите displayed — список параметров для отображения.
  //   Если showAll=false, показывать только обязательные.

  // TODO: Вычислите configText — строки конфига в формате "key value",
  //   объединённые переносом строки. Используйте только displayed параметры.

  // TODO: Реализуйте handleTest — функцию для симуляции TLS подключения.
  //   Через setTimeout установите testResult с текстом успешного подключения.

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Настройка TLS в Mosquitto</h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Левая часть: список параметров */}
        <div style={{ flex: '1', minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0 }}>Параметры конфигурации</h3>
            {/* TODO: Добавьте чекбокс "Показать все" для управления showAll */}
          </div>

          {/* TODO: Отобразите список параметров (displayed).
              Каждый параметр — карточка с:
              - Именем параметра (key) подсвеченным синим
              - Значением (value) в коде
              - Бейджем "обязательно" для required
              - При клике раскрывается description
              - Обязательные параметры имеют зелёную рамку */}
          <div style={{ color: '#999', fontStyle: 'italic' }}>
            Параметры появятся здесь...
          </div>
        </div>

        {/* Правая часть: превью конфига и тест */}
        <div style={{ flex: '1', minWidth: '260px' }}>
          <h3 style={{ margin: '0 0 0.75rem' }}>mosquitto.conf</h3>

          {/* TODO: Отобразите configText в блоке <pre> с тёмным фоном.
              Добавьте в начало статичный текст:
              "# Основной listener (без TLS, только локально)\nlistener 1883 localhost\n\n# TLS listener\n" */}
          <pre
            style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.83rem',
              lineHeight: 1.7,
              margin: '0 0 1rem',
            }}
          >
            # Конфиг появится здесь...
          </pre>

          {/* TODO: Добавьте секцию "Тест подключения":
              - Покажите команду mosquitto_pub с флагами --cafile, -h, -p 8883
              - Добавьте кнопку "Симулировать подключение"
              - При клике вызывайте handleTest
              - Если testResult не null — показывайте его в зелёном блоке */}
        </div>
      </div>
    </div>
  )
}
