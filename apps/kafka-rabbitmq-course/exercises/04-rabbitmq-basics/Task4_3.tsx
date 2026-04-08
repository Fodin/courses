import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 4.3: Virtual Hosts и права доступа
// Task 4.3: Virtual Hosts and Access Permissions
// ============================================
//
// Цель: создать интерактивную матрицу прав доступа RabbitMQ.
// Goal: create an interactive RabbitMQ access permission matrix.
// Функции:
// Features:
//   - Список virtual hosts с возможностью добавления/удаления
//   - List of virtual hosts with add/remove capability
//   - Список пользователей (предопределённых)
//   - List of users (predefined)
//   - Матрица прав: configure / write / read (regex-паттерны)
//   - Permission matrix: configure / write / read (regex patterns)
//   - Редактор permissions с live-валидацией совпадений
//   - Permission editor with live match validation
//   - Панель: к каким ресурсам у пользователя есть доступ
//   - Panel: which resources the user has access to

// TODO: Определи интерфейс VHost:
// TODO: Define VHost interface:
//   name: string, description: string, tags: string[], created: string
// interface VHost { ... }

// TODO: Определи интерфейс RmqUser:
// TODO: Define RmqUser interface:
//   username: string, tags: string[], color: string
// interface RmqUser { ... }

// TODO: Определи интерфейс Permission:
// TODO: Define Permission interface:
//   user: string, vhost: string
//   configure: string  — regex-паттерн / regex pattern
//   write: string      — regex-паттерн / regex pattern
//   read: string       — regex-паттерн / regex pattern
// interface Permission { ... }

// TODO: Создай DEFAULT_VHOSTS — массив из 3 vhosts:
// TODO: Create DEFAULT_VHOSTS — array of 3 vhosts:
//   '/' (default), '/production', '/staging'
// const DEFAULT_VHOSTS: VHost[] = [...]

// TODO: Создай DEFAULT_USERS — 3 пользователя:
// TODO: Create DEFAULT_USERS — 3 users:
//   admin (administrator, красный/red), app_user (none, синий/blue), monitor (monitoring, зелёный/green)
// const DEFAULT_USERS: RmqUser[] = [...]

// TODO: Создай DEFAULT_PERMISSIONS — начальные права:
// TODO: Create DEFAULT_PERMISSIONS — initial permissions:
//   admin @ / : configure='.*', write='.*', read='.*'
//   admin @ /production : configure='.*', write='.*', read='.*'
//   app_user @ /production : configure='', write='orders\..*|payments\..*', read='orders\..*|payments\..*'
//   monitor @ /production : configure='', write='', read='.*'
// const DEFAULT_PERMISSIONS: Permission[] = [...]

// TODO: Список ресурсов для проверки доступа:
// TODO: List of resources to check access:
// const RESOURCE_NAMES = ['orders.created', 'payments.pending', 'notifications.email', 'audit.events', 'amq.topic', 'amq.direct']

// TODO: Реализуй функцию matchesRegex(pattern: string, name: string): boolean
// TODO: Implement function matchesRegex(pattern: string, name: string): boolean
//   Использует new RegExp(`^${pattern}$`).test(name)
//   Uses new RegExp(`^${pattern}$`).test(name)
//   Возвращает false при пустом pattern или ошибке
//   Returns false for empty pattern or error
// function matchesRegex(pattern: string, name: string): boolean { ... }

export function Task4_3() {
  const { t } = useLanguage()

  // TODO: Состояния:
  // TODO: States:
  //   vhosts: VHost[] — начальное DEFAULT_VHOSTS
  //   vhosts: VHost[] — initial DEFAULT_VHOSTS
  //   users: RmqUser[] — начальное DEFAULT_USERS
  //   users: RmqUser[] — initial DEFAULT_USERS
  //   permissions: Permission[] — начальное DEFAULT_PERMISSIONS
  //   permissions: Permission[] — initial DEFAULT_PERMISSIONS
  //   selectedVhost: string — начальный '/production'
  //   selectedVhost: string — initial '/production'
  //   selectedUser: string | null — выбранный пользователь для фильтра
  //   selectedUser: string | null — selected user for filtering
  //   newVhostName: string — поле ввода нового vhost
  //   newVhostName: string — input field for new vhost
  //   editPerm: Permission | null — редактируемый permission
  //   editPerm: Permission | null — permission being edited
  //   editFields: { configure, write, read } — поля редактора
  //   editFields: { configure, write, read } — editor fields
  //   activeTab: 'matrix' | 'editor'

  const [selectedVhost, setSelectedVhost] = useState('/production')
  const [activeTab, setActiveTab] = useState<'matrix' | 'editor'>('matrix')

  // TODO: Вспомогательные функции:
  // TODO: Helper functions:
  //
  //   getPermission(user: string, vhost: string): Permission | undefined
  //   — ищет в массиве permissions по user+vhost
  //   — searches permissions array by user+vhost
  //
  //   addVhost() — добавляет новый vhost из newVhostName (если не пустой и не дублирует)
  //   addVhost() — adds new vhost from newVhostName (if not empty and not duplicate)
  //   deleteVhost(name: string) — удаляет vhost (нельзя удалить '/')
  //   deleteVhost(name: string) — removes vhost (cannot delete '/')
  //     также удаляет связанные permissions
  //     also removes associated permissions
  //
  //   startEdit(user: string, vhost: string) — открывает редактор:
  //   startEdit(user: string, vhost: string) — opens editor:
  //     находит permission или создаёт пустой, заполняет editFields, переходит на вкладку editor
  //     finds permission or creates empty one, fills editFields, switches to editor tab
  //
  //   savePerm() — сохраняет editFields в permissions (update или push)
  //   savePerm() — saves editFields to permissions (update or push)

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '960px', padding: '1rem' }}>
      <h2>{t('task.4.3')}</h2>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Создавайте Virtual Hosts, управляйте правами доступа через regex-паттерны.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem' }}>

        {/* ЛЕВАЯ КОЛОНКА: список VHosts + список пользователей */}
        {/* LEFT COLUMN: VHosts list + users list */}
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Virtual Hosts
          </div>

          {/* TODO: Список vhosts:
              - Клик выбирает selectedVhost
              - Выбранный: оранжевая граница, светлый фон
              - Кнопка ✕ для удаления (кроме '/')
              - Имя — monospace */}
          {/* TODO: VHosts list:
              - Click selects selectedVhost
              - Selected: orange border, light background
              - ✕ button for deletion (except '/')
              - Name — monospace */}
          <div style={{ border: '2px solid #FF6600', borderRadius: '8px', padding: '0.6rem 0.75rem', marginBottom: '0.4rem', background: '#FFF3E0' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#E65100' }}>/production</span>
            <div style={{ fontSize: '0.72rem', color: '#888' }}>TODO: реализовать список / implement list</div>
          </div>

          {/* TODO: Поле ввода + кнопка "+" для добавления vhost:
              - Input с value=newVhostName, onChange, onKeyDown (Enter)
              - Кнопка "+" вызывает addVhost() */}
          {/* TODO: Input field + "+" button for adding vhost:
              - Input with value=newVhostName, onChange, onKeyDown (Enter)
              - "+" button calls addVhost() */}
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
          {/* TODO: Users list:
              - Click selects/deselects selectedUser
              - Colored dot next to name
              - User tag (administrator, none, monitoring) */}
          <div style={{ color: '#aaa', fontSize: '0.8rem', padding: '0.5rem' }}>
            TODO: список пользователей / users list
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: матрица или редактор */}
        {/* RIGHT SIDE: matrix or editor */}
        <div>
          {/* Переключатель вкладок */}
          {/* Tab switcher */}
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
          {/* TAB: Permission matrix */}
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
              {/* TODO: Permissions table:
                  Columns: User | Configure | Write | Read | Actions
                  Rows: one per user
                  - If permission exists: show regex pattern as colored badge
                    configure = orange, write = blue, read = green
                    '.*' = light green (full access)
                  - If none: gray "no access"
                  - "Edit" button calls startEdit(user, selectedVhost) */}
              <div style={{ color: '#aaa', textAlign: 'center', padding: '2rem', border: '1px dashed #ddd', borderRadius: '8px' }}>
                TODO: таблица матрицы прав / permissions matrix table
              </div>

              {/* TODO: Если selectedUser !== null:
                  Показывай панель "Доступ к ресурсам":
                  - Таблица: Ресурс | Configure ✅/— | Write ✅/— | Read ✅/—
                  - Для каждого из RESOURCE_NAMES проверяй matchesRegex
              */}
              {/* TODO: If selectedUser !== null:
                  Show "Resource Access" panel:
                  - Table: Resource | Configure ✅/— | Write ✅/— | Read ✅/—
                  - For each of RESOURCE_NAMES check matchesRegex
              */}
            </div>
          )}

          {/* ВКЛАДКА: Редактор */}
          {/* TAB: Editor */}
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
              {/* TODO: If editPerm === null: placeholder with instructions
                  If editPerm is set:
                  - For each field (configure, write, read):
                    label with color and description
                    input with value and onChange
                    live check: how many resources from RESOURCE_NAMES match
                    show matched resources as colored badges
                  - Regex hints (examples)
                  - Buttons: "Save" (savePerm) and "Cancel"
              */}
              <div style={{ color: '#aaa', textAlign: 'center', padding: '2rem', fontSize: '0.85rem' }}>
                TODO: редактор permissions / permissions editor
              </div>

              {/* Подсказка по синтаксису */}
              {/* Syntax hint */}
              <div style={{ padding: '0.75rem', background: '#F3F4F6', borderRadius: '6px', fontSize: '0.78rem', color: '#555' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Примеры regex: / Regex examples:</div>
                <div style={{ fontFamily: 'monospace', lineHeight: 1.8 }}>
                  <div>.*  — полный доступ / full access</div>
                  <div>orders\..*  — все с префиксом "orders." / all with "orders." prefix</div>
                  <div>orders\..*|payments\..*  — OR через | / OR via |</div>
                  <div>(пусто) — доступ запрещён / (empty) — access denied</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
