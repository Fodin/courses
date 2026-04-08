import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.3: Декомпозиция Dashboard
// ============================================
// Разбейте Dashboard на 4 компонента по зонам ответственности:
// FilterPanel, StatsCards, SalesChart, DataTable

// TODO: Определите интерфейсы
// interface DashboardFilters {
//   period: 'day' | 'week' | 'month'
//   category: string
// }
// interface StatItem { label: string; value: string; change: number; icon: string }
// interface ChartPoint { label: string; value: number }
// interface TableRow { id: string; product: string; category: string; sales: number; revenue: number; growth: number }

// TODO: Создайте FilterPanel — Dumb компонент
// Принимает: filters: DashboardFilters, onChange: (f: DashboardFilters) => void
// Отображает: select для period ('day'|'week'|'month') и select для category
// НЕ имеет собственного state — только вызывает onChange
// function FilterPanel({ filters, onChange }: { ... }) { ... }

// TODO: Создайте StatsCards — Dumb компонент
// Принимает: stats: StatItem[]
// Отображает: карточки с иконкой, названием, значением и % изменения
// Положительное изменение — зелёный цвет, отрицательное — красный
// function StatsCards({ stats }: { stats: StatItem[] }) { ... }

// TODO: Создайте SalesChart — Dumb компонент
// Принимает: data: ChartPoint[]
// Рисует bar chart через div с CSS-высотой: height = (value / maxValue) * 100px
// function SalesChart({ data }: { data: ChartPoint[] }) { ... }

// TODO: Создайте DataTable — компонент с UI-state
// Принимает: rows: TableRow[]
// Имеет локальный state: sortField (keyof TableRow), sortDir ('asc' | 'desc')
// При клике на заголовок столбца — сортирует, повторный клик — меняет направление
// function DataTable({ rows }: { rows: TableRow[] }) { ... }

// Пример данных (замените статикой или функцией generateData)
const exampleStats = [
  { label: 'Продажи', value: '868 шт.', change: 12.5, icon: '📦' },
  { label: 'Выручка', value: '3 423 000 ₽', change: -3.2, icon: '💰' },
  { label: 'Заказы', value: '609', change: 8.1, icon: '🛒' },
  { label: 'Средний чек', value: '5 620 ₽', change: -1.4, icon: '📊' },
]

const exampleChart = [
  { label: 'Пн', value: 35 },
  { label: 'Вт', value: 52 },
  { label: 'Ср', value: 41 },
  { label: 'Чт', value: 67 },
  { label: 'Пт', value: 58 },
  { label: 'Сб', value: 44 },
  { label: 'Вс', value: 30 },
]

const exampleRows = [
  { id: '1', product: 'Keychron K2', category: 'Периферия', sales: 48, revenue: 431520, growth: 15.2 },
  { id: '2', product: 'MacBook Air M3', category: 'Ноутбуки', sales: 12, revenue: 1788000, growth: 8.7 },
  { id: '3', product: 'iPhone 15 Pro', category: 'Смартфоны', sales: 23, revenue: 2277000, growth: -2.1 },
]

export function Task0_3() {
  const { t } = useLanguage()

  // TODO: Добавьте state для фильтров
  // const [filters, setFilters] = useState({ period: 'week', category: 'Все' })

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 0.3</h2>
      <p style={{ color: '#888', fontStyle: 'italic' }}>
        Декомпозируйте Dashboard: FilterPanel, StatsCards, SalesChart, DataTable
      </p>

      {/* TODO: Отрендерите все 4 компонента */}
      {/* <FilterPanel filters={filters} onChange={setFilters} /> */}
      {/* <StatsCards stats={exampleStats} /> */}
      {/* <SalesChart data={exampleChart} /> */}
      {/* <DataTable rows={exampleRows} /> */}

      {/* Временная заглушка — замените */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px', color: '#999', textAlign: 'center' }}>
          FilterPanel: период + категория (2 select'а)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {exampleStats.map((s, i) => (
            <div key={i} style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
              {s.icon} {s.label}
            </div>
          ))}
        </div>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px', color: '#999', textAlign: 'center' }}>
          SalesChart: {exampleChart.length} столбцов
        </div>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px', color: '#999', textAlign: 'center' }}>
          DataTable: {exampleRows.length} строк, сортировка по клику на заголовок
        </div>
      </div>
    </div>
  )
}
