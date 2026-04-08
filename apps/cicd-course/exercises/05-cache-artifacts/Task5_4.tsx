// Task 5.4: Cache key strategies configurator
// Задание 5.4: Стратегии cache key

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// TODO: Define KeyStrategy type
// Three strategies: 'static' | 'branch' | 'files'
// Три стратегии: 'static' | 'branch' | 'files'
type KeyStrategy = 'static' | 'branch' | 'files'

// TODO: Define KeyStrategyInfo interface
// { id, name, description, autoInvalidation, branchIsolation, complexity, getKey, yaml }
interface KeyStrategyInfo {
  id: KeyStrategy
  name: string
  description: string
  autoInvalidation: boolean
  branchIsolation: boolean
  complexity: 'low' | 'medium' | 'high'
  getKey: (branch: string, lockfileHash: string, prefix: string) => string
  yaml: (prefix: string) => string
}

// TODO: Fill in KEY_STRATEGIES array with 3 strategies
// Static: key does not depend on branch or lockfile
// By branch: key = $CI_COMMIT_REF_SLUG (depends on branch)
// By lockfile: key = hash of lockfile (depends on content)
// Статический: key не зависит от ветки и lock-файла
// По ветке: key = $CI_COMMIT_REF_SLUG (зависит от ветки)
// По lock-файлу: key = hash lock-файла (зависит от содержимого)
const KEY_STRATEGIES: KeyStrategyInfo[] = [
  // TODO: fill in three strategies
  // TODO: заполни три стратегии
]

export function Task5_4() {
  const { t } = useLanguage()
  const [activeStrategy, setActiveStrategy] = useState<KeyStrategy>('files')
  const [currentBranch, setCurrentBranch] = useState('main')
  const [lockfileVersion, setLockfileVersion] = useState(1)
  const [prefix, setPrefix] = useState('')
  const [simHistory, setSimHistory] = useState<
    Array<{ event: string; results: Record<KeyStrategy, 'hit' | 'miss'> }>
  >([])

  const lockfileHash = `sha256-lock-v${lockfileVersion}`

  // TODO: Compute currentKeys for each strategy
  // currentKeys: Record<KeyStrategy, string>
  // Use getKey from each strategy with current branch, lockfileHash, prefix
  // TODO: Compute currentKeys for each strategy
  // currentKeys: Record<KeyStrategy, string>
  // Используй getKey из каждой стратегии с текущими branch, lockfileHash, prefix
  const currentKeys: Record<KeyStrategy, string> = {
    static: '',  // TODO
    branch: '',  // TODO
    files: '',   // TODO
  }

  // TODO: Implement simulateEvent(eventType: 'branch' | 'lockfile')
  // 1. Save prevKeys = { ...currentKeys }
  // 2. Change state: on 'branch' — toggle branch, on 'lockfile' — increment version
  // 3. Compute newKeys with new state
  // 4. For each strategy: compare newKey with prevKey — hit or miss
  // 5. Add event to simHistory (max 5 entries)
  // TODO: Implement simulateEvent(eventType: 'branch' | 'lockfile')
  // 1. Сохранить prevKeys = { ...currentKeys }
  // 2. Изменить состояние: при 'branch' — переключить ветку, при 'lockfile' — увеличить версию
  // 3. Вычислить newKeys с новым состоянием
  // 4. Для каждой стратегии: сравнить newKey с prevKey — hit или miss
  // 5. Добавить событие в simHistory (максимум 5 записей)
  const simulateEvent = (_eventType: 'branch' | 'lockfile') => {
    // TODO: implement event simulation
    // TODO: реализуй симуляцию событий
    // Hint: when switching branch main -> feature/auth and back
    // Подсказка: при смене ветки main → feature/auth и обратно
    // Hint: for lockfile — increment lockfileVersion by 1
    // Подсказка: при lockfile — увеличивай lockfileVersion на 1
  }

  // Suppress unused warnings
  void simHistory
  void setSimHistory
  void setCurrentBranch
  void setLockfileVersion
  void lockfileHash
  void currentKeys
  void KEY_STRATEGIES

  const activeStrategyInfo = KEY_STRATEGIES.find(s => s.id === activeStrategy)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.4')}</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        {t('task.5.4.subtitle')}
      </p>

      {/* TODO: Strategy cards (3 cards) */}
      {/* Click on card — setActiveStrategy(s.id) */}
      {/* Active card highlighted with blue border */}
      {/* Each card: name, description, auto-invalidation and isolation tags */}
      {/* TODO: Strategy cards (3 карточки) */}
      {/* Клик на карточку — setActiveStrategy(s.id) */}
      {/* Активная карточка выделена синей рамкой */}
      {/* В каждой карточке: название, описание, теги авто-инвалидации и изоляции */}
      {KEY_STRATEGIES.length === 0 && (
        <p style={{ color: '#aaa' }}>TODO: fill in KEY_STRATEGIES</p>
        <p style={{ color: '#aaa' }}>TODO: заполни KEY_STRATEGIES</p>
      )}

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {/* Simulator panel */}
        <div style={{ flex: '1 1 280px' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
            {t('task.5.4.simulator')}
          </div>

          {/* TODO: Current state info */}
          {/* Display: current branch, lockfile version, current key of active strategy */}
          {/* TODO: Current state info */}
          {/* Отобрази: текущую ветку, версию lock-файла, текущий ключ активной стратегии */}
          <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#aaa' }}>
            Branch: {currentBranch} | Lock v{lockfileVersion}
            {/* Ветка: {currentBranch} | Lock v{lockfileVersion} */}
          </div>

          {/* TODO: Two simulation buttons */}
          {/* "Switch branch" — simulateEvent('branch') */}
          {/* "Update lockfile" — simulateEvent('lockfile') */}
          {/* TODO: Two simulation buttons */}
          {/* "Сменить ветку" — simulateEvent('branch') */}
          {/* "Обновить lock-файл" — simulateEvent('lockfile') */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button
              onClick={() => simulateEvent('branch')}
              style={{ flex: 1, padding: '0.5rem', background: '#1565C0', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              {t('task.5.4.switchBranch')}
            </button>
            <button
              onClick={() => simulateEvent('lockfile')}
              style={{ flex: 1, padding: '0.5rem', background: '#E65100', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              {t('task.5.4.updateLockfile')}
            </button>
          </div>

          {/* TODO: Simulation history */}
          {/* For each entry in simHistory — show event and results (hit/miss) */}
          {/* TODO: Simulation history */}
          {/* Для каждой записи в simHistory — показать событие и результаты (hit/miss) */}
          <p style={{ color: '#aaa', fontSize: '0.8rem' }}>
            {simHistory.length === 0 ? t('task.5.4.noEvents') : `${simHistory.length} ${t('task.5.4.eventsCount')}`}
          </p>
        </div>

        {/* YAML + prefix panel */}
        <div style={{ flex: '1 1 280px' }}>
          {/* TODO: Prefix input */}
          {/* Text input for prefix */}
          {/* Updates setPrefix */}
          {/* TODO: Prefix input */}
          {/* Текстовое поле для ввода prefix */}
          {/* Обновляет setPrefix */}
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            {t('task.5.4.prefix')}
          </div>
          <input
            type='text'
            value={prefix}
            onChange={e => setPrefix(e.target.value)}
            placeholder={t('task.5.4.prefixPlaceholder')}
            style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.875rem', marginBottom: '1rem', boxSizing: 'border-box' }}
          />

          {/* TODO: YAML output */}
          {/* activeStrategyInfo?.yaml(prefix) */}
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            {t('task.5.4.yamlResult')}
          </div>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', borderRadius: '8px', padding: '1rem', fontSize: '0.78rem', lineHeight: 1.6, overflow: 'auto', margin: 0 }}>
            {activeStrategyInfo ? activeStrategyInfo.yaml(prefix) : '# TODO: fill in KEY_STRATEGIES'}
            {/* {activeStrategyInfo ? activeStrategyInfo.yaml(prefix) : '# TODO: заполни KEY_STRATEGIES'} */}
          </pre>
        </div>
      </div>

      {/* TODO: Comparison table */}
      {/* Columns: Strategy | Auto-invalidation | Branch isolation | Complexity */}
      {/* Rows: one per each strategy */}
      {/* Active row is highlighted */}
      {/* TODO: Comparison table */}
      {/* Столбцы: Стратегия | Авто-инвалидация | Изоляция веток | Сложность */}
      {/* Строки: по одной на каждую стратегию */}
      {/* Активная строка выделена */}
      <div style={{ color: '#aaa', fontSize: '0.85rem' }}>
        Active: {activeStrategy} | Branch: {currentBranch} | Prefix: {prefix || '(none)'}
        {/* Active: {activeStrategy} | Branch: {currentBranch} | Prefix: {prefix || '(нет)'} */}
      </div>
      <div style={{ display: 'none' }}>
        <button onClick={() => setActiveStrategy('static')} />
      </div>
    </div>
  )
}
