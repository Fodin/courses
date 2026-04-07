# Уровень 3: Топики и сообщения

## Что такое топик?

Топик в MQTT — это строка-адрес, по которому публикуются и принимаются сообщения. Представьте почтовый ящик: отправитель пишет адрес на конверте, почта доставляет всем, кто подписан на этот адрес.

Топик — это **не очередь** и не хранилище. Это просто маршрут.

```
home/living_room/temperature  →  "22.5"
home/kitchen/humidity         →  "65"
factory/line1/sensor3/rpm     →  "3600"
```

## Иерархия топиков

Топики строятся как дерево через `/`. Каждый сегмент — уровень иерархии:

```
home/
├── living_room/
│   ├── temperature
│   ├── humidity
│   └── light/state
├── kitchen/
│   ├── temperature
│   └── smoke_alarm
└── bedroom/
    └── temperature
```

📌 Правила именования:
- Разделитель — `/`
- Максимум 65535 байт в имени топика
- Не начинайте с `/` без необходимости (создаёт пустой первый уровень)
- Чувствительность к регистру: `Home/Temp` ≠ `home/temp`
- Нельзя использовать `#` и `+` в именах топиков при публикации

## Wildcards: + и #

Wildcards используются **только при подписке**, никогда при публикации.

### Одноуровневый wildcard: `+`

Заменяет ровно **один** уровень топика:

```
home/+/temperature    →  home/living_room/temperature ✅
                          home/kitchen/temperature     ✅
                          home/bedroom/temp            ❌ (другой последний сегмент)
                          home/floor1/room1/temp       ❌ (два уровня вместо одного)
```

### Многоуровневый wildcard: `#`

Заменяет **любое количество** уровней от текущей позиции до конца. Всегда стоит последним:

```
home/#           →  home/living_room/temperature  ✅
                    home/kitchen/humidity          ✅
                    home/a/b/c/d/e                ✅
                    office/temp                   ❌ (другой корень)

home/+/light/#   →  home/living_room/light/state  ✅
                    home/kitchen/light/brightness  ✅
                    home/kitchen/light/rgb/r       ✅
```

## Системные топики $SYS

Mosquitto публикует статистику брокера в зарезервированных топиках `$SYS`:

```
$SYS/broker/uptime                    →  "3600 seconds"
$SYS/broker/clients/connected         →  "42"
$SYS/broker/messages/sent            →  "100500"
$SYS/broker/load/messages/sent/1min  →  "15.23"
```

> ⚠️ Топики начинающиеся с `$` невидимы для подписки `#` с корня.
> `#` не покрывает `$SYS/#` — это намеренная защита от утечки системных данных.

Настройка интервала обновления в `mosquitto.conf`:
```
sys_interval 10   # обновлять каждые 10 секунд (0 = отключить)
```

## Лучшие практики именования

| Контекст | Хорошо | Плохо |
|---|---|---|
| IoT дом | `home/room/device/metric` | `home_room_device` |
| Промышленность | `plant/line/machine/param` | `data` |
| Команды | `device/id/cmd/action` | `device/cmd` |
| Статус | `device/id/status` | `status/device/id` |

💡 Включайте ID устройства, чтобы можно было использовать `+`:
```
sensor/+/temperature   # все температурные датчики
sensor/esp32-01/+      # все метрики одного устройства
```

## ⚠️ Частые ошибки новичков

❌ **Подписка на `#` для всего:**
```
mosquitto_sub -t '#'   # получит ВСЁ, перегрузит клиент
```
✅ Используйте конкретные префиксы: `home/#`, `sensor/#`

❌ **Пустой топик или пробелы:**
```
publish " home/temp"   # пробел в начале — ошибка
```

❌ **Wildcard при публикации:**
```
mosquitto_pub -t 'home/+/temp' -m '22'   # ошибка! + только для подписки
```
