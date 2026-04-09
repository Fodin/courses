# Level 0: Introduction to CI/CD

## What is CI/CD and why you need it

Imagine you work in a bakery. Every Friday, all the bakers gather, argue over whose dough is best, mix everything together, and try to bake one giant loaf. Sometimes it turns out fine. Sometimes it doesn't. And no one knows whose fault it is.

That's how software development worked before CI/CD. Teams worked in isolation for weeks, then merged their code in one "big bang" (Big Bang Merge). It was painful.

**CI/CD** is the practice of automatically integrating, verifying, and delivering code. Instead of Friday chaos — a pipeline that runs on every commit.

```
Developer pushes code  →  System checks everything automatically  →  Code in production
```

💡 CI/CD is not a tool, it's a **practice**. Tools (GitHub Actions, GitLab CI) simply help you implement it.

---

## The pain of manual deploys

Here's what a typical release looks like without CI/CD:

1. Developer spends two hours manually archiving files
2. Uploads to the server via FTP (or through SSH with notes in a notepad)
3. Stops the application, replaces files, restarts
4. Opens the site — it's down
5. Starts to roll back... and realizes no backup was made

📌 According to statistics, manual deploys are 30 times more error-prone than automated ones.

### Assembly line analogy

Imagine a factory without a conveyor belt: each worker takes a part, carries it to the next station, waits, comes back. Slow, chaotic, lots of mistakes.

CI/CD is the conveyor belt. Each stage is clearly defined, automated, and repeatable. The part (code) moves through it on its own.

```mermaid
graph LR
    A[Developer\nwrites code] --> B[Pipeline\nstarts]
    B --> C[Automated\nchecks]
    C --> D[Build\nartifact]
    D --> E[Deploy\nto server]
    E --> F[Monitoring\nand alerts]
```

---

## CI vs CD vs CD — three different things

This is the most common point of confusion. The abbreviation "CD" is used for two **different** concepts.

### Continuous Integration (CI)

**Goal:** integrate all developers' code as often as possible and verify that it works together.

- Developers commit multiple times a day
- Tests and linters run automatically
- If something breaks — everyone sees it immediately

```yaml
# Example: CI runs on every push
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      - run: npm run lint
```

🔥 Key idea of CI: **integration** (merging code) happens **continuously**, not once a week.

---

### Continuous Delivery (CD)

**Goal:** code is always ready to deploy to production. But the deploy itself is manual.

- After successful tests, code automatically reaches the staging environment
- A manager or team lead clicks "Deploy to production"
- That click is the only manual step

```mermaid
graph LR
    A[Code\npassed CI] --> B[Staging\nenvironment]
    B --> C{Manual\napproval}
    C -->|Clicked\nbutton| D[Production]
    C -->|Rejected| E[Keep\non staging]
```

💡 The key word is **"ready"**. Not "deployed automatically", but "ready to deploy at any moment".

---

### Continuous Deployment (CD)

**Goal:** every commit that passes all checks automatically reaches production without manual intervention.

- No "deploy" button
- No manager approving the release
- If tests are green — code is already with users

```mermaid
graph LR
    A[Commit\nto main] --> B[CI: tests\nand checks]
    B -->|Green| C[Auto-deploy\nto prod]
    B -->|Red| D[Block\nmerge]
```

⚠️ Continuous Deployment requires a mature testing culture. Without good test coverage, it's dangerous.

---

### Summary comparison

| | CI | Continuous Delivery | Continuous Deployment |
|---|---|---|---|
| **What is automated** | Tests, build | Tests + deploy to staging | Everything, including deploy to prod |
| **Manual step** | No | Deploy to prod | No |
| **Deploy frequency** | — | As needed | On every commit |
| **Risk** | Low | Medium | Requires mature testing |
| **Who it suits** | Everyone | Most teams | Mature teams with high coverage |

---

## Feedback Loop — the heart of CI/CD

Imagine writing code blindfolded. You take a step, someone tells you: "ok" or "you fell". The faster the response — the more confidently you move.

**Feedback loop** is the time between "wrote code" and "learned something broke".

```mermaid
graph LR
    A[Wrote\ncode] --> B[Started\npipeline]
    B --> C[Got\nresult]
    C --> D[Fixed\nbug]
    D --> A
```

### Why feedback speed is critical

| Situation | Time to detect error | Cost to fix |
|---|---|---|
| Without CI/CD | Days or weeks | Very high (context lost) |
| With CI (tests run on push) | Minutes | Low (context is fresh) |
| With instant unit tests | Seconds | Minimal |

💡 10x rule: each stage of development where a bug goes undetected increases the cost of fixing it by 10x. A bug in production costs 1000x more than a bug found while writing code.

---

## Overview of CI/CD tools

### GitHub Actions

**What it is:** CI/CD built into GitHub. Configuration in YAML files in the `.github/workflows/` folder.

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
```

✅ Pros: deep GitHub integration, huge actions marketplace, free for public repos
❌ Cons: tied to GitHub, expensive for large teams on private repos

---

### GitLab CI/CD

**What it is:** CI/CD built into GitLab. Configuration in `.gitlab-ci.yml` at the project root.

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build-job:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

test-job:
  stage: test
  script:
    - npm test
```

✅ Pros: all-in-one (repo + CI + image registry), self-hosted option, powerful artifacts
❌ Cons: more complex setup, heavier UI

---

### Jenkins

**What it is:** the oldest open-source CI/CD server. Configured via Groovy (Jenkinsfile) or UI.

```groovy
// Jenkinsfile
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm ci && npm run build'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}
```

✅ Pros: huge plugin ecosystem, full control, self-hosted
❌ Cons: outdated UI, complex setup, requires server maintenance

---

### CircleCI

**What it is:** cloud-based CI/CD service. Configuration in `.circleci/config.yml`.

```yaml
# .circleci/config.yml
version: 2.1
jobs:
  build-and-test:
    docker:
      - image: cimg/node:20.0
    steps:
      - checkout
      - run: npm ci
      - run: npm test
```

✅ Pros: quick start, good documentation, convenient UI
❌ Cons: paid for serious usage, fewer integrations than competitors

---

### Comparison table

| Tool | Type | Free tier | Setup complexity | Ecosystem |
|---|---|---|---|---|
| GitHub Actions | SaaS | Yes (public repos) | Low | Huge |
| GitLab CI | SaaS + Self-hosted | Yes (400 min/month) | Medium | Large |
| Jenkins | Self-hosted | Yes (open source) | High | Huge (plugins) |
| CircleCI | SaaS | Yes (6000 min/month) | Low | Medium |
| Travis CI | SaaS | No (legacy only) | Low | Medium |

---

## Pipeline anatomy

A pipeline is a sequence of automated steps that run when code changes.

```mermaid
graph LR
    A[Trigger:\nPush / PR] --> B[Stage:\nBuild]
    B --> C[Stage:\nTest]
    C --> D[Stage:\nSecurity Scan]
    D --> E[Stage:\nDeploy Staging]
    E --> F[Stage:\nDeploy Prod]
```

### Key concepts

**Pipeline** — the entire process from trigger to deploy.

**Stage** — a logical group of steps. Stages run sequentially.

**Job** — a unit of work within a stage. Jobs within the same stage can run in parallel.

**Step** — a single command within a job.

**Trigger** — an event that starts the pipeline (push, PR, schedule, manual launch).

**Artifact** — a file created in one stage and passed to the next (e.g., a built binary).

```mermaid
graph LR
    subgraph Pipeline
        subgraph "Stage: Build"
            B1[Job: compile]
            B2[Job: bundle]
        end
        subgraph "Stage: Test"
            T1[Job: unit-tests]
            T2[Job: e2e-tests]
        end
        subgraph "Stage: Deploy"
            D1[Job: deploy-staging]
            D2[Job: deploy-prod]
        end
        B1 --> T1
        B2 --> T1
        T1 --> D1
        T2 --> D1
        D1 --> D2
    end
```

### Typical pipeline stages

| Stage | What happens | Time |
|---|---|---|
| **Source** | Code checkout, dependency installation | ~30 sec |
| **Build** | Compilation, Docker image build | 1–5 min |
| **Test** | Unit, integration, e2e tests | 1–15 min |
| **Security** | SAST, dependency check, secrets scan | 1–3 min |
| **Deploy Staging** | Deploy to test environment | ~2 min |
| **Smoke Tests** | Basic post-deploy checks | ~1 min |
| **Deploy Prod** | Deploy to production | ~2 min |

---

## Common beginner mistakes

⚠️ **Mistake 1: "We'll set up CI/CD later, features first"**

CI/CD is harder to set up on a large project than from scratch. Technical debt grows. Add CI from the first commit.

⚠️ **Mistake 2: Confusing Continuous Delivery and Continuous Deployment**

Delivery = manual deploy to prod. Deployment = automatic. Use the correct terms — it matters when discussing architecture.

⚠️ **Mistake 3: A pipeline that's always green**

❌ The team eventually starts ignoring warnings and skipping tests.
✅ A broken pipeline is a blocker. You can't merge until it's fixed.

⚠️ **Mistake 4: Slow pipeline**

If the pipeline takes 40 minutes — developers stop waiting and start working around it. Optimal time — up to 10 minutes.

⚠️ **Mistake 5: Storing secrets in config**

❌
```yaml
env:
  DATABASE_URL: postgres://admin:password123@prod-db/mydb
```

✅ Use CI/CD system environment variables or a vault for secrets.

---

## Summary

CI/CD is not just tools, it's a development **culture**:

- Integrate code often, not once a week
- Automate everything you can
- A broken pipeline is priority #1
- Fast feedback makes the team more confident and productive

In the following levels, we'll break down each pipeline stage in detail and write real configs for GitHub Actions and GitLab CI.
