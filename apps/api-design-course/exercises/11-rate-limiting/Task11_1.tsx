import { useState, useEffect, useRef } from 'react'

// TODO: Implement Token Bucket simulator / Симулятор Token Bucket
//
// State needed:
//   capacity: number (3–20, default 10) — bucket size / размер ведра
//   refillRate: number (1–5, default 2) — tokens per second / токенов в секунду
//   tokens: number — current token count / текущее количество токенов
//   log: array of { time, status: 'ok'|'limited', remaining, resetIn }
//
// Refs needed (to avoid stale closures in setInterval):
//   tokensRef — mirrors tokens state
//   lastRefillRef — timestamp of last refill
//
// Logic:
//   useEffect with setInterval (every 100ms):
//     calculate elapsed time since lastRefill
//     add floor(elapsed * refillRate) tokens (capped at capacity)
//     update tokensRef and tokens state
//   sendRequest():
//     if tokensRef.current >= 1: consume 1 token, log 200
//     else: log 429 (no token consumed)
//
// Visual bucket: / Визуальное ведро:
//   Container: border on 3 sides (no top), border-radius bottom
//   Fill: height = (tokens/capacity * 100)%
//   Color: green >50%, yellow 20-50%, red <20%
//
// Response headers block (shown after each request): / Блок заголовков ответа
//   200: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
//   429: same + Retry-After

export function Task11_1() {
  // TODO: useState for capacity, refillRate, tokens, log
  // TODO: useRef for tokensRef, lastRefillRef

  // TODO: useEffect to sync tokensRef when capacity changes

  // TODO: useEffect with setInterval for auto-refill

  // TODO: sendRequest function

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Симулятор Token Bucket / Token Bucket Simulator</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Визуализация алгоритма ограничения частоты запросов / Visualization of request rate limiting algorithm
      </p>

      {/* TODO: Two-column settings grid (capacity slider, refillRate slider) / Двухколоночная сетка настроек */}

      {/* TODO: Two-column layout: bucket visualization | controls / Двухколоночный макет: визуализация ведра | управление */}
      {/* Bucket: bordered container, fill div with dynamic height and color */}
      {/* Controls: send button + response headers block */}

      {/* TODO: Request log (last 10 entries) / Лог запросов (последние 10) */}

      {/* TODO: Explanation block (bg #eff6ff, border #bfdbfe) / Блок объяснения */}
    </div>
  )
}
