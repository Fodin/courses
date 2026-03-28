---
name: Docker course progress
description: Курс docker-course: все 13 уровней (0-12) готовы, 45 заданий
type: project
---

Курс docker-course содержит 13 уровней (00-intro через 12-cicd). Все уровни завершены.

Готовые уровни:
- Уровень 0 (00-intro) -- "Введение в Docker" -- 2 задания
- Уровень 1 (01-images) -- "Образы" -- 4 задания
- Уровень 2 (02-containers) -- "Контейнеры" -- 4 задания
- Уровень 3 (03-dockerfile) -- "Dockerfile" -- 4 задания
- Уровень 4 (04-volumes) -- "Тома и данные" -- 3 задания
- Уровень 5 (05-networking) -- "Сеть" -- 4 задания
- Уровень 6 (06-compose-basics) -- "Compose -- основы" -- 4 задания
- Уровень 7 (07-compose-advanced) -- "Compose -- продвинутое" -- 4 задания
- Уровень 8 (08-env-config) -- "Переменные и конфигурация" -- 3 задания
- Уровень 9 (09-logging) -- "Логирование и отладка" -- 3 задания
- Уровень 10 (10-optimization) -- "Оптимизация Docker-образов" -- 4 задания
- Уровень 11 (11-security) -- "Безопасность Docker" -- 3 задания
- Уровень 12 (12-cicd) -- "CI/CD с Docker" -- 3 задания (2026-03-28)

Уровень 12 содержит:
- README.md -- теория (~1300 строк): основы CI/CD, стадии пайплайна, Docker в CI (сборка, кэширование слоёв), GitHub Actions (workflow, matrix builds, тестирование с compose), GitLab CI (DinD, Kaniko), Container Registries (GHCR, ECR, ACR, GCR, Harbor), стратегии тегирования (semver, sha, branch, timestamp), тестирование с Docker Compose, деплой-стратегии (rolling update, blue-green, canary), production docker-compose, health checks (liveness/readiness/startup), Docker Swarm, мониторинг (Prometheus+Grafana+cAdvisor), автоматический rollback
- Solution.tsx -- 3 интерактивных компонента: CI Pipeline (анимация стадий, кэширование, matrix), Registry+теги (таблица registries, симулятор тегов, metadata-action), деплой+мониторинг (стратегии с диаграммами, симулятор health check, метрики)
- 3 task descriptions (task-12.1.md - task-12.3.md)
- 3 student stubs (Task12_1.tsx - Task12_3.tsx)

Курс полностью завершён.

**Why:** Курс создавался последовательно, уровень за уровнем.
**How to apply:** Курс завершён, все 13 уровней (45 заданий) готовы.
