# Задание 12.1: Helmet & Security Headers

## 🎯 Цель

Освоить защиту API через HTTP-заголовки: настройка Helmet, Content Security Policy, HSTS, X-Frame-Options.

## Требования

1. Подключите Helmet с настройками по умолчанию (11 заголовков)
2. Настройте CSP: разрешённые источники для скриптов, стилей, изображений, подключений
3. Настройте HSTS: maxAge 1 год, includeSubDomains, preload
4. Покажите CSP report-only режим для тестирования без блокировки
5. Создайте endpoint для сбора CSP violation reports

## Чеклист

- [ ] Helmet установлен и возвращает security headers
- [ ] CSP настроен с whitelist источников для каждого типа ресурсов
- [ ] HSTS принудительно переключает на HTTPS
- [ ] Report-only режим логирует нарушения CSP
- [ ] Violation reports собираются на отдельном endpoint

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: Helmet устанавливает заголовки, CSP блокирует неразрешённые ресурсы, report-only логирует нарушения.
