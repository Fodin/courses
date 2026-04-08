import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.1: Tabs с Compound Components
// Task 3.1: Tabs with Compound Components
// ============================================
//
// Реализуйте компонент <Tabs> с декларативным API через React Context.
// Implement the <Tabs> component with a declarative API via React Context.
//
// Итоговый API должен выглядеть так:
// The final API should look like this:
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
// --- Step 1: Describe the types ---

// TODO: Создайте интерфейс TabsContextValue с полями:
// TODO: Create the TabsContextValue interface with fields:
//   activeTab: string
//   setActiveTab: (id: string) => void
interface TabsContextValue {
  // TODO: ваши поля здесь
  // TODO: your fields here
}

// --- Step 2: Создайте контекст ---
// --- Step 2: Create the context ---

// TODO: createContext<TabsContextValue | null>(null)
const TabsContext = createContext<TabsContextValue | null>(null)

// TODO: Реализуйте хук useTabsContext() — он должен:
// TODO: Implement the useTabsContext() hook — it should:
//   1. Вызывать useContext(TabsContext)
//   1. Call useContext(TabsContext)
//   2. Если ctx === null — бросать ошибку с понятным сообщением
//   2. If ctx === null — throw an error with a clear message
//   3. Иначе — возвращать ctx
//   3. Otherwise — return ctx
function useTabsContext(): TabsContextValue {
  // TODO: ваш код здесь
  // TODO: your code here
  throw new Error('Not implemented')
}

// --- Step 3: Корневой компонент ---
// --- Step 3: Root component ---

interface TabsRootProps {
  children: ReactNode
  defaultTab: string
}

// TODO: Реализуйте TabsRoot:
// TODO: Implement TabsRoot:
//   - Хранит activeTab в useState(defaultTab)
//   - Stores activeTab in useState(defaultTab)
//   - Оборачивает children в TabsContext.Provider
//   - Wraps children in TabsContext.Provider
//   - Мемоизируйте value через useMemo
//   - Memoize value via useMemo
function TabsRoot({ children, defaultTab }: TabsRootProps) {
  // TODO: ваш код здесь
  // TODO: your code here
  return <div>{children}</div>
}

// --- Step 4: Sub-компоненты ---
// --- Step 4: Sub-components ---

// TODO: Реализуйте TabsList — простая обёртка с role="tablist"
// TODO: Implement TabsList — a simple wrapper with role="tablist"
function TabsList({ children }: { children: ReactNode }) {
  // TODO: ваш код здесь
  // TODO: your code here
  return <div>{children}</div>
}

interface TabProps {
  id: string
  children: ReactNode
  disabled?: boolean
}

// TODO: Реализуйте Tab:
// TODO: Implement Tab:
//   - Читает activeTab и setActiveTab из useTabsContext()
//   - Reads activeTab and setActiveTab from useTabsContext()
//   - isActive = activeTab === id
//   - При клике: setActiveTab(id)
//   - On click: setActiveTab(id)
//   - ARIA: role="tab", aria-selected={isActive}
function Tab({ id, children, disabled = false }: TabProps) {
  // TODO: ваш код здесь
  // TODO: your code here
  return <button>{children}</button>
}

interface PanelProps {
  id: string
  children: ReactNode
}

// TODO: Реализуйте Panel:
// TODO: Implement Panel:
//   - Читает activeTab из useTabsContext()
//   - Reads activeTab from useTabsContext()
//   - Если activeTab !== id — возвращает null
//   - If activeTab !== id — return null
//   - Иначе рендерит children с role="tabpanel"
//   - Otherwise renders children with role="tabpanel"
function Panel({ id, children }: PanelProps) {
  // TODO: ваш код здесь
  // TODO: your code here
  return <div>{children}</div>
}

// --- Step 5: Соберите Tabs через Object.assign ---
// --- Step 5: Assemble Tabs via Object.assign ---

// TODO: Установите displayName для каждого компонента:
// TODO: Set displayName for each component:
//   TabsRoot.displayName = 'Tabs'
//   Tab.displayName = 'Tabs.Tab'
//   и т.д. / etc.

// TODO: Соберите итоговый объект:
// TODO: Assemble the final object:
//   const Tabs = Object.assign(TabsRoot, { List: TabsList, Tab, Panel })
const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab,
  Panel,
})

// ============================================
// Демонстрация — не изменяйте эту функцию,
// Demo — do not modify this function,
// просто реализуйте компоненты выше
// just implement the components above
// ============================================

export function Task3_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 3.1 — Tabs</h2>
      <p style={{ color: '#64748b', marginBottom: 16 }}>
        {/* Реализуйте компоненты выше, чтобы это заработало: */}
        {/* Implement the components above to make this work: */}
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
