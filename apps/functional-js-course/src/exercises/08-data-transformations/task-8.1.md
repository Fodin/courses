# Задание 8.1: Lens — иммутабельный фокус на вложенных данных

## Цель

Реализовать тип Lens и набор примитивов для иммутабельных обновлений вложенных структур.
Научиться компоновать линзы для доступа к глубоко вложенным полям.

## Требования

1. Объявить тип `Lens<S, A>` с полями `get` и `set`
2. Реализовать конструктор `lens(get, set)` — возвращает Lens
3. Реализовать функцию `view(l, s)` — читает значение через линзу
4. Реализовать функцию `lset(l, a, s)` — возвращает новую структуру с изменённым значением (без мутации `s`)
5. Реализовать функцию `over(l, fn, s)` — применяет функцию к значению через линзу
6. Реализовать функцию `composeLens(outer, inner)` — возвращает линзу, составленную из двух
7. Создать линзы для структуры `Company → departments[0] → manager → name`
8. В компоненте продемонстрировать: выбор линзы, `lset`, `over`, проверку что `source` не мутирован

## Чеклист

- [ ] Тип `Lens<S, A>` объявлен
- [ ] `view`, `lset`, `over` корректно реализованы
- [ ] `composeLens` правильно комбинирует get и set
- [ ] `lset` возвращает новый объект, не мутирует исходный
- [ ] Законы линзы: `lset(l, view(l, s), s)` возвращает объект, равный `s` по значению
- [ ] В интерфейсе можно выбрать любую из предустановленных линз и применить операцию
- [ ] Показано: оригинальная структура не изменена (referential check)

## Как проверить себя

```ts
const nameLens = lens<Company, string>(
  s => s.name,
  (a, s) => ({ ...s, name: a })
)

const company = { name: 'TechCorp', departments: [] }
const updated = lset(nameLens, 'NewCorp', company)

console.log(view(nameLens, updated))  // 'NewCorp'
console.log(view(nameLens, company))  // 'TechCorp' — не изменился
console.log(company === updated)       // false — новый объект
```

Для composed lens:
```ts
const dept0ManagerNameLens = composeLens(
  composeLens(departmentLens(0), managerLens),
  managerNameLens
)
view(dept0ManagerNameLens, initialCompany)  // 'Alice'
view(dept0ManagerNameLens, lset(dept0ManagerNameLens, 'Bob', initialCompany))  // 'Bob'
```
