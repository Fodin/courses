import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Task 12.2: CQRS — Read/Write Separation
// Задание 12.2: CQRS — разделение чтения и записи
// ============================================================
//
// Goal: implement a CQRS demonstration.
// Цель: реализовать демонстрацию CQRS.
// Write side: commands → business validation → events → write store (Map)
// Write side: команды → бизнес-валидация → события → write store (Map)
// Read side: two projection builders construct independent read models
// Read side:  два проекционных builder-а строят независимые read models
// from the same event source.
// из одного источника событий.

// TODO: Define type CommandType — union of 4 strings:
// TODO: Определи тип CommandType — объединение 4 строк:
// 'CreateProduct' | 'UpdatePrice' | 'AddStock' | 'SetInactive'
// type CommandType = ...

// TODO: Define interface Command:
// TODO: Определи интерфейс Command:
// { type: CommandType; payload: Record<string, unknown> }
// interface Command { ... }

// TODO: Define interface CQRSEvent:
// TODO: Определи интерфейс CQRSEvent:
// { id: string; type: string; payload: Record<string, unknown>; timestamp: number }
// interface CQRSEvent { ... }

// TODO: Define interface ProductWriteModel — write store entry:
// TODO: Определи интерфейс ProductWriteModel — write store entry:
// { productId: string; name: string; price: number; stock: number; active: boolean; version: number }
// interface ProductWriteModel { ... }

// TODO: Define interface ProductCatalogItem — read model for catalog:
// TODO: Определи интерфейс ProductCatalogItem — read model для каталога:
// { productId: string; name: string; price: number; available: boolean }
// interface ProductCatalogItem { ... }

// TODO: Define interface InventoryItem — read model for warehouse:
// TODO: Определи интерфейс InventoryItem — read model для склада:
// { productId: string; name: string; stock: number; lowStock: boolean }
// interface InventoryItem { ... }

// TODO: Implement function processCommand(state, command) → CQRSEvent | null
// TODO: Реализуй функцию processCommand(state, command) → CQRSEvent | null
// Business rules (return null on violation):
// Бизнес-правила (возвращать null при нарушении):
// - CreateProduct: if state.has(productId) — reject (duplicate)
// - CreateProduct: если state.has(productId) — отклонить (дубль)
//   event: { type: 'ProductCreated', payload: { productId, name, price, stock } }
//   событие: { type: 'ProductCreated', payload: { productId, name, price, stock } }
// - UpdatePrice: if !state.has(productId) — reject
// - UpdatePrice: если !state.has(productId) — отклонить
//   event: { type: 'PriceUpdated', payload: { productId, price } }
//   событие: { type: 'PriceUpdated', payload: { productId, price } }
// - AddStock: if !state.has(productId) — reject
// - AddStock: если !state.has(productId) — отклонить
//   event: { type: 'StockAdded', payload: { productId, qty } }
//   событие: { type: 'StockAdded', payload: { productId, qty } }
// - SetInactive: if !state.has(productId) — reject
// - SetInactive: если !state.has(productId) — отклонить
//   event: { type: 'ProductDeactivated', payload: { productId } }
//   событие: { type: 'ProductDeactivated', payload: { productId } }
// Event id: `e-${Date.now()}`, timestamp: Date.now()
// id события: `e-${Date.now()}`, timestamp: Date.now()
// function processCommand(state: Map<string, ProductWriteModel>, command: Command): CQRSEvent | null { ... }

// TODO: Implement function applyProductEvent(state, event) → Map<string, ProductWriteModel>
// TODO: Реализуй функцию applyProductEvent(state, event) → Map<string, ProductWriteModel>
// Create a new Map via new Map(state), do not mutate the original.
// Создавай новый Map через new Map(state), не мутируй оригинал.
// Handle types: 'ProductCreated', 'PriceUpdated', 'StockAdded', 'ProductDeactivated'
// Обработай типы: 'ProductCreated', 'PriceUpdated', 'StockAdded', 'ProductDeactivated'
// On StockAdded: stock = existing.stock + qty
// При StockAdded: stock = existing.stock + qty
// On PriceUpdated: update price, version + 1
// При PriceUpdated: обновляем price, version + 1
// On ProductDeactivated: active = false, version + 1
// При ProductDeactivated: active = false, version + 1
// function applyProductEvent(state: Map<string, ProductWriteModel>, event: CQRSEvent): Map<string, ProductWriteModel> { ... }

// TODO: Implement buildCatalogProjection(writeModels) → ProductCatalogItem[]
// TODO: Реализуй buildCatalogProjection(writeModels) → ProductCatalogItem[]
// Filter only active products (p.active === true)
// Фильтруй только активные товары (p.active === true)
// available = p.stock > 0
// available = p.stock > 0
// function buildCatalogProjection(writeModels: Map<string, ProductWriteModel>): ProductCatalogItem[] { ... }

// TODO: Implement buildInventoryProjection(writeModels) → InventoryItem[]
// TODO: Реализуй buildInventoryProjection(writeModels) → InventoryItem[]
// Include ALL products (including inactive)
// Включай ВСЕ товары (и неактивные тоже)
// lowStock = p.stock < 10
// lowStock = p.stock < 10
// function buildInventoryProjection(writeModels: Map<string, ProductWriteModel>): InventoryItem[] { ... }

// TODO: Declare array PRESET_COMMANDS of 5 elements of type:
// TODO: Объяви массив PRESET_COMMANDS из 5 элементов типа:
// Array<{ label: string; command: Command; color: string }>
// Array<{ label: string; command: Command; color: string }>
// 1. label: 'Create product A', command: CreateProduct {productId:'P-A', name:'Widget Pro', price:29, stock:50}, color:'#4f86f7'
// 1. label: 'Создать товар A', command: CreateProduct {productId:'P-A', name:'Widget Pro', price:29, stock:50}, color:'#4f86f7'
// 2. label: 'Create product B', command: CreateProduct {productId:'P-B', name:'Gadget X', price:89, stock:8},  color:'#4f86f7'
// 2. label: 'Создать товар B', command: CreateProduct {productId:'P-B', name:'Gadget X', price:89, stock:8},  color:'#4f86f7'
// 3. label: 'Raise price A',    command: UpdatePrice  {productId:'P-A', price:39},                            color:'#ed8936'
// 3. label: 'Повысить цену A',  command: UpdatePrice  {productId:'P-A', price:39},                            color:'#ed8936'
// 4. label: 'Add stock B',      command: AddStock     {productId:'P-B', qty:5},                               color:'#38a169'
// 4. label: 'Добавить склад B', command: AddStock     {productId:'P-B', qty:5},                               color:'#38a169'
// 5. label: 'Deactivate A',     command: SetInactive  {productId:'P-A'},                                      color:'#e53e3e'
// 5. label: 'Деактивировать A', command: SetInactive  {productId:'P-A'},                                      color:'#e53e3e'
// const PRESET_COMMANDS = [...]

export function Task12_2() {
  const { t } = useLanguage()

  // TODO: State writeState: Map<string, ProductWriteModel> (initial: new Map())
  // TODO: Состояние writeState: Map<string, ProductWriteModel> (начальное: new Map())
  const [writeState, setWriteState] = useState<Map<string, unknown>>(new Map())

  // TODO: State eventLog: CQRSEvent[] (initial: [])
  // TODO: Состояние eventLog: CQRSEvent[] (начальное: [])
  const [eventLog, setEventLog] = useState<unknown[]>([])

  // TODO: State lastCommandResult: string | null (initial: null)
  // TODO: Состояние lastCommandResult: string | null (начальное: null)
  const [lastCommandResult, setLastCommandResult] = useState<string | null>(null)

  // TODO: Implement handleCommand(command: Command):
  // TODO: Реализуй handleCommand(command: Command):
  // 1. Call processCommand(writeState, command)
  // 1. Вызови processCommand(writeState, command)
  // 2. If result is null → setLastCommandResult(`Command ${command.type} rejected (business rule)`) and return
  // 2. Если результат null → setLastCommandResult(`Команда ${command.type} отклонена (бизнес-правило)`) и return
  // 3. Otherwise:
  // 3. Иначе:
  //    - setLastCommandResult(`Command accepted → event ${event.type} saved`)
  //    - setLastCommandResult(`Команда принята → событие ${event.type} сохранено`)
  //    - setWriteState(applyProductEvent(writeState, event))
  //    - setEventLog(prev => [...prev, event])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCommand = (_command: unknown) => {
    // TODO: implementation
    // TODO: реализация
  }

  // TODO: Compute projections:
  // TODO: Вычисли проекции:
  // const catalog = buildCatalogProjection(writeState)
  // const inventory = buildInventoryProjection(writeState)
  const catalog: unknown[] = []
  const inventory: unknown[] = []

  return (
    <div className="exercise-container">
      <h2>{t('task.12.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        {/* CQRS separates write (commands → events → write store) and read (projections → read models). */}
        {/* CQRS разделяет запись (команды → события → write store) и чтение (проекции → read models). */}
        CQRS separates write (commands → events → write store) and read (projections → read models).
        {/* Send commands and observe how independent projections update. */}
        {/* Отправляйте команды и наблюдайте, как обновляются независимые проекции. */}
        Send commands and observe how independent projections update.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Write side */}
        <div style={{ flex: '1 1 220px' }}>
          <div style={{
            fontSize: '0.75rem', fontWeight: 700, color: '#4f86f7',
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem',
          }}>
            Write Side — commands {/* Write Side — команды */}
          </div>

          {/* TODO: PRESET_COMMANDS.map — command buttons. */}
          {/* TODO: PRESET_COMMANDS.map — кнопки команд.
              Each button:
              Каждая кнопка:
              - onClick: handleCommand(item.command)
              - background: `${item.color}15`, border: `1.5px solid ${item.color}50`
              - color: item.color, fontWeight 600
          */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Command buttons will appear here... {/* Кнопки команд появятся здесь... */}</p>
          </div>

          {/* TODO: If lastCommandResult not null — show block with result text */}
          {/* TODO: Если lastCommandResult не null — показать блок с текстом результата
              background '#f7fafc', border '#e2e8f0', fontSize 0.78rem
          */}

          {/* TODO: Event Store — eventLog list. */}
          {/* TODO: Event Store — список eventLog.
              Title: "Event Store ({eventLog.length})"
              Заголовок: "Event Store ({eventLog.length})"
              If empty — text "Empty" centered.
              Если пусто — текст "Пусто" по центру.
              Otherwise: list of lines: event type in color #4f86f7 + payload (slice 40 chars + ...)
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
              <p style={{ color: '#aaa', fontSize: '0.8rem', textAlign: 'center' }}>Empty {/* Пусто */}</p>
            </div>
          </div>
        </div>

        {/* Read side */}
        <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* TODO: Read Model: product catalog. */}
          {/* TODO: Read Model: каталог товаров.
              Title in green (#38a169).
              Заголовок зелёный (#38a169).
              If catalog empty — "Catalog empty".
              Если catalog пуст — "Каталог пуст".
              Otherwise — table: columns Product | Price | Availability.
              Иначе — таблица: столбцы Товар | Цена | Наличие.
              Availability: available ? "In stock" (#38a169) : "No" (#e53e3e)
              Наличие: available ? "В наличии" (#38a169) : "Нет" (#e53e3e)
              background '#f0fff4', border '#c6f6d5'
          */}
          <div>
            <div style={{
              fontSize: '0.75rem', fontWeight: 700, color: '#38a169',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem',
            }}>
              Read Model: product catalog {/* Read Model: каталог товаров */}
            </div>
            <div style={{ border: '1px solid #c6f6d5', borderRadius: '8px', background: '#f0fff4', padding: '1rem' }}>
              <p style={{ color: '#aaa', fontSize: '0.8rem', textAlign: 'center' }}>
                {catalog.length === 0 ? 'Catalog empty {/* Каталог пуст */}' : 'TODO: catalog table {/* TODO: таблица каталога */}'}
              </p>
            </div>
          </div>

          {/* TODO: Read Model: inventory management. */}
          {/* TODO: Read Model: управление складом.
              Title in orange (#ed8936).
              Заголовок оранжевый (#ed8936).
              If inventory empty — "Warehouse empty".
              Если inventory пуст — "Склад пуст".
              Otherwise — table: columns Product | Stock | Status.
              Иначе — таблица: столбцы Товар | Склад | Статус.
              Status: lowStock ? "Low!" (#e53e3e, fontWeight 600) : "OK" (#38a169)
              Статус: lowStock ? "Мало!" (#e53e3e, fontWeight 600) : "OK" (#38a169)
              background '#fffaf0', border '#fbd38d'
          */}
          <div>
            <div style={{
              fontSize: '0.75rem', fontWeight: 700, color: '#ed8936',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem',
            }}>
              Read Model: inventory management {/* Read Model: управление складом */}
            </div>
            <div style={{ border: '1px solid #fbd38d', borderRadius: '8px', background: '#fffaf0', padding: '1rem' }}>
              <p style={{ color: '#aaa', fontSize: '0.8rem', textAlign: 'center' }}>
                {inventory.length === 0 ? 'Warehouse empty {/* Склад пуст */}' : 'TODO: warehouse table {/* TODO: таблица склада */}'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TODO: Info block. */}
      {/* TODO: Информационный блок.
          background '#ebf4ff', border '#bee3f8', color '#2b6cb0'
          Text: CQRS explanation — catalog and warehouse as different read models from the same events.
          Текст: объяснение CQRS — каталог и склад как разные read models на одних событиях.
      */}
    </div>
  )
}
