// ============================================
// Level 10: Secrets and Security — Solutions
// ============================================

import { useState } from 'react'

// ============================================
// Task 10.1: CI/CD Variables — types, masked, protected, scope
// ============================================

type VarType = 'variable' | 'file'
type VarScope = 'project' | 'group' | 'instance'

function buildVarYaml(name: string, varType: VarType): string {
  if (varType === 'file') {
    return `deploy:
  script:
    # GitLab сохранит значение во временный файл
    # $${name} будет содержать путь вроде /tmp/runner-file-abc
    - kubectl --kubeconfig=$${name} get pods
    - helm --kubeconfig=$${name} upgrade myapp ./chart`
  }
  return `deploy:
  script:
    - echo "Deploying to $ENVIRONMENT"
    - aws s3 cp dist/ s3://$S3_BUCKET/
    # $${name} доступна как обычная переменная окружения`
}

const SCOPE_LEVELS = [
  { id: 'instance', label: 'Instance', desc: 'Все группы и проекты', color: '#7B1FA2', bg: '#F3E5F5' },
  { id: 'group', label: 'Group', desc: 'Все проекты группы my-org/', color: '#1565C0', bg: '#E3F2FD' },
  { id: 'project', label: 'Project', desc: 'Только текущий проект', color: '#2E7D32', bg: '#E8F5E9' },
]

const BRANCH_SCENARIOS = [
  { branch: 'main', isProtected: true, label: 'main (protected)', color: '#2E7D32', bg: '#E8F5E9' },
  { branch: 'feature/my-feature', isProtected: false, label: 'feature/my-feature', color: '#C62828', bg: '#FFEBEE' },
]

export function Task10_1_Solution() {
  const [varType, setVarType] = useState<VarType>('variable')
  const [masked, setMasked] = useState(false)
  const [isProtected, setIsProtected] = useState(false)
  const [scope, setScope] = useState<VarScope>('project')
  const [value, setValue] = useState('my-secret-value')
  const varName = 'MY_SECRET'

  const hasSpaces = value.includes(' ')
  const hasNewlines = value.includes('\n')
  const maskedIncompatible = masked && varType === 'variable' && (hasSpaces || hasNewlines)

  const canAccess = (branchProtected: boolean) => {
    if (isProtected && !branchProtected) return false
    return true
  }

  const logLine = masked
    ? `curl -H "Authorization: Bearer [MASKED]" https://api.example.com`
    : `curl -H "Authorization: Bearer ${value}" https://api.example.com`

  const btnStyle = (active: boolean, color = '#1565C0') => ({
    padding: '0.35rem 0.9rem',
    borderRadius: '6px',
    border: active ? `2px solid ${color}` : '1px solid #ccc',
    background: active ? (color === '#1565C0' ? '#E3F2FD' : '#E8F5E9') : '#fff',
    color: active ? color : '#555',
    fontWeight: active ? 700 : 400,
    cursor: 'pointer',
    fontSize: '0.82rem',
  })

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>CI/CD Variables: типы, маскировка, область видимости</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Настрой параметры переменной и посмотри, как она ведёт себя в разных условиях
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Left: settings */}
        <div style={{ flex: '1 1 300px' }}>

          {/* Type */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Тип переменной</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['variable', 'file'] as VarType[]).map(t => (
                <button key={t} onClick={() => setVarType(t)} style={btnStyle(varType === t)}>
                  {t === 'variable' ? 'Variable (строка)' : 'File (путь к файлу)'}
                </button>
              ))}
            </div>
            {varType === 'file' && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#555', background: '#F3E5F5', borderRadius: '6px', padding: '0.5rem 0.75rem' }}>
                <code>${varName}</code> содержит путь: <code>/tmp/gitlab-runner-file-abc123</code>
              </div>
            )}
          </div>

          {/* Value */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Значение</div>
            <input
              value={value}
              onChange={e => setValue(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box', padding: '0.4rem 0.6rem',
                borderRadius: '6px', border: maskedIncompatible ? '2px solid #D32F2F' : '1px solid #ccc',
                fontFamily: 'monospace', fontSize: '0.85rem',
              }}
            />
            {maskedIncompatible && (
              <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: '#C62828', background: '#FFEBEE', borderRadius: '6px', padding: '0.4rem 0.7rem' }}>
                Masked не работает: значение содержит пробелы или переносы строк. Используй тип File.
              </div>
            )}
          </div>

          {/* Masked + Protected */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Флаги</div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type='checkbox' checked={masked} onChange={e => setMasked(e.target.checked)} />
                <span>Masked</span>
                <span style={{ color: '#888', fontSize: '0.75rem' }}>(скрыть в логах)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type='checkbox' checked={isProtected} onChange={e => setIsProtected(e.target.checked)} />
                <span>Protected</span>
                <span style={{ color: '#888', fontSize: '0.75rem' }}>(только protected ветки)</span>
              </label>
            </div>
          </div>

          {/* Scope */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Уровень (scope)</div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {SCOPE_LEVELS.map(s => (
                <button key={s.id} onClick={() => setScope(s.id as VarScope)} style={btnStyle(scope === s.id, s.color)}>
                  {s.label}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {SCOPE_LEVELS.map((s, i) => (
                <div key={s.id} style={{
                  padding: '0.3rem 0.6rem',
                  paddingLeft: `${0.6 + i * 1}rem`,
                  borderRadius: '5px',
                  background: scope === s.id ? s.bg : '#f9f9f9',
                  border: scope === s.id ? `1.5px solid ${s.color}` : '1px solid #e0e0e0',
                  fontSize: '0.8rem',
                  color: scope === s.id ? s.color : '#666',
                  fontWeight: scope === s.id ? 600 : 400,
                  transition: 'all 0.15s',
                }}>
                  {i > 0 ? '└ ' : ''}{s.label} — {s.desc}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: output */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Log simulation */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Лог джоба</div>
            <div style={{ background: '#1e1e1e', borderRadius: '8px', padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.78rem', color: '#d4d4d4' }}>
              <div style={{ color: '#6A9955' }}># Выполнение скрипта...</div>
              <div style={{ marginTop: '4px', wordBreak: 'break-all' }}>{logLine}</div>
              {masked && !maskedIncompatible && (
                <div style={{ marginTop: '4px', color: '#569CD6' }}># GitLab заменил значение на [MASKED]</div>
              )}
            </div>
          </div>

          {/* Access simulator */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Симулятор доступа</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {BRANCH_SCENARIOS.map(s => {
                const access = canAccess(s.isProtected)
                return (
                  <div key={s.branch} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem', borderRadius: '8px',
                    background: access ? '#E8F5E9' : '#FFEBEE',
                    border: `1.5px solid ${access ? '#A5D6A7' : '#EF9A9A'}`,
                  }}>
                    <div>
                      <code style={{ fontSize: '0.8rem', color: '#333' }}>{s.label}</code>
                      {s.isProtected && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', background: '#E8F5E9', color: '#2E7D32', borderRadius: '4px', padding: '1px 6px', border: '1px solid #A5D6A7' }}>
                          protected
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: access ? '#2E7D32' : '#C62828' }}>
                      {access ? 'Есть доступ' : 'Нет доступа'}
                    </div>
                  </div>
                )
              })}
            </div>
            {isProtected && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#555', background: '#FFF8E1', borderRadius: '6px', padding: '0.4rem 0.7rem', border: '1px solid #FFE082' }}>
                Protected переменная доступна только на protected ветках и тегах
              </div>
            )}
          </div>

          {/* YAML */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Пример использования в YAML</div>
            <pre style={{
              background: '#1e1e1e', color: '#d4d4d4', borderRadius: '8px',
              padding: '0.75rem 1rem', fontSize: '0.75rem', margin: 0,
              overflowX: 'auto', whiteSpace: 'pre-wrap',
            }}>
              {buildVarYaml(varName, varType)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 10.2: Vault integration — JWT/OIDC and dynamic secrets
// ============================================

type SecretType = 'static' | 'dynamic'
type SecretsEngine = 'kv' | 'aws' | 'database'

const FLOW_STEPS = [
  { actor: 'gitlab', label: 'GitLab генерирует JWT', detail: 'GitLab подписывает токен своим приватным ключом. Токен содержит: проект, ветку, environment, user.' },
  { actor: 'runner', label: 'Джоб получает $VAULT_ID_TOKEN', detail: 'Runner передаёт JWT в переменную окружения джоба. Токен доступен только внутри этого джоба.' },
  { actor: 'vault', label: 'Джоб отправляет JWT в Vault', detail: 'vault write auth/jwt/login role="gitlab-deploy" jwt="$VAULT_ID_TOKEN"' },
  { actor: 'oidc', label: 'Vault проверяет подпись', detail: 'Vault скачивает публичный ключ с GitLab OIDC endpoint (.well-known/openid-configuration) и верифицирует JWT.' },
  { actor: 'vault', label: 'Vault проверяет политику', detail: 'Политика роли "gitlab-deploy" определяет: к каким секретам есть доступ и на каких условиях.' },
  { actor: 'runner', label: 'Vault выдаёт временный токен + секрет', detail: 'Джоб получает короткоживущий Vault token и читает нужный секрет. После TTL токен отзывается автоматически.' },
]

const ACTOR_COLORS: Record<string, { bg: string; border: string; color: string }> = {
  gitlab: { bg: '#E3F2FD', border: '#90CAF9', color: '#1565C0' },
  runner: { bg: '#F3E5F5', border: '#CE93D8', color: '#6A1B9A' },
  vault: { bg: '#E8F5E9', border: '#A5D6A7', color: '#1B5E20' },
  oidc: { bg: '#FFF3E0', border: '#FFCC80', color: '#E65100' },
}

const ENGINE_EXAMPLES: Record<SecretsEngine, { cmd: string; result: string; desc: string }> = {
  kv: {
    desc: 'Key-Value — хранит статические пары ключ-значение',
    cmd: 'vault kv get -field=password secret/myapp/db',
    result: 'my-db-password-123',
  },
  aws: {
    desc: 'AWS — генерирует временные IAM credentials с TTL',
    cmd: 'vault write aws/creds/deploy-role ttl=1h',
    result: 'access_key: ASIAXXX...\nsecret_key: abc123...\nlease_duration: 1h',
  },
  database: {
    desc: 'Database — создаёт временного пользователя PostgreSQL',
    cmd: 'vault read database/creds/readonly-role',
    result: 'username: v-gitlab-ro-AbC123\npassword: A1b-9xZ...\nlease_duration: 1h',
  },
}

function buildVaultYaml(secretType: SecretType, engine: SecretsEngine): string {
  if (secretType === 'static') {
    return `# СТАТИЧЕСКИЙ ТОКЕН — проблема долгоживущих секретов
deploy:
  variables:
    VAULT_TOKEN: \$VAULT_TOKEN_FROM_GITLAB_VARS  # хранится в GitLab Settings
    VAULT_ADDR: https://vault.company.com
  script:
    - vault kv get -field=password secret/myapp/db`
  }
  const engineScript = engine === 'kv'
    ? '    - export DB_PASS=$(vault kv get -field=password secret/myapp/db)'
    : engine === 'aws'
      ? '    - export AWS_KEY=$(vault write -field=access_key aws/creds/deploy ttl=1h)'
      : '    - export DB_CREDS=$(vault read database/creds/readonly)'
  return `# JWT/OIDC — токен генерируется динамически
deploy:
  id_tokens:
    VAULT_ID_TOKEN:
      aud: https://vault.company.com
  variables:
    VAULT_ADDR: https://vault.company.com
  script:
    - |
      export VAULT_TOKEN=$(vault write -field=token \\
        auth/jwt/login \\
        role="gitlab-deploy" \\
        jwt="\$VAULT_ID_TOKEN")
${engineScript}
    - ./deploy.sh`
}

export function Task10_2_Solution() {
  const [step, setStep] = useState(-1)
  const [secretType, setSecretType] = useState<SecretType>('dynamic')
  const [engine, setEngine] = useState<SecretsEngine>('kv')

  const currentStep = FLOW_STEPS[step]
  const activeActor = currentStep?.actor ?? null

  const btnStyle = (active: boolean, color = '#1565C0', activeBg = '#E3F2FD') => ({
    padding: '0.35rem 0.9rem',
    borderRadius: '6px',
    border: active ? `2px solid ${color}` : '1px solid #ccc',
    background: active ? activeBg : '#fff',
    color: active ? color : '#555',
    fontWeight: active ? 700 : 400,
    cursor: 'pointer',
    fontSize: '0.82rem',
  })

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Vault: JWT/OIDC аутентификация и динамические секреты</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Пройди по шагам аутентификации и выбери тип секретов
      </p>

      {/* Type switch */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Тип секрета:</span>
        <button onClick={() => setSecretType('static')} style={btnStyle(secretType === 'static', '#C62828', '#FFEBEE')}>
          Статический токен
        </button>
        <button onClick={() => setSecretType('dynamic')} style={btnStyle(secretType === 'dynamic', '#2E7D32', '#E8F5E9')}>
          Динамический (JWT/OIDC)
        </button>
      </div>

      {secretType === 'static' && (
        <div style={{ background: '#FFEBEE', border: '1.5px solid #EF9A9A', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
          VAULT_TOKEN — долгоживущий секрет. При утечке действует вечно. Нужна ручная ротация. Создаёт проблему "курицы и яйца" — для доступа к секретам нужен секрет.
        </div>
      )}

      {/* Timeline */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Жизнь секрета</div>
        <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '0.75rem 1rem', position: 'relative', height: '40px', display: 'flex', alignItems: 'center' }}>
          <div style={{
            height: '12px',
            borderRadius: '6px',
            width: secretType === 'static' ? '100%' : '55%',
            background: secretType === 'static' ? '#EF9A9A' : '#81C784',
            transition: 'width 0.4s ease',
            position: 'relative',
          }}>
            {secretType === 'dynamic' && (
              <span style={{ position: 'absolute', right: '-10px', top: '-20px', fontSize: '0.75rem', color: '#2E7D32', whiteSpace: 'nowrap' }}>
                TTL: 1h — автоматически отозван
              </span>
            )}
            {secretType === 'static' && (
              <span style={{ position: 'absolute', right: '8px', top: '-20px', fontSize: '0.75rem', color: '#C62828', whiteSpace: 'nowrap' }}>
                Действует бессрочно
              </span>
            )}
          </div>
        </div>
      </div>

      {/* JWT Flow animation */}
      {secretType === 'dynamic' && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>JWT/OIDC Flow</div>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>
              {step === -1 ? 'Нажми "Следующий шаг"' : `Шаг ${step + 1} / ${FLOW_STEPS.length}`}
            </div>
          </div>

          {/* Actors */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {Object.entries(ACTOR_COLORS).map(([actor, c]) => (
              <div key={actor} style={{
                padding: '0.35rem 0.75rem', borderRadius: '8px',
                background: activeActor === actor ? c.bg : '#f5f5f5',
                border: `2px solid ${activeActor === actor ? c.border : '#e0e0e0'}`,
                color: activeActor === actor ? c.color : '#999',
                fontSize: '0.8rem', fontWeight: activeActor === actor ? 700 : 400,
                transition: 'all 0.2s',
              }}>
                {actor === 'oidc' ? 'GitLab OIDC' : actor.charAt(0).toUpperCase() + actor.slice(1)}
              </div>
            ))}
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '0.75rem' }}>
            {FLOW_STEPS.map((s, i) => {
              const done = i < step + 1
              const active = i === step
              const c = ACTOR_COLORS[s.actor]
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                  padding: '0.4rem 0.6rem', borderRadius: '6px',
                  background: active ? c.bg : done ? '#f0f4ff' : '#fafafa',
                  border: `1px solid ${active ? c.border : done ? '#c5cae9' : '#e0e0e0'}`,
                  opacity: i > step + 1 ? 0.5 : 1,
                  transition: 'all 0.2s',
                }}>
                  <div style={{ minWidth: '20px', height: '20px', borderRadius: '50%', background: done ? '#3949AB' : '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#fff', fontWeight: 700, marginTop: '1px' }}>
                    {done ? (active ? i + 1 : '✓') : i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: active ? 700 : 400, color: active ? c.color : '#333' }}>{s.label}</div>
                    {active && <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '2px' }}>{s.detail}</div>}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setStep(prev => Math.min(prev + 1, FLOW_STEPS.length - 1))}
              disabled={step >= FLOW_STEPS.length - 1}
              style={{ padding: '0.4rem 1rem', borderRadius: '6px', border: 'none', background: step >= FLOW_STEPS.length - 1 ? '#ccc' : '#3949AB', color: '#fff', cursor: step >= FLOW_STEPS.length - 1 ? 'default' : 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
            >
              {step === -1 ? 'Начать' : 'Следующий шаг'}
            </button>
            <button
              onClick={() => setStep(-1)}
              style={{ padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Сбросить
            </button>
          </div>
        </div>
      )}

      {/* Secrets engine */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Secrets Engine</div>
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
          {(['kv', 'aws', 'database'] as SecretsEngine[]).map(e => (
            <button key={e} onClick={() => setEngine(e)} style={btnStyle(engine === e, '#2E7D32', '#E8F5E9')}>
              {e.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.82rem', color: '#555', marginBottom: '0.5rem' }}>{ENGINE_EXAMPLES[engine].desc}</div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 220px' }}>
            <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '2px' }}>Команда:</div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.75rem', margin: 0, whiteSpace: 'pre-wrap' }}>
              {ENGINE_EXAMPLES[engine].cmd}
            </pre>
          </div>
          <div style={{ flex: '1 1 220px' }}>
            <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '2px' }}>Возвращает:</div>
            <pre style={{ background: '#1e1e1e', color: '#A5D6A7', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.75rem', margin: 0, whiteSpace: 'pre-wrap' }}>
              {ENGINE_EXAMPLES[engine].result}
            </pre>
          </div>
        </div>
      </div>

      {/* YAML */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Конфигурация GitLab CI</div>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.75rem', margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
          {buildVaultYaml(secretType, engine)}
        </pre>
      </div>
    </div>
  )
}

// ============================================
// Task 10.3: Pipeline protection — branches, environments, approvals
// ============================================

type MergeRole = 'developers' | 'maintainers' | 'owners'

interface CheckStep {
  name: string
  passed: boolean
  detail: string
}

interface ScenarioResult {
  passed: boolean
  steps: CheckStep[]
  reason: string
}

interface ProtectionConfig {
  protectedBranch: boolean
  mergeRole: MergeRole
  approvalsEnabled: boolean
  requiredApprovals: number
  noSelfApproval: boolean
}

type Scenario = 'A' | 'B' | 'C'

const SCENARIOS: Record<Scenario, { label: string; desc: string }> = {
  A: { label: 'Сценарий A', desc: 'Developer пушит feature/login, запускает deploy-production' },
  B: { label: 'Сценарий B', desc: 'Maintainer мёрджит MR в main, 1 approver уже одобрил деплой' },
  C: { label: 'Сценарий C', desc: 'Developer пытается апрувить свой собственный деплой' },
}

function checkScenario(config: ProtectionConfig, scenario: Scenario): ScenarioResult {
  if (scenario === 'A') {
    const branchOk = !config.protectedBranch
    const approvalsOk = !config.approvalsEnabled || config.requiredApprovals <= 1
    const steps: CheckStep[] = [
      {
        name: 'Проверка ветки',
        passed: branchOk,
        detail: branchOk
          ? 'feature/login — ветка не protected, правило не применяется'
          : 'feature/login не является protected branch — protected переменные недоступны',
      },
      {
        name: 'Проверка окружения',
        passed: branchOk,
        detail: branchOk
          ? 'Деплой из feature-ветки разрешён конфигурацией'
          : 'Environment "production" ограничен: только protected branches',
      },
      {
        name: 'Проверка апрувов',
        passed: approvalsOk || !branchOk === false,
        detail: config.approvalsEnabled
          ? `Требуется ${config.requiredApprovals} апрув(ов), получено 0`
          : 'Апрувы не настроены',
      },
    ]
    const passed = branchOk
    return {
      passed,
      steps,
      reason: passed
        ? 'Деплой разрешён: ветка доступна, защита не ограничивает feature-ветки'
        : 'Деплой заблокирован: feature/login не является protected branch — protected переменные PROD_* недоступны',
    }
  }

  if (scenario === 'B') {
    const branchOk = true // main is always fine for maintainer merge
    const roleOk = config.mergeRole === 'developers' || config.mergeRole === 'maintainers'
    const approvalsOk = !config.approvalsEnabled || config.requiredApprovals <= 1
    const steps: CheckStep[] = [
      {
        name: 'Проверка ветки',
        passed: true,
        detail: 'main — protected branch. Пуш выполнен Maintainer-ом — разрешено',
      },
      {
        name: 'Права на мёрдж',
        passed: roleOk,
        detail: roleOk
          ? `Maintainer имеет право мёрджить (настройка: ${config.mergeRole}+)`
          : `Только Owners могут мёрджить (настройка: ${config.mergeRole})`,
      },
      {
        name: 'Количество апрувов',
        passed: approvalsOk,
        detail: config.approvalsEnabled
          ? approvalsOk
            ? `Требуется ${config.requiredApprovals} апрув — уже есть 1. Достаточно.`
            : `Требуется ${config.requiredApprovals} апрува, получен 1. Недостаточно.`
          : 'Апрувы не настроены — деплой без ограничений',
      },
    ]
    const passed = roleOk && approvalsOk
    return {
      passed,
      steps,
      reason: passed
        ? 'Деплой разрешён: Maintainer имеет права, количество апрувов достаточно'
        : !roleOk
          ? 'Деплой заблокирован: Maintainer не имеет права мёрджить (требуется Owner)'
          : `Деплой заблокирован: требуется ${config.requiredApprovals} апрува, получен только 1`,
    }
  }

  // Scenario C: self-approval
  const selfOk = !config.noSelfApproval
  const approvalsOk = !config.approvalsEnabled
  const steps: CheckStep[] = [
    {
      name: 'Проверка ветки',
      passed: true,
      detail: 'Деплой инициирован с main — ветка protected, всё в порядке',
    },
    {
      name: 'Проверка самоапрува',
      passed: selfOk,
      detail: selfOk
        ? 'Self-approval разрешён конфигурацией'
        : 'Self-approval запрещён: нельзя апрувить свой собственный деплой',
    },
    {
      name: 'Итоговые апрувы',
      passed: selfOk || approvalsOk,
      detail: selfOk
        ? 'Апрув засчитан, деплой может продолжиться'
        : 'Апрув не засчитан — нужен апрув от другого человека',
    },
  ]
  const passed = selfOk
  return {
    passed,
    steps,
    reason: passed
      ? 'Апрув засчитан: self-approval разрешён конфигурацией'
      : 'Апрув отклонён: запрещено апрувить собственный деплой (prevent self-approval)',
  }
}

function buildDeployYaml(config: ProtectionConfig): string {
  const approvalComment = config.approvalsEnabled
    ? `\n  # requires ${config.requiredApprovals} approval(s) in GitLab Environment settings`
    : ''
  return `deploy-production:
  stage: deploy
  environment:
    name: production${approvalComment}
    url: https://my-app.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual   # ручной запуск
    - when: never
  script:
    - echo "Deploying by: $GITLAB_USER_LOGIN"
    - ./deploy-prod.sh`
}

export function Task10_3_Solution() {
  const [protectedBranch, setProtectedBranch] = useState(true)
  const [mergeRole, setMergeRole] = useState<MergeRole>('maintainers')
  const [approvalsEnabled, setApprovalsEnabled] = useState(true)
  const [requiredApprovals, setRequiredApprovals] = useState(2)
  const [noSelfApproval, setNoSelfApproval] = useState(true)
  const [scenario, setScenario] = useState<Scenario | null>(null)

  const config: ProtectionConfig = { protectedBranch, mergeRole, approvalsEnabled, requiredApprovals, noSelfApproval }
  const result = scenario ? checkScenario(config, scenario) : null

  const btnStyle = (active: boolean, color = '#1565C0', activeBg = '#E3F2FD') => ({
    padding: '0.35rem 0.8rem',
    borderRadius: '6px',
    border: active ? `2px solid ${color}` : '1px solid #ccc',
    background: active ? activeBg : '#fff',
    color: active ? color : '#555',
    fontWeight: active ? 700 : 400,
    cursor: 'pointer',
    fontSize: '0.82rem',
  })

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Защита пайплайна: ветки, окружения, апрувы</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Настрой слои защиты и проверь сценарии деплоя
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Config */}
        <div style={{ flex: '1 1 280px' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Конфигурация защиты</div>

          {/* Protected Branch */}
          <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#F3F4F6', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Protected Branch (main)</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                <input type='checkbox' checked={protectedBranch} onChange={e => setProtectedBranch(e.target.checked)} />
                <span style={{ fontSize: '0.8rem' }}>{protectedBranch ? 'Включено' : 'Выключено'}</span>
              </label>
            </div>
            {protectedBranch && (
              <div>
                <div style={{ fontSize: '0.78rem', color: '#555', marginBottom: '0.35rem' }}>Кто может мёрджить:</div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {(['developers', 'maintainers', 'owners'] as MergeRole[]).map(r => (
                    <button key={r} onClick={() => setMergeRole(r)} style={btnStyle(mergeRole === r)}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Environment Approvals */}
          <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#F3F4F6', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Environment Approvals</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                <input type='checkbox' checked={approvalsEnabled} onChange={e => setApprovalsEnabled(e.target.checked)} />
                <span style={{ fontSize: '0.8rem' }}>{approvalsEnabled ? 'Включено' : 'Выключено'}</span>
              </label>
            </div>
            {approvalsEnabled && (
              <div>
                <div style={{ fontSize: '0.78rem', color: '#555', marginBottom: '0.35rem' }}>Количество апрувов:</div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {[1, 2, 3].map(n => (
                    <button key={n} onClick={() => setRequiredApprovals(n)} style={btnStyle(requiredApprovals === n)}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Self-approval */}
          <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#F3F4F6', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Prevent Self-Approval</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                <input type='checkbox' checked={noSelfApproval} onChange={e => setNoSelfApproval(e.target.checked)} />
                <span style={{ fontSize: '0.8rem' }}>{noSelfApproval ? 'Включено' : 'Выключено'}</span>
              </label>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.35rem' }}>
              {noSelfApproval ? 'Нельзя апрувить свой собственный деплой' : 'Разработчик может апрувить свой деплой'}
            </div>
          </div>
        </div>

        {/* Scenarios + Result */}
        <div style={{ flex: '1 1 280px' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Сценарии</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {(Object.entries(SCENARIOS) as [Scenario, { label: string; desc: string }][]).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setScenario(key)}
                style={{
                  textAlign: 'left', padding: '0.6rem 0.8rem', borderRadius: '8px',
                  border: scenario === key ? '2px solid #3949AB' : '1px solid #ccc',
                  background: scenario === key ? '#E8EAF6' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#3949AB' }}>{s.label}</div>
                <div style={{ fontSize: '0.78rem', color: '#555', marginTop: '2px' }}>{s.desc}</div>
              </button>
            ))}
          </div>

          {result && (
            <div>
              {/* Check steps */}
              <div style={{ marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {result.steps.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                    padding: '0.4rem 0.6rem', borderRadius: '6px',
                    background: s.passed ? '#E8F5E9' : '#FFEBEE',
                    border: `1px solid ${s.passed ? '#A5D6A7' : '#EF9A9A'}`,
                  }}>
                    <span style={{ fontSize: '0.9rem', marginTop: '1px' }}>{s.passed ? 'OK' : 'X'}</span>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: s.passed ? '#2E7D32' : '#C62828' }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#555' }}>{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Verdict */}
              <div style={{
                padding: '1rem', borderRadius: '10px', textAlign: 'center',
                background: result.passed ? '#E8F5E9' : '#FFEBEE',
                border: `2px solid ${result.passed ? '#66BB6A' : '#EF5350'}`,
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{result.passed ? 'ДЕПЛОЙ РАЗРЕШЁН' : 'ДЕПЛОЙ ЗАБЛОКИРОВАН'}</div>
                <div style={{ fontSize: '0.82rem', color: '#555' }}>{result.reason}</div>
              </div>
            </div>
          )}

          {!result && (
            <div style={{ textAlign: 'center', color: '#999', fontSize: '0.875rem', padding: '2rem 0' }}>
              Выбери сценарий чтобы проверить конфигурацию
            </div>
          )}
        </div>
      </div>

      {/* YAML */}
      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Конфигурация джоба</div>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.75rem', margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
          {buildDeployYaml(config)}
        </pre>
      </div>
    </div>
  )
}
