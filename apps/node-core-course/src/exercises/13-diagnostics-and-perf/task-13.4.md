# Задание 13.4: Util & Misc

## Цель

Освоить утилиты Node.js: `util.promisify` для преобразования callback в Promise, `util.inspect` для форматирования, `util.types` для проверки типов, кастомный Console и readline для интерактивного ввода.

## Требования

1. Продемонстрируйте `util.promisify()` для преобразования callback-функций
2. Покажите `util.inspect()` с настройками глубины, цвета и кастомным inspect
3. Продемонстрируйте `util.types` для точной проверки типов объектов
4. Покажите создание кастомного Console с выводом в файл
5. Продемонстрируйте readline для интерактивного ввода и построчного чтения файлов
6. Покажите console.table, console.time/timeEnd для отладки

## Чеклист

- [ ] util.promisify() с примерами fs и child_process
- [ ] util.inspect() с настройками и custom inspect
- [ ] util.types — isDate, isPromise, isProxy и другие
- [ ] Custom Console с stdout/stderr в файлы
- [ ] readline с question и for-await-of для файлов
- [ ] console.table и console.time для отладки

## Как проверить себя

1. Нажмите "Запустить" — должны отобразиться все утилиты
2. Убедитесь, что promisify показан для нестандартных callback
3. Проверьте, что custom inspect скрывает чувствительные данные
4. Убедитесь, что readline показан в callback и Promise версии
