import { useState, useCallback } from 'react'

// =====================================================
// Task 11.1: Testing Pyramid Visualizer
// =====================================================

type LayerId = 'unit' | 'contract' | 'integration' | 'e2e' | 'visual'

type PyramidLayer = {
  id: LayerId
  label: string
  color: string
  bgColor: string
  width: number
  speed: string
  speedMs: number
  reliability: number
  cost: 'низкая' | 'средняя' | 'высокая'
  description: string
  example: string
  pipelineMin: number
}

type MfeCoverage = {
  id: string
  label: string
  color: string
  coverage: Record<LayerId, number>
}

const PYRAMID_LAYERS: PyramidLayer[] = [
  {
    id: 'unit',
    label: 'Unit',
    color: '#fff',
    bgColor: '#388e3c',
    width: 100,
    speed: '< 1 мин',
    speedMs: 30,
    reliability: 95,
    cost: 'низкая',
    description:
      'Тестирование отдельных компонентов, хуков и утилит внутри одного MFE без каких-либо зависимостей от других MFE или shell. MFE запускается изолированно — Module Federation заглушается через mock. Покрывает бизнес-логику, рендер, пропсы.',
    example: `// Jest + React Testing Library
// Catalog MFE — изолированный unit-тест
import { render, screen } from '@testing-library/react'
import { ProductCard } from './ProductCard'

jest.mock('shell/EventBus', () => ({
  emit: jest.fn(),
  on: jest.fn(),
}))

test('отображает название и цену товара', () => {
  render(<ProductCard name="iPhone 15" price={89990} />)
  expect(screen.getByText('iPhone 15')).toBeInTheDocument()
  expect(screen.getByText('89 990 ₽')).toBeInTheDocument()
})`,
    pipelineMin: 3,
  },
  {
    id: 'contract',
    label: 'Contract',
    color: '#fff',
    bgColor: '#1976d2',
    width: 80,
    speed: '2–5 мин',
    speedMs: 180,
    reliability: 88,
    cost: 'средняя',
    description:
      'Consumer-driven contract testing (Pact): проверяет, что контракт между MFE (producer) и потребителем (consumer) не нарушен. Catalog публикует контракт — Shell верифицирует его. Не требует запуска обоих MFE одновременно. Обнаруживает breaking changes до деплоя.',
    example: `// Pact — consumer side (Shell)
import { PactV3 } from '@pact-foundation/pact'

const provider = new PactV3({
  consumer: 'Shell',
  provider: 'CatalogMFE',
})

describe('Shell → Catalog contract', () => {
  it('получает список товаров', async () => {
    await provider
      .given('товары доступны')
      .uponReceiving('запрос каталога')
      .withRequest({ method: 'GET', path: '/api/products' })
      .willRespondWith({
        status: 200,
        body: eachLike({ id: string(), name: string() }),
      })
      .executeTest(async (mockServer) => {
        const products = await fetchProducts(mockServer.url)
        expect(products).toHaveLength(1)
      })
  })
})`,
    pipelineMin: 5,
  },
  {
    id: 'integration',
    label: 'Integration',
    color: '#fff',
    bgColor: '#7b1fa2',
    width: 60,
    speed: '5–15 мин',
    speedMs: 600,
    reliability: 80,
    cost: 'средняя',
    description:
      'Тестирование взаимодействия нескольких MFE в сборе: shell монтирует remotes, проверяются события EventBus, shared state, навигация между MFE. Используется mock-server для API. Запускается в JSDOM или легковесном браузере без E2E инфраструктуры.',
    example: `// Integration: Shell + Catalog + Cart вместе
import { createApp } from '../test-utils/app-factory'

describe('Добавление в корзину', () => {
  it('Cart обновляет счётчик после события catalog:add', async () => {
    const { shell, catalog, cart } = await createApp({
      mfes: ['shell', 'catalog', 'cart'],
      mockApi: true,
    })

    // Catalog эмитирует событие
    catalog.eventBus.emit('catalog:addToCart', {
      productId: '42',
      quantity: 1,
    })

    // Cart реагирует через EventBus
    await waitFor(() => {
      expect(cart.getCartCount()).toBe(1)
    })
  })
})`,
    pipelineMin: 12,
  },
  {
    id: 'e2e',
    label: 'E2E',
    color: '#fff',
    bgColor: '#e65100',
    width: 40,
    speed: '15–40 мин',
    speedMs: 1800,
    reliability: 70,
    cost: 'высокая',
    description:
      'End-to-end тестирование полностью собранного приложения в реальном браузере. Playwright/Cypress запускают сценарии пользователя сквозь все MFE. Медленно, но проверяет реальный UX. Запускается в CI перед релизом или ночью. Фокус — критические user journeys.',
    example: `// Playwright — E2E через все MFE
import { test, expect } from '@playwright/test'

test('полный checkout flow', async ({ page }) => {
  await page.goto('https://staging.myapp.com')

  // Shell загружает Catalog MFE
  await expect(page.locator('[data-mfe="catalog"]')).toBeVisible()

  // Добавить товар (Catalog MFE)
  await page.click('[data-testid="product-42"] [data-testid="add-to-cart"]')

  // Счётчик в Shell обновился
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1')

  // Перейти в корзину (Cart MFE)
  await page.click('[data-testid="cart-icon"]')
  await expect(page.locator('[data-mfe="cart"]')).toBeVisible()

  // Оформить заказ
  await page.click('[data-testid="checkout-btn"]')
  await expect(page).toHaveURL(/\/checkout/)
})`,
    pipelineMin: 25,
  },
  {
    id: 'visual',
    label: 'Visual',
    color: '#fff',
    bgColor: '#5d4037',
    width: 25,
    speed: '10–20 мин',
    speedMs: 900,
    reliability: 85,
    cost: 'высокая',
    description:
      'Скриншот-тесты для контроля визуальной консистентности между MFE. Playwright делает снимки каждого MFE и сравнивает с baseline. Обнаруживает случайные изменения CSS, шрифтов, отступов. Особенно важно при обновлении дизайн-системы — гарантирует единый look & feel.',
    example: `// Playwright Visual Regression
import { test, expect } from '@playwright/test'

test('Catalog MFE — визуальный снимок', async ({ page }) => {
  await page.goto('/catalog')
  await page.waitForLoadState('networkidle')

  // Скриншот всего MFE
  await expect(page.locator('[data-mfe="catalog"]'))
    .toHaveScreenshot('catalog-default.png', {
      maxDiffPixelRatio: 0.02, // 2% допуск
    })
})

test('Cart MFE — пустая корзина', async ({ page }) => {
  await page.goto('/cart')
  await expect(page.locator('[data-mfe="cart"]'))
    .toHaveScreenshot('cart-empty.png')
})`,
    pipelineMin: 15,
  },
]

const MFE_COVERAGE: MfeCoverage[] = [
  {
    id: 'shell',
    label: 'Shell',
    color: '#5c6bc0',
    coverage: { unit: 72, contract: 60, integration: 85, e2e: 90, visual: 50 },
  },
  {
    id: 'catalog',
    label: 'Catalog',
    color: '#26a69a',
    coverage: { unit: 88, contract: 75, integration: 70, e2e: 85, visual: 65 },
  },
  {
    id: 'cart',
    label: 'Cart',
    color: '#ef5350',
    coverage: { unit: 91, contract: 80, integration: 78, e2e: 90, visual: 40 },
  },
  {
    id: 'profile',
    label: 'Profile',
    color: '#ffa726',
    coverage: { unit: 65, contract: 45, integration: 30, e2e: 60, visual: 20 },
  },
]

export function Task11_1_Solution() {
  const [selectedLayer, setSelectedLayer] = useState<LayerId | null>('unit')
  const [enabledLayers, setEnabledLayers] = useState<Record<LayerId, boolean>>({
    unit: true,
    contract: true,
    integration: true,
    e2e: true,
    visual: false,
  })

  const toggleLayer = useCallback((id: LayerId) => {
    setEnabledLayers((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const selected = PYRAMID_LAYERS.find((l) => l.id === selectedLayer)

  const totalPipelineMin = PYRAMID_LAYERS.filter((l) => enabledLayers[l.id]).reduce(
    (sum, l) => sum + l.pipelineMin,
    0,
  )

  const confidenceScore = Math.round(
    PYRAMID_LAYERS.filter((l) => enabledLayers[l.id]).reduce(
      (sum, l) => sum + l.reliability * 0.2,
      0,
    ),
  )

  const containerStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    fontSize: 14,
    background: '#0f172a',
    color: '#e2e8f0',
    minHeight: '100vh',
    padding: 24,
    boxSizing: 'border-box',
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#f8fafc' }}>
        Пирамида тестирования MFE
      </h2>
      <p style={{ margin: '0 0 24px', color: '#94a3b8', fontSize: 13 }}>
        Кликните на слой пирамиды, чтобы увидеть детали. Включайте/выключайте уровни для расчёта pipeline.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left: pyramid + toggles */}
        <div>
          {/* Pyramid */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              marginBottom: 20,
            }}
          >
            {[...PYRAMID_LAYERS].reverse().map((layer) => (
              <div
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                style={{
                  width: `${layer.width}%`,
                  padding: '10px 0',
                  background: enabledLayers[layer.id] ? layer.bgColor : '#334155',
                  color: layer.color,
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 13,
                  border:
                    selectedLayer === layer.id
                      ? '2px solid #f8fafc'
                      : '2px solid transparent',
                  transition: 'all 0.2s',
                  opacity: enabledLayers[layer.id] ? 1 : 0.45,
                  userSelect: 'none',
                }}
              >
                {layer.label}
              </div>
            ))}
            <div
              style={{
                fontSize: 11,
                color: '#64748b',
                marginTop: 4,
                textAlign: 'center',
              }}
            >
              ▲ дороже, медленнее, надёжнее для UX
            </div>
          </div>

          {/* Toggle controls */}
          <div
            style={{
              background: '#1e293b',
              borderRadius: 10,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 12, color: '#cbd5e1' }}>
              Активные уровни в pipeline
            </div>
            {PYRAMID_LAYERS.map((layer) => (
              <div
                key={layer.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <button
                  onClick={() => toggleLayer(layer.id)}
                  style={{
                    width: 36,
                    height: 20,
                    borderRadius: 10,
                    border: 'none',
                    cursor: 'pointer',
                    background: enabledLayers[layer.id] ? layer.bgColor : '#334155',
                    transition: 'background 0.2s',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 3,
                      left: enabledLayers[layer.id] ? 18 : 3,
                      width: 14,
                      height: 14,
                      background: '#fff',
                      borderRadius: '50%',
                      transition: 'left 0.2s',
                      display: 'block',
                    }}
                  />
                </button>
                <span style={{ color: enabledLayers[layer.id] ? '#f1f5f9' : '#64748b', fontSize: 13 }}>
                  {layer.label}
                </span>
                <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: 12 }}>
                  {layer.speed}
                </span>
              </div>
            ))}
          </div>

          {/* Pipeline stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 10,
            }}
          >
            {[
              { label: 'Время CI', value: `~${totalPipelineMin} мин`, color: '#38bdf8' },
              { label: 'Confidence', value: `${confidenceScore}%`, color: '#4ade80' },
              {
                label: 'Стоимость',
                value:
                  enabledLayers.e2e || enabledLayers.visual
                    ? 'высокая'
                    : enabledLayers.integration
                      ? 'средняя'
                      : 'низкая',
                color: '#fb923c',
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: '#1e293b',
                  borderRadius: 8,
                  padding: '12px 8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: selected layer details + coverage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Selected layer details */}
          {selected ? (
            <div
              style={{
                background: '#1e293b',
                borderRadius: 10,
                padding: 16,
                borderLeft: `4px solid ${selected.bgColor}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    background: selected.bgColor,
                    color: '#fff',
                    borderRadius: 6,
                    padding: '3px 10px',
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {selected.label}
                </span>
                <span style={{ color: '#64748b', fontSize: 12 }}>
                  скорость: {selected.speed} · надёжность: {selected.reliability}% ·
                  стоимость: {selected.cost}
                </span>
              </div>
              <p style={{ margin: '0 0 12px', color: '#cbd5e1', lineHeight: 1.6, fontSize: 13 }}>
                {selected.description}
              </p>
              <div style={{ fontWeight: 600, marginBottom: 6, color: '#94a3b8', fontSize: 12 }}>
                ПРИМЕР
              </div>
              <pre
                style={{
                  background: '#0f172a',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 11,
                  lineHeight: 1.6,
                  color: '#a5f3fc',
                  overflowX: 'auto',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selected.example}
              </pre>
            </div>
          ) : (
            <div
              style={{
                background: '#1e293b',
                borderRadius: 10,
                padding: 24,
                textAlign: 'center',
                color: '#475569',
              }}
            >
              Кликните на слой пирамиды
            </div>
          )}

          {/* Coverage map */}
          <div style={{ background: '#1e293b', borderRadius: 10, padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, color: '#cbd5e1' }}>
              Coverage map по MFE
            </div>
            {MFE_COVERAGE.map((mfe) => (
              <div key={mfe.id} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: mfe.color,
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 13 }}>{mfe.label}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {PYRAMID_LAYERS.map((layer) => {
                    const pct = mfe.coverage[layer.id]
                    const isEnabled = enabledLayers[layer.id]
                    return (
                      <div
                        key={layer.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        <span
                          style={{
                            width: 70,
                            fontSize: 11,
                            color: isEnabled ? '#94a3b8' : '#334155',
                            flexShrink: 0,
                          }}
                        >
                          {layer.label}
                        </span>
                        <div
                          style={{
                            flex: 1,
                            height: 8,
                            background: '#0f172a',
                            borderRadius: 4,
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${isEnabled ? pct : 0}%`,
                              height: '100%',
                              background: isEnabled ? layer.bgColor : '#1e293b',
                              borderRadius: 4,
                              transition: 'width 0.4s ease',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 11, color: isEnabled ? '#64748b' : '#334155', width: 30, textAlign: 'right' }}>
                          {isEnabled ? `${pct}%` : '—'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// =====================================================
// Task 11.2: Test Plan Constructor
// =====================================================

type TestLevel = 'unit' | 'contract' | 'integration' | 'e2e' | 'visual'
type MockStrategy = 'real' | 'mock' | 'hybrid'
type CiTrigger = 'pr' | 'nightly' | 'pre-release' | 'manual'

type MfeEntry = {
  id: string
  name: string
  levels: Record<TestLevel, boolean>
}

type ValidationError = {
  mfeId?: string
  message: string
  type: 'error' | 'warning'
}

const LEVEL_LABELS: Record<TestLevel, string> = {
  unit: 'Unit',
  contract: 'Contract',
  integration: 'Integration',
  e2e: 'E2E',
  visual: 'Visual',
}

const LEVEL_COLORS: Record<TestLevel, string> = {
  unit: '#388e3c',
  contract: '#1976d2',
  integration: '#7b1fa2',
  e2e: '#e65100',
  visual: '#5d4037',
}

const LEVEL_TIMES: Record<TestLevel, number> = {
  unit: 3,
  contract: 5,
  integration: 12,
  e2e: 25,
  visual: 15,
}

const MOCK_STRATEGY_LABELS: Record<MockStrategy, string> = {
  real: 'Real remotes (реальные MFE)',
  mock: 'Mock remotes (заглушки)',
  hybrid: 'Hybrid (prod + заглушки)',
}

const CI_TRIGGER_LABELS: Record<CiTrigger, string> = {
  pr: 'Every PR',
  nightly: 'Nightly build',
  'pre-release': 'Pre-release only',
  manual: 'Manual trigger',
}

const ALL_LEVELS: TestLevel[] = ['unit', 'contract', 'integration', 'e2e', 'visual']

let mfeCounter = 5

function makeMfeId() {
  return `mfe_${++mfeCounter}`
}

const DEFAULT_MFES: MfeEntry[] = [
  {
    id: 'mfe_1',
    name: 'Shell',
    levels: { unit: true, contract: true, integration: true, e2e: true, visual: false },
  },
  {
    id: 'mfe_2',
    name: 'Catalog',
    levels: { unit: true, contract: true, integration: false, e2e: false, visual: false },
  },
  {
    id: 'mfe_3',
    name: 'Cart',
    levels: { unit: true, contract: false, integration: false, e2e: false, visual: false },
  },
]

type GeneratedMatrix = {
  pipeline: Array<{
    stage: string
    mfes: string[]
    estimatedMin: number
    trigger: string
  }>
  matrix: Record<string, Record<string, boolean>>
  totalMin: number
  recommendations: string[]
}

export function Task11_2_Solution() {
  const [mfes, setMfes] = useState<MfeEntry[]>(DEFAULT_MFES)
  const [newMfeName, setNewMfeName] = useState('')
  const [mockStrategy, setMockStrategy] = useState<MockStrategy>('mock')
  const [ciTrigger, setCiTrigger] = useState<CiTrigger>('pr')
  const [generated, setGenerated] = useState<GeneratedMatrix | null>(null)
  const [errors, setErrors] = useState<ValidationError[]>([])

  const addMfe = () => {
    const name = newMfeName.trim()
    if (!name) return
    setMfes((prev) => [
      ...prev,
      {
        id: makeMfeId(),
        name,
        levels: { unit: true, contract: false, integration: false, e2e: false, visual: false },
      },
    ])
    setNewMfeName('')
  }

  const removeMfe = (id: string) => {
    setMfes((prev) => prev.filter((m) => m.id !== id))
    setGenerated(null)
  }

  const toggleLevel = (mfeId: string, level: TestLevel) => {
    setMfes((prev) =>
      prev.map((m) =>
        m.id === mfeId
          ? { ...m, levels: { ...m.levels, [level]: !m.levels[level] } }
          : m,
      ),
    )
    setGenerated(null)
  }

  const validate = (): ValidationError[] => {
    const errs: ValidationError[] = []
    mfes.forEach((m) => {
      if (!m.levels.unit) {
        errs.push({ mfeId: m.id, message: `${m.name}: обязателен Unit тест`, type: 'error' })
      }
    })
    if (mfes.length >= 2) {
      const hasContract = mfes.some((m) => m.levels.contract)
      if (!hasContract) {
        errs.push({
          message: 'При 2+ MFE необходим Contract testing хотя бы для одного',
          type: 'warning',
        })
      }
    }
    const hasE2E = mfes.some((m) => m.levels.e2e)
    if (!hasE2E) {
      errs.push({
        message: 'Рекомендуется E2E хотя бы для одного MFE',
        type: 'warning',
      })
    }
    return errs
  }

  const generate = () => {
    const validationErrors = validate()
    setErrors(validationErrors)
    if (validationErrors.some((e) => e.type === 'error')) return

    // Build matrix
    const matrix: Record<string, Record<string, boolean>> = {}
    mfes.forEach((m) => {
      matrix[m.name.toLowerCase()] = Object.fromEntries(
        ALL_LEVELS.map((l) => [l, m.levels[l]]),
      )
    })

    // Build pipeline stages
    const pipeline: GeneratedMatrix['pipeline'] = []
    ALL_LEVELS.forEach((level) => {
      const mfesForLevel = mfes.filter((m) => m.levels[level]).map((m) => m.name)
      if (mfesForLevel.length === 0) return
      pipeline.push({
        stage: level,
        mfes: mfesForLevel,
        estimatedMin: LEVEL_TIMES[level],
        trigger: ciTrigger,
      })
    })

    const totalMin = pipeline.reduce((sum, s) => sum + s.estimatedMin, 0)

    // Recommendations
    const recommendations: string[] = []
    if (totalMin > 40) {
      recommendations.push('CI > 40 мин: запускайте E2E/Visual только на pre-release')
    }
    if (mockStrategy === 'real' && mfes.length > 3) {
      recommendations.push('Много MFE с real remotes — рассмотрите hybrid mock-стратегию')
    }
    if (!mfes.some((m) => m.levels.visual)) {
      recommendations.push('Рекомендуем добавить Visual regression для Shell MFE')
    }
    if (mfes.some((m) => !m.levels.contract) && mfes.length >= 2) {
      recommendations.push('Не все MFE покрыты Contract testing — риск breaking changes')
    }

    setGenerated({ pipeline, matrix, totalMin, recommendations })
  }

  const containerStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    fontSize: 14,
    background: '#0f172a',
    color: '#e2e8f0',
    minHeight: '100vh',
    padding: 24,
    boxSizing: 'border-box',
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#f8fafc' }}>
        Конструктор тест-плана MFE
      </h2>
      <p style={{ margin: '0 0 24px', color: '#94a3b8', fontSize: 13 }}>
        Настройте уровни тестирования для каждого MFE и сгенерируйте test matrix.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left: MFE list + config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* MFE list */}
          <div style={{ background: '#1e293b', borderRadius: 10, padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, color: '#cbd5e1' }}>
              MFE в системе ({mfes.length})
            </div>

            {/* Header row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '110px repeat(5, 1fr) 24px',
                gap: 4,
                marginBottom: 8,
                paddingBottom: 6,
                borderBottom: '1px solid #334155',
              }}
            >
              <span style={{ color: '#64748b', fontSize: 11 }}>MFE</span>
              {ALL_LEVELS.map((l) => (
                <span
                  key={l}
                  style={{
                    color: LEVEL_COLORS[l],
                    fontSize: 11,
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  {LEVEL_LABELS[l]}
                </span>
              ))}
              <span />
            </div>

            {mfes.map((mfe) => (
              <div
                key={mfe.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '110px repeat(5, 1fr) 24px',
                  gap: 4,
                  alignItems: 'center',
                  marginBottom: 6,
                  padding: '4px 0',
                  borderRadius: 6,
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: '#f1f5f9',
                    fontSize: 13,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {mfe.name}
                </span>
                {ALL_LEVELS.map((level) => (
                  <div key={level} style={{ display: 'flex', justifyContent: 'center' }}>
                    <input
                      type="checkbox"
                      checked={mfe.levels[level]}
                      onChange={() => toggleLevel(mfe.id, level)}
                      style={{
                        width: 16,
                        height: 16,
                        cursor: 'pointer',
                        accentColor: LEVEL_COLORS[level],
                      }}
                    />
                  </div>
                ))}
                <button
                  onClick={() => removeMfe(mfe.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: 16,
                    padding: 0,
                    lineHeight: 1,
                  }}
                  title="Удалить"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Add MFE */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <input
                value={newMfeName}
                onChange={(e) => setNewMfeName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMfe()}
                placeholder="Название MFE..."
                style={{
                  flex: 1,
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 6,
                  color: '#f1f5f9',
                  padding: '6px 10px',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              <button
                onClick={addMfe}
                style={{
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: 6,
                  color: '#fff',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                + Добавить
              </button>
            </div>
          </div>

          {/* Mock strategy + CI trigger */}
          <div style={{ background: '#1e293b', borderRadius: 10, padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, color: '#cbd5e1' }}>
              Конфигурация
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
                  Mock-стратегия
                </label>
                <select
                  value={mockStrategy}
                  onChange={(e) => setMockStrategy(e.target.value as MockStrategy)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: 6,
                    color: '#f1f5f9',
                    padding: '6px 10px',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {(Object.keys(MOCK_STRATEGY_LABELS) as MockStrategy[]).map((k) => (
                    <option key={k} value={k}>
                      {MOCK_STRATEGY_LABELS[k]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
                  CI trigger
                </label>
                <select
                  value={ciTrigger}
                  onChange={(e) => setCiTrigger(e.target.value as CiTrigger)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: 6,
                    color: '#f1f5f9',
                    padding: '6px 10px',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {(Object.keys(CI_TRIGGER_LABELS) as CiTrigger[]).map((k) => (
                    <option key={k} value={k}>
                      {CI_TRIGGER_LABELS[k]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Validation errors */}
          {errors.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {errors.map((err, i) => (
                <div
                  key={i}
                  style={{
                    background: err.type === 'error' ? '#450a0a' : '#431407',
                    border: `1px solid ${err.type === 'error' ? '#ef4444' : '#f97316'}`,
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: 13,
                    color: err.type === 'error' ? '#fca5a5' : '#fdba74',
                  }}
                >
                  {err.type === 'error' ? '✖ ' : '⚠ '}
                  {err.message}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={generate}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              padding: '12px 0',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 0.5,
            }}
          >
            Сгенерировать test matrix
          </button>
        </div>

        {/* Right: generated output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {generated ? (
            <>
              {/* Pipeline stages */}
              <div style={{ background: '#1e293b', borderRadius: 10, padding: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 12, color: '#cbd5e1' }}>
                  Pipeline (~{generated.totalMin} мин)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {generated.pipeline.map((stage, idx) => (
                    <div key={stage.stage} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          background: LEVEL_COLORS[stage.stage as TestLevel],
                          color: '#fff',
                          borderRadius: 6,
                          padding: '3px 10px',
                          fontWeight: 700,
                          fontSize: 12,
                          minWidth: 80,
                          textAlign: 'center',
                        }}
                      >
                        {LEVEL_LABELS[stage.stage as TestLevel]}
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: 12 }}>
                        {stage.mfes.join(', ')}
                      </span>
                      <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: 11 }}>
                        ~{stage.estimatedMin} мин
                      </span>
                      {idx < generated.pipeline.length - 1 && (
                        <span style={{ color: '#334155', fontSize: 16 }}>→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {generated.recommendations.length > 0 && (
                <div style={{ background: '#1e293b', borderRadius: 10, padding: 16 }}>
                  <div style={{ fontWeight: 600, marginBottom: 10, color: '#cbd5e1' }}>
                    Рекомендации
                  </div>
                  {generated.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: 8,
                        marginBottom: 6,
                        fontSize: 13,
                        color: '#fbbf24',
                      }}
                    >
                      <span>💡</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* JSON output */}
              <div style={{ background: '#1e293b', borderRadius: 10, padding: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 10, color: '#cbd5e1' }}>
                  Test Matrix JSON
                </div>
                <pre
                  style={{
                    background: '#0f172a',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 11,
                    lineHeight: 1.7,
                    color: '#a5f3fc',
                    overflowX: 'auto',
                    margin: 0,
                    maxHeight: 320,
                    overflowY: 'auto',
                  }}
                >
                  {JSON.stringify(
                    {
                      mockStrategy,
                      ciTrigger,
                      pipeline: generated.pipeline,
                      matrix: generated.matrix,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </>
          ) : (
            <div
              style={{
                background: '#1e293b',
                borderRadius: 10,
                padding: 40,
                textAlign: 'center',
                color: '#475569',
                fontSize: 15,
              }}
            >
              Настройте тест-план и нажмите
              <br />
              «Сгенерировать test matrix»
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
