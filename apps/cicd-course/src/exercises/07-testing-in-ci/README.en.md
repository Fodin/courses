# Level 7: Testing in CI

## Why Test in CI at All?

Imagine each developer on the team makes 10 commits a day. With 5 people — that's 50 commits. Without automated tests, each of these 50 commits is a potential ticking time bomb. Tests in CI are automatic quality control that works 24/7, doesn't get tired, and doesn't forget to run checks.

But simply "running tests in CI" is not enough. Poorly organized tests make the pipeline slow, unreliable, and developers start ignoring them. The goal of this level is to learn how to build testing in CI properly.

---

## Testing Pyramid

The testing pyramid is a fundamental concept that describes **how many tests of each type** should be in a project and **how they relate in speed and cost**.

```
         /\
        /E2E\          few, slow, expensive
       /------\
      /Integ-  \       medium, moderate
     /ration    \
    /------------\
   /  Unit Tests  \    many, fast, cheap
  /--------------\
```

📌 Pyramid logic:

- **Unit tests** (base) — test individual functions/classes in isolation. Run in milliseconds, no external dependencies needed. Should be 70-80% of all tests.
- **Integration tests** (middle) — check component interactions: API + database, service + message queue. Require running dependencies, run in seconds.
- **E2E tests** (top) — simulate a real user in a real browser. Minutes to run, high cost, instability (flaky tests). There should be few of them.

### Pyramid in a GitLab CI Pipeline

The testing pyramid should be reflected in the pipeline structure. Fast unit tests first, slow E2E later or on a separate trigger:

```yaml
stages:
  - lint          # seconds — syntax and style
  - unit-test     # seconds → minutes
  - integration   # minutes (needs services)
  - e2e           # minutes (needs browser)
  - deploy

# Fast check — runs first
lint:
  stage: lint
  image: node:20-alpine
  script:
    - npm run lint
    - npm run typecheck

# Unit tests — fast, no dependencies
unit-tests:
  stage: unit-test
  image: node:20-alpine
  script:
    - npm ci
    - npm run test:unit -- --coverage
  coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'
  artifacts:
    reports:
      junit: reports/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

# Integration tests — need a DB
integration-tests:
  stage: integration
  image: node:20-alpine
  services:
    - postgres:15-alpine
    - redis:7-alpine
  variables:
    DATABASE_URL: 'postgresql://test:test@postgres/testdb'
    REDIS_URL: 'redis://redis:6379'
  script:
    - npm ci
    - npm run test:integration

# E2E — only on main or on schedule
e2e-tests:
  stage: e2e
  image: mcr.microsoft.com/playwright:v1.44.0-jammy
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - playwright-report/
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_PIPELINE_SOURCE == "schedule"'
```

```mermaid
graph LR
    A[Lint\n~30 sec] --> B[Unit Tests\n~2 min]
    B --> C[Integration\n~5 min]
    C --> D[E2E\n~15 min]
    D --> E[Deploy]
```

💡 Key principle: if something goes wrong, you want to know **as early as possible**. That's why fast, cheap tests go first. A lint failure saves time that would've been spent running E2E.

---

## Services — External Dependencies in CI

One of the most common problems with integration tests in CI: **how to run PostgreSQL, Redis, MongoDB alongside your job?**

GitLab CI solves this elegantly through **services** — additional Docker containers that run in parallel with the main job container and are accessible by network name.

### How Services Work

```mermaid
graph LR
    A[Job Container\nnode:20-alpine] -- localhost:5432 --> B[PostgreSQL\nservice container]
    A -- localhost:6379 --> C[Redis\nservice container]
    A -- localhost:27017 --> D[MongoDB\nservice container]
```

📌 Services and the job are on the same Docker network. A service container is accessible by its image name (without tag and slashes). For example, `postgres:15-alpine` → host `postgres`.

### Basic Configuration

```yaml
integration-tests:
  stage: test
  image: node:20-alpine

  services:
    - postgres:15-alpine          # available as 'postgres'
    - redis:7-alpine              # available as 'redis'

  variables:
    # PostgreSQL accepts these variables for initialization
    POSTGRES_DB: testdb
    POSTGRES_USER: test
    POSTGRES_PASSWORD: test
    POSTGRES_HOST_AUTH_METHOD: trust

    # Variables for the application
    DATABASE_URL: 'postgresql://test:test@postgres:5432/testdb'
    REDIS_URL: 'redis://redis:6379'

  script:
    - npm ci
    - npm run test:integration
```

### Custom Host Name for a Service

By default, host = image name without tag. But if you need a different name — use `alias`:

```yaml
services:
  - name: postgres:15-alpine
    alias: database          # now available as 'database', not 'postgres'

  - name: redis:7-alpine
    alias: cache             # available as 'cache'

variables:
  DATABASE_URL: 'postgresql://test:test@database:5432/testdb'
  REDIS_URL: 'redis://cache:6379'
```

### Waiting for Service Readiness

Common mistake: tests run before PostgreSQL has finished starting. Solutions:

```yaml
script:
  # Option 1: wait-for-it.sh — wait for port
  - apt-get update && apt-get install -y wait-for-it
  - wait-for-it postgres:5432 --timeout=60 -- echo "PostgreSQL ready"
  - npm run test:integration

  # Option 2: pg_isready (if postgres client is available)
  - until pg_isready -h postgres -U test; do sleep 1; done
  - npm run test:integration

  # Option 3: retry in test code (best approach)
  # In beforeAll(), make several connection attempts
```

### Services in GitHub Actions

For comparison — the equivalent in GitHub Actions:

```yaml
# GitHub Actions
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_USER: test
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - run: npm test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/testdb
```

📌 Key difference: in GitHub Actions, services forward ports to `localhost`, while in GitLab CI they're accessible by network name without port forwarding.

---

## Coverage and JUnit Reports

Just running tests and seeing "passed/failed" is only half the story. GitLab CI can parse test results and code coverage, displaying them directly in the Merge Request interface.

### JUnit XML Reports

JUnit XML is a standard test results format understood by GitLab, GitHub, Jenkins, and other CI systems.

```yaml
unit-tests:
  stage: test
  image: node:20-alpine
  script:
    - npm ci
    # Jest with JUnit reporter
    - npx jest --reporters=default --reporters=jest-junit
  artifacts:
    when: always       # save even if tests fail!
    reports:
      junit: reports/junit.xml
    expire_in: 1 week
  variables:
    JEST_JUNIT_OUTPUT_DIR: reports
    JEST_JUNIT_OUTPUT_NAME: junit.xml
```

After this, each MR gets a **Tests** tab showing:
- How many tests passed / failed / skipped
- Which specific tests failed (with names and error messages)
- Comparison with the previous run

### Coverage: Two Strategies

**Strategy 1 — Coverage via regex** (simple approach):

GitLab can parse coverage from test stdout using a regular expression:

```yaml
unit-tests:
  stage: test
  script:
    - npm run test -- --coverage
  # Regex for Jest coverage output
  coverage: '/All files[^|]*\|[^|]*\|\s*(\d+\.?\d*)/'
  # Or simpler, for most formats:
  # coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'
```

GitLab displays a badge with the coverage percentage in the README and MR.

**Strategy 2 — Cobertura XML** (detailed report with diff):

```yaml
unit-tests:
  stage: test
  image: node:20-alpine
  script:
    - npm ci
    - npx jest --coverage --coverageReporters=cobertura --coverageReporters=text
  coverage: '/All files[^|]*\|[^|]*\|\s*(\d+\.?\d*)/'
  artifacts:
    when: always
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    expire_in: 1 week
```

With Cobertura, the MR shows a detailed diff: which lines are covered, which aren't, how many added lines are covered by new tests.

### Python: pytest + coverage

```yaml
test-python:
  stage: test
  image: python:3.12-slim
  script:
    - pip install pytest pytest-cov pytest-junit
    - pytest
        --junitxml=reports/junit.xml
        --cov=src
        --cov-report=term
        --cov-report=xml:coverage/coverage.xml
  coverage: '/TOTAL\s+\d+\s+\d+\s+(\d+)%/'
  artifacts:
    when: always
    reports:
      junit: reports/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/coverage.xml
```

### Coverage Thresholds

Want the pipeline to fail when coverage is insufficient? This is done at the test framework level:

```yaml
script:
  # Jest — minimum threshold via config
  - npx jest --coverage --coverageThreshold='{"global":{"lines":80}}'

  # Python — via pytest-cov
  - pytest --cov=src --cov-fail-under=80
```

```json
// jest.config.js
{
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

---

## Parallel Test Execution

When there are many tests, sequential execution takes too long. GitLab CI provides several ways to parallelize tests.

### The `parallel` Keyword

The simplest approach — the `parallel` keyword. GitLab will launch N identical jobs, passing each the variables `CI_NODE_INDEX` and `CI_NODE_TOTAL`:

```yaml
unit-tests:
  stage: test
  image: node:20-alpine
  parallel: 4           # launch 4 copies of this job
  script:
    - npm ci
    # Test framework splits tests by CI_NODE_INDEX / CI_NODE_TOTAL
    - npx jest --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
  artifacts:
    when: always
    reports:
      junit: junit-$CI_NODE_INDEX.xml
```

```mermaid
graph LR
    A[Push] --> B[unit-tests 1/4\ntests 1-25]
    A --> C[unit-tests 2/4\ntests 26-50]
    A --> D[unit-tests 3/4\ntests 51-75]
    A --> E[unit-tests 4/4\ntests 76-100]
    B --> F[Result]
    C --> F
    D --> F
    E --> F
```

📌 Important: with `parallel: 4` and an 8-minute test suite, each shard runs in ~2 minutes. Total pipeline time — 2 minutes instead of 8. But you need 4 runners for simultaneous execution.

### Matrix Breakdown

If you need to test different configurations (Node versions, browsers, databases), use `parallel:matrix`:

```yaml
test-matrix:
  stage: test
  image: node:${NODE_VERSION}-alpine
  parallel:
    matrix:
      - NODE_VERSION: ['18', '20', '22']
        DATABASE: ['sqlite', 'postgres']
  services:
    - name: postgres:15-alpine
      alias: postgres
  script:
    - echo "Testing Node $NODE_VERSION with $DATABASE"
    - npm ci
    - DATABASE=$DATABASE npm test
```

This creates 6 jobs: `test-matrix: [18, sqlite]`, `test-matrix: [18, postgres]`, etc.

### Manual Split via Variables

For full control — manual division of tests by files or labels:

```yaml
# Run specific test groups
test-auth:
  stage: test
  script:
    - npm test -- --testPathPattern="auth|user|session"

test-payments:
  stage: test
  script:
    - npm test -- --testPathPattern="payment|billing|invoice"

test-api:
  stage: test
  script:
    - npm test -- --testPathPattern="api|rest|graphql"
```

### Combining JUnit Reports with Parallel Tests

With `parallel: N`, each shard creates its own XML file. GitLab can accept multiple files:

```yaml
unit-tests:
  parallel: 4
  script:
    - npx jest --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
        --reporters=jest-junit
  variables:
    JEST_JUNIT_OUTPUT_NAME: junit-$CI_NODE_INDEX.xml
  artifacts:
    when: always
    reports:
      junit:
        - junit-1.xml
        - junit-2.xml
        - junit-3.xml
        - junit-4.xml
```

Or via glob pattern:

```yaml
artifacts:
  reports:
    junit: "junit-*.xml"
```

---

## Test Launch Strategies

You don't always need to run the entire test suite on every commit. Smart strategies save resources and time.

### Conditional E2E Launch

```yaml
e2e-tests:
  stage: e2e
  script:
    - npx playwright test
  rules:
    # Run on main and release branches
    - if: '$CI_COMMIT_BRANCH =~ /^(main|master|release\/.*)$/'
    # Run on schedule (nightly runs)
    - if: '$CI_PIPELINE_SOURCE == "schedule"'
    # Run when explicitly requested in commit
    - if: '$CI_COMMIT_MESSAGE =~ /\[run-e2e\]/'
    # Skip for documentation
    - if: '$CI_COMMIT_BRANCH'
      changes:
        - '**/*.md'
        - 'docs/**/*'
      when: never
    # In all other cases — skip
    - when: never
```

### Tests Only When Related Files Change

```yaml
test-frontend:
  stage: test
  script:
    - cd frontend && npm test
  rules:
    - changes:
        - 'frontend/**/*'
        - 'shared/**/*'
      when: always
    - when: never

test-backend:
  stage: test
  script:
    - cd backend && npm test
  rules:
    - changes:
        - 'backend/**/*'
        - 'shared/**/*'
      when: always
    - when: never
```

---

## Common Beginner Mistakes

⚠️ **Mistake 1: Tests fail because the service hasn't started yet**

❌ Problem:
```yaml
services:
  - postgres:15
script:
  - npm run test:integration  # fails: connection refused
```

✅ Solution:
```yaml
services:
  - postgres:15
variables:
  POSTGRES_HOST_AUTH_METHOD: trust
script:
  - apt-get install -y postgresql-client
  - until pg_isready -h postgres; do sleep 1; done
  - npm run test:integration
```

---

⚠️ **Mistake 2: JUnit artifacts only save on success**

❌ Problem:
```yaml
artifacts:
  reports:
    junit: reports/junit.xml
  # when not specified → on_success by default
  # If tests fail — JUnit file won't be saved, MR won't show details
```

✅ Solution:
```yaml
artifacts:
  when: always    # ALWAYS save — especially on failure!
  reports:
    junit: reports/junit.xml
```

---

⚠️ **Mistake 3: Service address specified incorrectly**

❌ Problem:
```yaml
services:
  - postgres:15-alpine
variables:
  DATABASE_URL: 'postgresql://test:test@localhost:5432/testdb'
  # localhost doesn't work! Need the image name without tag
```

✅ Solution:
```yaml
variables:
  DATABASE_URL: 'postgresql://test:test@postgres:5432/testdb'
  # Or use alias:
  # DATABASE_URL: 'postgresql://test:test@db:5432/testdb'
```

---

⚠️ **Mistake 4: parallel without sharding**

❌ Problem:
```yaml
unit-tests:
  parallel: 4
  script:
    - npm test   # runs ALL tests in each of the 4 jobs!
```

✅ Solution:
```yaml
unit-tests:
  parallel: 4
  script:
    - npx jest --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
    # or for pytest:
    # - pytest --splits=$CI_NODE_TOTAL --group=$CI_NODE_INDEX
```

---

⚠️ **Mistake 5: E2E on every commit**

❌ Problem: E2E tests run on every push to every branch. 15 minutes of waiting for a typo fix.

✅ Solution: restrict E2E with rules — only main, only on schedule, only on explicit request via a label in commit or MR.

---

⚠️ **Mistake 6: Not specifying coverage regex**

❌ Problem:
```yaml
unit-tests:
  script:
    - npm test -- --coverage
  # coverage not specified → GitLab doesn't know about coverage
```

✅ Solution:
```yaml
unit-tests:
  script:
    - npm test -- --coverage
  coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'
```

---

## Summary

Properly organized testing in CI is not just "running tests". It's:

1. **Structure**: testing pyramid in stages — fast tests first
2. **Services**: PostgreSQL, Redis, and other dependencies directly in the job
3. **Visibility**: JUnit + Coverage show results directly in the MR
4. **Speed**: `parallel` splits the test suite into shards
5. **Savings**: E2E only where needed

Well-configured testing in CI saves hours of development per week and gives confidence when deploying.
