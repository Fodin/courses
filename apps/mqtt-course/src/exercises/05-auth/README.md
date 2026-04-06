# Уровень 5: Аутентификация

## Зачем нужна аутентификация?

По умолчанию Mosquitto принимает подключения от **любого** клиента без проверки. На внутренней сети это ещё терпимо, но даже там:

- Сосед по сети может подписаться на `#` и читать все ваши данные
- Любой может опубликовать в `device/relay/cmd` = `ON` и включить что угодно

Аутентификация в Mosquitto — трёхуровневая: password file → ACL → плагины.

## Password File

Самый простой способ — файл паролей. Пароли хранятся в хешированном виде.

```bash
# Создать пользователя (запросит пароль)
mosquitto_passwd -c /etc/mosquitto/passwd admin
mosquitto_passwd /etc/mosquitto/passwd sensor1

# Добавить с явным паролем (-b = batch mode)
mosquitto_passwd -b /etc/mosquitto/passwd sensor2 s3cr3t

# Удалить пользователя
mosquitto_passwd -D /etc/mosquitto/passwd sensor1
```

Содержимое файла (пароли хешируются SHA512+соль):
```
admin:$7$101$...хеш...
sensor1:$7$101$...хеш...
```

Подключить в `mosquitto.conf`:
```
allow_anonymous false
password_file /etc/mosquitto/passwd
```

📌 После изменения файла брокер нужно перечитать конфиг или перезапустить:
```bash
kill -HUP $(pidof mosquitto)   # или
mosquitto reload                # Mosquitto 2.x
```

## ACL — Access Control Lists

ACL контролирует **что** могут делать пользователи после авторизации. Формат файла:

```
# Глобальные правила (для всех аутентифицированных)
topic read $SYS/#

# Правила для конкретного пользователя
user admin
topic readwrite #

user sensor1
topic write home/sensor1/#
topic read home/sensor1/cmd/#

user dashboard
topic read home/#
topic read $SYS/#
```

Ключевые слова:
- `read` — только чтение (subscribe)
- `write` — только запись (publish)
- `readwrite` — чтение и запись
- `deny` — явный запрет

Подключить в `mosquitto.conf`:
```
acl_file /etc/mosquitto/acl
```

⚠️ По умолчанию если ACL файл задан — доступ к топику без явного разрешения **запрещён**.

## Плагины аутентификации

Для динамической авторизации (пользователи в базе данных, Redis, JWT) используются плагины.

В Mosquitto 2.x встроен механизм `auth_plugin`:

```
# mosquitto.conf (Mosquitto 2.x)
plugin /usr/lib/mosquitto_dynamic_security.so
plugin_opt_config_file /etc/mosquitto/dynamic-security.json
```

Популярные плагины:
- **mosquitto-go-auth** — поддержка PostgreSQL, MySQL, Redis, JWT, HTTP
- **Dynamic Security Plugin** — встроен в Mosquitto 2.x, управление через MQTT

На OpenWRT из-за ограничений RAM и flash предпочтительны:
1. Файл паролей + ACL (минимальные ресурсы)
2. Dynamic Security Plugin (встроен, не требует внешних зависимостей)

## ⚠️ Частые ошибки

❌ **allow_anonymous true с password_file** — если не указать `allow_anonymous false`, анонимные клиенты всё равно подключатся.

❌ **ACL без пользователя применяется ко всем** — строка `topic read $SYS/#` без предшествующего `user` — глобальное правило.

❌ **Права в ACL — избыточные** — `user sensor1` + `topic readwrite #` даёт этому сенсору доступ ко всему брокеру.

❌ **Пароли в открытом виде в конфиге** — никогда не указывайте пароль в `mosquitto.conf`. Только через `mosquitto_passwd`.
