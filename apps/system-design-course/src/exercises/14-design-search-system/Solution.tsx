import { useState, useCallback } from 'react'

// ============================================
// Задание 14.1: Справочная карточка — Search System
// ============================================

export function Task14_1_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Search System — краткая справка</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Inverted Index</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Принцип</strong>: для каждого терма хранится список документов (posting list),
            где этот терм встречается.
            <br /><br />
            <strong>Аналогия</strong>: алфавитный указатель в книге — слово {'→'} страницы.
            <br /><br />
            <strong>Структура</strong>: term {'→'} [{'{'}docId, TF, positions{'}'}].
            <br /><br />
            <strong>Преимущество</strong>: O(1) lookup по терму вместо O(N) full scan.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>TF-IDF / BM25</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>TF</strong>: Term Frequency — как часто слово в документе (локальный вес).
            <br /><br />
            <strong>IDF</strong>: Inverse Document Frequency — редкие слова ценнее (глобальный вес).
            <br /><br />
            <strong>BM25</strong>: улучшенный TF-IDF с насыщением TF и нормализацией длины документа.
            <br /><br />
            <strong>Стандарт</strong>: BM25 используется в Elasticsearch / Lucene по умолчанию.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Elasticsearch (Shards + Replicas)</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Shard</strong>: горизонтальный раздел индекса (10-50 GB). Каждый шард — Lucene index.
            <br /><br />
            <strong>Replica</strong>: копия шарда для отказоустойчивости и распределения read-нагрузки.
            <br /><br />
            <strong>Scatter-Gather</strong>: запрос на все шарды параллельно {'→'} merge top-K результатов.
            <br /><br />
            <strong>Правило</strong>: 1 шард = 10-50 GB, реплик = N-1 для N-availability.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Typeahead (Trie)</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Trie</strong>: prefix tree с предвычисленными top-K suggestions в каждом узле.
            <br /><br />
            <strong>Latency</strong>: {'<'} 10 мс (O(L), L — длина префикса).
            <br /><br />
            <strong>Отдельный сервис</strong>: не нагружать основной search cluster 60K+ RPS typeahead.
            <br /><br />
            <strong>Обновление</strong>: батчами из search logs (ежечасно).
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Fuzzy Matching</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Edit distance</strong>: расстояние Левенштейна — мин. число вставок/удалений/замен.
            <br /><br />
            <strong>Fuzziness AUTO</strong>: {'<'} 3 символов — exact, 3-5 — 1 edit, {'>'} 5 — 2 edits.
            <br /><br />
            <strong>Пример</strong>: {'"iphon" → "iphone"'} (1 edit: вставка {'"e"'}).
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e0f2f1', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Search Ranking Pipeline</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>1. Query Parsing</strong> — разбор запроса (AND, OR, фразы, исключения).
            <br /><br />
            <strong>2. BM25 Scoring</strong> — текстовая релевантность по inverted index.
            <br /><br />
            <strong>3. Boosting</strong> — popularity, freshness, quality signals.
            <br /><br />
            <strong>4. Re-ranking</strong> — ML-модель (LambdaMART, BERT) для финального порядка.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 14.2: Визуализатор Inverted Index
// ============================================

const STOP_WORDS = new Set([
  'и', 'в', 'на', 'с', 'по', 'для', 'из', 'к', 'от', 'до', 'о', 'за', 'не', 'но', 'а', 'или',
  'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were',
  'it', 'this', 'that', 'be', 'as', 'do', 'has', 'have', 'had',
])

const STEM_RULES: Array<[RegExp, string]> = [
  [/ами$/i, ''],
  [/ями$/i, ''],
  [/ение$/i, ''],
  [/ание$/i, ''],
  [/ость$/i, ''],
  [/ести$/i, ''],
  [/ющий$/i, ''],
  [/ущий$/i, ''],
  [/ающ$/i, ''],
  [/ного$/i, ''],
  [/ная$/i, ''],
  [/ные$/i, ''],
  [/ный$/i, ''],
  [/ого$/i, ''],
  [/ому$/i, ''],
  [/ать$/i, ''],
  [/ить$/i, ''],
  [/ает$/i, ''],
  [/ить$/i, ''],
  [/ой$/i, ''],
  [/ые$/i, ''],
  [/ый$/i, ''],
  [/ая$/i, ''],
  [/ие$/i, ''],
  [/ий$/i, ''],
  [/ов$/i, ''],
  [/ей$/i, ''],
  [/ам$/i, ''],
  [/ing$/i, ''],
  [/tion$/i, ''],
  [/ed$/i, ''],
  [/es$/i, ''],
  [/er$/i, ''],
  [/ly$/i, ''],
  [/s$/i, ''],
]

function simpleStem(word: string): string {
  if (word.length <= 3) return word
  for (const [pattern, replacement] of STEM_RULES) {
    if (pattern.test(word)) {
      const stemmed = word.replace(pattern, replacement)
      if (stemmed.length >= 2) return stemmed
    }
  }
  return word
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\sа-яёА-ЯЁ]/gi, '')
    .split(/\s+/)
    .filter(t => t.length > 0)
}

function removeStopWords(tokens: string[]): string[] {
  return tokens.filter(t => !STOP_WORDS.has(t))
}

interface PostingEntry {
  docId: number
  termFrequency: number
  positions: number[]
}

interface InvertedIndexMap {
  [term: string]: PostingEntry[]
}

interface TokenInfo {
  docId: number
  original: string
  tokens: string[]
  filtered: string[]
  stems: string[]
}

interface SearchResult {
  docId: number
  text: string
  score: number
  tfValues: { [term: string]: number }
  idfValues: { [term: string]: number }
  tfidfValues: { [term: string]: number }
  matchedTerms: string[]
}

const DEFAULT_DOCS = `The quick brown fox jumps over the lazy dog
The lazy brown dog sleeps in the sun
Quick foxes are smarter than lazy dogs
The sun shines brightly over the brown hills
Dogs and foxes play together in the park`

export function Task14_2_Solution() {
  const [docsInput, setDocsInput] = useState(DEFAULT_DOCS)
  const [index, setIndex] = useState<InvertedIndexMap | null>(null)
  const [tokenInfos, setTokenInfos] = useState<TokenInfo[]>([])
  const [documents, setDocuments] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  const buildIndex = useCallback(() => {
    const docs = docsInput.split('\n').filter(line => line.trim().length > 0)
    setDocuments(docs)
    const newIndex: InvertedIndexMap = {}
    const infos: TokenInfo[] = []

    docs.forEach((doc, docId) => {
      const tokens = tokenize(doc)
      const filtered = removeStopWords(tokens)
      const stems = filtered.map(t => simpleStem(t))

      infos.push({
        docId,
        original: doc,
        tokens,
        filtered,
        stems,
      })

      stems.forEach((stem, pos) => {
        if (!newIndex[stem]) newIndex[stem] = []
        const existing = newIndex[stem].find(p => p.docId === docId)
        if (existing) {
          existing.termFrequency++
          existing.positions.push(pos)
        } else {
          newIndex[stem].push({ docId, termFrequency: 1, positions: [pos] })
        }
      })
    })

    setIndex(newIndex)
    setTokenInfos(infos)
    setSearchResults([])
    setSearchQuery('')
  }, [docsInput])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (!index || !query.trim()) {
      setSearchResults([])
      return
    }

    const queryTokens = removeStopWords(tokenize(query)).map(t => simpleStem(t))
    if (queryTokens.length === 0) {
      setSearchResults([])
      return
    }

    const totalDocs = documents.length

    // Find documents matching ALL query terms (AND logic)
    const postingLists = queryTokens.map(t => index[t] || [])
    if (postingLists.some(pl => pl.length === 0)) {
      setSearchResults([])
      return
    }

    // Intersect posting lists
    const docIds = postingLists.reduce<number[]>(
      (acc, pl) => {
        const plDocIds = new Set(pl.map(p => p.docId))
        return acc.filter(id => plDocIds.has(id))
      },
      postingLists[0].map(p => p.docId)
    )

    const results: SearchResult[] = docIds.map(docId => {
      const docText = documents[docId]
      const docTokenCount = removeStopWords(tokenize(docText)).length
      let totalScore = 0
      const tfValues: { [term: string]: number } = {}
      const idfValues: { [term: string]: number } = {}
      const tfidfValues: { [term: string]: number } = {}
      const matchedTerms: string[] = []

      for (const queryTerm of queryTokens) {
        const postings = index[queryTerm] || []
        const docPosting = postings.find(p => p.docId === docId)
        const tf = docPosting ? docPosting.termFrequency / docTokenCount : 0
        const df = postings.length
        const idf = Math.log(totalDocs / (1 + df))
        const tfidf = tf * idf

        tfValues[queryTerm] = tf
        idfValues[queryTerm] = idf
        tfidfValues[queryTerm] = tfidf
        totalScore += tfidf

        if (docPosting) {
          matchedTerms.push(queryTerm)
        }
      }

      return {
        docId,
        text: docText,
        score: totalScore,
        tfValues,
        idfValues,
        tfidfValues,
        matchedTerms,
      }
    })

    results.sort((a, b) => b.score - a.score)
    setSearchResults(results)
  }, [index, documents])

  const sortedTerms = index
    ? Object.keys(index).sort((a, b) => a.localeCompare(b))
    : []

  const maxScore = searchResults.length > 0
    ? Math.max(...searchResults.map(r => r.score))
    : 1

  const cellStyle: React.CSSProperties = {
    padding: '0.4rem 0.6rem',
    borderBottom: '1px solid #e0e0e0',
    fontSize: '0.85rem',
    textAlign: 'left' as const,
  }

  const headerCellStyle: React.CSSProperties = {
    ...cellStyle,
    background: '#f5f5f5',
    fontWeight: 'bold',
    position: 'sticky' as const,
    top: 0,
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Визуализатор Inverted Index</h2>

      {/* Document Input */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Документы (каждая строка = документ):
        </label>
        <textarea
          value={docsInput}
          onChange={e => setDocsInput(e.target.value)}
          rows={6}
          style={{
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={buildIndex}
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1.5rem',
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Построить индекс
        </button>
      </div>

      {index && (
        <>
          {/* Tokenization table */}
          <h3>Tokenization Pipeline</h3>
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>Doc</th>
                  <th style={headerCellStyle}>Original</th>
                  <th style={headerCellStyle}>Tokens</th>
                  <th style={headerCellStyle}>Stop-words removed</th>
                  <th style={headerCellStyle}>Stemmed</th>
                </tr>
              </thead>
              <tbody>
                {tokenInfos.map(info => (
                  <tr key={info.docId}>
                    <td style={cellStyle}>#{info.docId}</td>
                    <td style={{ ...cellStyle, maxWidth: '200px' }}>{info.original}</td>
                    <td style={cellStyle}>
                      <code>{info.tokens.join(', ')}</code>
                    </td>
                    <td style={cellStyle}>
                      <code>{info.filtered.join(', ')}</code>
                    </td>
                    <td style={cellStyle}>
                      <code style={{ color: '#1976d2' }}>{info.stems.join(', ')}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inverted Index table */}
          <h3>Inverted Index</h3>
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>Term</th>
                  <th style={headerCellStyle}>Doc Frequency</th>
                  <th style={headerCellStyle}>Posting List (docId: TF)</th>
                </tr>
              </thead>
              <tbody>
                {sortedTerms.map(term => {
                  const postings = index[term]
                  return (
                    <tr key={term}>
                      <td style={{ ...cellStyle, fontFamily: 'monospace', fontWeight: 'bold', color: '#1976d2' }}>
                        {term}
                      </td>
                      <td style={cellStyle}>{postings.length}</td>
                      <td style={cellStyle}>
                        {postings.map((p, i) => (
                          <span key={p.docId}>
                            {i > 0 && ', '}
                            <span style={{
                              background: '#e3f2fd',
                              padding: '0.1rem 0.3rem',
                              borderRadius: '3px',
                              fontSize: '0.8rem',
                            }}>
                              Doc#{p.docId}: {p.termFrequency}
                            </span>
                          </span>
                        ))}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Search */}
          <h3>Поиск по индексу</h3>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Введите поисковый запрос (AND-логика для нескольких слов)..."
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {searchQuery.trim() && searchResults.length === 0 && (
            <div style={{
              padding: '1rem',
              background: '#fff3e0',
              borderRadius: '8px',
              color: '#e65100',
              marginBottom: '1rem',
            }}>
              Ничего не найдено. Попробуйте другой запрос.
            </div>
          )}

          {searchResults.length > 0 && (
            <div>
              <h4>Результаты ({searchResults.length} документов)</h4>
              {searchResults.map((result, idx) => (
                <div
                  key={result.docId}
                  style={{
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    background: idx === 0 ? '#e8f5e9' : '#fff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong>Doc #{result.docId}</strong>
                    <span style={{
                      background: '#1976d2',
                      color: '#fff',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                    }}>
                      Score: {result.score.toFixed(4)}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>{result.text}</p>

                  {/* Score bar */}
                  <div style={{
                    height: '6px',
                    background: '#e0e0e0',
                    borderRadius: '3px',
                    marginBottom: '0.5rem',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(result.score / maxScore) * 100}%`,
                      background: '#4caf50',
                      borderRadius: '3px',
                      transition: 'width 0.3s',
                    }} />
                  </div>

                  {/* TF-IDF breakdown */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                      <thead>
                        <tr>
                          <th style={{ ...headerCellStyle, fontSize: '0.75rem' }}>Term</th>
                          <th style={{ ...headerCellStyle, fontSize: '0.75rem' }}>TF</th>
                          <th style={{ ...headerCellStyle, fontSize: '0.75rem' }}>IDF</th>
                          <th style={{ ...headerCellStyle, fontSize: '0.75rem' }}>TF-IDF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.matchedTerms.map(term => (
                          <tr key={term}>
                            <td style={{ ...cellStyle, fontFamily: 'monospace', fontSize: '0.8rem' }}>{term}</td>
                            <td style={{ ...cellStyle, fontSize: '0.8rem' }}>{result.tfValues[term]?.toFixed(4)}</td>
                            <td style={{ ...cellStyle, fontSize: '0.8rem' }}>{result.idfValues[term]?.toFixed(4)}</td>
                            <td style={{ ...cellStyle, fontSize: '0.8rem', fontWeight: 'bold' }}>
                              {result.tfidfValues[term]?.toFixed(4)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ============================================
// Задание 14.3: Полный System Design — Search
// ============================================

interface SectionData {
  title: string
  content: React.ReactNode
}

function CollapsibleSection({ title, content, defaultOpen = false }: SectionData & { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{
      marginBottom: '0.75rem',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '0.75rem 1rem',
          background: open ? '#e3f2fd' : '#f5f5f5',
          cursor: 'pointer',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.95rem',
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: '1.2rem' }}>{open ? '\u25B2' : '\u25BC'}</span>
      </div>
      {open && (
        <div style={{ padding: '1rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
          {content}
        </div>
      )}
    </div>
  )
}

function TechTable({ rows }: { rows: Array<{ component: string; tech: string; why: string }> }) {
  const cellStyle: React.CSSProperties = {
    padding: '0.4rem 0.6rem',
    borderBottom: '1px solid #e0e0e0',
    fontSize: '0.85rem',
    textAlign: 'left' as const,
  }
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '0.5rem' }}>
      <thead>
        <tr>
          <th style={{ ...cellStyle, background: '#f5f5f5', fontWeight: 'bold' }}>Компонент</th>
          <th style={{ ...cellStyle, background: '#f5f5f5', fontWeight: 'bold' }}>Технология</th>
          <th style={{ ...cellStyle, background: '#f5f5f5', fontWeight: 'bold' }}>Почему</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>{row.component}</td>
            <td style={cellStyle}>{row.tech}</td>
            <td style={cellStyle}>{row.why}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function Task14_3_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>System Design: Поисковая система для e-commerce</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        50M товаров, 100K поисковых RPS, latency {'<'} 200 мс, near real-time indexing.
      </p>

      <CollapsibleSection
        title="1. Requirements & Estimates"
        defaultOpen={true}
        content={
          <div>
            <h4 style={{ margin: '0 0 0.5rem' }}>Functional</h4>
            <ul style={{ margin: '0 0 1rem', paddingLeft: '1.5rem' }}>
              <li>Full-text search по товарам (название, описание, бренд, SKU)</li>
              <li>Faceted search: цена, категория, бренд, рейтинг, наличие</li>
              <li>Typeahead / autocomplete с популярными запросами</li>
              <li>Fuzzy matching для опечаток</li>
              <li>Сортировка: релевантность, цена, популярность, новизна</li>
              <li>Синонимы: «телефон» = «смартфон»</li>
            </ul>

            <h4 style={{ margin: '0 0 0.5rem' }}>Non-Functional</h4>
            <ul style={{ margin: '0 0 1rem', paddingLeft: '1.5rem' }}>
              <li>50M товаров, средний размер документа ~2 KB</li>
              <li>100K поисковых RPS (пик)</li>
              <li>Latency {'<'} 200 мс (p99)</li>
              <li>Near real-time indexing: {'<'} 30 сек</li>
              <li>99.99% availability</li>
            </ul>

            <h4 style={{ margin: '0 0 0.5rem' }}>Back-of-the-envelope</h4>
            <div style={{ background: '#f5f5f5', padding: '0.75rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
              <div>Documents: 50M x 2 KB = 100 GB raw data</div>
              <div>Inverted index: ~20% = 20 GB</div>
              <div>Shards: 20 GB / 10 GB per shard = 2 primary shards (minimum)</div>
              <div>With replicas (x3): 6 shard copies</div>
              <div>Typeahead: 10M unique queries x 50 bytes = 500 MB (fits in memory)</div>
              <div>Search QPS: 100K RPS / 6 shard copies = ~17K per shard</div>
              <div>Typeahead QPS: 100K x 5 chars = 500K RPS (separate service)</div>
            </div>
          </div>
        }
      />

      <CollapsibleSection
        title="2. High-Level Architecture"
        content={
          <div>
            <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: '1.8', overflowX: 'auto' }}>
              <div>[Client] {'-->'} [Load Balancer] {'-->'} [API Gateway]</div>
              <div style={{ paddingLeft: '2rem' }}>{'|-->'} [Query Service] {'-->'} [ES Coordinator] {'-->'} [Shard 0..N]</div>
              <div style={{ paddingLeft: '2rem' }}>{'|-->'} [Typeahead Service] {'-->'} [Redis Trie]</div>
              <div style={{ paddingLeft: '2rem' }}>{'|-->'} [Ranking Service] (ML re-ranker)</div>
              <div style={{ marginTop: '0.5rem' }}>[Product Service] {'-->'} [Kafka] {'-->'} [Indexer Workers] {'-->'} [ES Shards]</div>
              <div>[Search Logs] {'-->'} [ClickHouse] {'-->'} [Analytics Dashboard]</div>
            </div>

            <h4 style={{ margin: '1rem 0 0.5rem' }}>Компоненты</h4>
            <TechTable rows={[
              { component: 'Search Engine', tech: 'Elasticsearch 8.x', why: 'Inverted index, BM25, sharding, aggregations из коробки' },
              { component: 'Message Queue', tech: 'Kafka', why: 'Буферизация перед индексацией, exactly-once, replay' },
              { component: 'Typeahead', tech: 'Redis Sorted Sets', why: 'Предвычисленные suggestions, < 5 мс latency' },
              { component: 'Ranking ML', tech: 'LambdaMART / XGBoost', why: 'Learning-to-rank на основе CTR, conversion' },
              { component: 'Product Store', tech: 'PostgreSQL (sharded)', why: 'Source of truth для товаров, ACID' },
              { component: 'Cache', tech: 'Redis', why: 'Кеширование популярных запросов (top 1000)' },
              { component: 'Analytics', tech: 'ClickHouse', why: 'Search logs, CTR, zero-result rate анализ' },
            ]} />
          </div>
        }
      />

      <CollapsibleSection
        title="3. Indexing Pipeline"
        content={
          <div>
            <h4 style={{ margin: '0 0 0.5rem' }}>Data Flow</h4>
            <div style={{ background: '#e8f5e9', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <strong>Product Created/Updated</strong> {'-->'} Product Service writes to PostgreSQL {'-->'}
              CDC event to Kafka {'-->'} Indexer Worker consumes event {'-->'}
              Tokenize + Normalize + Enrich {'-->'} Index into ES shard {'-->'}
              Available in search within 1-5 seconds
            </div>

            <h4 style={{ margin: '0 0 0.5rem' }}>Document Schema in ES</h4>
            <pre style={{ background: '#f5f5f5', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', overflow: 'auto' }}>
{`{
  "product_id": "string",
  "title": "text (analyzed, boosted x3)",
  "description": "text (analyzed)",
  "brand": "keyword + text",
  "category": "keyword (for facets)",
  "price": "float (for range filter)",
  "rating": "float (for filter + boost)",
  "in_stock": "boolean (for filter)",
  "sales_count": "integer (for popularity)",
  "created_at": "date (for freshness)"
}`}
            </pre>

            <h4 style={{ margin: '1rem 0 0.5rem' }}>Sharding Strategy</h4>
            <p>
              <strong>Hash-based (по product_id)</strong> — равномерное распределение, scatter-gather для каждого запроса.
              При 50M товаров и 10 GB per shard: минимум 2 primary шарда + 2 реплики каждого = 6 shard copies.
              Для 100K RPS с запасом: 10 primary шардов x 3 реплики = 30 shard copies.
            </p>
            <p style={{ color: '#e65100' }}>
              <strong>Не по категории!</strong> Категории неравномерны: «Электроника» = 10M товаров,
              «Антиквариат» = 100 товаров. Это создаст hot spots.
            </p>
          </div>
        }
      />

      <CollapsibleSection
        title="4. Search & Ranking Pipeline"
        content={
          <div>
            <h4 style={{ margin: '0 0 0.5rem' }}>Pipeline</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {[
                { step: '1', name: 'Query Parse', desc: 'Разбор, spell check, synonyms' },
                { step: '2', name: 'BM25 Retrieval', desc: 'Top 1000 по текстовой релевантности' },
                { step: '3', name: 'Business Boost', desc: 'price, rating, stock, sales' },
                { step: '4', name: 'Personalization', desc: 'История покупок, просмотров' },
                { step: '5', name: 'ML Re-rank', desc: 'LambdaMART на CTR features' },
                { step: '6', name: 'Ads Injection', desc: 'Sponsored results в позиции 1,4,8' },
              ].map(s => (
                <div key={s.step} style={{
                  padding: '0.5rem 0.75rem',
                  background: '#e3f2fd',
                  borderRadius: '8px',
                  flex: '1 1 auto',
                  minWidth: '140px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{s.step}. {s.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>{s.desc}</div>
                </div>
              ))}
            </div>

            <h4 style={{ margin: '0 0 0.5rem' }}>Scoring Formula</h4>
            <pre style={{ background: '#f5f5f5', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', overflow: 'auto' }}>
{`final_score =
  bm25_score(query, doc)          // Текстовая релевантность
  * (1 + log(1 + sales_count) * 0.1)  // Популярность
  * (in_stock ? 1.0 : 0.3)            // Наличие на складе
  * (1 + rating / 5 * 0.2)            // Рейтинг
  * freshness_decay(created_at)        // Свежесть (для новинок)
  * personalization_boost(user, doc)   // Персонализация`}
            </pre>

            <h4 style={{ margin: '1rem 0 0.5rem' }}>Обработка нулевых результатов</h4>
            <ol style={{ paddingLeft: '1.5rem', fontSize: '0.85rem' }}>
              <li><strong>Spell correction</strong>: {'"iphon" --> "did you mean: iphone?"'}</li>
              <li><strong>Synonyms</strong>: {'"смартфон" --> also search "телефон", "мобильный"'}</li>
              <li><strong>Relaxed query</strong>: убрать наименее важный терм и повторить</li>
              <li><strong>Fallback</strong>: показать популярные товары в категории</li>
            </ol>
          </div>
        }
      />

      <CollapsibleSection
        title="5. Typeahead Service"
        content={
          <div>
            <p>
              <strong>Отдельный сервис</strong>, не нагружает основной ES cluster.
              500K+ RPS (каждый символ = запрос).
            </p>

            <h4 style={{ margin: '1rem 0 0.5rem' }}>Реализация</h4>
            <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem' }}>
              <li><strong>Redis Sorted Sets</strong>: prefix {'-->'} sorted set of suggestions by score</li>
              <li>Score = количество поисков за последние 7 дней (с decay)</li>
              <li>Обновление: батчами каждый час из search logs (ClickHouse {'-->'} Redis)</li>
              <li>Latency: {'<'} 5 мс (ZRANGEBYSCORE в Redis)</li>
            </ul>

            <h4 style={{ margin: '1rem 0 0.5rem' }}>Personalized Suggestions</h4>
            <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem' }}>
              <li>Merge глобальных suggestions + пользовательской истории поиска</li>
              <li>Boost категорий, которые пользователь часто покупает</li>
              <li>Пример: {'"ip" --> для tech-buyer: "iphone 15", для музыканта: "ipad pro"'}</li>
            </ul>
          </div>
        }
      />

      <CollapsibleSection
        title="6. Faceted Search"
        content={
          <div>
            <p>
              Facets — это фильтры с подсчётом: «Brand: Apple (42), Samsung (38)».
              Реализованы через ES aggregations.
            </p>

            <pre style={{ background: '#f5f5f5', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', overflow: 'auto' }}>
{`POST /products/_search
{
  "query": { "match": { "title": "телефон" } },
  "aggs": {
    "brands":       { "terms": { "field": "brand" } },
    "price_ranges": { "range": { "field": "price",
      "ranges": [
        { "to": 10000 },
        { "from": 10000, "to": 30000 },
        { "from": 30000, "to": 70000 },
        { "from": 70000 }
      ]
    }},
    "avg_rating":   { "avg": { "field": "rating" } },
    "in_stock":     { "filter": { "term": { "in_stock": true } } }
  }
}`}
            </pre>

            <p style={{ marginTop: '0.5rem', color: '#e65100', fontSize: '0.85rem' }}>
              <strong>Aggregations выполняются параллельно с поиском</strong> на тех же шардах.
              Для тяжёлых facets (100+ значений) используйте sampling или отдельный facet-index.
            </p>
          </div>
        }
      />

      <CollapsibleSection
        title="7. Monitoring & Quality"
        content={
          <div>
            <TechTable rows={[
              { component: 'Search Latency', tech: 'p50, p95, p99', why: 'Главная метрика: < 200 мс p99' },
              { component: 'Zero-result Rate', tech: '% запросов без результатов', why: 'Цель: < 5%. Высокий = плохие synonyms/spelling' },
              { component: 'CTR (Click-through)', tech: '% кликов по результатам', why: 'Цель: > 30%. Низкий = плохой ranking' },
              { component: 'MRR (Mean Reciprocal Rank)', tech: 'Позиция первого клика', why: 'Чем ближе к 1 — тем лучше ranking' },
              { component: 'Conversion Rate', tech: '% покупок после поиска', why: 'Главная бизнес-метрика поиска' },
              { component: 'Index Lag', tech: 'Задержка индексации', why: 'Цель: < 30 сек от создания до searchable' },
              { component: 'Shard Health', tech: 'ES cluster status', why: 'Green = OK, Yellow = missing replicas, Red = data loss' },
            ]} />
          </div>
        }
      />

      <CollapsibleSection
        title="8. Key Trade-offs & Interview Tips"
        content={
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Relevance vs Speed</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  BM25 быстрый, но ML re-ranking точнее. Компромисс: BM25 top-1000 {'-->'} ML re-rank top-50.
                </p>
              </div>
              <div style={{ padding: '0.75rem', background: '#fff3e0', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Freshness vs Indexing Cost</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  Real-time indexing дороже. Near real-time (1-5 сек) — оптимальный баланс через Kafka buffering.
                </p>
              </div>
              <div style={{ padding: '0.75rem', background: '#e3f2fd', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Precision vs Recall</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  Strict matching (precision) vs fuzzy/synonyms (recall). E-commerce предпочитает recall — лучше показать лишнее, чем ничего.
                </p>
              </div>
              <div style={{ padding: '0.75rem', background: '#fce4ec', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Shards: Few vs Many</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  Мало шардов = меньше overhead, но ограниченный параллелизм. Много = больше scatter-gather cost. Правило: 10-50 GB per shard.
                </p>
              </div>
            </div>
          </div>
        }
      />
    </div>
  )
}
