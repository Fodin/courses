# Задание 6.3: Взаимная аутентификация (mTLS)

## Цель

Настроить mTLS (mutual TLS) в Mosquitto, при котором сервер проверяет сертификат клиента.
Использовать CN клиентского сертификата как имя пользователя для ACL.

## Требования

1. Добавьте в конфигурацию `require_certificate true` и `use_identity_as_username true`
2. Настройте ACL-правила на основе CN сертификатов (`sensor-01`, `gw-01`)
3. Создайте два клиентских сертификата с разными CN и разными правами в ACL
4. Убедитесь, что подключение без сертификата отклоняется брокером
5. Убедитесь, что сертификат с CN `sensor-01` может публиковать, но не подписываться на чужие топики

## Чеклист

- [ ] `require_certificate true` добавлено в конфиг
- [ ] `use_identity_as_username true` добавлено в конфиг
- [ ] ACL-файл содержит правила для `sensor-01` (запись) и `gw-01` (чтение)
- [ ] Подключение без сертификата отклоняется (`Connection Refused`)
- [ ] `sensor-01.crt` + `sensor-01.key` работают с правильными топиками
- [ ] `gw-01.crt` + `gw-01.key` могут только читать

## Как проверить себя

1. Проверьте, что без сертификата подключение отклоняется:
   ```bash
   mosquitto_pub --cafile ca.crt -h mqtt.home -p 8883 -t test -m hello
   # Ожидаемо: Connection Refused
   ```

2. Подключитесь с сертификатом `sensor-01`:
   ```bash
   mosquitto_pub \
     --cafile ca.crt --cert sensor-01.crt --key sensor-01.key \
     -h mqtt.home -p 8883 \
     -t sensors/01/temp -m "22.5"
   ```

3. Убедитесь, что `sensor-01` не может читать чужие топики:
   ```bash
   mosquitto_sub \
     --cafile ca.crt --cert sensor-01.crt --key sensor-01.key \
     -h mqtt.home -p 8883 -t "sensors/#"
   # Должна быть ошибка авторизации
   ```

4. Убедитесь, что `gw-01` может читать все данные датчиков:
   ```bash
   mosquitto_sub \
     --cafile ca.crt --cert gw-01.crt --key gw-01.key \
     -h mqtt.home -p 8883 -t "sensors/#" -v
   ```
