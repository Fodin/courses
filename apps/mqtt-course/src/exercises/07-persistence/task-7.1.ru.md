# Задание 7.1: Настройка persistence database

## Цель

Научиться настраивать persistence в Mosquitto для сохранения retained-сообщений, сессий и очередей
QoS 1/2 между перезапусками брокера.

## Требования

1. Включите persistence с правильным `persistence_location` (не /tmp!)
2. Настройте `autosave_interval` (рекомендуется 300 секунд)
3. Установите `autosave_on_changes false` для экономии ресурса flash
4. Создайте директорию `/var/lib/mosquitto/` с правильными правами (владелец `mosquitto`)
5. Визуализируйте параметры с интерактивным слайдером для autosave_interval

## Чеклист

- [ ] `persistence true` указан в конфиге
- [ ] `persistence_location` НЕ указывает на `/tmp`
- [ ] Директория существует и доступна Mosquitto: `chown mosquitto:mosquitto /var/lib/mosquitto`
- [ ] `autosave_interval` задан (не 0, не слишком мало)
- [ ] `autosave_on_changes false` установлен
- [ ] Компонент показывает перечень того, что сохраняется и что нет
- [ ] Слайдер autosave_interval обновляет превью конфига

## Как проверить себя

1. Перезапустите Mosquitto и убедитесь в отсутствии ошибок:
   ```bash
   service mosquitto restart && logread | grep mosquitto | tail -5
   ```
2. Опубликуйте retained-сообщение:
   ```bash
   mosquitto_pub -t home/temp -m "22.5" -r
   ```
3. Перезапустите Mosquitto и проверьте, что retained-сообщение не потерялось:
   ```bash
   service mosquitto restart
   mosquitto_sub -t home/temp -C 1
   # Должно вернуть "22.5" немедленно
   ```
4. Убедитесь, что файл БД создан:
   ```bash
   ls -la /var/lib/mosquitto/mosquitto.db
   ```
