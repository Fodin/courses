import { useState } from 'react'

// ============================================
// Shared: Card component (used in 1.1 and 1.2)
// ============================================

interface CardProps {
  header?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}

function Card({ header, children, footer }: CardProps) {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      overflow: 'hidden',
      background: '#fff',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    }}>
      {header && (
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e0e0e0',
          background: '#fafafa',
        }}>
          {header}
        </div>
      )}
      <div style={{ padding: 16 }}>
        {children}
      </div>
      {footer && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #e0e0e0',
          background: '#fafafa',
          display: 'flex',
          gap: 8,
          justifyContent: 'flex-end',
        }}>
          {footer}
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 1.1 Solution — Card с children и слотами
// ============================================

function ProfileCard() {
  return (
    <Card
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
          }}>
            АИ
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Алексей Иванов</div>
            <div style={{ color: '#888', fontSize: 12 }}>Frontend Developer</div>
          </div>
        </div>
      }
      footer={
        <button style={{
          background: '#667eea',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '8px 20px',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 500,
        }}>
          Подписаться
        </button>
      }
    >
      <p style={{ margin: 0, color: '#444', lineHeight: 1.5 }}>
        Разрабатываю интерфейсы уже 5 лет. Люблю React, TypeScript и чистую архитектуру.
        В свободное время пишу статьи о паттернах проектирования.
      </p>
    </Card>
  )
}

function NotificationCard() {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: '#fff3cd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}>
          🔔
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Новый комментарий</div>
          <div style={{ color: '#666', fontSize: 13, lineHeight: 1.5 }}>
            Пользователь <strong>maria_dev</strong> оставил комментарий к вашей статье
            "Паттерны React: от простого к сложному"
          </div>
          <div style={{ color: '#aaa', fontSize: 11, marginTop: 6 }}>2 минуты назад</div>
        </div>
      </div>
    </Card>
  )
}

function ProductCard() {
  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>React: Продвинутые паттерны</span>
          <span style={{
            background: '#e8f5e9',
            color: '#2e7d32',
            borderRadius: 4,
            padding: '2px 8px',
            fontSize: 11,
            fontWeight: 500,
          }}>
            Хит
          </span>
        </div>
      }
      footer={
        <>
          <button style={{
            background: '#fff',
            color: '#667eea',
            border: '1px solid #667eea',
            borderRadius: 6,
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: 13,
          }}>
            В корзину
          </button>
          <button style={{
            background: '#667eea',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
          }}>
            Купить сейчас
          </button>
        </>
      }
    >
      <p style={{ margin: '0 0 12px', color: '#444', fontSize: 13, lineHeight: 1.5 }}>
        Видеокурс о продвинутых паттернах в React: Compound Components, Render Props,
        Context API, кастомные хуки и оптимизация производительности.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 20, color: '#1a1a1a' }}>2 490 ₽</span>
        <span style={{ color: '#aaa', textDecoration: 'line-through', fontSize: 14 }}>4 990 ₽</span>
        <span style={{ color: '#e53935', fontSize: 12, fontWeight: 500 }}>-50%</span>
      </div>
    </Card>
  )
}

export function Task1_1_Solution() {
  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100%' }}>
      <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 20 }}>
        Задание 1.1 — Card с children и слотами
      </h2>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 13 }}>
        Один компонент Card — три разных варианта использования через слоты
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        alignItems: 'start',
      }}>
        <ProfileCard />
        <NotificationCard />
        <ProductCard />
      </div>
    </div>
  )
}

// ============================================
// Task 1.2 Solution — PageLayout со слотами
// ============================================

interface PageLayoutProps {
  header: React.ReactNode
  sidebar?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}

function PageLayout({ header, sidebar, children, footer }: PageLayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{
        background: '#1a1a2e',
        color: '#fff',
        padding: '0 24px',
        flexShrink: 0,
      }}>
        {header}
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {sidebar && (
          <aside style={{
            width: 220,
            background: '#16213e',
            color: '#cbd5e1',
            padding: '16px 0',
            flexShrink: 0,
          }}>
            {sidebar}
          </aside>
        )}
        <main style={{ flex: 1, padding: 24, background: '#f0f2f5', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      {footer && (
        <footer style={{
          background: '#1a1a2e',
          color: '#94a3b8',
          padding: '12px 24px',
          textAlign: 'center',
          fontSize: 12,
          flexShrink: 0,
        }}>
          {footer}
        </footer>
      )}
    </div>
  )
}

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  const isPositive = change.startsWith('+')
  return (
    <div style={{
      background: '#fff',
      borderRadius: 8,
      padding: 20,
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    }}>
      <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: isPositive ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
        {change} за месяц
      </div>
    </div>
  )
}

function DashboardPage() {
  const navItems = ['Главная', 'Аналитика', 'Пользователи', 'Отчёты', 'Настройки']
  const [activeNav, setActiveNav] = useState('Главная')

  return (
    <PageLayout
      header={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28,
              height: 28,
              background: '#667eea',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}>
              ⚡
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: 0.5 }}>AdminDash</span>
          </div>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#667eea',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
          }}>
            АД
          </div>
        </div>
      }
      sidebar={
        <nav>
          {navItems.map(item => (
            <div
              key={item}
              onClick={() => setActiveNav(item)}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: 13,
                color: activeNav === item ? '#fff' : '#94a3b8',
                background: activeNav === item ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                borderLeft: activeNav === item ? '3px solid #667eea' : '3px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {item}
            </div>
          ))}
        </nav>
      }
      footer={<>© 2024 AdminDash. Все права защищены.</>}
    >
      <h1 style={{ margin: '0 0 4px', fontSize: 22, color: '#1a1a2e' }}>Главная панель</h1>
      <p style={{ margin: '0 0 24px', color: '#888', fontSize: 13 }}>Сводная статистика за текущий период</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        marginBottom: 24,
      }}>
        <StatCard label="Всего пользователей" value="12 483" change="+8.2%" />
        <StatCard label="Выручка" value="₽ 847K" change="+14.5%" />
        <StatCard label="Конверсия" value="3.24%" change="-0.3%" />
      </div>

      <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, color: '#1a1a2e' }}>Последние события</h3>
        {['Новая регистрация: user@example.com', 'Оплата заказа #8821 на ₽12 490', 'Обновлён тариф для компании "Альфа"'].map((event, i) => (
          <div key={i} style={{
            padding: '10px 0',
            borderTop: i === 0 ? 'none' : '1px solid #f0f0f0',
            fontSize: 13,
            color: '#444',
          }}>
            {event}
          </div>
        ))}
      </div>
    </PageLayout>
  )
}

export function Task1_2_Solution() {
  return <DashboardPage />
}

// ============================================
// Task 1.3 Solution — Accordion через композицию
// ============================================

interface AccordionProps {
  children: React.ReactNode
}

function Accordion({ children }: AccordionProps) {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      {children}
    </div>
  )
}

interface AccordionItemProps {
  title: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div style={{ borderBottom: '1px solid #e0e0e0' }}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          background: isOpen ? '#f8f9ff' : '#fff',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: 14,
          fontWeight: 500,
          color: '#1a1a2e',
          transition: 'background 0.15s',
        }}
      >
        <span>{title}</span>
        <span style={{
          color: '#667eea',
          fontSize: 12,
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s',
          display: 'inline-block',
        }}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div style={{
          padding: '0 16px 16px',
          color: '#555',
          fontSize: 13,
          lineHeight: 1.6,
          background: '#fafbff',
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

export function Task1_3_Solution() {
  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100%' }}>
      <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 20 }}>
        Задание 1.3 — Accordion через композицию
      </h2>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 13 }}>
        Каждый AccordionItem управляет своим состоянием независимо
      </p>

      <div style={{ maxWidth: 640 }}>
        <h3 style={{ fontSize: 15, marginBottom: 12, color: '#1a1a2e' }}>
          Часто задаваемые вопросы
        </h3>
        <Accordion>
          <AccordionItem
            defaultOpen={true}
            title="Что такое композиция в React?"
          >
            Композиция — это подход к построению UI, при котором сложные компоненты
            собираются из простых, как конструктор. В отличие от наследования,
            композиция передаёт контроль над содержимым пользователю компонента
            через пропы <code>children</code> и слоты.
          </AccordionItem>

          <AccordionItem
            title={
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Зачем использовать слоты вместо строковых пропов?
                <span style={{
                  background: '#667eea',
                  color: '#fff',
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 10,
                  fontWeight: 400,
                }}>
                  Важно
                </span>
              </span>
            }
          >
            Слоты принимают <code>React.ReactNode</code> — это означает, что вместо
            простой строки вы можете передать любой JSX: компонент с иконкой,
            форматированный текст, интерактивный элемент. Строковые пропы это
            не позволяют.
          </AccordionItem>

          <AccordionItem title="Чем Accordion через композицию лучше конфигурационного?">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Каждый элемент независим — открытие одного не влияет на другие</li>
              <li>title принимает любой JSX, не только строку</li>
              <li>children может быть любым контентом: формы, списки, вложенные компоненты</li>
              <li>Не нужно добавлять новые поля в конфиг при расширении</li>
            </ul>
          </AccordionItem>

          <AccordionItem title="Когда children не достаточно и нужны слоты?">
            Когда у компонента есть несколько независимых зон для контента.
            Например, карточка с шапкой, телом и подвалом — три разные области,
            которые не стоит смешивать в одном <code>children</code>. В этом случае
            используются именованные пропы: <code>header</code>, <code>footer</code>, <code>sidebar</code>.
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
