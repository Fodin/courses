import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 12.2: CQRS — разделение чтения и записи
// ============================================================
//
// Цель: реализовать демонстрацию CQRS.
// Write side: команды → бизнес-валидация → события → write store (Map)
// Read side:  два проекционных builder-а строят независимые read models
// из одного источника событий.

// TODO: Определи тип CommandType — объединение 4 строк:
// 'CreateProduct' | 'UpdatePrice' | 'AddStock' | 'SetInactive'
// type CommandType = ...

// TODO: Определи интерфейс Command:
// { type: CommandType; payload: Record<string, unknown> }
// interface Command { ... }

// TODO: Определи интерфейс CQRSEvent:
// { id: string; type: string; payload: Record<string, unknown>; timestamp: number }
// interface CQRSEvent { ... }

// TODO: Определи интерфейс ProductWriteModel — write store entry:
// { productId: string; name: string; price: number; stock: number; active: boolean; version: number }
// interface ProductWriteModel { ... }

// TODO: Определи интерфейс ProductCatalogItem — read model для каталога:
// { productId: string; name: string; price: number; available: boolean }
// interface ProductCatalogItem { ... }

// TODO: Определи интерфейс InventoryItem — read model для склада:
// { productId: string; name: string; stock: number; lowStock: boolean }
// interface InventoryItem { ... }

// TODO: Реализуй функцию processCommand(state, command) → CQRSEvent | null
// Бизнес-правила (возвращать null при нарушении):
// - CreateProduct: если state.has(productId) — отклонить (дубль)
//   событие: { type: 'ProductCreated', payload: { productId, name, price, stock } }
// - UpdatePrice: если !state.has(productId) — отклонить
//   событие: { type: 'PriceUpdated', payload: { productId, price } }
// - AddStock: если !state.has(productId) — отклонить
//   событие: { type: 'StockAdded', payload: { productId, qty } }
// - SetInactive: если !state.has(productId) — отклонить
//   событие: { type: 'ProductDeactivated', payload: { productId } }
// id события: `e-${Date.now()}`, timestamp: Date.now()
// function processCommand(state: Map<string, ProductWriteModel>, command: Command): CQRSEvent | null { ... }

// TODO: Реализуй функцию applyProductEvent(state, event) → Map<string, ProductWriteModel>
// Создавай новый Map через new Map(state), не мутируй оригинал.
// Обработай типы: 'ProductCreated', 'PriceUpdated', 'StockAdded', 'ProductDeactivated'
// При StockAdded: stock = existing.stock + qty
// При PriceUpdated: обновляем price, version + 1
// При ProductDeactivated: active = false, version + 1
// function applyProductEvent(state: Map<string, ProductWriteModel>, event: CQRSEvent): Map<string, ProductWriteModel> { ... }

// TODO: Реализуй buildCatalogProjection(writeModels) → ProductCatalogItem[]
// Фильтруй только активные товары (p.active === true)
// available = p.stock > 0
// function buildCatalogProjection(writeModels: Map<string, ProductWriteModel>): ProductCatalogItem[] { ... }

// TODO: Реализуй buildInventoryProjection(writeModels) → InventoryItem[]
// Включай ВСЕ товары (и неактивные тоже)
// lowStock = p.stock < 10
// function buildInventoryProjection(writeModels: Map<string, ProductWriteModel>): InventoryItem[] { ... }

// TODO: Объяви массив PRESET_COMMANDS из 5 элементов типа:
// Array<{ label: string; command: Command; color: string }>
// 1. label: 'Создать товар A', command: CreateProduct {productId:'P-A', name:'Widget Pro', price:29, stock:50}, color:'#4f86f7'
// 2. label: 'Создать товар B', command: CreateProduct {productId:'P-B', name:'Gadget X', price:89, stock:8},  color:'#4f86f7'
// 3. label: 'Повысить цену A',  command: UpdatePrice  {productId:'P-A', price:39},                            color:'#ed8936'
// 4. label: 'Добавить склад B', command: AddStock     {productId:'P-B', qty:5},                               color:'#38a169'
// 5. label: 'Деактивировать A', command: SetInactive  {productId:'P-A'},                                      color:'#e53e3e'
// const PRESET_COMMANDS = [...]

export function Task12_2() {
  const { t } = useLanguage()

  // TODO: Состояние writeState: Map<string, ProductWriteModel> (начальное: new Map())
  const [writeState, setWriteState] = useState<Map<string, unknown>>(new Map())

  // TODO: Состояние eventLog: CQRSEvent[] (начальное: [])
  const [eventLog, setEventLog] = useState<unknown[]>([])

  // TODO: Состояние lastCommandResult: string | null (начальное: null)
  const [lastCommandResult, setLastCommandResult] = useState<string | null>(null)

  // TODO: Реализуй handleCommand(command: Command):
  // 1. Вызови processCommand(writeState, command)
  // 2. Если результат null → setLastCommandResult(`Команда ${command.type} отклонена (бизнес-правило)`) и return
  // 3. Иначе:
  //    - setLastCommandResult(`Команда принята → событие ${event.type} сохранено`)
  //    - setWriteState(applyProductEvent(writeState, event))
  //    - setEventLog(prev => [...prev, event])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCommand = (_command: unknown) => {
    // TODO: реализация
  }

  // TODO: Вычисли проекции:
  // const catalog = buildCatalogProjection(writeState)
  // const inventory = buildInventoryProjection(writeState)
  const catalog: unknown[] = []
  const inventory: unknown[] = []

  return (
    <div className="exercise-container">
      <h2>{t('task.12.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        CQRS разделяет запись (команды → события → write store) и чтение (проекции → read models).
        Отправляйте команды и наблюдайте, как обновляются независимые проекции.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Write side */}
        <div style={{ flex: '1 1 220px' }}>
          <div style={{
            fontSize: '0.75rem', fontWeight: 700, color: '#4f86f7',
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem',
          }}>
            Write Side — команды
          </div>

          {/* TODO: PRESET_COMMANDS.map — кнопки команд.
              Каждая кнопка:
              - onClick: handleCommand(item.command)
              - background: `${item.color}15`, border: `1.5px solid ${item.color}50`
              - color: item.color, fontWeight 600
          */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Кнопки команд появятся здесь...</p>
          </div>

          {/* TODO: Если lastCommandResult не null — показать блок с текстом результата
              background '#f7fafc', border '#e2e8f0', fontSize 0.78rem
          */}

          {/* TODO: Event Store — список eventLog.
              Заголовок: "Event Store ({eventLog.length})"
              Если пусто — текст "Пусто" по центру.
              Иначе: список строк: тип события цветом #4f86f7 + payload (slice 40 символов + ...)
              maxHeight: 180px, overflowY: auto
          */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{
              fontSize: '0.75rem', fontWeight: 700, color: '#888',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem',
            }}>
              Event Store ({eventLog.length})
            </div>
            <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '0.5rem' }}>
              <p style={{ color: '#aaa', fontSize: '0.8rem', textAlign: 'center' }}>Пусто</p>
            </div>
          </div>
        </div>

        {/* Read side */}
        <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* TODO: Read Model: каталог товаров.
              Заголовок зелёный (#38a169).
              Если catalog пуст — "Каталог пуст".
              Иначе — таблица: столбцы Товар | Цена | Наличие.
              Наличие: available ? "В наличии" (#38a169) : "Нет" (#e53e3e)
              background '#f0fff4', border '#c6f6d5'
          */}
          <div>
            <div style={{
              fontSize: '0.75rem', fontWeight: 700, color: '#38a169',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem',
            }}>
              Read Model: каталог товаров
            </div>
            <div style={{ border: '1px solid #c6f6d5', borderRadius: '8px', background: '#f0fff4', padding: '1rem' }}>
              <p style={{ color: '#aaa', fontSize: '0.8rem', textAlign: 'center' }}>
                {catalog.length === 0 ? 'Каталог пуст' : 'TODO: таблица каталога'}
              </p>
            </div>
          </div>

          {/* TODO: Read Model: управление складом.
              Заголовок оранжевый (#ed8936).
              Если inventory пуст — "Склад пуст".
              Иначе — таблица: столбцы Товар | Склад | Статус.
              Статус: lowStock ? "Мало!" (#e53e3e, fontWeight 600) : "OK" (#38a169)
              background '#fffaf0', border '#fbd38d'
          */}
          <div>
            <div style={{
              fontSize: '0.75rem', fontWeight: 700, color: '#ed8936',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem',
            }}>
              Read Model: управление складом
            </div>
            <div style={{ border: '1px solid #fbd38d', borderRadius: '8px', background: '#fffaf0', padding: '1rem' }}>
              <p style={{ color: '#aaa', fontSize: '0.8rem', textAlign: 'center' }}>
                {inventory.length === 0 ? 'Склад пуст' : 'TODO: таблица склада'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TODO: Информационный блок.
          background '#ebf4ff', border '#bee3f8', color '#2b6cb0'
          Текст: объяснение CQRS — каталог и склад как разные read models на одних событиях.
      */}
    </div>
  )
}
