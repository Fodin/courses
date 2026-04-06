import { useState } from 'react'

// ============================================
// Задание 6.3: Клиентские сертификаты (mTLS)
// ============================================

// TODO: Опишите интерфейс MtlsMode с полями:
//   id (string), title (string), config (string),
//   description (string), useCases (string[]), pros (string[]), cons (string[])

// TODO: Создайте массив mtlsModes с двумя режимами:
//
//   1. 'tls-only': TLS (только шифрование)
//      config: listener 8883, cafile, certfile, keyfile, require_certificate false
//      Описание: сервер шифрует соединение, клиент аутентифицируется по паролю
//      Плюсы: простота настройки клиентов, поддержка старых устройств
//      Минусы: пароли могут быть скомпрометированы
//
//   2. 'mtls': mTLS (взаимная аутентификация)
//      config: то же + require_certificate true, use_identity_as_username true
//      Описание: клиент обязан предъявить сертификат, CN становится username
//      Плюсы: наивысший уровень безопасности, нет паролей
//      Минусы: сложнее управлять сертификатами

export function Task6_3() {
  // TODO: Создайте состояние selectedMode (string) — выбранный режим, по умолчанию 'tls-only'
  const [selectedMode, setSelectedMode] = useState<string>('tls-only')

  // TODO: Создайте состояние showClientCmd (boolean) — показывать команду клиента
  const [showClientCmd, setShowClientCmd] = useState(false)

  // TODO: Найдите текущий режим: mode = mtlsModes.find(m => m.id === selectedMode)

  // TODO: Создайте объект clientCommands с командами для каждого режима:
  //   'tls-only': mosquitto_sub с --cafile, -u, -P
  //   'mtls': mosquitto_sub с --cafile, --cert, --key (без пароля)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Клиентские сертификаты и mTLS</h2>

      {/* TODO: Добавьте информационный блок с аналогией:
          "Аналогия: обычный TLS — это как показать паспорт на входе в офис
          (только вы проверяете, что здание настоящее). mTLS — это обмен паспортами:
          и здание проверяет вас, и вы проверяете здание." */}

      {/* TODO: Отобразите кнопки-переключатели для выбора режима (tls-only / mtls).
          Активная кнопка выделена синей рамкой и фоном. */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button style={{ flex: 1, padding: '0.75rem', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' }}>
          TLS (только шифрование)
        </button>
        <button style={{ flex: 1, padding: '0.75rem', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' }}>
          mTLS (взаимная аутентификация)
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Левая часть: конфиг Mosquitto */}
        <div style={{ flex: '1', minWidth: '260px' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>Конфигурация Mosquitto</h3>
          {/* TODO: Отобразите mode.config в блоке <pre> с тёмным фоном */}
          <pre
            style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.83rem',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            # Конфиг выбранного режима появится здесь...
          </pre>
        </div>

        {/* Правая часть: описание, сценарии, плюсы/минусы */}
        <div style={{ flex: '1', minWidth: '260px' }}>
          {/* TODO: Отобразите mode.description как текстовый параграф */}

          {/* TODO: Отобразите mode.useCases как список "Сценарии использования" */}

          {/* TODO: Отобразите mode.pros и mode.cons рядом в двух блоках:
              - Зелёный блок (#e8f5e9) для плюсов
              - Красный блок (#ffebee) для минусов */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1, padding: '0.6rem', background: '#e8f5e9', borderRadius: '6px' }}>
              <strong>Плюсы:</strong>
            </div>
            <div style={{ flex: 1, padding: '0.6rem', background: '#ffebee', borderRadius: '6px' }}>
              <strong>Минусы:</strong>
            </div>
          </div>
        </div>
      </div>

      {/* TODO: Добавьте кнопку "Показать/Скрыть команду клиента".
          При showClientCmd=true показывать clientCommands[selectedMode] в <pre>.
          Используйте зелёный цвет текста (#a5d6a7) на тёмном фоне. */}
      <div style={{ marginTop: '1.5rem' }}>
        <button
          onClick={() => setShowClientCmd(!showClientCmd)}
          style={{ padding: '0.5rem 1rem', background: '#546e7a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          {showClientCmd ? 'Скрыть' : 'Показать'} команду клиента
        </button>
      </div>
    </div>
  )
}
