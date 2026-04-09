# Level 10: Secrets and Security in CI/CD

## Why Secrets Are the Most Dangerous Place in the Pipeline

Imagine you're building a factory. The conveyor (pipeline) is visible to all workers: what parts go where, in what order. But there's a safe with master keys to all doors. If someone writes a PIN code on the conveyor wall — the factory gets hacked. In CI/CD, the role of this safe is played by the secrets management system.

A typical disaster looks like this:

```yaml
# ❌ NEVER DO THIS
deploy:
  script:
    - export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
    - export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    - aws s3 cp dist/ s3://my-bucket/
```

This YAML gets into git history forever. Even if you delete the commit — it remains in forks, mirrors, clones. Bots scan public GitHub/GitLab repositories in real time and crack keys in minutes.

---

## CI/CD Variables: Built-in Secret Store

GitLab CI has a built-in variable manager. Secrets are stored encrypted in GitLab's database and injected into the job at launch time.

```mermaid
graph LR
    A[GitLab Variables Store\nencrypted] -->|inject at runtime| B[Job Runner\nenv variables]
    B -->|uses| C[deploy script\naws s3 cp ...]
    D[git repository\n.gitlab-ci.yml] -->|NO secrets| B
```

### Variable Types

**Variable** (string variable) — the most common type:

```yaml
# In .gitlab-ci.yml you can reference a variable
deploy:
  script:
    - aws s3 cp dist/ s3://$S3_BUCKET/
    - echo "Deploying to $ENVIRONMENT"
```

The variable `S3_BUCKET` is defined in Settings → CI/CD → Variables, not in YAML.

**File** — type for multi-line secrets (certificates, kubeconfig, SSH keys):

```yaml
deploy-k8s:
  script:
    # GitLab saves the variable contents to a temp file
    # and passes the file path via $KUBECONFIG
    - kubectl --kubeconfig=$KUBECONFIG get pods
    - kubectl --kubeconfig=$KUBECONFIG apply -f k8s/
```

📌 Difference: `Variable` = string in environment (`$TOKEN="abc123"`), `File` = path to a temp file (`$KUBECONFIG="/tmp/gitlab-runner-kubeconfig123"`).

### Masked and Protected

**Masked** — variable is masked in job logs:

```
# Without masked:
$ curl -H "Authorization: Bearer ghp_secrettoken123" https://api.github.com
curl -H "Authorization: Bearer ghp_secrettoken123" ...
                                   ^^^^^^^^^^^^^^^^ visible in logs!

# With masked:
$ curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com
curl -H "Authorization: Bearer [MASKED]" ...
```

⚠️ Limitation: masked only works if the value is not multi-line and doesn't contain spaces or special characters. For complex values (multiline certificates), masked doesn't work — use the `File` type.

**Protected** — variable is only available in jobs on protected branches and tags:

```mermaid
graph LR
    A[feature/my-feature\nnot protected] -->|pipeline| B[Job: deploy]
    B -->|no access| C[PROD_DB_PASSWORD\nprotected variable]
    D[main\nprotected branch] -->|pipeline| E[Job: deploy]
    E -->|has access| C
```

📌 Logic: dev branches can test code but shouldn't have access to production secrets. Protected variables guarantee this at the platform level.

### Variable Scope

GitLab has three levels of variable storage:

```
Instance Level (gitlab.com admin)
├── Group Level (my-org/)
│   ├── Subgroup Level (my-org/backend/)
│   │   └── Project Level (my-org/backend/api-service)
```

```yaml
# Group-level variable — available to all projects in the group
# DOCKER_REGISTRY=registry.my-org.com  (group variable)

# Project-level variable — only for this project
# DATABASE_URL=postgres://...  (project variable)

# In .gitlab-ci.yml we access them the same way:
build:
  script:
    - docker login $DOCKER_REGISTRY    # from group vars
    - psql $DATABASE_URL -c "..."       # from project vars
```

A project variable with the same name **overrides** the group variable — allowing defaults at the group level and overrides at the project level.

---

## Environment-specific Variables

Variables can be tied to a specific environment:

```yaml
deploy-staging:
  environment:
    name: staging
  script:
    - echo "DB: $DATABASE_URL"  # gets staging value

deploy-production:
  environment:
    name: production
  script:
    - echo "DB: $DATABASE_URL"  # gets production value
```

In settings: one variable `DATABASE_URL` with two values — for `staging` and `production` environments. GitLab substitutes the correct one based on `environment:name`.

---

## HashiCorp Vault: Professional Secrets Management

Built-in GitLab variables are fine for small teams. But when you have 50+ microservices, 3 clouds, and compliance requirements, you need a dedicated secrets manager.

**Vault** is a centralized secret store with:
- dynamic secrets (temporary credentials that live N minutes)
- audit of all accesses (who, when, which secret)
- fine-grained access policies
- automatic secret rotation

```mermaid
graph LR
    A[GitLab CI Job] -->|1 requests JWT token| B[GitLab OIDC]
    B -->|2 issues JWT| A
    A -->|3 exchanges JWT for Vault token| C[HashiCorp Vault]
    C -->|4 checks policy| D[Vault Policy\nci-deploy-policy]
    D -->|5 allows| C
    C -->|6 issues secret| A
    A -->|uses| E[AWS / DB / API]
```

### JWT/OIDC Authentication

The old method (storing VAULT_TOKEN in a GitLab variable) creates a chicken-and-egg problem: you need a secret to access secrets. JWT authentication solves this:

```yaml
# .gitlab-ci.yml
deploy:
  image: vault:latest
  id_tokens:
    VAULT_ID_TOKEN:
      aud: https://vault.my-company.com   # audience
  script:
    # GitLab automatically creates a JWT token in $VAULT_ID_TOKEN
    # Vault verifies the token signature via GitLab OIDC endpoint
    - |
      export VAULT_TOKEN=$(vault write -field=token auth/jwt/login \
        role="gitlab-deploy" \
        jwt="$VAULT_ID_TOKEN")
    - export DB_PASSWORD=$(vault kv get -field=password secret/myapp/db)
    - ./deploy.sh
```

### Dynamic Secrets — Vault's Killer Feature

```yaml
deploy:
  id_tokens:
    VAULT_ID_TOKEN:
      aud: https://vault.my-company.com
  script:
    # Vault creates a temporary AWS user with minimal permissions
    # Credentials live for 1 hour and are automatically removed
    - |
      CREDS=$(vault write aws/creds/deploy-role ttl=1h)
      export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r '.data.access_key')
      export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r '.data.secret_key')
    - aws s3 sync dist/ s3://my-bucket/
    # After the job, credentials are automatically revoked
```

💡 Dynamic secrets are fundamentally safer than static ones: a leaked key works for at most 1 hour, not forever.

### AWS Secrets Manager

AWS's alternative to Vault:

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
    # OIDC: GitLab issues token, AWS STS verifies it and issues temp credentials
    - aws sts assume-role-with-web-identity \
        --role-arn $AWS_ROLE_ARN \
        --web-identity-token file://$AWS_WEB_IDENTITY_TOKEN_FILE
    # Get the secret directly from AWS Secrets Manager
    - DB_URL=$(aws secretsmanager get-secret-value \
        --secret-id prod/myapp/database \
        --query SecretString --output text)
    - ./deploy.sh $DB_URL
```

---

## Pipeline Protection: Protected Branches and Environments

Managing secrets is only half of security. The other half is controlling **who and when** can run dangerous jobs.

### Protected Branches

```mermaid
graph LR
    A[developer\npushes to feature/*] -->|can| B[Merge Request\n+ pipeline]
    A -->|cannot| C[direct push to main]
    D[maintainer\napproves MR] -->|can| C
    C -->|runs| E[deploy production\nprotected job]
```

Protected branches are configured in Settings → Repository → Protected Branches:
- **Allowed to push**: who can push directly
- **Allowed to merge**: who can merge
- **Code owner approval**: whether code owner approval is required

```yaml
deploy-production:
  stage: deploy
  script:
    - ./deploy-prod.sh
  # This job only runs on protected branches/tags
  # Protected variables (PROD_*) will be available
  only:
    - main
    - /^v\d+\.\d+\.\d+$/  # tags like v1.2.3
```

### Protected Environments

Environments add a second layer of control — right before the deploy runs:

```yaml
deploy-production:
  stage: deploy
  environment:
    name: production
    url: https://my-app.com
  script:
    - ./deploy-prod.sh
  # GitLab may require manual approval before running
  when: manual
```

In Settings → CI/CD → Environments you configure:
- **Deployment approvals**: who must approve the deploy (1 of 3 senior engineers)
- **Required approvals**: how many approvals are needed
- **Prevent self-approval**: can't approve your own deploy

### Approval Rules in Action

```mermaid
graph LR
    A[Developer\ntriggers deploy] -->|creates| B[Deployment Request\nawaiting approval]
    B -->|notification| C[Senior Engineer 1]
    B -->|notification| D[Senior Engineer 2]
    C -->|approve| E{2 of 2\napprovals?}
    D -->|approve| E
    E -->|yes| F[Deployment\nruns]
    E -->|no| G[waiting]
```

### Audit and Monitoring

```yaml
# Useful audit variables in scripts
deploy:
  script:
    - echo "Deployment by: $GITLAB_USER_LOGIN"
    - echo "Commit: $CI_COMMIT_SHA"
    - echo "Pipeline: $CI_PIPELINE_URL"
    - echo "Branch: $CI_COMMIT_REF_NAME"
    # Write to audit log
    - |
      curl -X POST $AUDIT_WEBHOOK_URL \
        -H "Content-Type: application/json" \
        -d "{\"user\": \"$GITLAB_USER_LOGIN\", \"commit\": \"$CI_COMMIT_SHA\"}"
```

---

## Secret Scanning: Preventing Leaks

It's important to catch secrets before they enter the repository.

### GitLab Secret Detection

```yaml
include:
  - template: Security/Secret-Detection.gitlab-ci.yml

# GitLab automatically adds a secret_detection job
# which scans the entire diff for known secret patterns
```

Patterns include: AWS keys, GitHub tokens, Slack webhooks, Google API keys, private keys, etc.

### Pre-commit hooks (Local Protection)

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
```

Run locally before committing — first line of defense.

---

## Common Beginner Mistakes

⚠️ **Mistake 1: Secrets in environment variables via variables:**

```yaml
# ❌ variables in .gitlab-ci.yml are visible to everyone in the repo
variables:
  API_KEY: 'sk-prod-super-secret-key'
  DB_PASSWORD: 'mypassword123'

deploy:
  script:
    - curl -H "X-API-Key: $API_KEY" https://api.example.com
```

```yaml
# ✅ Only references to variables, values — in Settings → Variables
deploy:
  script:
    - curl -H "X-API-Key: $API_KEY" https://api.example.com
# API_KEY defined in GitLab UI, not in YAML
```

⚠️ **Mistake 2: Outputting secrets in echo/debug:**

```yaml
# ❌ Secret will appear in job log (visible in GitLab UI)
deploy:
  script:
    - echo "Using token: $DEPLOY_TOKEN"
    - echo "DB: $DATABASE_URL"
```

```yaml
# ✅ Don't output secrets, only check existence
deploy:
  script:
    - test -n "$DEPLOY_TOKEN" || (echo "DEPLOY_TOKEN not set" && exit 1)
    - test -n "$DATABASE_URL" || (echo "DATABASE_URL not set" && exit 1)
```

⚠️ **Mistake 3: Protected variables without protected branches:**

```yaml
# ❌ Protected variable exists, but main branch isn't marked as protected
# → any developer can push to main and get PROD_SECRETS
```

```
# ✅ Chain: Protected Branch + Protected Variable + Required Approvals
# Settings → Repository → Protected Branches:
#   main → Allowed to push: Maintainers only
# Settings → CI/CD → Variables:
#   PROD_DB_PASSWORD → Protected: ✓
# Settings → CI/CD → Environments:
#   production → Required approval count: 2
```

⚠️ **Mistake 4: One VAULT_TOKEN for everything:**

```yaml
# ❌ One token with access to all secrets
variables:
  VAULT_TOKEN: 'hvs.CAESIKFQ...'  # super-admin token

all-jobs:
  script:
    - vault kv get secret/production/db
    - vault kv get secret/production/payments
    - vault kv get secret/staging/db
```

```yaml
# ✅ JWT/OIDC — each job gets a temporary token
# with access only to the needed secrets
deploy-production:
  id_tokens:
    VAULT_ID_TOKEN:
      aud: https://vault.company.com
  script:
    # Vault policy: gitlab-deploy-prod → only secret/production/app/*
    - export VAULT_TOKEN=$(vault write -field=token auth/jwt/login \
        role="gitlab-deploy-prod" jwt="$VAULT_ID_TOKEN")
```

⚠️ **Mistake 5: Masked variable with multi-line value:**

```
# ❌ Masked doesn't work for multi-line values
# GitLab will warn: "Value cannot be masked"
# Type Variable + Masked + certificate contents = error

# ✅ For certificates, SSH keys, kubeconfig → use File type
# GitLab saves the contents to a file, passes the path
# $MY_CERT will contain a path like /tmp/gitlab-runner-cert123
```

---

## Summary

- **Masked** — hides the value in logs. Only works for single-line values without special characters.
- **Protected** — restricts variable access to jobs on protected branches/tags only.
- **File type** — for multi-line secrets. GitLab creates a temp file, the variable contains the path to it.
- **Vault/AWS Secrets Manager** — for complex scenarios: dynamic secrets, auditing, rotation.
- **JWT/OIDC** — the correct way to authenticate with Vault/AWS without storing long-lived tokens.
- **Protected Branches + Environments + Approvals** — three layers of production deploy protection.
- Scan your repo for secrets: GitLab Secret Detection + pre-commit gitleaks.
