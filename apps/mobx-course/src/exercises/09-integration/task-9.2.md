# Задание 9.2: Тестирование сторов

## 🎯 Цель

Научиться тестировать MobX-сторы как обычные классы — без рендеринга React-компонентов.

## 📋 Требования

Создайте `CartStoreForTest` и встроенный тест-раннер:

1. `CartStoreForTest` с observable `items: { name, price, qty }[]`
2. Метод `addItem(name, price)` — добавляет товар с qty = 1
3. Computed `totalPrice` — сумма `price * qty` всех товаров
4. Computed `itemCount` — количество товаров
5. Метод `clear()` — очищает корзину
6. Функция `runTests()` с тестами:
   - Стор начинает пустым (itemCount === 0, totalPrice === 0)
   - `addItem` добавляет товар и обновляет totalPrice
   - totalPrice корректно считает сумму нескольких товаров
   - `clear` удаляет все товары
7. UI: кнопка «Run Tests» и отображение результатов PASS/FAIL

```typescript
class CartStoreForTest {
  items: { name: string; price: number; qty: number }[]
  addItem(name: string, price: number): void
  get totalPrice(): number
  get itemCount(): number
  clear(): void
}
```

## Чеклист

- [ ] `CartStoreForTest` создан с `makeAutoObservable`
- [ ] `addItem` корректно добавляет товар с qty = 1
- [ ] `totalPrice` вычисляет сумму `price * qty`
- [ ] `clear` очищает массив items
- [ ] Написано минимум 4 теста
- [ ] Все тесты проходят (PASS) при нажатии кнопки
- [ ] Результаты отображаются с цветовой индикацией (зелёный/красный)

## 🔍 Как проверить себя

1. Нажмите кнопку «Run Tests»
2. Все тесты должны отображаться как PASS (зелёным цветом)
3. Попробуйте временно сломать логику стора (например, убрать `* qty` из `totalPrice`) — соответствующий тест должен стать FAIL
4. Убедитесь, что отображается счётчик: `N/N passed`
