import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// TODO 1: Объявите тип Lens<S, A>
//
// Lens — пара функций:
//   get: читает значение типа A из структуры S
//   set: возвращает НОВУЮ структуру S с обновлённым значением A
//       (source не должен мутироваться!)
// ============================================

// type Lens<S, A> = {
//   get: (source: S) => A
//   set: (value: A, source: S) => S
// }

// ============================================
// TODO 2: Реализуйте конструктор lens и три операции
//
// lens(get, set) — создаёт Lens из двух функций
// view(l, s)    — читает значение через линзу
// lset(l, a, s) — возвращает новую структуру с новым значением
// over(l, fn, s)— применяет fn к значению через линзу
// ============================================

// function lens<S, A>(get: (s: S) => A, set: (a: A, s: S) => S): Lens<S, A> {
//   return { get, set }
// }

// function view<S, A>(l: Lens<S, A>, s: S): A { ... }
// function lset<S, A>(l: Lens<S, A>, a: A, s: S): S { ... }
// function over<S, A>(l: Lens<S, A>, fn: (a: A) => A, s: S): S { ... }

// ============================================
// TODO 3: Реализуйте composeLens
//
// composeLens(outer, inner) возвращает Lens<A, C> если:
//   outer: Lens<A, B>
//   inner: Lens<B, C>
//
// Подсказка для get:  inner.get(outer.get(s))
// Подсказка для set:  outer.set(inner.set(c, outer.get(s)), s)
// ============================================

// function composeLens<A, B, C>(outer: Lens<A, B>, inner: Lens<B, C>): Lens<A, C> { ... }

// ============================================
// TODO 4: Объявите интерфейсы и начальные данные
//
// interface Manager { name: string; email: string }
// interface Department { name: string; manager: Manager }
// interface Company { name: string; departments: Department[] }
//
// const initialCompany: Company = {
//   name: 'TechCorp',
//   departments: [{
//     name: 'Engineering',
//     manager: { name: 'Alice', email: 'alice@tech.com' }
//   }]
// }
// ============================================

// ============================================
// TODO 5: Создайте предустановленные линзы
//
// companyNameLens      — фокус на Company.name
// departmentLens(i)    — фокус на Company.departments[i]
// managerLens          — фокус на Department.manager
// managerNameLens      — фокус на Manager.name
//
// Скомпонуйте линзу dept0ManagerNameLens:
//   composeLens(composeLens(departmentLens(0), managerLens), managerNameLens)
// ============================================

export function Task8_1() {
  const { t } = useLanguage()
  const [selectedLens, setSelectedLens] = useState('companyName')
  const [newValue, setNewValue] = useState('')
  void selectedLens
  void setSelectedLens
  void newValue
  void setNewValue

  return (
    <div className="exercise-container">
      <h2>{t('task.8.1')}</h2>

      {/* TODO 6: Отобразите текущее состояние company
          Покажите структуру в виде дерева:
          - name: TechCorp
          - departments[0].name: Engineering
          - departments[0].manager.name: Alice
          - departments[0].manager.email: alice@tech.com */}

      {/* TODO 7: Добавьте выпадающий список линз
          Опции: companyName, dept[0].manager.name, dept[0].manager.email (и другие)
          Показывайте текущее значение через view(selectedLens, company) */}

      {/* TODO 8: Добавьте поля для редактирования
          - Input для нового значения
          - Кнопка "set(lens, value, company)" — вызывает lset
          - Кнопка "over(lens, toUpperCase)" — вызывает over с .toUpperCase()
          - Кнопка "Сбросить" — возвращает initialCompany */}

      {/* TODO 9: Покажите результат операции
          - Старое значение
          - Новое значение
          - Используемая линза (описание)
          - Проверка: company === initialCompany? (иммутабельность) */}
    </div>
  )
}
