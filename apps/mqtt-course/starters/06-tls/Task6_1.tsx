import { useState } from 'react'

// ============================================
// Задание 6.1: Генерация PKI-инфраструктуры для MQTT TLS
// ============================================

// TODO: Опишите интерфейс CertStep с полями:
//   id (string), title (string), command (string),
//   description (string), output (string), generates (string[])

// TODO: Создайте массив certSteps с 5 шагами:
//   1. Генерация ключа CA (openssl genrsa -out ca.key 2048)
//   2. Самоподписанный сертификат CA (openssl req -new -x509 ...)
//   3. Ключ и CSR сервера (openssl genrsa + openssl req -new ...)
//   4. Подписание сертификата сервера (openssl x509 -req ...)
//   5. Клиентский сертификат sensor-01 (ключ + CSR + подпись)
//   Для каждого шага укажите: title, command, description, output, generates

export function Task6_1() {
  // TODO: Создайте состояние activeStep (string | null) — раскрытый шаг
  const [activeStep, setActiveStep] = useState<string | null>(null)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Генерация PKI-инфраструктуры для MQTT TLS</h2>

      {/* TODO: Добавьте информационный блок с перечислением всех генерируемых файлов.
          Соберите все файлы из certSteps.flatMap(s => s.generates).
          Отобразите каждый файл как <code> с отступами и рамкой. */}

      {/* TODO: Отобразите список шагов certSteps.
          Каждый шаг — кнопка-заголовок (аккордеон):
          - Клик раскрывает/скрывает шаг
          - Заголовок содержит title и список файлов generates
          - При раскрытии показывается description и блок с command (тёмный фон)
          - Если у шага есть output — покажите его ниже команды
          - Добавьте кнопку "Копировать" для команды */}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setActiveStep(activeStep ? null : 'placeholder')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: '#fafafa',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Шаги генерации появятся здесь...
          </button>
        </div>
      </div>

      {/* TODO: Добавьте блок "Размещение на OpenWRT" с командами:
          mkdir -p /etc/mosquitto/certs
          cp ca.crt server.crt server.key /etc/mosquitto/certs/
          chmod 600 /etc/mosquitto/certs/server.key
          chown mosquitto: /etc/mosquitto/certs/server.key */}
    </div>
  )
}
