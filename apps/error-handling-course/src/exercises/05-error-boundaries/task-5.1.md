# Задание 5.1: Базовый Error Boundary

## Цель
Создать классовый компонент Error Boundary для перехвата ошибок рендера.

## Требования
1. Создайте класс `BasicErrorBoundary extends Component`
2. Реализуйте `getDerivedStateFromError` для обновления состояния
3. Реализуйте `componentDidCatch` для логирования в консоль
4. При ошибке показывайте сообщение с `error.message`
5. Создайте `BuggyCounter` — компонент, падающий при count === 3
6. Оберните `BuggyCounter` в `BasicErrorBoundary`

## Чеклист
- [ ] Error Boundary класс создан
- [ ] `getDerivedStateFromError` реализован
- [ ] `componentDidCatch` логирует ошибку
- [ ] При ошибке показывается fallback
- [ ] `BuggyCounter` падает на 3 и ловится boundary
