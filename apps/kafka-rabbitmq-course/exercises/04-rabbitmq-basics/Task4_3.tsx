import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 4.3: Virtual Hosts и права доступа
// ============================================
//
// Цель: создать интерактивную матрицу прав доступа RabbitMQ.
// Функции:
//   - Список virtual hosts с возможностью добавления/удаления
//   - Список пользователей (предопределённых)
//   - Матрица прав: configure / write / read (regex-паттерны)
//   - Редактор permissions с live-валидацией совпадений
//   - Панель: к каким ресурсам у пользователя есть доступ

// TODO: Определи интерфейс VHost:
//   name: string, description: string, tags: string[], created: string
// interface VHost { ... }

// TODO: Определи интерфейс RmqUser:
//   username: string, tags: string[], color: string
// interface RmqUser { ... }

// TODO: Определи интерфейс Permission:
//   user: string, vhost: string
//   configure: string  — regex-паттерн
//   write: string      — regex-паттерн
//   read: string       — regex-паттерн
// interface Permission { ... }

// TODO: Создай DEFAULT_VHOSTS — массив из 3 vhosts:
//   '/' (default), '/production', '/staging'
// const DEFAULT_VHOSTS: VHost[] = [...]

// TODO: Создай DEFAULT_USERS — 3 пользователя:
//   admin (administrator, красный), app_user (none, синий), monitor (monitoring, зелёный)
// const DEFAULT_USERS: RmqUser[] = [...]

// TODO: Создай DEFAULT_PERMISSIONS — начальные права:
//   admin @ / : configure='.*', write='.*', read='.*'
//   admin @ /production : configure='.*', write='.*', read='.*'
//   app_user @ /production : configure='', write='orders\..*|payments\..*', read='orders\..*|payments\..*'
//   monitor @ /production : configure='', write='', read='.*'
// const DEFAULT_PERMISSIONS: Permission[] = [...]

// TODO: Список ресурсов для проверки доступа:
// const RESOURCE_NAMES = ['orders.created', 'payments.pending', 'notifications.email', 'audit.events', 'amq.topic', 'amq.direct']

// TODO: Реализуй функцию matchesRegex(pattern: string, name: string): boolean
//   Использует new RegExp(`^${pattern}$`).test(name)
//   Возвращает false при пустом pattern или ошибке
// function matchesRegex(pattern: string, name: string): boolean { ... }

export function Task4_3() {
  const { t } = useLanguage()

  // TODO: Состояния:
  //   vhosts: VHost[] — начальное DEFAULT_VHOSTS
  //   users: RmqUser[] — начальное DEFAULT_USERS
  //   permissions: Permission[] — начальное DEFAULT_PERMISSIONS
  //   selectedVhost: string — начальный '/production'
  //   selectedUser: string | null — выбранный пользователь для фильтра
  //   newVhostName: string — поле ввода нового vhost
  //   editPerm: Permission | null — редактируемый permission
  //   editFields: { configure, write, read } — поля редактора
  //   activeTab: 'matrix' | 'editor'

  const [selectedVhost, setSelectedVhost] = useState('/production')
  const [activeTab, setActiveTab] = useState<'matrix' | 'editor'>('matrix')

  // TODO: Вспомогательные функции:
  //
  //   getPermission(user: string, vhost: string): Permission | undefined
  //   — ищет в массиве permissions по user+vhost
  //
  //   addVhost() — добавляет новый vhost из newVhostName (если не пустой и не дублирует)
  //   deleteVhost(name: string) — удаляет vhost (нельзя удалить '/')
  //     также удаляет связанные permissions
  //
  //   startEdit(user: string, vhost: string) — открывает редактор:
  //     находит permission или создаёт пустой, заполняет editFields, переходит на вкладку editor
  //
  //   savePerm() — сохраняет editFields в permissions (update или push)

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '960px', padding: '1rem' }}>
      <h2>{t('task.4.3')}</h2>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Создавайте Virtual Hosts, управляйте правами доступа через regex-паттерны.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem' }}>

        {/* ЛЕВАЯ КОЛОНКА: список VHosts + список пользователей */}
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Virtual Hosts
          </div>

          {/* TODO: Список vhosts:
              - Клик выбирает selectedVhost
              - Выбранный: оранжевая граница, светлый фон
              - Кнопка ✕ для удаления (кроме '/')
              - Имя — monospace */}
          <div style={{ border: '2px solid #FF6600', borderRadius: '8px', padding: '0.6rem 0.75rem', marginBottom: '0.4rem', background: '#FFF3E0' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#E65100' }}>/production</span>
            <div style={{ fontSize: '0.72rem', color: '#888' }}>TODO: реализовать список</div>
          </div>

          {/* TODO: Поле ввода + кнопка "+" для добавления vhost:
              - Input с value=newVhostName, onChange, onKeyDown (Enter)
              - Кнопка "+" вызывает addVhost() */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
            <input
              placeholder='/new-vhost'
              style={{ flex: 1, padding: '0.4rem 0.5rem', fontFamily: 'monospace', fontSize: '0.82rem', border: '1px solid #ddd', borderRadius: '6px' }}
            />
            <button style={{ padding: '0.4rem 0.6rem', background: '#FF6600', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+</button>
          </div>

          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem', marginTop: '1.25rem', textTransform: 'uppercase' }}>
            Пользователи
          </div>

          {/* TODO: Список пользователей:
              - Клик выбирает/снимает selectedUser
              - Цветная точка рядом с именем
              - Тег пользователя (administrator, none, monitoring) */}
          <div style={{ color: '#aaa', fontSize: '0.8rem', padding: '0.5rem' }}>
            TODO: список пользователей
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: матрица или редактор */}
        <div>
          {/* Переключатель вкладок */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {([['matrix', '🔐 Матрица прав'], ['editor', '✏️ Редактор']] as const).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  background: activeTab === tab ? '#1565C0' : '#fff',
                  color: activeTab === tab ? '#fff' : '#333',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab ? 600 : 400,
                  fontSize: '0.85rem',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ВКЛАДКА: Матрица прав */}
          {activeTab === 'matrix' && (
            <div>
              <div style={{ marginBottom: '0.75rem', fontSize: '0.82rem', color: '#666' }}>
                VHost: <strong style={{ fontFamily: 'monospace', color: '#E65100' }}>{selectedVhost}</strong>
              </div>

              {/* TODO: Таблица прав:
                  Колонки: Пользователь | Configure | Write | Read | Действия
                  Строки: по каждому пользователю
                  - Если permission есть: показывай regex-паттерн цветным badge
                    configure = оранжевый, write = синий, read = зелёный
                    '.*' = светло-зелёный (полный доступ)
                  - Если нет: серое "нет доступа"
                  - Кнопка "Изменить" вызывает startEdit(user, selectedVhost) */}
              <div style={{ color: '#aaa', textAlign: 'center', padding: '2rem', border: '1px dashed #ddd', borderRadius: '8px' }}>
                TODO: таблица матрицы прав
              </div>

              {/* TODO: Если selectedUser !== null:
                  Показывай панель "Доступ к ресурсам":
                  - Таблица: Ресурс | Configure ✅/— | Write ✅/— | Read ✅/—
                  - Для каждого из RESOURCE_NAMES проверяй matchesRegex
              */}
            </div>
          )}

          {/* ВКЛАДКА: Редактор */}
          {activeTab === 'editor' && (
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.25rem' }}>
              <div style={{ fontWeight: 600, marginBottom: '1rem', color: '#333' }}>
                Редактировать права
              </div>

              {/* TODO: Если editPerm === null: заглушка с инструкцией
                  Если editPerm задан:
                  - Для каждого поля (configure, write, read):
                    label с цветом и пояснением
                    input с value и onChange
                    live-проверка: сколько ресурсов из RESOURCE_NAMES совпадает
                    показывай совпавшие ресурсы как цветные бейджи
                  - Подсказки по regex (примеры)
                  - Кнопки: "Сохранить" (savePerm) и "Отмена"
              */}
              <div style={{ color: '#aaa', textAlign: 'center', padding: '2rem', fontSize: '0.85rem' }}>
                TODO: редактор permissions
              </div>

              {/* Подсказка по синтаксису */}
              <div style={{ padding: '0.75rem', background: '#F3F4F6', borderRadius: '6px', fontSize: '0.78rem', color: '#555' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Примеры regex:</div>
                <div style={{ fontFamily: 'monospace', lineHeight: 1.8 }}>
                  <div>.*  — полный доступ</div>
                  <div>orders\..*  — все с префиксом "orders."</div>
                  <div>orders\..*|payments\..*  — OR через |</div>
                  <div>(пусто) — доступ запрещён</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
