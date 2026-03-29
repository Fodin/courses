# Задание 10.1: Multer

## 🎯 Цель

Освоить загрузку файлов через Multer: single/multiple upload, file filters для валидации типа, storage engines (memory/disk), лимиты и обработка ошибок.

## Требования

1. Настройте `upload.single('avatar')` с memory storage для загрузки одного файла
2. Настройте `upload.array('photos', 10)` и `upload.fields()` для нескольких файлов
3. Реализуйте file filter: проверка mimetype, отклонение неподдерживаемых типов
4. Настройте disk storage: кастомный destination и filename с уникальным суффиксом
5. Установите лимиты (fileSize, files) и обработайте ошибки MulterError по err.code

## Чеклист

- [ ] Single upload сохраняет файл и возвращает метаданные (size, mimetype)
- [ ] Multiple upload принимает до N файлов
- [ ] File filter отклоняет неподдерживаемые типы файлов
- [ ] Disk storage генерирует уникальные имена файлов
- [ ] Ошибки MulterError обрабатываются с правильными HTTP-статусами (413, 400)

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: файлы загружаются через single и array, filter отклоняет PDF, storage сохраняет с уникальными именами, ошибки лимитов обрабатываются.
