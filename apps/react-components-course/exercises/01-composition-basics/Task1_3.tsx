import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Task 1.3 — Accordion через композицию
// Task 1.3 — Accordion via composition
// ============================================
//
// Реализуйте компоненты Accordion и AccordionItem.
// Implement the Accordion and AccordionItem components.
// Каждый AccordionItem управляет своим состоянием независимо.
// Each AccordionItem manages its state independently.
// НЕ используйте массив конфигов — только JSX-вложенность.
// Do NOT use an array of configs — only JSX nesting.
//
// Подробное описание: src/exercises/01-composition-basics/task-1.3.md
// Detailed description: src/exercises/01-composition-basics/task-1.3.md

// TODO 1: Определите интерфейс AccordionProps
// TODO 1: Define the AccordionProps interface
// - children: React.ReactNode

// TODO 2: Реализуйте компонент Accordion
// TODO 2: Implement the Accordion component
// Это просто контейнер — никакой логики, только визуальное оформление
// This is just a container — no logic, only visual styling
// (border, borderRadius, overflow: hidden)

// TODO 3: Определите интерфейс AccordionItemProps
// TODO 3: Define the AccordionItemProps interface
// - title: React.ReactNode — заголовок (принимает JSX!)
// - title: React.ReactNode — title (accepts JSX!)
// - children: React.ReactNode — раскрываемый контент
// - children: React.ReactNode — collapsible content
// - defaultOpen?: boolean — открыт по умолчанию (false)
// - defaultOpen?: boolean — open by default (false)

// TODO 4: Реализуйте компонент AccordionItem
// TODO 4: Implement the AccordionItem component
// - useState для хранения isOpen (начальное значение = defaultOpen ?? false)
// - useState for storing isOpen (initial value = defaultOpen ?? false)
// - Кнопка <button onClick={() => setIsOpen(prev => !prev)}>
// - Button <button onClick={() => setIsOpen(prev => !prev)}>
//   - Отображает title
//   - Displays title
//   - Показывает стрелку ▼ (поверните через transform: rotate при isOpen)
//   - Shows arrow ▼ (rotate via transform: rotate when isOpen)
// - {isOpen && <div>children</div>} — условный рендеринг контента
// - {isOpen && <div>children</div>} — conditional content rendering

// TODO 5: Создайте FAQ с минимум 4 вопросами:
// TODO 5: Create an FAQ with at least 4 questions:
// - Первый вопрос: defaultOpen={true}
// - First question: defaultOpen={true}
// - Второй вопрос: title содержит JSX (span с цветным бейджем "Важно")
// - Second question: title contains JSX (span with colored "Important" badge)
// - Третий вопрос: children содержит <ul><li>...</li></ul>
// - Third question: children contains <ul><li>...</li></ul>
// - Четвёртый вопрос: обычный текстовый ответ
// - Fourth question: plain text answer

export function Task1_3() {
  const { t } = useLanguage()
  // Hint: состояние isOpen хранится в каждом AccordionItem, а не здесь
  // Hint: isOpen state is stored in each AccordionItem, not here
  void useState

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100%' }}>
      <h2 style={{ marginTop: 0, marginBottom: 24 }}>{t('task.title')} 1.3</h2>

      {/* TODO 6: Раскомментируйте и заполните после реализации компонентов */}
      {/* TODO 6: Uncomment and fill in after implementing the components */}
      {/*
      <div style={{ maxWidth: 640 }}>
        <Accordion>
          <AccordionItem defaultOpen={true} title="Первый вопрос">
            Ответ на первый вопрос...
          </AccordionItem>
          <AccordionItem title={<span>Второй вопрос <span style={{...}}>Важно</span></span>}>
            Ответ на второй вопрос...
          </AccordionItem>
          <AccordionItem title="Третий вопрос">
            <ul>
              <li>Пункт 1</li>
              <li>Пункт 2</li>
            </ul>
          </AccordionItem>
          <AccordionItem title="Четвёртый вопрос">
            Ответ на четвёртый вопрос...
          </AccordionItem>
        </Accordion>
      </div>
      */}
    </div>
  )
}
