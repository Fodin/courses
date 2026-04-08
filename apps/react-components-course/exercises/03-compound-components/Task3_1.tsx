import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.1: Tabs с Compound Components
// ============================================
//
// Реализуйте компонент <Tabs> с декларативным API через React Context.
//
// Итоговый API должен выглядеть так:
//
//   <Tabs defaultTab="home">
//     <Tabs.List>
//       <Tabs.Tab id="home">Главная</Tabs.Tab>
//       <Tabs.Tab id="settings">Настройки</Tabs.Tab>
//     </Tabs.List>
//     <Tabs.Panel id="home">Контент главной</Tabs.Panel>
//     <Tabs.Panel id="settings">Контент настроек</Tabs.Panel>
//   </Tabs>

// --- Step 1: Опишите типы ---

// TODO: Создайте интерфейс TabsContextValue с полями:
//   activeTab: string
//   setActiveTab: (id: string) => void
interface TabsContextValue {
  // TODO: ваши поля здесь
}

// --- Step 2: Создайте контекст ---

// TODO: createContext<TabsContextValue | null>(null)
const TabsContext = createContext<TabsContextValue | null>(null)

// TODO: Реализуйте хук useTabsContext() — он должен:
//   1. Вызывать useContext(TabsContext)
//   2. Если ctx === null — бросать ошибку с понятным сообщением
//   3. Иначе — возвращать ctx
function useTabsContext(): TabsContextValue {
  // TODO: ваш код здесь
  throw new Error('Not implemented')
}

// --- Step 3: Корневой компонент ---

interface TabsRootProps {
  children: ReactNode
  defaultTab: string
}

// TODO: Реализуйте TabsRoot:
//   - Хранит activeTab в useState(defaultTab)
//   - Оборачивает children в TabsContext.Provider
//   - Мемоизируйте value через useMemo
function TabsRoot({ children, defaultTab }: TabsRootProps) {
  // TODO: ваш код здесь
  return <div>{children}</div>
}

// --- Step 4: Sub-компоненты ---

// TODO: Реализуйте TabsList — простая обёртка с role="tablist"
function TabsList({ children }: { children: ReactNode }) {
  // TODO: ваш код здесь
  return <div>{children}</div>
}

interface TabProps {
  id: string
  children: ReactNode
  disabled?: boolean
}

// TODO: Реализуйте Tab:
//   - Читает activeTab и setActiveTab из useTabsContext()
//   - isActive = activeTab === id
//   - При клике: setActiveTab(id)
//   - ARIA: role="tab", aria-selected={isActive}
function Tab({ id, children, disabled = false }: TabProps) {
  // TODO: ваш код здесь
  return <button>{children}</button>
}

interface PanelProps {
  id: string
  children: ReactNode
}

// TODO: Реализуйте Panel:
//   - Читает activeTab из useTabsContext()
//   - Если activeTab !== id — возвращает null
//   - Иначе рендерит children с role="tabpanel"
function Panel({ id, children }: PanelProps) {
  // TODO: ваш код здесь
  return <div>{children}</div>
}

// --- Step 5: Соберите Tabs через Object.assign ---

// TODO: Установите displayName для каждого компонента:
//   TabsRoot.displayName = 'Tabs'
//   Tab.displayName = 'Tabs.Tab'
//   и т.д.

// TODO: Соберите итоговый объект:
//   const Tabs = Object.assign(TabsRoot, { List: TabsList, Tab, Panel })
const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab,
  Panel,
})

// ============================================
// Демонстрация — не изменяйте эту функцию,
// просто реализуйте компоненты выше
// ============================================

export function Task3_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 3.1 — Tabs</h2>
      <p style={{ color: '#64748b', marginBottom: 16 }}>
        Реализуйте компоненты выше, чтобы это заработало:
      </p>

      <Tabs defaultTab="overview">
        <Tabs.List>
          <Tabs.Tab id="overview">Обзор</Tabs.Tab>
          <Tabs.Tab id="features">Возможности</Tabs.Tab>
          <Tabs.Tab id="settings">Настройки</Tabs.Tab>
          <Tabs.Tab id="disabled" disabled>Заблокировано</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel id="overview">
          <p>Содержимое вкладки "Обзор"</p>
        </Tabs.Panel>
        <Tabs.Panel id="features">
          <p>Содержимое вкладки "Возможности"</p>
        </Tabs.Panel>
        <Tabs.Panel id="settings">
          <p>Содержимое вкладки "Настройки"</p>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}
