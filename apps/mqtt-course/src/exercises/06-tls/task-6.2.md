# Задание 6.2: Настройка TLS в Mosquitto

## Цель

Настроить MQTT-брокер Mosquitto 2.x для работы по зашифрованному протоколу TLS на порту 8883,
используя сгенерированные в задании 6.1 сертификаты.

## Требования

1. Настройте два listener: `1883` (localhost, без TLS) и `8883` (с TLS)
2. Укажите `cafile`, `certfile`, `keyfile` — пути к файлам из задания 6.1
3. Задайте минимальную версию TLS: `tls_version tlsv1.2`
4. Перезапустите Mosquitto и убедитесь, что брокер стартует без ошибок
5. Проверьте подключение командой `mosquitto_pub` с флагом `--cafile`

## Чеклист

- [ ] `listener 1883 localhost` — незашифрованный порт только для localhost
- [ ] `listener 8883` — TLS listener
- [ ] `cafile`, `certfile`, `keyfile` указывают на корректные файлы
- [ ] `tls_version tlsv1.2` задан
- [ ] `service mosquitto restart` завершается без ошибок
- [ ] `mosquitto_pub --cafile ca.crt -h mqtt.home -p 8883 -t test -m hello` работает
- [ ] Попытка подключения без TLS на порт 8883 завершается ошибкой

## Как проверить себя

1. Проверьте лог Mosquitto на ошибки:
   ```bash
   logread | grep mosquitto
   ```
2. Убедитесь, что оба порта открыты:
   ```bash
   netstat -tlnp | grep mosquitto
   ```
3. Проверьте TLS-рукопожатие:
   ```bash
   openssl s_client -connect mqtt.home:8883 -CAfile /etc/mosquitto/certs/ca.crt
   # Должно вывести: Verify return code: 0 (ok)
   ```
4. Попробуйте подключиться без сертификата — должна быть ошибка:
   ```bash
   mosquitto_pub -h mqtt.home -p 8883 -t test -m hello
   ```
