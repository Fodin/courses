# Задание 5.4: Compression & Caching

## 🎯 Цель

Реализовать HTTP-сжатие (gzip/brotli) и кэширование (ETag, Cache-Control, conditional requests).

## Требования

1. Покажите Accept-Encoding -> Content-Encoding: gzip/br
2. Сравните размеры: оригинал vs gzip vs brotli для JSON, HTML, CSS
3. Реализуйте ETag и conditional requests: `If-None-Match` -> 304 Not Modified
4. Покажите Cache-Control стратегии: private/public, max-age, no-cache, no-store, immutable
5. Покажите примеры Cache-Control для разных типов ресурсов (API, статика, auth)

## Чеклист

- [ ] Gzip/brotli: Accept-Encoding -> Content-Encoding + Vary: Accept-Encoding
- [ ] Таблица размеров: оригинал/gzip/brotli с процентом сжатия
- [ ] ETag flow: первый запрос -> ETag, повторный -> If-None-Match -> 304
- [ ] Cache-Control: private (API), public+immutable (хешированная статика), no-store (auth)
- [ ] 304 Not Modified не отправляет тело ответа

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: таблица сжатия показывает экономию, ETag flow демонстрирует 304, Cache-Control стратегии описаны для разных типов ресурсов.
