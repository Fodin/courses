import { useState } from 'react'

// ============================================
// Задание 5.3: Плагины аутентификации
// ============================================

// TODO: Опишите структуру записи о плагине аутентификации
// Поля:
//   id: string
//   name: строковое название
//   type: 'builtin' | 'thirdparty'
//   description: описание
//   backends: массив поддерживаемых бэкендов
//   pros: массив преимуществ
//   cons: массив недостатков
//   configExample: пример конфигурации (строка)
//   openWrtSupport: 'full' | 'partial' | 'limited'
//   openWrtNote: комментарий о поддержке OpenWRT
interface AuthPlugin {
  id: string
  name: string
  // TODO: добавьте остальные поля
}

// TODO: Создайте массив из 4 плагинов:
// 1. Password File + ACL (builtin, full OpenWRT support)
// 2. Dynamic Security Plugin (builtin, full OpenWRT support, Mosquitto 2.x)
// 3. mosquitto-go-auth (thirdparty, limited OpenWRT support)
// 4. JWT Authentication (thirdparty, partial OpenWRT support)
// Для каждого заполните все поля, включая реальный пример конфигурации
const authPlugins: AuthPlugin[] = [
  // TODO: добавьте плагины
]

export function Task5_3() {
  const [selectedPlugin, setSelectedPlugin] = useState<string>('')
  const [showConfig, setShowConfig] = useState(false)

  // TODO: найдите выбранный плагин по id
  const plugin = authPlugins.find((p) => p.id === selectedPlugin)

  return (
    <div className="exercise-container">
      <h2>Задание 5.3: Плагины аутентификации</h2>
      <p style={{ color: '#6b7280', marginBottom: 16 }}>
        Сравнение механизмов аутентификации для Mosquitto с учётом ограничений OpenWRT.
      </p>

      {authPlugins.length === 0 && (
        <div style={{ padding: 16, background: '#fef2f2', borderRadius: 8, color: '#991b1b' }}>
          Заполните массив authPlugins данными о плагинах
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
        <div>
          <h3 style={{ fontSize: 14, color: '#6b7280', textTransform: 'uppercase', marginBottom: 12 }}>
            Плагины
          </h3>

          {/* TODO: кнопки выбора плагина */}
          {authPlugins.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelectedPlugin(p.id); setShowConfig(false) }}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 12px',
                border: `2px solid ${selectedPlugin === p.id ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: 8,
                background: selectedPlugin === p.id ? '#eff6ff' : 'white',
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: 6,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
              {/* TODO: добавьте бейдж built-in/thirdparty */}
            </button>
          ))}
        </div>

        <div>
          {/* TODO: если plugin выбран, показать:
               - название и бейдж OpenWRT поддержки
               - description
               - список backends
               - pros (зелёный блок)
               - cons (красный блок)
               - openWrtNote (жёлтый блок)
               - кнопку показать/скрыть configExample */}

          {!plugin && (
            <div style={{ color: '#9ca3af', fontSize: 14 }}>
              Выберите плагин слева
            </div>
          )}

          {plugin && (
            <div>
              <h2 style={{ margin: 0, fontSize: 18, marginBottom: 8 }}>{plugin.name}</h2>

              {/* TODO: отрендерите полную информацию о плагине */}
              <p style={{ color: '#6b7280', fontSize: 13 }}>
                TODO: добавьте поля в AuthPlugin и заполните данные
              </p>

              <button
                onClick={() => setShowConfig(!showConfig)}
                style={{ padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: 6, background: 'white', cursor: 'pointer', fontSize: 13 }}
              >
                {showConfig ? '▼ Скрыть конфигурацию' : '▶ Показать пример конфигурации'}
              </button>

              {showConfig && (
                <pre style={{ background: '#1e1e2e', color: '#cdd6f4', padding: 12, borderRadius: 8, fontSize: 12, fontFamily: 'monospace', marginTop: 8 }}>
                  TODO: configExample
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
