# Задание 10.3: Интеграция с collectd

## Цель

Настроить collectd на OpenWRT для автоматического сбора MQTT-метрик через плагин exec и сохранения в RRD-файлы.

## Требования

1. Установить `collectd` и `collectd-mod-exec` через opkg
2. Создать скрипт `/usr/local/bin/mqtt-collectd.sh` в формате collectd exec
3. Скрипт должен выводить PUTVAL-строки для 5+ метрик: clients, messages_rx, messages_tx, heap, retained
4. Настроить `/etc/collectd.conf`: подключить exec-плагин, указать путь к скрипту
5. RRD-файлы хранить в `/tmp/rrd/` (RAM, не flash)
6. Запустить collectd и проверить, что метрики собираются

## Чеклист

- [ ] `opkg install collectd collectd-mod-exec` выполнено без ошибок
- [ ] Скрипт создан, исполняем, от пользователя `nobody` не требует root
- [ ] Скрипт выводит строки вида `PUTVAL "hostname/mqtt-broker/gauge-clients" N:42`
- [ ] `collectd.conf` содержит корректный блок `<Plugin exec>`
- [ ] RRD DataDir указывает на `/tmp/rrd/`
- [ ] `/etc/init.d/collectd restart` проходит без ошибок
- [ ] Через 60 секунд в `/tmp/rrd/` появились RRD-файлы

## Как проверить себя

```bash
# 1. Проверить установку:
collectd -t  # Тест конфига (должно быть без ошибок)

# 2. Запустить скрипт вручную от имени nobody:
su -s /bin/sh nobody -c '/usr/local/bin/mqtt-collectd.sh'
# Ожидаем строки PUTVAL:
# PUTVAL "router/mqtt-broker/gauge-clients" N:3
# PUTVAL "router/mqtt-broker/derive-messages_rx" N:1247
# ...

# 3. Проверить наличие RRD-файлов через минуту после запуска collectd:
ls /tmp/rrd/$(hostname)/mqtt-broker/

# 4. Посмотреть последнее значение из RRD:
rrdtool lastupdate /tmp/rrd/$(hostname)/mqtt-broker/gauge-clients.rrd

# 5. Лог collectd (ошибки exec-плагина):
logread | grep collectd | tail -20
```

Формат PUTVAL строк:
```
PUTVAL "hostname/plugin-instance/type-instance" N:value
PUTVAL "router/mqtt-broker/gauge-clients" N:42
PUTVAL "router/mqtt-broker/derive-messages_rx" N:12847
PUTVAL "router/mqtt-broker/bytes-heap" N:524288
```
