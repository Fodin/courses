import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Task 1.3 — Accordion через композицию
// ============================================
//
// Реализуйте компоненты Accordion и AccordionItem.
// Каждый AccordionItem управляет своим состоянием независимо.
// НЕ используйте массив конфигов — только JSX-вложенность.
//
// Подробное описание: src/exercises/01-composition-basics/task-1.3.md

// TODO 1: Определите интерфейс AccordionProps
// - children: React.ReactNode

// TODO 2: Реализуйте компонент Accordion
// Это просто контейнер — никакой логики, только визуальное оформление
// (border, borderRadius, overflow: hidden)

// TODO 3: Определите интерфейс AccordionItemProps
// - title: React.ReactNode — заголовок (принимает JSX!)
// - children: React.ReactNode — раскрываемый контент
// - defaultOpen?: boolean — открыт по умолчанию (false)

// TODO 4: Реализуйте компонент AccordionItem
// - useState для хранения isOpen (начальное значение = defaultOpen ?? false)
// - Кнопка <button onClick={() => setIsOpen(prev => !prev)}>
//   - Отображает title
//   - Показывает стрелку ▼ (поверните через transform: rotate при isOpen)
// - {isOpen && <div>children</div>} — условный рендеринг контента

// TODO 5: Создайте FAQ с минимум 4 вопросами:
// - Первый вопрос: defaultOpen={true}
// - Второй вопрос: title содержит JSX (span с цветным бейджем "Важно")
// - Третий вопрос: children содержит <ul><li>...</li></ul>
// - Четвёртый вопрос: обычный текстовый ответ

export function Task1_3() {
  const { t } = useLanguage()
  // Hint: состояние isOpen хранится в каждом AccordionItem, а не здесь
  void useState

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100%' }}>
      <h2 style={{ marginTop: 0, marginBottom: 24 }}>{t('task.title')} 1.3</h2>

      {/* TODO 6: Раскомментируйте и заполните после реализации компонентов */}
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
