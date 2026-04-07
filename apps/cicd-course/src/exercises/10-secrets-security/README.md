# Уровень 10: Secrets и Security в CI/CD

## Почему секреты — это самое опасное место в пайплайне

Представь, что ты строишь завод. Конвейер (пайплайн) отлично виден всем рабочим: какие детали куда едут, в каком порядке. Но есть сейф с мастер-ключами от всех дверей. Если кто-то напишет пин-код на стене конвейера — завод взломают. В CI/CD роль этого сейфа играет система управления секретами.

Типичная катастрофа выглядит так:

```yaml
# ❌ НИКОГДА ТАК НЕ ДЕЛАТЬ
deploy:
  script:
    - export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
    - export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    - aws s3 cp dist/ s3://my-bucket/
```

Этот YAML попадает в git-историю навсегда. Даже если ты удалишь коммит — в форках, зеркалах, клонах он останется. Боты сканируют GitHub/GitLab публичные репозитории в реальном времени и подбирают ключи за минуты.

---

## CI/CD Variables: встроенное хранилище секретов

GitLab CI имеет встроенный менеджер переменных. Секреты хранятся зашифрованно в БД GitLab и подставляются в джоб в момент его запуска.

```mermaid
graph LR
    A[GitLab Variables Store\nзашифровано] -->|inject at runtime| B[Job Runner\nenv variables]
    B -->|использует| C[deploy script\naws s3 cp ...]
    D[git repository\n.gitlab-ci.yml] -->|НЕТ секретов| B
```

### Типы переменных

**Variable** (строковая переменная) — самый распространённый тип:

```yaml
# В .gitlab-ci.yml можно ссылаться на переменную
deploy:
  script:
    - aws s3 cp dist/ s3://$S3_BUCKET/
    - echo "Deploying to $ENVIRONMENT"
```

Переменная `S3_BUCKET` определена в Settings → CI/CD → Variables, а не в YAML.

**File** — тип для многострочных секретов (certificates, kubeconfig, SSH keys):

```yaml
deploy-k8s:
  script:
    # GitLab сохраняет содержимое переменной во временный файл
    # и передаёт путь к нему через $KUBECONFIG
    - kubectl --kubeconfig=$KUBECONFIG get pods
    - kubectl --kubeconfig=$KUBECONFIG apply -f k8s/
```

📌 Разница: `Variable` = строка в окружении (`$TOKEN="abc123"`), `File` = путь к временному файлу (`$KUBECONFIG="/tmp/gitlab-runner-kubeconfig123"`).

### Masked и Protected

**Masked** — переменная маскируется в логах джоба:

```
# Без masked:
$ curl -H "Authorization: Bearer ghp_secrettoken123" https://api.github.com
curl -H "Authorization: Bearer ghp_secrettoken123" ...
                                   ^^^^^^^^^^^^^^^^ видно в логах!

# С masked:
$ curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com
curl -H "Authorization: Bearer [MASKED]" ...
```

⚠️ Ограничение: masked работает только если значение не разбивается на несколько строк и не содержит пробелов/спецсимволов. Для сложных значений (multiline certificates) masked не работает — используй `File` тип.

**Protected** — переменная доступна только в джобах на защищённых ветках и тегах:

```mermaid
graph LR
    A[feature/my-feature\nне protected] -->|пайплайн| B[Job: deploy]
    B -->|нет доступа| C[PROD_DB_PASSWORD\nprotected variable]
    D[main\nprotected branch] -->|пайплайн| E[Job: deploy]
    E -->|есть доступ| C
```

📌 Логика: dev-ветки могут тестировать код, но не должны иметь доступ к продакшн-секретам. Protected переменные гарантируют это на уровне платформы.

### Scope переменных

В GitLab есть три уровня хранения переменных:

```
Instance Level (gitlab.com admin)
├── Group Level (my-org/)
│   ├── Subgroup Level (my-org/backend/)
│   │   └── Project Level (my-org/backend/api-service)
```

```yaml
# Переменная на уровне группы — доступна всем проектам группы
# DOCKER_REGISTRY=registry.my-org.com  (group variable)

# Переменная на уровне проекта — только для этого проекта
# DATABASE_URL=postgres://...  (project variable)

# В .gitlab-ci.yml одинаково обращаемся:
build:
  script:
    - docker login $DOCKER_REGISTRY    # из group vars
    - psql $DATABASE_URL -c "..."       # из project vars
```

Переменная проекта с тем же именем **переопределяет** переменную группы — это позволяет делать дефолты на уровне группы и оверрайды на уровне проекта.

---

## Environment-specific переменные

Переменные можно привязывать к конкретному окружению:

```yaml
deploy-staging:
  environment:
    name: staging
  script:
    - echo "DB: $DATABASE_URL"  # получит staging-значение

deploy-production:
  environment:
    name: production
  script:
    - echo "DB: $DATABASE_URL"  # получит production-значение
```

В настройках: одна переменная `DATABASE_URL` с двумя значениями — для `staging` и `production` окружений. GitLab подставит нужное в зависимости от `environment:name`.

---

## HashiCorp Vault: профессиональное управление секретами

Встроенные переменные GitLab хороши для небольших команд. Но когда у вас 50+ микросервисов, 3 облака и compliance-требования, нужен выделенный секрет-менеджер.

**Vault** — это централизованное хранилище секретов с:
- динамическими секретами (временные credentials, которые живут N минут)
- аудитом всех обращений (кто, когда, какой секрет)
- fine-grained политиками доступа
- автоматической ротацией секретов

```mermaid
graph LR
    A[GitLab CI Job] -->|1 запрашивает JWT токен| B[GitLab OIDC]
    B -->|2 выдаёт JWT| A
    A -->|3 обменивает JWT на Vault token| C[HashiCorp Vault]
    C -->|4 проверяет политику| D[Vault Policy\nci-deploy-policy]
    D -->|5 разрешает| C
    C -->|6 выдаёт секрет| A
    A -->|использует| E[AWS / DB / API]
```

### JWT/OIDC аутентификация

Старый способ (хранить VAULT_TOKEN в GitLab переменной) создаёт проблему курицы и яйца: для доступа к секретам нужен секрет. JWT-аутентификация решает это:

```yaml
# .gitlab-ci.yml
deploy:
  image: vault:latest
  id_tokens:
    VAULT_ID_TOKEN:
      aud: https://vault.my-company.com   # audience
  script:
    # GitLab автоматически создаёт JWT токен в $VAULT_ID_TOKEN
    # Vault проверяет подпись токена через GitLab OIDC endpoint
    - |
      export VAULT_TOKEN=$(vault write -field=token auth/jwt/login \
        role="gitlab-deploy" \
        jwt="$VAULT_ID_TOKEN")
    - export DB_PASSWORD=$(vault kv get -field=password secret/myapp/db)
    - ./deploy.sh
```

### Динамические секреты — killer feature Vault

```yaml
deploy:
  id_tokens:
    VAULT_ID_TOKEN:
      aud: https://vault.my-company.com
  script:
    # Vault создаёт временного AWS пользователя с минимальными правами
    # Credentials живут 1 час и автоматически удаляются
    - |
      CREDS=$(vault write aws/creds/deploy-role ttl=1h)
      export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r '.data.access_key')
      export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r '.data.secret_key')
    - aws s3 sync dist/ s3://my-bucket/
    # После джоба credentials автоматически отзываются
```

💡 Динамические секреты принципиально безопаснее статических: утёкший ключ работает максимум 1 час, а не вечно.

### AWS Secrets Manager

Альтернатива Vault от AWS:

```yaml
deploy-to-aws:
  image: amazon/aws-cli
  id_tokens:
    AWS_WEB_IDENTITY_TOKEN:
      aud: sts.amazonaws.com
  variables:
    AWS_ROLE_ARN: arn:aws:iam::123456789:role/gitlab-deploy-role
    AWS_WEB_IDENTITY_TOKEN_FILE: /tmp/aws-token
  script:
    # OIDC: GitLab выдаёт токен, AWS STS его проверяет и выдаёт временные credentials
    - aws sts assume-role-with-web-identity \
        --role-arn $AWS_ROLE_ARN \
        --web-identity-token file://$AWS_WEB_IDENTITY_TOKEN_FILE
    # Получаем секрет напрямую из AWS Secrets Manager
    - DB_URL=$(aws secretsmanager get-secret-value \
        --secret-id prod/myapp/database \
        --query SecretString --output text)
    - ./deploy.sh $DB_URL
```

---

## Защита пайплайна: Protected Branches и Environments

Управление секретами — только половина безопасности. Вторая половина — контроль над тем, **кто и когда** может запускать опасные джобы.

### Protected Branches

```mermaid
graph LR
    A[developer\nпуш в feature/*] -->|может| B[Merge Request\n+ pipeline]
    A -->|не может| C[прямой пуш в main]
    D[maintainer\nапрув MR] -->|может| C
    C -->|запускает| E[deploy production\nprotected job]
```

Protected branches настраиваются в Settings → Repository → Protected Branches:
- **Allowed to push**: кто может пушить напрямую
- **Allowed to merge**: кто может делать merge
- **Code owner approval**: нужно ли одобрение владельцев кода

```yaml
deploy-production:
  stage: deploy
  script:
    - ./deploy-prod.sh
  # Этот джоб запустится только на protected ветке/теге
  # Protected переменные (PROD_*) будут доступны
  only:
    - main
    - /^v\d+\.\d+\.\d+$/  # теги вида v1.2.3
```

### Protected Environments

Environments добавляют второй уровень контроля — прямо перед запуском деплоя:

```yaml
deploy-production:
  stage: deploy
  environment:
    name: production
    url: https://my-app.com
  script:
    - ./deploy-prod.sh
  # GitLab может потребовать ручного одобрения перед запуском
  when: manual
```

В Settings → CI/CD → Environments настраивается:
- **Deployment approvals**: кто должен одобрить деплой (1 из 3 senior engineers)
- **Required approvals**: сколько апрувов нужно
- **Prevent self-approval**: нельзя апрувить свой собственный деплой

### Approval Rules в действии

```mermaid
graph LR
    A[Developer\nзапускает deploy] -->|создаёт| B[Deployment Request\nожидает апрув]
    B -->|уведомление| C[Senior Engineer 1]
    B -->|уведомление| D[Senior Engineer 2]
    C -->|approve| E{2 из 2\nапрувов?}
    D -->|approve| E
    E -->|да| F[Deployment\nзапускается]
    E -->|нет| G[ожидание]
```

### Audit и мониторинг

```yaml
# Полезные переменные для аудита в скриптах
deploy:
  script:
    - echo "Deployment by: $GITLAB_USER_LOGIN"
    - echo "Commit: $CI_COMMIT_SHA"
    - echo "Pipeline: $CI_PIPELINE_URL"
    - echo "Branch: $CI_COMMIT_REF_NAME"
    # Записываем в audit log
    - |
      curl -X POST $AUDIT_WEBHOOK_URL \
        -H "Content-Type: application/json" \
        -d "{\"user\": \"$GITLAB_USER_LOGIN\", \"commit\": \"$CI_COMMIT_SHA\"}"
```

---

## Сканирование секретов: предотвращение утечек

Важно ловить секреты до того, как они попали в репозиторий.

### GitLab Secret Detection

```yaml
include:
  - template: Security/Secret-Detection.gitlab-ci.yml

# GitLab автоматически добавляет джоб secret_detection
# который сканирует весь diff на предмет известных паттернов секретов
```

Паттерны включают: AWS keys, GitHub tokens, Slack webhooks, Google API keys, private keys, и т.д.

### Pre-commit hooks (локальная защита)

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
```

Запуск локально перед коммитом — первая линия защиты.

---

## Частые ошибки новичков

⚠️ **Ошибка 1: Секреты в переменных окружения через variables:**

```yaml
# ❌ variables в .gitlab-ci.yml видны всем в репозитории
variables:
  API_KEY: 'sk-prod-super-secret-key'
  DB_PASSWORD: 'mypassword123'

deploy:
  script:
    - curl -H "X-API-Key: $API_KEY" https://api.example.com
```

```yaml
# ✅ Только ссылки на переменные, значения — в Settings → Variables
deploy:
  script:
    - curl -H "X-API-Key: $API_KEY" https://api.example.com
# API_KEY определена в GitLab UI, не в YAML
```

⚠️ **Ошибка 2: Выводить секреты в echo/debug:**

```yaml
# ❌ Секрет попадёт в лог джоба (видно в GitLab UI)
deploy:
  script:
    - echo "Using token: $DEPLOY_TOKEN"
    - echo "DB: $DATABASE_URL"
```

```yaml
# ✅ Не выводить секреты, проверять только факт наличия
deploy:
  script:
    - test -n "$DEPLOY_TOKEN" || (echo "DEPLOY_TOKEN not set" && exit 1)
    - test -n "$DATABASE_URL" || (echo "DATABASE_URL not set" && exit 1)
```

⚠️ **Ошибка 3: Protected переменные без protected branches:**

```yaml
# ❌ Protected переменная есть, но ветка main не помечена как protected
# → любой разработчик может пушить в main и получить PROD_SECRETS
```

```
# ✅ Связка: Protected Branch + Protected Variable + Required Approvals
# Settings → Repository → Protected Branches:
#   main → Allowed to push: Maintainers only
# Settings → CI/CD → Variables:
#   PROD_DB_PASSWORD → Protected: ✓
# Settings → CI/CD → Environments:
#   production → Required approval count: 2
```

⚠️ **Ошибка 4: Один VAULT_TOKEN на всё:**

```yaml
# ❌ Один токен с правами на все секреты
variables:
  VAULT_TOKEN: 'hvs.CAESIKFQ...'  # super-admin token

all-jobs:
  script:
    - vault kv get secret/production/db
    - vault kv get secret/production/payments
    - vault kv get secret/staging/db
```

```yaml
# ✅ JWT/OIDC — каждый джоб получает временный токен
# с доступом только к нужным секретам
deploy-production:
  id_tokens:
    VAULT_ID_TOKEN:
      aud: https://vault.company.com
  script:
    # Vault policy: gitlab-deploy-prod → только secret/production/app/*
    - export VAULT_TOKEN=$(vault write -field=token auth/jwt/login \
        role="gitlab-deploy-prod" jwt="$VAULT_ID_TOKEN")
```

⚠️ **Ошибка 5: Masked переменная с multiline значением:**

```
# ❌ Masked не работает для многострочных значений
# GitLab предупредит: "Value cannot be masked"
# Тип Variable + Masked + содержимое сертификата = ошибка

# ✅ Для certificates, SSH keys, kubeconfig → тип File
# GitLab сохранит содержимое в файл, передаст путь
# $MY_CERT будет содержать путь вроде /tmp/gitlab-runner-cert123
```

---

## Итог

- **Masked** — скрывает значение в логах. Работает только для однострочных значений без спецсимволов.
- **Protected** — ограничивает доступ к переменной только для джобов на protected ветках/тегах.
- **File тип** — для многострочных секретов. GitLab создаёт временный файл, переменная содержит путь к нему.
- **Vault/AWS Secrets Manager** — для сложных сценариев: динамические секреты, аудит, ротация.
- **JWT/OIDC** — правильный способ аутентификации в Vault/AWS без хранения долгоживущих токенов.
- **Protected Branches + Environments + Approvals** — три слоя защиты деплоя в продакшн.
- Сканируй репозиторий на секреты: GitLab Secret Detection + pre-commit gitleaks.
