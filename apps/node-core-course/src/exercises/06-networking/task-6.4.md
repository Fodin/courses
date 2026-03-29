# Задание 6.4: HTTPS/TLS

## Цель

Понять TLS/SSL шифрование в Node.js: создание HTTPS серверов, TLS сокетов, процесс handshake и best practices безопасности.

## Требования

1. Покажите генерацию самоподписанного сертификата через OpenSSL
2. Продемонстрируйте создание HTTPS сервера с `key` и `cert`
3. Покажите TLS сервер через `tls.createServer()` с информацией о соединении
4. Продемонстрируйте TLS клиент через `tls.connect()`
5. Симулируйте TLS Handshake по шагам
6. Покажите security best practices и типичные ошибки

## Чеклист

- [ ] Генерация сертификата через OpenSSL показана
- [ ] HTTPS сервер с key/cert создан
- [ ] TLS сервер с getProtocol/getCipher показан
- [ ] TLS клиент продемонстрирован
- [ ] TLS Handshake симулирован по шагам
- [ ] Security best practices перечислены

## Как проверить себя

1. Нажмите "Запустить" и изучите TLS Handshake
2. Убедитесь, что все 7 шагов handshake показаны
3. Проверьте, что информация о соединении (protocol, cipher, certificate) присутствует
4. Убедитесь, что упомянуто: minVersion TLS 1.2, не отключать rejectUnauthorized, Let's Encrypt
