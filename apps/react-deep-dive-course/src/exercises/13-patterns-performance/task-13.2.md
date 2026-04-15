# Задание 13.2: State Colocation + Children as Props

## Задание

Вам дан компонент с глубоко вложенным деревом. State поднят в корень: поле ввода
комментария хранится в `PageRoot`, хотя используется только в `CommentInput` глубоко
в дереве. При каждом нажатии клавиши мигают все компоненты на странице.

Применить два паттерна:
1. **State Colocation** — переместить state вниз к `CommentInput`
2. **Children as Props** — передать тяжёлый `ArticleContent` снаружи,
   чтобы он не ре-рендерился при изменении `CommentInput`

---

## Цель

На практике применить State Colocation и Children as Props, убедиться через render counters,
что количество ре-рендеров сократилось.

---

## Требования

1. В начальной версии (`BeforeColocation`) state `commentText` находится в корне, все дочерние
   компоненты ре-рендерятся при вводе
2. В оптимизированной версии (`AfterColocation`) применить оба паттерна:
   - `commentText` перемещён в `CommentSection`
   - `ArticleContent` передаётся через `children` prop в `CommentSection`
3. Оба варианта отображаются рядом с render counters для каждого компонента
4. `ArticleContent` — "тяжёлый" компонент (симулировать: показывать "статью" с несколькими параграфами)
5. Счётчики рендеров показывают: до = все мигают, после = только `CommentSection` и `CommentInput`
6. `ArticleContent` в оптимизированной версии НЕ ре-рендерится при вводе

---

## Структура компонентов

```
BeforeColocation:
  PageRoot [state: commentText]
    ArticleContent
    CommentSection
      CommentInput [props: commentText, setCommentText]

AfterColocation:
  PageRoot (без state)
    CommentSection [state: commentText, children: ArticleContent]
      {children} → ArticleContent (не ре-рендерится!)
      CommentInput (внутри, читает state из CommentSection)
```

---

## Чеклист

- [ ] `BeforeColocation` показывает все 3 компонента ре-рендерятся при вводе
- [ ] `AfterColocation`: state `commentText` находится в `CommentSection`, не в корне
- [ ] `AfterColocation`: `ArticleContent` передаётся как `children` в `CommentSection`
- [ ] `AfterColocation`: при вводе в поле ре-рендерятся только `CommentSection` + `CommentInput`
- [ ] `ArticleContent` в `AfterColocation` имеет стабильный счётчик рендеров при вводе
- [ ] Оба варианта рядом, визуально сравнимы

---

## Как проверить себя

1. В поле "До" вводите текст — счётчик должен расти у всех компонентов включая ArticleContent
2. В поле "После" вводите текст — счётчик должен расти только у CommentSection и CommentInput
3. ArticleContent справа (в "После") должен оставаться на счётчике = 1

---

## Подсказки

- Children as Props работает потому что `<ArticleContent />` создаётся в PageRoot (снаружи),
  а не внутри CommentSection. При ре-рендере CommentSection React получает тот же объект children.
- Render counter: `const count = useRef(0); count.current++` — инкрементируется при каждом вызове функции
- Чтобы паттерн сработал, ArticleContent не должен принимать props от CommentSection
- Если ArticleContent нужны данные из CommentSection — паттерн не применим, нужен другой подход
