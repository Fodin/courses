# Задание 3.3: Command (TextEditor с undo)

## Цель

Реализовать паттерн Command для текстового редактора с поддержкой отмены операций (undo).

## Требования

1. Создайте интерфейс `Command` с методами:
   - `execute(): void`
   - `undo(): void`
   - `describe(): string` — текстовое описание команды
2. Создайте класс `TextEditor` с методами:
   - `getContent(): string` и `setContent(content: string): void`
   - `executeCommand(command: Command): void` — выполнить и сохранить в историю
   - `undo(): Command | undefined` — отменить последнюю команду
   - `getHistorySize(): number`
3. Реализуйте `InsertTextCommand(editor, text, position)`:
   - `execute` — вставляет текст в позицию
   - `undo` — восстанавливает предыдущее содержимое
4. Реализуйте `DeleteTextCommand(editor, position, length)`:
   - `execute` — удаляет length символов с позиции
   - `undo` — восстанавливает предыдущее содержимое
5. Продемонстрируйте серию команд и последовательный undo

## Чеклист

- [ ] Интерфейс `Command` имеет `execute`, `undo`, `describe`
- [ ] `TextEditor` ведёт историю выполненных команд
- [ ] `InsertTextCommand` корректно вставляет текст
- [ ] `DeleteTextCommand` корректно удаляет текст
- [ ] `undo` восстанавливает состояние до выполнения команды
- [ ] Каждая команда сохраняет состояние для undo

## Как проверить себя

1. Нажмите кнопку запуска
2. Проследите, как содержимое редактора меняется после каждой команды
3. Убедитесь, что undo возвращает текст к предыдущему состоянию
