# Задание 10.1: $SYS топики брокера

## Цель

Изучить встроенную систему метрик Mosquitto через $SYS-топики и научиться получать данные о состоянии брокера в реальном времени.

## Требования

1. Подписаться на все $SYS-топики командой `mosquitto_sub -t '$SYS/#' -v`
2. Найти и записать текущие значения 6 ключевых метрик: connected, messages/received, heap/current, uptime, subscriptions/count, retained/count
3. Убедиться, что пользователь `monitor` имеет право читать `$SYS/#` через ACL
4. Настроить `sys_interval 30` в mosquitto.conf (снизить частоту публикации)
5. Написать команду, которая получает ровно одно значение конкретного топика и выходит

## Чеклист

- [ ] Команда `mosquitto_sub -t '$SYS/#' -v` выдаёт метрики
- [ ] В ACL прописано `topic read $SYS/#` для пользователя monitor
- [ ] `sys_interval 30` установлен в mosquitto.conf
- [ ] Команда `mosquitto_sub -t '$SYS/broker/clients/connected' -C 1 -W 5` работает
- [ ] Записаны значения всех 6 метрик

## Как проверить себя

```bash
# 1. Получить количество подключённых клиентов:
mosquitto_sub -h localhost -u monitor -P monpass \
  -t '$SYS/broker/clients/connected' -C 1 -W 5

# 2. Получить все метрики разом:
mosquitto_sub -h localhost -u monitor -P monpass \
  -t '$SYS/#' -v -W 15

# 3. Отфильтровать только heap-метрики:
mosquitto_sub -h localhost -u monitor -P monpass \
  -t '$SYS/broker/heap/#' -v -W 10

# 4. Проверить sys_interval:
grep sys_interval /etc/mosquitto/mosquitto.conf
```

Ожидаемый вывод:
```
$SYS/broker/clients/connected 3
$SYS/broker/messages/received 1247
$SYS/broker/heap/current 524288
$SYS/broker/uptime 3600 seconds
$SYS/broker/subscriptions/count 12
$SYS/broker/messages/retained/count 45
```
