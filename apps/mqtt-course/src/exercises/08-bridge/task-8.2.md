# Задание 8.2: Настройка моста в Mosquitto

## Цель

Настроить MQTT Bridge в Mosquitto для связи локального брокера OpenWRT с удалённым брокером.
Понять основные параметры конфигурации и их назначение.

## Требования

1. Настройте `connection` с именем `bridge-to-cloud`
2. Укажите `address` — адрес и порт удалённого брокера
3. Добавьте как минимум два правила `topic`: одно `out`, одно `in`
4. Настройте аутентификацию: `remote_username`, `remote_password`
5. Настройте TLS: `bridge_cafile` (если используется TLS на удалённом брокере)
6. Добавьте `start_type automatic` и `keepalive_interval`

## Чеклист

- [ ] `connection bridge-to-cloud` — имя моста задано
- [ ] `address` — адрес и порт правильные
- [ ] Есть хотя бы одно правило `topic ... out` и одно `... in`
- [ ] `remote_username` и `remote_password` заданы
- [ ] `start_type automatic` — мост автоматически переподключается
- [ ] `keepalive_interval 60` — задан интервал
- [ ] Компонент показывает параметры с описаниями и генерирует конфиг

## Как проверить себя

1. Проверьте Bridge-соединение в логах после запуска:
   ```bash
   logread | grep mosquitto | grep -i "bridge\|connect"
   ```
2. Проверьте статус соединения через $SYS:
   ```bash
   mosquitto_sub -t '$SYS/broker/connection/bridge-to-cloud/state' -C 1
   # Должно вернуть 1 (подключён) или 0 (отключён)
   ```
3. Опубликуйте сообщение локально и убедитесь, что оно появилось на удалённом брокере:
   ```bash
   mosquitto_pub -t sensors/test -m "bridge_test"
   # На удалённом: mosquitto_sub -t sensors/test -C 1
   ```
