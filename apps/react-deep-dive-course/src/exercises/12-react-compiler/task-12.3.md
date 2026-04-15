# Задание 12.3: Compiler Output Analysis

## Задание

Перед вами интерактивный diff viewer: слева — оригинальный код компонента, справа — "скомпилированная"
версия (с useMemoCache, $[0], $[1] и т.д.). Ваша задача — кликнуть на каждый блок трансформации
и объяснить: что закэшировано, какой cache key, почему именно эти scope boundaries.

## Цель

Научиться читать compiler output. Понять логику разбиения компонента на reactive scopes,
объяснить связь между зависимостями и cache keys. Развить интуицию: как компилятор "думает".

## Требования

1. Реализуйте diff viewer с двумя колонками:
   - Левая: оригинальный код (read-only, с подсветкой синтаксиса через цвет шрифта)
   - Правая: compiler output — подсвечивать связанные строки при ховере

2. Покажите три компонента для анализа (переключение через табы):

   **Компонент 1 — `UserProfile`**:
   ```
   // оригинал
   function UserProfile({ user, onFollow }) {
     const fullName = user.firstName + ' ' + user.lastName
     const avatar = getAvatarUrl(user.id, 'medium')
     const handleFollow = () => onFollow(user.id)
     return (
       <div>
         <img src={avatar} alt={fullName} />
         <span>{fullName}</span>
         <button onClick={handleFollow}>Подписаться</button>
       </div>
     )
   }
   ```
   Compiler output показывает 4 scope: fullName (deps: firstName+lastName), avatar (deps: user.id),
   handleFollow (deps: onFollow+user.id), JSX (deps: avatar+fullName+handleFollow)

   **Компонент 2 — `FilteredTable`**:
   ```
   // оригинал
   function FilteredTable({ rows, filter, onRowClick }) {
     const filtered = rows.filter(r => r.status === filter)
     const total = filtered.length
     return (
       <div>
         <span>Найдено: {total}</span>
         <table>
           {filtered.map(r => (
             <tr key={r.id} onClick={() => onRowClick(r.id)}>
               <td>{r.name}</td>
             </tr>
           ))}
         </table>
       </div>
     )
   }
   ```
   Scope analysis: filtered (deps: rows+filter), total (deps: filtered), inline onClick (deps: onRowClick внутри map — это проблема!), JSX

   **Компонент 3 — `ConditionalWidget`**:
   ```
   // оригинал
   function ConditionalWidget({ isAdmin, data, onAction }) {
     const label = isAdmin ? 'Удалить' : 'Просмотреть'
     const handleAction = () => onAction(data.id, isAdmin)
     if (data.hidden) return null
     return (
       <button onClick={handleAction}>{label}</button>
     )
   }
   ```
   Анализ: early return усложняет scope boundaries — что происходит если data.hidden меняется?

3. Для каждого компонента — панель "Аннотации":
   - Кликабельные scope-блоки в правой колонке
   - При клике: появляется попап/tooltip с объяснением (cache key index, deps list, почему этот scope)
   - Студент может написать своё объяснение в textarea (free-form)
   - Кнопка "Показать правильный ответ"

4. Итоговая секция "Тест на понимание" — 3 вопроса с вариантами ответов:
   - Вопрос 1: какой cache index ($[?]) хранит значение `fullName`?
   - Вопрос 2: почему inline onClick в map не оптимален?
   - Вопрос 3: что случится с handleAction scope если `data.hidden` вернёт true?

## Чеклист

- [ ] Три компонента переключаются через табы
- [ ] Левая колонка — оригинал, правая — compiler output
- [ ] Scope-блоки в правой колонке кликабельны (highlight + popup)
- [ ] Каждый popup объясняет: что закэшировано, cache keys, deps
- [ ] Textarea для своих аннотаций (студент пишет объяснение)
- [ ] Кнопка "Показать правильный ответ" для каждого scope
- [ ] Итоговый тест из 3 вопросов с проверкой ответов
- [ ] Итоговый счёт правильных ответов

## Как проверить себя

- `UserProfile`: укажите, что `$[0]` и `$[1]` это `firstName` и `lastName` как deps для fullName
- `FilteredTable`: объясните почему inline onClick в `.map()` создаёт новую функцию на каждый рендер
  — компилятор должен был бы вынести её, но deps включают `r.id` из замыкания
- `ConditionalWidget`: объясните, что early return (`if (data.hidden) return null`) создаёт
  отдельный scope boundary — компилятор должен сохранить handleFollow ПЕРЕД early return, иначе
  при переходе hidden→false будет стale closure
- Пройдите итоговый тест: все 3 вопроса должны быть с правильным ответом
