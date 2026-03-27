# Задание 8.2: lazy() — рекурсивные схемы

## Цель

Научиться использовать `yup.lazy()` для создания рекурсивных схем, валидирующих древовидные структуры.

## Требования

1. Определите интерфейс `TreeNode`:
   ```ts
   interface TreeNode {
     id: number
     label: string
     children: TreeNode[]
   }
   ```

2. Создайте `treeNodeSchema` — рекурсивную объектную схему:
   - `id`: required, positive number
   - `label`: required, min(1)
   - `children`: array of `yup.lazy(() => treeNodeSchema.default(undefined))`
   - Не забудьте `.default([])` на массиве

3. Реализуйте компонент с textarea для ввода JSON дерева и кнопкой валидации:
   - Парсите JSON через `JSON.parse()`
   - Валидируйте через `treeNodeSchema.validate(data, { abortEarly: false })`
   - При успехе покажите количество узлов (рекурсивный подсчёт)
   - Обработайте `SyntaxError` (невалидный JSON) и `ValidationError` отдельно

## Чеклист

- [ ] `treeNodeSchema` типизирован как `yup.ObjectSchema<TreeNode>`
- [ ] `children` использует `yup.lazy(() => treeNodeSchema.default(undefined))`
- [ ] `.default([])` стоит на массиве children
- [ ] JSON-ошибки и ошибки валидации обрабатываются раздельно
- [ ] Показывается количество узлов при успешной валидации

## Как проверить себя

1. Дефолтное дерево (Root → Child 1 → Grandchild, Child 2) — успех, 4 узла
2. Удалите `label` у узла — ошибка валидации
3. Введите невалидный JSON (`{broken}`) — ошибка парсинга
4. Пустые `children: []` — ок, лист дерева
5. Отрицательный `id` — ошибка "positive"
