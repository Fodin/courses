# Уровень 1: Установка Mosquitto на OpenWRT

## OpenWRT и пакетный менеджер opkg

OpenWRT — это Linux-дистрибутив для маршрутизаторов. Вместо apt/yum здесь используется **opkg** (Open Package Manager). Пакеты хранятся в онлайн-репозиториях и скачиваются напрямую на устройство.

```bash
# Обязательно перед установкой любых пакетов:
opkg update
```

💡 Список пакетов кэшируется в `/var/opkg-lists/`. После перезагрузки роутера кэш стирается (tmpfs), поэтому `opkg update` нужно повторять.

---

## Доступные пакеты Mosquitto

OpenWRT предлагает два варианта:

| Пакет | TLS | Размер | Когда использовать |
|-------|-----|--------|-------------------|
| `mosquitto-nossl` | ❌ | ~100 КБ | Изолированная LAN, нет внешних подключений |
| `mosquitto` (full) | ✅ | ~300 КБ | Внешние клиенты, требуется шифрование |
| `mosquitto-client-nossl` | ❌ | ~80 КБ | CLI-утилиты (pub/sub) без TLS |
| `mosquitto-client` | ✅ | ~100 КБ | CLI-утилиты с TLS |

Для начала — устанавливаем `mosquitto-nossl`. Если потребуется TLS, переустанавливаем на полную версию.

```bash
opkg update
opkg install mosquitto-nossl
opkg install mosquitto-client-nossl
```

---

## Управление сервисом

OpenWRT использует **init.d** для управления сервисами:

```bash
/etc/init.d/mosquitto enable   # автозапуск при загрузке
/etc/init.d/mosquitto start    # запустить сейчас
/etc/init.d/mosquitto stop     # остановить
/etc/init.d/mosquitto restart  # перезапустить
/etc/init.d/mosquitto status   # проверить статус
```

📌 `enable` только добавляет симлинк в `/etc/rc.d/` — не запускает сервис немедленно. После `enable` нужен отдельный `start`.

---

## Структура файлов Mosquitto

```
/etc/mosquitto/
├── mosquitto.conf    ← главный конфиг (редактируем)
├── passwd            ← база паролей (создаётся mosquitto_passwd)
└── acl               ← права доступа (создаём вручную)

/usr/sbin/mosquitto   ← исполняемый файл брокера

/usr/bin/
├── mosquitto_pub     ← публикация сообщений
└── mosquitto_sub     ← подписка на топики

/var/run/mosquitto.pid  ← PID процесса
/var/lib/mosquitto/     ← данные persistence (если включён)
```

---

## Проверка после установки

```bash
# 1. Статус процесса
ps | grep mosquitto

# 2. Слушает ли порт 1883?
netstat -tlnp | grep 1883

# 3. Тест pub/sub (два терминала)
mosquitto_sub -h 127.0.0.1 -t "test/#" -v &
mosquitto_pub -h 127.0.0.1 -t "test/hello" -m "OK"
# Ожидаемый вывод: test/hello OK
```

---

## Особенности OpenWRT

⚠️ **Flash-память ограничена.** На большинстве роутеров flash 4–16 МБ. Mosquitto с зависимостями занимает ~300 КБ, но файлы конфигурации и logs не должны бесконтрольно расти.

⚠️ **Логи пишутся в syslog.** По умолчанию `log_dest syslog` — читать через `logread | grep mosquitto`. Файл в `/tmp` (tmpfs) — безопаснее для flash.

⚠️ **Persistence по умолчанию отключён.** Retained messages теряются при перезагрузке. Если нужен persistence — используй `/tmp` (RAM) или внешний USB-диск.

---

## ⚠️ Частые ошибки

**❌ Забыть opkg update**
```bash
opkg install mosquitto-nossl
# Unknown package 'mosquitto-nossl'
```
✅ Всегда запускай `opkg update` перед установкой.

**❌ Перепутать nossl и полную версию**
```bash
# После установки полной версии пытаться указать TLS в nossl-конфиге
cafile /etc/mosquitto/ca.crt  # ОШИБКА: nossl версия не поддерживает TLS
```
✅ Проверяй версию: `mosquitto --version | grep 'SSL'`.
