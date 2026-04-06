# Уровень 5: Аутентификация — Развёрнутая теория

## Модель безопасности MQTT

MQTT сам по себе не предоставляет шифрования (это задача TLS/SSL). Но протокол поддерживает поля `username` и `password` в CONNECT пакете. Mosquitto использует их для аутентификации.

Уровни защиты (от простого к сложному):

```
1. allow_anonymous false     — требовать логин/пароль
2. password_file             — проверить пароль в файле
3. acl_file                  — ограничить доступ к топикам
4. TLS                       — шифровать соединение (уровень 6)
5. mTLS                      — взаимная аутентификация сертификатами (уровень 6)
```

## Файл паролей: детали

### Формат хранения

Mosquitto 2.x использует **PBKDF2-SHA512** для хеширования паролей:

```
username:$7$iterations$salt$hash
```

Пример реальной записи:
```
admin:$7$101$5qOkbrpSgepR1Tld$...длинный_хеш...
```

`$7` — версия алгоритма (bcrypt-совместимый формат Mosquitto)
`101` — число итераций (умолчание в Mosquitto 2.x)

Старый формат (Mosquitto 1.x):
```
username:$6$salt$sha512_hash
```

### Работа с mosquitto_passwd

```bash
# Создать НОВЫЙ файл и добавить пользователя
# -c = create (перезапишет существующий!)
mosquitto_passwd -c /etc/mosquitto/passwd admin

# Добавить пользователя в существующий файл
mosquitto_passwd /etc/mosquitto/passwd sensor1

# Пакетный режим (-b = batch, пароль как аргумент)
# ОСТОРОЖНО: пароль виден в истории shell
mosquitto_passwd -b /etc/mosquitto/passwd sensor2 mypassword

# Удалить пользователя
mosquitto_passwd -D /etc/mosquitto/passwd sensor1

# Обновить пароль (просто добавить ещё раз — перезапишет)
mosquitto_passwd /etc/mosquitto/passwd admin
```

### Применение изменений без перезапуска

```bash
# Отправить SIGHUP процессу — перечитает конфиг и файлы auth
kill -HUP $(cat /var/run/mosquitto.pid)
# или
kill -HUP $(pgrep mosquitto)

# На OpenWRT через init.d:
/etc/init.d/mosquitto reload
```

### Настройка в mosquitto.conf

```
# Запретить анонимный доступ
allow_anonymous false

# Файл паролей
password_file /etc/mosquitto/passwd

# Опционально: разрешить анонимам только чтение $SYS
# (опасно — не используйте на продакшене)
# allow_anonymous true
# password_file /etc/mosquitto/passwd
```

📌 Порядок проверки: если `allow_anonymous false` и клиент не предоставил credentials — отклоняется ДО проверки ACL.

## ACL: подробный формат

### Синтаксис файла

ACL файл обрабатывается сверху вниз. Первое совпадающее правило применяется.

```
# Это комментарий

# === Глобальные правила (для всех клиентов, включая анонимных) ===
topic read $SYS/#                    # все могут читать статистику

# === Правила для конкретного пользователя ===
user admin
topic readwrite #                    # полный доступ ко всем топикам

user sensor_kitchen
topic write home/kitchen/#           # может только писать в свою зону
topic read home/kitchen/cmd/#        # может читать команды

user dashboard
topic read home/#                    # только чтение всего дома
topic read $SYS/broker/clients/#    # мониторинг клиентов

# === Правила для паттернов (с подстановкой ID клиента) ===
pattern write sensor/%c/data         # клиент может писать только в свой топик
# %c = client_id, %u = username
```

### Специальные переменные в pattern

```
%c — client_id (идентификатор клиента)
%u — username (имя пользователя)
```

Пример с `pattern`:
```
# Сенсор с client_id="esp32-kitchen" может публиковать только в esp32-kitchen/#
pattern write sensor/%c/+
```

Если клиент `esp32-kitchen` публикует в `sensor/esp32-kitchen/temp` → разрешено.
Если тот же клиент публикует в `sensor/esp32-living/temp` → запрещено.

### Иерархия правил

1. `allow_anonymous false` → анонимы отклоняются без ACL проверки
2. `user X` → следующие `topic` правила применяются к пользователю X
3. `pattern` → применяется ко всем пользователям с подстановкой
4. `topic` без предшествующего `user` → глобальные правила
5. Нет совпадений → доступ **запрещён**

```
# ВАЖНО: нет правила = запрещено
# Нужно явно разрешить каждый нужный топик
```

### Полный пример для умного дома

```
# /etc/mosquitto/acl

# Анонимы могут читать только статистику (если allow_anonymous true)
topic read $SYS/#

# Администратор — полный доступ
user admin
topic readwrite #

# Датчики — только запись своей зоны, чтение команд
user sensor_kitchen
topic write home/kitchen/sensor/#
topic read home/kitchen/cmd

user sensor_living
topic write home/living/sensor/#
topic read home/living/cmd

# Дашборд — только чтение всего
user dashboard
topic read home/#
topic read $SYS/broker/clients/connected
topic read $SYS/broker/messages/sent

# Контроллер автоматизации — читает всё, пишет команды
user automation
topic read home/#
topic write home/+/cmd
topic write device/+/cmd

# Мост (bridge-подключение) — полный доступ
user bridge_slave
topic readwrite #

# Паттерн: каждый клиент только в своё пространство
# client_id должен совпадать с именем устройства
pattern write devices/%c/#
pattern read devices/%c/cmd/#
```

## Dynamic Security Plugin (Mosquitto 2.x)

Встроенный плагин для динамического управления пользователями и ACL через MQTT без перезапуска.

### Инициализация

```bash
# Создать начальную конфигурацию
mosquitto_ctrl dynsec init /etc/mosquitto/dynamic-security.json admin admin_password

# Запустить с плагином
# В mosquitto.conf:
plugin /usr/lib/mosquitto_dynamic_security.so
plugin_opt_config_file /etc/mosquitto/dynamic-security.json
```

### Управление через MQTT топики

```bash
# Создать роль
mosquitto_ctrl dynsec createRole sensors
mosquitto_ctrl dynsec addRoleACL sensors publishClientSend "sensor/+/data" allow
mosquitto_ctrl dynsec addRoleACL sensors subscribeLiteral "sensor/+/cmd" allow

# Создать пользователя и назначить роль
mosquitto_ctrl dynsec createClient esp32_01 -p mypassword
mosquitto_ctrl dynsec addClientRole esp32_01 sensors
```

Или через MQTT напрямую:
```bash
# Все операции управления через топик $CONTROL/dynamic-security/v1
mosquitto_pub -t '$CONTROL/dynamic-security/v1' \
  -m '{"commands":[{"command":"createClient","username":"esp32_01","password":"pass"}]}'
```

### Концепция ролей

Dynamic Security вводит **роли** (roles) — наборы правил ACL:

```
Роль "sensors" → может write sensor/+/data, read sensor/+/cmd
Роль "dashboard" → может read home/#, read $SYS/#

Пользователь esp32_01 → роль "sensors"
Пользователь grafana → роль "dashboard"
```

Это позволяет менять права сотен устройств изменением одной роли.

## mosquitto-go-auth: внешние бэкенды

Популярный сторонний плагин для аутентификации через внешние системы.

### Поддерживаемые бэкенды

| Бэкенд | Описание |
|---|---|
| files | Файлы (аналог встроенного) |
| postgres | PostgreSQL |
| mysql | MySQL/MariaDB |
| sqlite3 | SQLite |
| redis | Redis |
| http | HTTP API (любой сервис) |
| jwt | JSON Web Tokens |
| grpc | gRPC сервис |

### Пример: HTTP аутентификация

```
# mosquitto.conf
plugin /usr/lib/mosquitto_go_auth.so
plugin_opt_backends http
plugin_opt_http_host localhost
plugin_opt_http_port 8080
plugin_opt_http_getuser_uri /auth/user
plugin_opt_http_aclcheck_uri /auth/acl
```

При подключении клиента Mosquitto делает POST-запрос к вашему HTTP API:
```
POST /auth/user
{"username": "sensor1", "password": "mypass"}
→ 200 OK (разрешить) / 403 (запретить)
```

### На OpenWRT: практические ограничения

- mosquitto-go-auth требует glibc или musl с поддержкой CGO
- OpenWRT использует musl, бинарники часто несовместимы
- Рекомендация: для OpenWRT использовать встроенный Dynamic Security Plugin или файлы

## Хранение паролей на OpenWRT

Flash на OpenWRT ограничена и может стираться при сбросе. Рекомендуется:

```bash
# Хранить auth файлы на overlay (сохраняются при обновлениях):
/etc/mosquitto/passwd      # ✅ persistent overlay
/etc/mosquitto/acl         # ✅ persistent overlay

# НЕ хранить в /tmp/ — очищается при перезагрузке
/tmp/mosquitto/passwd      # ❌ потеряется при reboot
```

Настройка overlay на OpenWRT:
```bash
# /etc/mosquitto/mosquitto.conf
password_file /etc/mosquitto/passwd
acl_file /etc/mosquitto/acl

# Создать файлы при первом запуске через init script
```

## ⚠️ Частые ошибки

❌ **allow_anonymous true + password_file:**
```
allow_anonymous true          # анонимы проходят!
password_file /etc/passwd     # только дополнительно проверяет авторизованных
```
✅ Всегда `allow_anonymous false` если используете аутентификацию.

❌ **ACL файл задан, но пустой:**
```
acl_file /etc/mosquitto/acl   # файл существует, но пуст
# Результат: НИКТО не может обратиться ни к одному топику!
```
✅ При пустом ACL файле все топики запрещены. Добавьте хотя бы:
```
user admin
topic readwrite #
```

❌ **Забыли обновить брокер после изменения passwd:**
```bash
# Добавили пользователя, подключаетесь — "Authentication failed"
mosquitto_passwd /etc/mosquitto/passwd newuser
# Нужно: kill -HUP или reload!
```

❌ **Слишком широкие права в ACL:**
```
user sensor1
topic readwrite #    # этот сенсор теперь может всё!
```
✅ Принцип минимальных привилегий: разрешайте только необходимые топики.

❌ **Пароль в аргументе команды (остаётся в истории shell):**
```bash
mosquitto_passwd -b /etc/mosquitto/passwd user password123
history | grep password123    # пароль виден!
```
✅ Используйте интерактивный режим без `-b`, или очищайте историю.
