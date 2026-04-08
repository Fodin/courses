# Задание 5.3: ComposeProviders — избавляемся от pyramid of doom

## Цель

Реализовать компонент `ComposeProviders`, который принимает массив провайдеров и компонует их в правильном порядке через `Array.reduceRight`. Сравнить читаемость кода до и после.

## Требования

1. Реализуйте тип `ProviderComponent`:
   ```ts
   type ProviderComponent = React.ComponentType<{ children: React.ReactNode }>
   ```

2. Реализуйте компонент `ComposeProviders`:
   - Props: `{ providers: ProviderComponent[]; children: React.ReactNode }`
   - Использует `providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children)`
   - Результат: первый провайдер в массиве — самый внешний в дереве

3. Продемонстрируйте работу через сравнение "до" и "после":
   - Раздел "Pyramid of doom" — руками написанные 5 вложенных провайдеров (UserProvider, ThemeProvider, LocaleProvider, NotificationsProvider, plus один кастомный CounterProvider)
   - Раздел "С ComposeProviders" — тот же результат через `<ComposeProviders providers={[...]}>`
   - Оба варианта рендерят одинаковое демо-приложение `<MiniApp />`

4. `MiniApp` должен:
   - Читать данные из всех 5 провайдеров (user, theme, locale, notifications, counter)
   - Показывать виджет для каждого контекста
   - Кнопки изменения данных должны работать

5. Добавьте `CounterProvider` как пятый пример:
   - Тип: `{ count: number; increment: () => void; decrement: () => void }`
   - Реализуйте через `createStrictContext`

## Подсказки

- `reduceRight` — не `reduce`. Первый в массиве должен быть самым внешним
- Чтобы убедиться в правильном порядке: поставьте `console.log` в каждом провайдере при монтировании
- Тип возвращаемого `reduceRight` нужно привести: `as React.ReactNode`

## Чеклист

- [ ] `ProviderComponent` тип определён корректно
- [ ] `ComposeProviders` использует `reduceRight`
- [ ] Первый провайдер в массиве — самый внешний в дереве
- [ ] Оба варианта (pyramid и compose) рендерят одинаковый `MiniApp`
- [ ] `MiniApp` читает данные из всех 5 контекстов
- [ ] `CounterProvider` реализован через `createStrictContext`
- [ ] Нет `any` в типах

## Как проверить себя

Откройте задание в браузере. Вы увидите два идентичных блока — "Pyramid of doom" и "ComposeProviders". Оба должны показывать одинаковые виджеты с работающими кнопками.

Измените порядок провайдеров в массиве `ComposeProviders` — `MiniApp` должен по-прежнему работать корректно (порядок провайдеров не должен влиять на работу для независимых контекстов).

Откройте React DevTools и сравните дерево компонентов для обоих вариантов — оно должно быть идентичным.
