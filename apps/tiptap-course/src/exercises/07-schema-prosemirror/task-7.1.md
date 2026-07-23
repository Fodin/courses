# Задание 7.1: Инспектор схемы

## Цель

Построить инструмент, выводящий содержимое `editor.schema` — список всех зарегистрированных nodes и marks с их `content`, `group` и `marks` спецификациями.

## Требования

1. Создайте `editor` через `useEditor` с `StarterKit`
2. Постройте таблицу/список из `Object.entries(editor.schema.nodes)`, для каждой ноды выведите: имя, `spec.content` (если есть), `spec.group` (если есть)
3. Аналогично постройте список marks из `Object.entries(editor.schema.marks)`
4. Разделите вывод на два блока: "Nodes" и "Marks"
5. Для ноды `doc` отдельно подсветите её `content` — это корень схемы документа

## Чеклист

- [ ] Компонент называется `Task7_1` и экспортируется
- [ ] `useLanguage` импортирован и `t('task.7.1')` используется в заголовке
- [ ] Список nodes показывает минимум 10 разных типов узлов (все из StarterKit)
- [ ] Список marks показывает минимум 5 типов marks
- [ ] Для каждой ноды виден `content` (если задан) — например `paragraph: inline*`
- [ ] Нет TypeScript-ошибок типа `any` (используйте `unknown` + сужение типов при необходимости для чтения `spec`)

## Как проверить себя

1. Откройте задание — должны быть видны все ноды из StarterKit: `doc`, `paragraph`, `text`, `heading`, `bulletList`, `orderedList`, `listItem`, `blockquote`, `codeBlock`, `horizontalRule`, `hardBreak`
2. Проверьте, что у `doc` отображается `content: "block+"` (или похожее выражение)
3. Проверьте, что у `paragraph` отображается `content: "inline*"`
4. В списке marks должны быть видны `bold`, `italic`, `strike`, `code`, `underline`, `link`
