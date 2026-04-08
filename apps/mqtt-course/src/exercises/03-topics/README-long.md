# Уровень 3: Топики и сообщения — Развёрнутая теория

## Топик как почтовый адрес

Представьте, что вы хотите получать газеты. Вы подписываетесь на адрес «ул. Новости, д. 1» — и каждый день туда доставляют газеты. MQTT работает так же:

- **Издатель (publisher)** — тот, кто кладёт письмо в ящик
- **Подписчик (subscriber)** — тот, кто забирает письма с нужного адреса
- **Топик** — это адрес
- **Брокер** — почтальон, который всё доставляет

Ключевое отличие от HTTP: издатель **не знает** о подписчиках. Он просто публикует. Брокер сам решает, кому доставить.

## Синтаксис топиков

### Правила MQTT спецификации (v3.1.1 и v5)

Топик — это UTF-8 строка. Технические ограничения:

```
Минимальная длина: 1 символ
Максимальная длина: 65535 байт (не символов — байт!)
Разделитель уровней: /
Wildcard одного уровня: +
Wildcard многих уровней: #
Системный префикс: $ (зарезервирован)
```

📌 Запрещённые символы:
- `+` и `#` в именах при публикации
- Символ NULL (U+0000)

📌 Разрешены, но не рекомендованы:
- Пробелы (технически допустимы, создают путаницу)
- Специальные символы `!@:;,`
- Unicode символы (работают, но усложняют отладку)

### Пустой первый уровень

Топик `/home/temp` начинается с пустого уровня:

```
/home/temp  =  ["", "home", "temp"]  — три уровня
home/temp   =  ["home", "temp"]       — два уровня
```

Это работает, но создаёт пустой "корень" и запутывает wildcards. Избегайте начального `/`.

## Проектирование иерархии топиков

### Подход "от общего к частному"

Золотое правило: двигайтесь от **широкого** контекста к **конкретному** параметру.

```
{область}/{объект}/{параметр}
{место}/{тип}/{устройство}/{метрика}
```

Пример для умного дома:
```
home/
├── living_room/
│   ├── temperature          # "22.5" (°C)
│   ├── humidity             # "65" (%)
│   ├── light/
│   │   ├── state            # "ON" / "OFF"
│   │   ├── brightness       # "75" (%)
│   │   └── color            # "255,128,0" (RGB)
│   └── motion               # "detected" / "clear"
├── kitchen/
│   ├── temperature
│   └── smoke_alarm          # "normal" / "alarm"
└── bedroom/
    ├── temperature
    └── humidity
```

Это позволяет использовать wildcards:
```
home/+/temperature      # температура во всех комнатах
home/living_room/#      # ВСЁ из гостиной
home/+/light/state      # состояние света везде
```

### Подход "команды и статус"

Для управления устройствами разделяют топики команд и ответов:

```
device/{id}/cmd/set_state      # команда → устройству
device/{id}/state              # статус ← от устройства
device/{id}/error              # ошибки ← от устройства
device/{id}/heartbeat          # пинг ← от устройства
```

```
# Отправить команду
mosquitto_pub -t 'device/esp32-01/cmd/set_state' -m 'ON'

# Слушать ответ
mosquitto_sub -t 'device/esp32-01/state'
```

### Промышленный IoT (IIoT)

```
plant/
├── line1/
│   ├── robot1/
│   │   ├── status           # "running" / "idle" / "fault"
│   │   ├── speed_rpm        # "3600"
│   │   └── temp_motor       # "65.2"
│   └── conveyor/
│       ├── speed_m_min      # "0.5"
│       └── items_count      # "1024"
└── utilities/
    ├── power_kw             # "45.2"
    └── water_pressure_bar  # "3.1"
```

## Wildcards в деталях

### Wildcard `+` (plus)

`+` заменяет **ровно один уровень**. Это как маска `?` в файловых системах.

```
Подписка: home/+/temperature

Совпадения:
  home/living_room/temperature   ✅  (один уровень вместо +)
  home/kitchen/temperature       ✅
  home/bedroom/temperature       ✅

НЕ совпадения:
  home/temperature               ❌  (нет уровня вместо +)
  home/floor1/room1/temperature  ❌  (два уровня вместо одного)
  home/living_room/humidity      ❌  (другой последний сегмент)
```

Несколько `+` в одном топике:

```
+/+/temperature    # любая комната в любом доме
home/+/light/+    # свойства света в любой комнате
```

### Wildcard `#` (hash)

`#` заменяет **весь остаток пути** включая текущий уровень.

```
Подписка: home/#

Совпадения:
  home/temp                        ✅
  home/living_room/temp            ✅
  home/a/b/c/d/e/f                 ✅
  home/                            ✅  (пустой уровень после /)

НЕ совпадения:
  home                             ❌  (нет / после home)
  office/temp                      ❌  (другой корень)
```

> 📌 `#` должен быть последним символом и стоять после `/` или быть единственным символом.
> `home#` — невалидный топик подписки.

Подписка `#` (только решётка) означает ВСЕ топики, кроме `$`:
```
mosquitto_sub -t '#'   # все топики (кроме $SYS)
```

### Комбинирование

```
home/+/light/#        # всё о свете в любой комнате
+/+/cmd/#             # любые команды в любой иерархии
sensor/+/data/#       # все данные любого сенсора
```

## Системные топики $SYS

Mosquitto предоставляет встроенный мониторинг через топики `$SYS`. Брокер публикует их автоматически каждые N секунд (по умолчанию — 10).

### Брокер

```
$SYS/broker/version              # "mosquitto version 2.0.18"
$SYS/broker/uptime               # "3600 seconds"
$SYS/broker/timestamp            # время сборки
$SYS/broker/changeset            # revision из git
```

### Клиенты

```
$SYS/broker/clients/connected    # текущее кол-во подключённых
$SYS/broker/clients/disconnected # отключённых с персистентными сессиями
$SYS/broker/clients/maximum      # максимум за время работы
$SYS/broker/clients/total        # всего когда-либо подключалось
```

### Сообщения

```
$SYS/broker/messages/sent        # отправлено всего
$SYS/broker/messages/received    # получено всего
$SYS/broker/messages/dropped     # отброшено (очереди переполнены)
$SYS/broker/messages/stored      # в retained + очередях QoS1/2
$SYS/broker/publish/messages/sent
$SYS/broker/publish/messages/received
```

### Трафик в байтах

```
$SYS/broker/bytes/sent           # байт отправлено
$SYS/broker/bytes/received       # байт получено
```

### Нагрузка (скользящее среднее)

```
$SYS/broker/load/connections/1min   # подключений/мин за последнюю минуту
$SYS/broker/load/connections/5min
$SYS/broker/load/connections/15min
$SYS/broker/load/messages/sent/1min
$SYS/broker/load/messages/sent/5min
$SYS/broker/load/messages/sent/15min
$SYS/broker/load/messages/received/1min
$SYS/broker/load/bytes/sent/1min
$SYS/broker/load/bytes/received/1min
```

### Persistence (если включена)

```
$SYS/broker/store/messages/count    # сохранённых сообщений
$SYS/broker/store/messages/bytes    # байт в хранилище
```

### Подписки

```
$SYS/broker/subscriptions/count    # активных подписок
```

### Как читать $SYS топики

```bash
# Один топик
mosquitto_sub -t '$SYS/broker/clients/connected'

# Все системные топики
mosquitto_sub -t '$SYS/#'

# Мониторинг в реальном времени
mosquitto_sub -t '$SYS/broker/load/#' -v
```

> ⚠️ В shell нужны одинарные кавычки вокруг топиков с `$`, иначе shell раскроет переменную:
> `$SYS` → пустая строка → подписка на `/broker/clients`

### Отключение $SYS топиков

Если не нужны или нужно скрыть от клиентов:

```
# mosquitto.conf
sys_interval 0   # 0 = отключить публикацию $SYS
```

## Важные различия MQTT v3.1.1 vs v5

В MQTT v5 добавлены **Topic Aliases** — клиент может заменить длинный топик коротким числовым псевдонимом для экономии трафика:

```
# Клиент говорит брокеру: топик "home/living_room/temperature" = alias 1
# Дальше публикует просто с alias=1 вместо полного имени
```

На OpenWRT с Mosquitto 2.x это поддерживается, но клиентская библиотека должна уметь это использовать.

## Производительность топиков на OpenWRT

На роутере с 32-64 МБ RAM важно:

1. **Избегайте глубоких иерархий** (>6 уровней) — каждый уровень увеличивает время парсинга
2. **Не используйте wildcards без нужды** — `#` требует обхода всего дерева подписок
3. **Короткие имена сегментов** — экономят память и трафик

```
# Плохо для встраиваемых систем
building/floor01/room007/sensor/temperature/celsius/current

# Хорошо
b1/f1/r7/t   # если структура задокументирована
```

## ⚠️ Частые ошибки

❌ **Wildcard при публикации:**
```bash
mosquitto_pub -t 'home/+/temp' -m '22'
# Ошибка! + и # нельзя использовать в топике при публикации
```
✅ Публикуйте в конкретные топики.

❌ **Забыли кавычки для $SYS в bash:**
```bash
mosquitto_sub -t $SYS/broker/uptime   # shell раскроет $SYS в пустую строку!
```
✅ Всегда одинарные кавычки: `'$SYS/broker/uptime'`

❌ **Регистр топика:**
```
home/Temperature  ≠  home/temperature  ≠  HOME/TEMPERATURE
```
✅ Договоритесь о единой конвенции — и следуйте ей.

❌ **Подписка на `#` для мониторинга** — нормально для отладки, катастрофа в продакшене с тысячами сообщений в секунду.

❌ **Топик с пробелами:**
```
home/ living room/temp   # пробел в имени — не ошибка протокола, но ад при отладке
```
✅ Используйте `_` или `-`: `home/living_room/temp`
