import { useState, useCallback } from 'react'

// ============================================
// Задание 16.1: Справочная карточка — Video Streaming
// ============================================

export function Task16_1_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Video Streaming Platform (YouTube-like) — краткая справка</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>HLS / DASH (Adaptive Bitrate)</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Принцип</strong>: видео разбито на сегменты (2-6 сек), плеер переключает качество на лету.
            <br /><br />
            <strong>HLS</strong>: Apple, .m3u8 manifest, .ts сегменты. Обязателен для iOS.
            <br /><br />
            <strong>DASH</strong>: открытый стандарт, .mpd manifest (XML), .m4s сегменты.
            <br /><br />
            <strong>LL-HLS/LL-DASH</strong>: low-latency варианты для live (2-5 сек).
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Codecs & Transcoding</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>H.264</strong>: универсальный, 95%+ устройств, baseline.
            <br /><br />
            <strong>H.265/VP9</strong>: на 50% эффективнее H.264, но патенты (H.265) или медленнее (VP9).
            <br /><br />
            <strong>AV1</strong>: будущее, ещё на 30% лучше VP9, но очень медленный encode.
            <br /><br />
            <strong>Pipeline</strong>: Upload {'→'} Queue {'→'} GPU Transcode {'→'} Storage {'→'} CDN.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>CDN для видео (3-tier)</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Edge POP</strong>: 200+ точек по миру, {'<'} 5 ms, hit rate 85-95%.
            <br /><br />
            <strong>Mid-tier</strong>: 20 региональных центров, ловит 5-10% промахов.
            <br /><br />
            <strong>Origin</strong>: Object Store, {'<'} 1% запросов доходит сюда.
            <br /><br />
            <strong>Push vs Pull</strong>: hot content push на edge, long tail — pull-on-demand.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>View Counting at Scale</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Проблема</strong>: 280K views/sec, нельзя UPDATE для каждого.
            <br /><br />
            <strong>Решение</strong>: Kafka {'→'} Flink (aggregate 1 min) {'→'} Cassandra batch write.
            <br /><br />
            <strong>De-dup</strong>: HyperLogLog (12 KB, ~1% error) / Bloom filter.
            <br /><br />
            <strong>Consistency</strong>: eventual (1-5 min lag), exact hourly for monetization.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Live Streaming</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Ingest</strong>: RTMP (стример {'→'} сервер), TCP, low overhead.
            <br /><br />
            <strong>Delivery</strong>: LL-HLS (сервер {'→'} зрители), 2-5 сек latency.
            <br /><br />
            <strong>Scaling</strong>: 1 stream {'→'} CDN {'→'} миллионы зрителей из edge кэша.
            <br /><br />
            <strong>DVR</strong>: запись live {'→'} VOD (сохранить сегменты).
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e0f2f1', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Copyright Detection (Content ID)</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Audio</strong>: Chromaprint — спектрограмма {'→'} fingerprint {'→'} Hamming distance.
            <br /><br />
            <strong>Video</strong>: pHash — key frames {'→'} perceptual hash {'→'} compare.
            <br /><br />
            <strong>Reference DB</strong>: 100M+ tracks, ~1 TB fingerprints.
            <br /><br />
            <strong>Policy</strong>: block / monetize (ads for owner) / track / allow.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 16.2: Калькулятор видеоинфраструктуры
// ============================================

interface Resolution {
  name: string
  label: string
  bitrateMbps: number
  gpuFactor: number
}

const RESOLUTIONS: Resolution[] = [
  { name: '240p', label: '240p', bitrateMbps: 0.5, gpuFactor: 0.3 },
  { name: '360p', label: '360p', bitrateMbps: 1.0, gpuFactor: 0.5 },
  { name: '480p', label: '480p', bitrateMbps: 2.5, gpuFactor: 0.7 },
  { name: '720p', label: '720p', bitrateMbps: 5.0, gpuFactor: 1.0 },
  { name: '1080p', label: '1080p', bitrateMbps: 8.0, gpuFactor: 1.5 },
  { name: '4K', label: '4K (2160p)', bitrateMbps: 20.0, gpuFactor: 4.0 },
]

interface Codec {
  name: string
  label: string
  efficiencyFactor: number
  speedFactor: number
}

const CODECS: Codec[] = [
  { name: 'h264', label: 'H.264', efficiencyFactor: 1.0, speedFactor: 1.0 },
  { name: 'h265', label: 'H.265', efficiencyFactor: 0.5, speedFactor: 2.0 },
  { name: 'vp9', label: 'VP9', efficiencyFactor: 0.5, speedFactor: 2.5 },
  { name: 'av1', label: 'AV1', efficiencyFactor: 0.35, speedFactor: 8.0 },
]

interface CalcPreset {
  name: string
  videosPerDay: number
  avgDurationMin: number
  resolutions: string[]
  codecs: string[]
  retentionYears: number
  peakMultiplier: number
}

const PRESETS: CalcPreset[] = [
  {
    name: 'Стартап',
    videosPerDay: 1000,
    avgDurationMin: 5,
    resolutions: ['480p', '720p'],
    codecs: ['h264'],
    retentionYears: 1,
    peakMultiplier: 3,
  },
  {
    name: 'Средняя платформа',
    videosPerDay: 50000,
    avgDurationMin: 10,
    resolutions: ['360p', '480p', '720p', '1080p'],
    codecs: ['h264', 'vp9'],
    retentionYears: 3,
    peakMultiplier: 5,
  },
  {
    name: 'YouTube-scale',
    videosPerDay: 500000,
    avgDurationMin: 10,
    resolutions: ['240p', '360p', '480p', '720p', '1080p', '4K'],
    codecs: ['h264', 'h265', 'vp9', 'av1'],
    retentionYears: 5,
    peakMultiplier: 8,
  },
]

function formatBytes(bytes: number): string {
  if (bytes >= 1e18) return `${(bytes / 1e18).toFixed(1)} EB`
  if (bytes >= 1e15) return `${(bytes / 1e15).toFixed(1)} PB`
  if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(1)} TB`
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`
  return `${bytes.toFixed(0)} B`
}

function formatCost(usd: number): string {
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(1)}B`
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(1)}M`
  if (usd >= 1e3) return `$${(usd / 1e3).toFixed(1)}K`
  return `$${usd.toFixed(0)}`
}

function costColor(monthly: number): string {
  if (monthly < 100000) return '#2e7d32'
  if (monthly < 10000000) return '#e65100'
  return '#c62828'
}

export function Task16_2_Solution() {
  const [videosPerDay, setVideosPerDay] = useState(50000)
  const [avgDurationMin, setAvgDurationMin] = useState(10)
  const [selectedRes, setSelectedRes] = useState<Set<string>>(new Set(['360p', '480p', '720p', '1080p']))
  const [selectedCodecs, setSelectedCodecs] = useState<Set<string>>(new Set(['h264', 'vp9']))
  const [retentionYears, setRetentionYears] = useState(3)
  const [peakMultiplier, setPeakMultiplier] = useState(5)

  const applyPreset = useCallback((preset: CalcPreset) => {
    setVideosPerDay(preset.videosPerDay)
    setAvgDurationMin(preset.avgDurationMin)
    setSelectedRes(new Set(preset.resolutions))
    setSelectedCodecs(new Set(preset.codecs))
    setRetentionYears(preset.retentionYears)
    setPeakMultiplier(preset.peakMultiplier)
  }, [])

  const toggleRes = useCallback((name: string) => {
    setSelectedRes(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  const toggleCodec = useCallback((name: string) => {
    setSelectedCodecs(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  // Calculations
  const activeRes = RESOLUTIONS.filter(r => selectedRes.has(r.name))
  const activeCodecs = CODECS.filter(c => selectedCodecs.has(c.name))
  const variants = activeRes.length * activeCodecs.length

  // Storage per video (all variants)
  const durationSec = avgDurationMin * 60
  const sizePerVideoBytes = activeRes.reduce((sum, res) => {
    return sum + activeCodecs.reduce((cSum, codec) => {
      const effectiveBitrate = res.bitrateMbps * codec.efficiencyFactor
      const sizeBytes = (effectiveBitrate * 1e6 / 8) * durationSec
      return cSum + sizeBytes
    }, 0)
  }, 0)
  const rawSizePerVideo = avgDurationMin * 60 * (50 * 1e6 / 8) // ~50 Mbps raw
  const totalSizePerVideo = sizePerVideoBytes + rawSizePerVideo

  // Daily storage
  const dailyStorageBytes = totalSizePerVideo * videosPerDay
  const yearlyStorageBytes = dailyStorageBytes * 365

  // Transcoding compute
  const gpuHoursPerVideo = activeRes.reduce((sum, res) => {
    return sum + activeCodecs.reduce((cSum, codec) => {
      // Baseline: 1 GPU-min per 1 min of 720p H.264
      const gpuMin = avgDurationMin * res.gpuFactor * codec.speedFactor
      return cSum + gpuMin / 60
    }, 0)
  }, 0)
  const dailyGpuHours = gpuHoursPerVideo * videosPerDay
  const gpuCostPerHour = 3.06 // p3.2xlarge (1 V100)
  const dailyComputeCost = dailyGpuHours * gpuCostPerHour

  // CDN bandwidth (assume 10x views relative to uploads, avg quality)
  const viewsPerDay = videosPerDay * 10
  const avgViewBitrate = activeRes.length > 0
    ? activeRes.reduce((s, r) => s + r.bitrateMbps, 0) / activeRes.length * 0.7
    : 5
  const dailyCdnEgressBytes = viewsPerDay * durationSec * (avgViewBitrate * 1e6 / 8) * 0.5 // 50% watch time
  const cdnCostPerGB = 0.02
  const dailyCdnCost = (dailyCdnEgressBytes / 1e9) * cdnCostPerGB * peakMultiplier / 3

  // Storage cost (tiered)
  const storageCostPerGBMonth = 0.015 // blended avg
  const monthlyStorageCostYear1 = (yearlyStorageBytes / 1e9) * storageCostPerGBMonth / 2 // avg over year

  // Monthly totals
  const monthlyCompute = dailyComputeCost * 30
  const monthlyCdn = dailyCdnCost * 30
  const monthlyStorage = monthlyStorageCostYear1
  const monthlyOther = (monthlyCompute + monthlyCdn + monthlyStorage) * 0.15 // DB, search, ML, ops
  const monthlyTotal = monthlyCompute + monthlyCdn + monthlyStorage + monthlyOther

  // Yearly growth table
  const yearlyData = Array.from({ length: retentionYears }, (_, yr) => {
    const cumulativeStorage = yearlyStorageBytes * (yr + 1)
    const storCost = (cumulativeStorage / 1e9) * storageCostPerGBMonth
    const computeCost = monthlyCompute * Math.pow(1.1, yr)
    const cdnCost = monthlyCdn * Math.pow(1.15, yr)
    const other = (storCost + computeCost + cdnCost) * 0.15
    return {
      year: yr + 1,
      cumulativeStorage,
      monthlyStorageCost: storCost,
      monthlyComputeCost: computeCost,
      monthlyCdnCost: cdnCost,
      monthlyOther: other,
      monthlyTotal: storCost + computeCost + cdnCost + other,
    }
  })

  const categories = [
    { name: 'Storage', value: monthlyStorage, color: '#42a5f5' },
    { name: 'Compute (GPU)', value: monthlyCompute, color: '#66bb6a' },
    { name: 'CDN', value: monthlyCdn, color: '#ffa726' },
    { name: 'Other (DB, ML, ops)', value: monthlyOther, color: '#ab47bc' },
  ]
  const maxCat = Math.max(...categories.map(c => c.value), 1)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Калькулятор видеоинфраструктуры</h2>

      {/* Presets */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {PRESETS.map(p => (
          <button
            key={p.name}
            onClick={() => applyPreset(p)}
            style={{
              padding: '0.5rem 1rem',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Параметры загрузки</h4>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            Videos/day: <strong>{videosPerDay.toLocaleString()}</strong>
            <input
              type="range"
              min={100}
              max={1000000}
              step={100}
              value={videosPerDay}
              onChange={e => setVideosPerDay(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            Avg duration: <strong>{avgDurationMin} мин</strong>
            <input
              type="range"
              min={1}
              max={60}
              value={avgDurationMin}
              onChange={e => setAvgDurationMin(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            Retention: <strong>{retentionYears} лет</strong>
            <input
              type="range"
              min={1}
              max={10}
              value={retentionYears}
              onChange={e => setRetentionYears(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
          <label style={{ display: 'block', fontSize: '0.85rem' }}>
            Peak multiplier: <strong>{peakMultiplier}x</strong>
            <input
              type="range"
              min={2}
              max={10}
              value={peakMultiplier}
              onChange={e => setPeakMultiplier(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Resolutions & Codecs</h4>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Resolutions:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>
              {RESOLUTIONS.map(r => (
                <button
                  key={r.name}
                  onClick={() => toggleRes(r.name)}
                  style={{
                    padding: '0.3rem 0.6rem',
                    background: selectedRes.has(r.name) ? '#1976d2' : '#e0e0e0',
                    color: selectedRes.has(r.name) ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Codecs:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>
              {CODECS.map(c => (
                <button
                  key={c.name}
                  onClick={() => toggleCodec(c.name)}
                  style={{
                    padding: '0.3rem 0.6rem',
                    background: selectedCodecs.has(c.name) ? '#e65100' : '#e0e0e0',
                    color: selectedCodecs.has(c.name) ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
            Variants per video: {variants} ({activeRes.length} res x {activeCodecs.length} codecs)
          </div>
        </div>
      </div>

      {/* Bitrate table */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>Bitrate Ladder (на одно видео {avgDurationMin} мин)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '0.4rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Resolution</th>
              {activeCodecs.map(c => (
                <th key={c.name} style={{ padding: '0.4rem', textAlign: 'right', borderBottom: '2px solid #ddd' }}>
                  {c.label} (Mbps)
                </th>
              ))}
              {activeCodecs.map(c => (
                <th key={c.name + '-size'} style={{ padding: '0.4rem', textAlign: 'right', borderBottom: '2px solid #ddd' }}>
                  {c.label} size
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeRes.map(r => (
              <tr key={r.name}>
                <td style={{ padding: '0.4rem', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{r.label}</td>
                {activeCodecs.map(c => (
                  <td key={c.name} style={{ padding: '0.4rem', textAlign: 'right', borderBottom: '1px solid #eee' }}>
                    {(r.bitrateMbps * c.efficiencyFactor).toFixed(1)}
                  </td>
                ))}
                {activeCodecs.map(c => {
                  const size = (r.bitrateMbps * c.efficiencyFactor * 1e6 / 8) * durationSec
                  return (
                    <td key={c.name + '-s'} style={{ padding: '0.4rem', textAlign: 'right', borderBottom: '1px solid #eee' }}>
                      {formatBytes(size)}
                    </td>
                  )
                })}
              </tr>
            ))}
            <tr style={{ fontWeight: 'bold', background: '#e3f2fd' }}>
              <td style={{ padding: '0.4rem' }}>Total per video</td>
              <td colSpan={activeCodecs.length * 2} style={{ padding: '0.4rem', textAlign: 'right' }}>
                Transcoded: {formatBytes(sizePerVideoBytes)} + Raw: {formatBytes(rawSizePerVideo)} = {formatBytes(totalSizePerVideo)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cost breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>Monthly Cost Breakdown</h3>
          {categories.map(cat => (
            <div key={cat.name} style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                <span>{cat.name}</span>
                <span style={{ fontWeight: 'bold' }}>{formatCost(cat.value)}</span>
              </div>
              <div style={{ height: '20px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(cat.value / maxCat) * 100}%`,
                    background: cat.color,
                    borderRadius: '4px',
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>
          ))}
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'white',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: costColor(monthlyTotal),
          }}>
            Monthly Total: {formatCost(monthlyTotal)}
          </div>
        </div>

        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>Key Metrics</h3>
          <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['Daily storage growth', formatBytes(dailyStorageBytes)],
                ['Yearly storage', formatBytes(yearlyStorageBytes)],
                [`${retentionYears}-year cumulative`, formatBytes(yearlyStorageBytes * retentionYears)],
                ['GPU-hours/day', `${dailyGpuHours.toLocaleString(undefined, { maximumFractionDigits: 0 })} hrs`],
                ['Variants per video', `${variants}`],
                ['Daily CDN egress', formatBytes(dailyCdnEgressBytes)],
                ['Cost per video', formatCost(totalSizePerVideo / 1e9 * storageCostPerGBMonth + gpuHoursPerVideo * gpuCostPerHour)],
              ].map(([label, value], i) => (
                <tr key={i}>
                  <td style={{ padding: '0.3rem 0', borderBottom: '1px solid #e0e0e0' }}>{label}</td>
                  <td style={{ padding: '0.3rem 0', borderBottom: '1px solid #e0e0e0', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Growth table */}
      <div>
        <h3 style={{ margin: '0 0 0.5rem' }}>Прогноз по годам (storage accumulation, 10% compute growth, 15% CDN growth)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '0.4rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Year</th>
              <th style={{ padding: '0.4rem', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Cumulative Storage</th>
              <th style={{ padding: '0.4rem', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Storage/mo</th>
              <th style={{ padding: '0.4rem', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Compute/mo</th>
              <th style={{ padding: '0.4rem', textAlign: 'right', borderBottom: '2px solid #ddd' }}>CDN/mo</th>
              <th style={{ padding: '0.4rem', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Total/mo</th>
            </tr>
          </thead>
          <tbody>
            {yearlyData.map(row => (
              <tr key={row.year}>
                <td style={{ padding: '0.4rem', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Year {row.year}</td>
                <td style={{ padding: '0.4rem', textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatBytes(row.cumulativeStorage)}</td>
                <td style={{ padding: '0.4rem', textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatCost(row.monthlyStorageCost)}</td>
                <td style={{ padding: '0.4rem', textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatCost(row.monthlyComputeCost)}</td>
                <td style={{ padding: '0.4rem', textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatCost(row.monthlyCdnCost)}</td>
                <td style={{
                  padding: '0.4rem',
                  textAlign: 'right',
                  borderBottom: '1px solid #eee',
                  fontWeight: 'bold',
                  color: costColor(row.monthlyTotal),
                }}>
                  {formatCost(row.monthlyTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// Задание 16.3: Transcoding Pipeline Visualizer
// ============================================

interface PipelineStage {
  id: string
  name: string
  description: string
  parallel: boolean
  dependsOn: string[]
  baseTimeMin: number
  gpuSpeedup: number
  retries: number
}

const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'upload', name: 'Upload', description: 'Приём raw файла (resumable, chunked)', parallel: false, dependsOn: [], baseTimeMin: 2.0, gpuSpeedup: 1, retries: 3 },
  { id: 'validate', name: 'Validation', description: 'Проверка формата, codec, duration, malware scan', parallel: false, dependsOn: ['upload'], baseTimeMin: 0.5, gpuSpeedup: 1, retries: 1 },
  { id: 'split', name: 'Splitting', description: 'Разбиение на 4-sec сегменты для параллельного transcoding', parallel: false, dependsOn: ['validate'], baseTimeMin: 0.3, gpuSpeedup: 1, retries: 2 },
  { id: 'transcode', name: 'Transcoding', description: 'Конвертация сегментов в N разрешений x M кодеков (GPU)', parallel: true, dependsOn: ['split'], baseTimeMin: 10.0, gpuSpeedup: 7, retries: 3 },
  { id: 'thumbnail', name: 'Thumbnails', description: 'Извлечение ключевых кадров (параллельно с transcoding)', parallel: true, dependsOn: ['split'], baseTimeMin: 0.5, gpuSpeedup: 1, retries: 2 },
  { id: 'merge', name: 'Merging', description: 'Объединение сегментов, HLS/DASH manifest generation', parallel: false, dependsOn: ['transcode'], baseTimeMin: 1.0, gpuSpeedup: 1, retries: 2 },
  { id: 'quality', name: 'Quality Check', description: 'VMAF score, bitrate compliance, audio sync', parallel: false, dependsOn: ['merge'], baseTimeMin: 1.5, gpuSpeedup: 2, retries: 1 },
  { id: 'storage', name: 'Storage Upload', description: 'Запись в Object Store (S3/GCS)', parallel: false, dependsOn: ['quality', 'thumbnail'], baseTimeMin: 1.0, gpuSpeedup: 1, retries: 3 },
  { id: 'cdn', name: 'CDN Push', description: 'Pre-push на edge POPs (для popular channels)', parallel: false, dependsOn: ['storage'], baseTimeMin: 0.5, gpuSpeedup: 1, retries: 2 },
  { id: 'notify', name: 'Notification', description: 'Webhook / push уведомление пользователю', parallel: false, dependsOn: ['cdn'], baseTimeMin: 0.1, gpuSpeedup: 1, retries: 3 },
]

interface PipelineConfig {
  inputRes: string
  targetRes: string[]
  targetCodecs: string[]
  workers: number
  useGpu: boolean
}

function calcStageTime(
  stage: PipelineStage,
  config: PipelineConfig
): number {
  let time = stage.baseTimeMin

  if (stage.id === 'transcode') {
    const resCount = config.targetRes.length
    const codecCount = config.targetCodecs.length
    const totalVariants = resCount * codecCount
    const resFactor = config.targetRes.includes('4K') ? 2.5 : config.targetRes.includes('1080p') ? 1.5 : 1.0
    time = stage.baseTimeMin * resFactor * (totalVariants / Math.max(config.workers, 1))
  }

  if (config.useGpu && stage.gpuSpeedup > 1) {
    time = time / stage.gpuSpeedup
  }

  return Math.max(time, 0.05)
}

export function Task16_3_Solution() {
  const [config, setConfig] = useState<PipelineConfig>({
    inputRes: '1080p',
    targetRes: ['720p', '480p', '360p'],
    targetCodecs: ['h264'],
    workers: 4,
    useGpu: true,
  })
  const [activeStage, setActiveStage] = useState<string | null>(null)
  const [completedStages, setCompletedStages] = useState<Set<string>>(new Set())
  const [isRunning, setIsRunning] = useState(false)

  const toggleTargetRes = useCallback((res: string) => {
    setConfig(prev => {
      const next = new Set(prev.targetRes)
      if (next.has(res)) next.delete(res)
      else next.add(res)
      return { ...prev, targetRes: Array.from(next) }
    })
  }, [])

  const toggleTargetCodec = useCallback((codec: string) => {
    setConfig(prev => {
      const next = new Set(prev.targetCodecs)
      if (next.has(codec)) next.delete(codec)
      else next.add(codec)
      return { ...prev, targetCodecs: Array.from(next) }
    })
  }, [])

  const stageTimes = PIPELINE_STAGES.map(stage => ({
    ...stage,
    estimatedMin: calcStageTime(stage, config),
  }))

  // Calculate critical path (sequential) considering parallel stages
  const criticalPathTime = stageTimes.reduce((total, stage) => {
    // thumbnail runs parallel with transcode, so we take max(transcode, thumbnail)
    if (stage.id === 'thumbnail') return total // counted in transcode path
    return total + stage.estimatedMin
  }, 0)

  const sequentialTime = stageTimes.reduce((t, s) => t + s.estimatedMin, 0)

  const cpuConfig = { ...config, useGpu: false }
  const cpuTime = PIPELINE_STAGES.reduce(
    (t, s) => t + calcStageTime(s, cpuConfig),
    0
  )

  const runSimulation = useCallback(() => {
    setIsRunning(true)
    setCompletedStages(new Set())
    setActiveStage(null)

    let idx = 0
    const interval = setInterval(() => {
      if (idx < PIPELINE_STAGES.length) {
        const stage = PIPELINE_STAGES[idx]
        setActiveStage(stage.id)
        if (idx > 0) {
          setCompletedStages(prev => new Set([...prev, PIPELINE_STAGES[idx - 1].id]))
        }
        idx++
      } else {
        setCompletedStages(prev => new Set([...prev, PIPELINE_STAGES[PIPELINE_STAGES.length - 1].id]))
        setActiveStage(null)
        setIsRunning(false)
        clearInterval(interval)
      }
    }, 600)

    return () => clearInterval(interval)
  }, [])

  const stageColor = (id: string): string => {
    if (completedStages.has(id)) return '#e8f5e9'
    if (activeStage === id) return '#fff3e0'
    return '#fafafa'
  }

  const stageIcon = (id: string): string => {
    if (completedStages.has(id)) return '\u2705'
    if (activeStage === id) return '\u23f3'
    return '\u23f9'
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Transcoding Pipeline Visualizer</h2>

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Input</h4>
          <select
            value={config.inputRes}
            onChange={e => setConfig(prev => ({ ...prev, inputRes: e.target.value }))}
            style={{ padding: '0.3rem', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
            <option value="4K">4K (2160p)</option>
          </select>
          <div style={{ marginTop: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={config.useGpu}
                onChange={e => setConfig(prev => ({ ...prev, useGpu: e.target.checked }))}
              />
              {' '}GPU Transcoding ({config.useGpu ? 'ON' : 'OFF'})
            </label>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem' }}>
              Workers: {config.workers}
              <input
                type="range"
                min={1}
                max={16}
                value={config.workers}
                onChange={e => setConfig(prev => ({ ...prev, workers: Number(e.target.value) }))}
                style={{ width: '100%' }}
              />
            </label>
          </div>
        </div>

        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Target Resolutions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {['240p', '360p', '480p', '720p', '1080p', '4K'].map(r => (
              <label key={r} style={{ fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={config.targetRes.includes(r)}
                  onChange={() => toggleTargetRes(r)}
                />
                {' '}{r}
              </label>
            ))}
          </div>
        </div>

        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Codecs</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {CODECS.map(c => (
              <label key={c.name} style={{ fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={config.targetCodecs.includes(c.name)}
                  onChange={() => toggleTargetCodec(c.name)}
                />
                {' '}{c.label} (speed: {c.speedFactor}x slower)
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline visualization */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h3 style={{ margin: 0 }}>Pipeline Stages</h3>
          <button
            onClick={runSimulation}
            disabled={isRunning}
            style={{
              padding: '0.5rem 1rem',
              background: isRunning ? '#bdbdbd' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isRunning ? 'default' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            {isRunning ? 'Running...' : 'Run Simulation'}
          </button>
        </div>

        {stageTimes.map((stage, i) => {
          const maxTime = Math.max(...stageTimes.map(s => s.estimatedMin), 0.1)
          const widthPct = (stage.estimatedMin / maxTime) * 100
          return (
            <div
              key={stage.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.3rem',
                padding: '0.5rem',
                background: stageColor(stage.id),
                borderRadius: '6px',
                border: activeStage === stage.id ? '2px solid #ff9800' : '1px solid #e0e0e0',
                transition: 'all 0.3s',
              }}
            >
              <span style={{ fontSize: '1.2rem', width: '1.5rem', textAlign: 'center' }}>{stageIcon(stage.id)}</span>
              <div style={{ width: '120px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                {stage.name}
                {stage.parallel && <span style={{ color: '#1976d2', fontSize: '0.7rem' }}> [parallel]</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: '18px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${widthPct}%`,
                      background: stage.parallel ? '#42a5f5' : '#66bb6a',
                      borderRadius: '4px',
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.1rem' }}>{stage.description}</div>
              </div>
              <div style={{ width: '80px', textAlign: 'right', fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {stage.estimatedMin.toFixed(1)} min
              </div>
              <div style={{ width: '60px', textAlign: 'center', fontSize: '0.75rem', color: '#666' }}>
                retry: {stage.retries}
              </div>
              {i < stageTimes.length - 1 && stage.dependsOn.length > 0 && (
                <span style={{ fontSize: '0.7rem', color: '#999' }}>
                  dep: {stage.dependsOn.join(', ')}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>Critical Path (parallel)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
            {criticalPathTime.toFixed(1)} min
          </div>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>Sequential (no parallel)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e65100' }}>
            {sequentialTime.toFixed(1)} min
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>
            {(sequentialTime / criticalPathTime).toFixed(1)}x slower
          </div>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>CPU only (no GPU)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c62828' }}>
            {cpuTime.toFixed(1)} min
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>
            {(cpuTime / criticalPathTime).toFixed(1)}x slower than GPU+parallel
          </div>
        </div>
      </div>

      {/* Error handling */}
      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff8e1', borderRadius: '8px', border: '1px solid #ffe082' }}>
        <h4 style={{ margin: '0 0 0.5rem' }}>Error Handling Strategy</h4>
        <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
          <strong>Retry</strong>: каждый этап имеет retry count (1-3). Exponential backoff: 1s, 2s, 4s.
          <br />
          <strong>Dead Letter Queue</strong>: после исчерпания retries — job переходит в DLQ для ручного анализа.
          <br />
          <strong>Partial Success</strong>: если 1080p failed, но 720p/480p готовы — видео доступно в пониженном качестве. Transcoding 1080p ставится в retry queue.
          <br />
          <strong>Idempotency</strong>: каждый job имеет unique ID. Повторный запуск не создаёт дубликатов.
          <br />
          <strong>Timeout</strong>: transcoding job timeout = 5x expected time. При timeout — restart на другом worker.
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 16.4: Полный System Design — Video Streaming
// ============================================

interface DesignSection {
  title: string
  content: string
}

const capstoneDesignSections: DesignSection[] = [
  {
    title: '1. Requirements & Back-of-the-Envelope',
    content: `Functional Requirements:
- Upload видео (до 256 GB, resumable)
- Transcoding в множество разрешений/кодеков (H.264, VP9, AV1)
- Adaptive bitrate streaming (HLS + DASH)
- Search (title, description, tags, channels)
- Recommendations (personalized feed)
- Live streaming (RTMP ingest → LL-HLS delivery)
- View counting, likes, comments, subscriptions
- Copyright detection (Content ID)
- Monetization (ads, premium subscriptions)

Non-Functional Requirements:
- 2B users, 800M DAU
- 500 hours of video uploaded per minute
- < 2 sec playback start, < 1 sec seek
- 99.99% availability (52 min downtime/year)
- Global delivery < 100 ms latency

Back-of-the-Envelope:
- Upload: 500 hrs/min × 60/10 = 3000 videos/min = 50 videos/sec
- Storage/day: 720K hrs × 6 GB/hr (all resolutions) ≈ 4.3 PB/day
- Storage/year: 4.3 PB × 365 ≈ 1.5 EB (exabytes!)
- CDN bandwidth peak: 800M × 30 min × 5 Mbps ≈ 200 Tbps
- Views/sec: 800M × 30 min / 86400 ≈ 280K views/sec
- Metadata: 5B+ videos × 1 KB = 5 TB metadata`,
  },
  {
    title: '2. Video Upload & Resumable Protocol',
    content: `Protocol: tus-like resumable upload.

Flow:
1. POST /uploads → init (uploadId, chunkSize=8MB)
2. PUT /uploads/{id}/chunks/{N} (parallel, up to 6 concurrent)
3. Each chunk: checksum (SHA256) for integrity
4. On network failure: GET /uploads/{id}/status → resume from missing chunks
5. POST /uploads/{id}/complete → trigger transcoding pipeline

Storage: raw video → S3/GCS (multi-part upload).
Validation: format check, codec probe (ffprobe), virus scan, file size limit.

API design:
- Rate limit: 10 uploads/hour per user (free), 100 (premium)
- Max file size: 256 GB (premium), 12 GB (free)
- Supported formats: mp4, webm, mov, avi, mkv (auto-detect with ffprobe)

Pre-signed URLs: upload directly to S3 (bypass API server).
- API generates pre-signed URL → client uploads to S3 → S3 triggers Lambda → enqueue transcoding`,
  },
  {
    title: '3. Transcoding Pipeline (Async, DAG)',
    content: `Architecture: event-driven, message queue + worker pool.

Pipeline (DAG):
Upload → Validate → Split (4s segments) → [Transcode × N | Thumbnails] → Merge → QC → Storage → CDN → Notify

Message Queue: Kafka (durable, ordered, replay).
Worker pool: GPU instances (p3.2xlarge / g5.xlarge) auto-scaled by queue depth.

Transcoding jobs:
- Per-title encoding: analyze content complexity → custom bitrate ladder
  - Lecture (static) → lower bitrate at same quality
  - Sports (fast motion) → higher bitrate
  - Netflix saves ~20% bandwidth with per-title encoding
- Lazy 4K: only transcode 4K for videos with > 1000 views (save compute)

DAG Parallelism:
- Split video into 4-sec segments
- Each segment transcoded independently on different machines
- Thumbnail extraction parallel with transcoding
- N resolutions × M codecs = N×M parallel transcoding jobs per segment
- Merge all segments after completion

GPU vs CPU:
- GPU (V100/A100): 5-10x faster for H.264/H.265
- AV1 encoding: 8x slower than H.264 even on GPU → batch overnight
- Cost: GPU $3/hr vs CPU $0.5/hr → GPU cheaper per video (faster)

Priority queue:
- Premium users: high priority → process first
- Popular channels (> 1M subs): high priority (more views expected)
- Re-encode (4K lazy): low priority → use spot instances`,
  },
  {
    title: '4. Adaptive Bitrate Streaming (HLS + DASH)',
    content: `Dual protocol: HLS for iOS + Safari, DASH for everything else.
CMAF (Common Media Application Format): shared segments for both protocols.

Bitrate ladder (per-title optimized):
2160p (4K) → 15-20 Mbps (Smart TV, desktop)
1080p      → 6-8 Mbps  (основное качество)
720p       → 4-5 Mbps  (mobile, средний интернет)
480p       → 2-2.5 Mbps (слабый интернет)
360p       → 0.8-1 Mbps (очень слабый)
240p       → 0.4-0.5 Mbps (2G/edge)

Segment duration: 4 sec (balance: shorter = faster switch, longer = better compression).

Player algorithm:
1. Start with lowest quality (fast start)
2. Measure download time of each segment → estimate bandwidth
3. Select quality for next segment: highest that fits within bandwidth × 0.7 (safety margin)
4. Buffer: maintain 30 sec buffer; if buffer < 10 sec → downgrade quality
5. Upgrade: only if bandwidth stable for > 3 segments

DRM:
- Widevine (Google): Android, Chrome, smart TVs
- FairPlay (Apple): iOS, Safari, Apple TV
- PlayReady (Microsoft): Windows, Xbox, Edge
- Multi-DRM: packager creates encrypted segments + license server per platform`,
  },
  {
    title: '5. CDN Architecture (3-Tier)',
    content: `Tier 1: Edge POP (Point of Presence)
- 200+ locations worldwide
- Cache hot segments (popular videos, recent uploads)
- Hit rate: 85-95%
- Latency to user: < 5 ms
- Storage per POP: 100-500 TB SSD

Tier 2: Mid-tier / Regional Cache
- 20 locations (US-East, US-West, EU-West, AP-South, etc.)
- Cache broader catalog (warm content)
- Hit rate: 95-99% (combined with edge)
- Latency: 10-50 ms

Tier 3: Origin
- S3/GCS Object Storage
- < 1% requests reach here
- Latency: 50-200+ ms (cross-region)

Strategies:
- HOT content (trending, new from popular channels):
  Push to edge POPs proactively after transcoding.
  TTL: 24 hours, versioned URLs for invalidation.

- LONG TAIL (99% of videos):
  Pull on first request → cache with LRU eviction.
  TTL: 7 days on edge, 30 days on mid-tier.

- Google GGC (Global Cache):
  Install cache servers directly at ISPs.
  Traffic never leaves ISP network → 60%+ bandwidth savings.
  ISP benefits: reduced peering costs.

Cost optimization:
- CDN: $0.02/GB egress (edge) vs $0.09/GB (origin)
- 95% cache hit rate → 95% cost savings on origin bandwidth
- Multi-CDN strategy: CloudFront + Akamai + own CDN for redundancy`,
  },
  {
    title: '6. Storage Architecture (Petabyte-Scale)',
    content: `Video Storage (Object Store):
Raw: S3 Standard → lifecycle to Glacier after 30 days
Transcoded: S3 Standard (hot) → S3 IA (warm, 30-90d) → Glacier (cold, >90d)

Layout: /videos/{videoId}/{resolution}/{codec}/segment_{N}.ts
- Enables per-segment CDN caching
- Enables parallel upload/download
- Enables efficient seek (load specific segment)

Cost (per GB/month):
- S3 Standard: $0.023 (hot, < 30 days)
- S3 IA: $0.0125 (warm, 30-90 days)
- S3 Glacier: $0.004 (cold, > 90 days)
- Average blended: ~$0.01/GB/month with lifecycle policies

Metadata (PostgreSQL, sharded by videoId):
- videos: id, title, description, channel_id, status, manifest_url, ...
- channels: id, name, subscriber_count, ...
- users: id, name, subscription_tier, ...
- Sharding: hash(videoId) mod 256 shards

Counters (Cassandra / DynamoDB):
- video_stats: video_id, view_count, like_count, comment_count
- Eventually consistent, high write throughput
- Batch updates from Flink aggregation

Search (Elasticsearch):
- Index: video title, description, tags, channel name, category
- Ranking: BM25 relevance × freshness × popularity × personalization
- Autocomplete: edge n-gram tokenizer + completion suggester
- Cluster: 50+ nodes, 10 TB index for 5B videos`,
  },
  {
    title: '7. View Counting & Analytics',
    content: `Challenge: 280K view events/sec. Cannot UPDATE SQL for each.

Pipeline:
1. Client → API → Kafka topic "view_events"
   Event: { videoId, userId, timestamp, watchTimeSec, deviceType, region }

2. Flink Stream Processing:
   - Window: tumbling 1 min
   - Aggregate: COUNT per videoId, SUM(watchTime)
   - De-dup: HyperLogLog (12 KB per video, ~0.81% error)
   - Output: batch of aggregated counts

3. Cassandra: batch UPSERT
   video_stats SET view_count += 15000 WHERE video_id = 'abc'
   280K events/sec → ~5K batch writes/sec (50x reduction)

4. Real-time Dashboard:
   Flink → ClickHouse (columnar OLAP)
   Grafana dashboards: views/min, watch time, top videos, by region

5. Monetization (exact counting):
   Hourly batch job (Spark) → exact de-dup via user_id
   Results → PostgreSQL → billing system

De-duplication strategies:
- Same user + same video + same session = 1 view
- Min watch time: > 30 sec to count as view
- Bot detection: rate limit, captcha, behavioral analysis
- HyperLogLog for approximate real-time count
- Exact counting via batch for monetization (hourly)`,
  },
  {
    title: '8. Recommendations Engine',
    content: `3-stage pipeline:

Stage 1: Candidate Generation (millions → thousands)
- Collaborative filtering: users with similar watch history → their videos
- Content-based: similar videos by tags, description embedding, audio/visual
- Trending: popular in user's region/category
- Subscriptions: new from subscribed channels
- Result: ~5000 candidates per user

Stage 2: Ranking (thousands → tens)
- ML model: predict P(user watches > 50% of video)
- Features: user_history, video_age, channel_popularity, time_of_day, device
- User embedding (256d) × Video embedding (256d) → cosine similarity
- Model: two-tower neural network (YouTube DNN paper)
- Serving: TensorFlow Serving, < 50 ms latency

Stage 3: Re-ranking (business rules)
- Remove: already watched, blocked channels, age-restricted
- Boost: promoted content, new creators, fresh videos
- Diversity: no more than 2 videos from same channel
- Freshness: prefer videos < 48 hours old
- Result: 20 videos for "Up Next" sidebar

Feature Store (Redis + Cassandra):
- user:{id}:history → last 1000 watched videoIds (Redis list)
- user:{id}:embedding → float[256] (Cassandra)
- video:{id}:embedding → float[256] (Cassandra)
- Refresh: embeddings recalculated daily (Spark batch)
- Real-time updates: user watches video → update history → trigger re-rank`,
  },
  {
    title: '9. Live Streaming',
    content: `Ingest:
- Protocol: RTMP (Real-Time Messaging Protocol)
- Streamer (OBS/camera) → RTMP → Ingest Server
- Ingest server: validate stream key, transcode to HLS

Live Transcoding (real-time):
- Input: RTMP 1080p stream
- Output: LL-HLS segments (1-2 sec) in multiple qualities
- Latency budget: < 2 sec for transcoding
- Hardware: dedicated GPU instances (not shared with VOD transcoding)

Delivery: LL-HLS (Low-Latency HLS)
- Partial segments: push before segment is complete
- Preload hints: player knows next segment URL before it exists
- Latency: 2-5 sec glass-to-glass (vs 20-30 sec standard HLS)
- Fallback: standard HLS for incompatible players

Scaling to millions:
- 1 streamer → 1 ingest server → transcoder → CDN origin
- CDN: 1 origin stream replicated to 200+ edge POPs
- Each POP serves thousands of viewers from cache
- No bottleneck: origin sends 1 copy per POP, POP serves N viewers

DVR (recording):
- Archive LL-HLS segments → Object Store
- After stream ends: create VOD manifest (standard HLS/DASH)
- Transcoding: optionally re-encode for better compression (live was fast-encode)

Live Chat:
- WebSocket → Chat Service → Redis Pub/Sub
- Fan-out: one message → broadcast to all viewers in room
- Rate limiting: 1 message/sec per user
- Moderation: ML filter + manual moderators`,
  },
  {
    title: '10. Copyright Detection (Content ID)',
    content: `Pipeline:
Upload → Transcoding → [Content ID scan in parallel]

Audio Fingerprinting (Chromaprint):
- Extract audio → spectrogram → chroma features → 32-bit hash per frame
- Database: 100M+ reference tracks, ~1 TB fingerprints
- Matching: Hamming distance between fingerprints
- Threshold: < 15% different bits → match
- Speed: scan 10 min video against 100M refs < 10 min (indexed)

Video Fingerprinting (pHash):
- Extract key frames (1 per second)
- Perceptual hash: resize to 32x32 → DCT → median threshold → 64-bit hash
- Resistant to: resizing, compression, slight crop, color changes
- Not resistant to: heavy editing, mirror flip, re-filming screen
- Matching: Hamming distance between pHash values

Reference Database:
- Rights holders upload reference content
- Each reference: audio fingerprint + video fingerprint + policy
- Policy: { action: "block" | "monetize" | "track" | "allow", territories: [...] }

Processing:
- Parallel with transcoding (doesn't delay publish if no match)
- On match: apply policy immediately
  - Block: video not published, uploader notified
  - Monetize: video published, ad revenue goes to rights holder
  - Track: video published, analytics shared with rights holder
- Appeal: uploader can dispute → manual review queue`,
  },
  {
    title: '11. Reliability & Disaster Recovery',
    content: `Health Checks & Monitoring:
- Transcoding queue depth: alert if > 10,000 (scaling needed)
- CDN cache hit rate: alert if < 80% (cache warming issue)
- Playback error rate: alert if > 0.1% (CDN/origin issue)
- Upload success rate: alert if < 95% (upload service issue)
- View counting lag: alert if > 10 min (Flink/Kafka issue)

Graceful Degradation:
- CDN issues: serve lower quality only (drop 4K, keep 720p)
- Transcoding overload: queue with priority, delay low-priority
- Search down: show trending/popular instead of search results
- Recommendations down: show trending/subscriptions
- Analytics lag: display "updating..." for view counts

Multi-Region DR:
- Active-Active: 3+ regions (US, EU, AP)
- Video data: replicated across regions (S3 cross-region replication)
- Metadata: PostgreSQL with cross-region async replication
- CDN: multi-provider (CloudFront + Akamai) for redundancy
- DNS failover: Route53 health checks → automatic region failover
- RTO: < 5 min (DNS TTL), RPO: < 1 min (async replication lag)

Capacity Planning:
- Storage: +30% yearly growth → plan 2 years ahead
- CDN: seasonal peaks (holidays, events) → pre-scale 2x
- Transcoding: monitor GPU utilization → auto-scale group
- Database: shard splits planned quarterly`,
  },
  {
    title: '12. Technology Choices Summary',
    content: `| Component          | Technology              | Why                                        |
|-------------------|-------------------------|---------------------------------------------|
| Upload            | tus.io / S3 multi-part  | Resumable, parallel, proven at scale        |
| Queue             | Kafka                   | Durable, ordered, replay, high throughput   |
| Transcoding       | FFmpeg + GPU (V100/A100)| Industry standard, GPU acceleration         |
| Object Storage    | S3 / GCS                | Unlimited scale, lifecycle policies, cheap  |
| CDN               | Multi-CDN + own GGC     | Global delivery, redundancy, ISP caching    |
| Metadata DB       | PostgreSQL (sharded)    | ACID, rich queries, mature ecosystem        |
| Counters          | Cassandra               | High write throughput, eventual consistent  |
| Stream Processing | Apache Flink            | Low latency, exactly-once, stateful         |
| Search            | Elasticsearch           | Full-text, faceted, autocomplete            |
| Recommendations   | TF Serving + Feature Store | Real-time ML inference, < 50 ms          |
| Analytics OLAP    | ClickHouse              | Columnar, fast aggregations, compression    |
| Live Ingest       | RTMP                    | Universal, low overhead, OBS support        |
| Live Delivery     | LL-HLS                  | Low latency, HTTP-based, universal          |
| Copyright         | Chromaprint + pHash     | Audio + video fingerprinting, open source   |
| Cache             | Redis                   | Session, feature store, Pub/Sub, rate limit |
| Monitoring        | Prometheus + Grafana    | Metrics, alerting, dashboards               |`,
  },
]

export function Task16_4_Solution() {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]))

  const toggleSection = useCallback((index: number) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    setOpenSections(new Set(capstoneDesignSections.map((_, i) => i)))
  }, [])

  const collapseAll = useCallback(() => {
    setOpenSections(new Set())
  }, [])

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2>CAPSTONE: System Design — YouTube-like Video Platform</h2>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        2B users, 800M DAU, 500 hrs video/min upload, 1.5 EB storage/year, 200 Tbps CDN peak
      </p>
      <p style={{ color: '#999', fontSize: '0.8rem', marginBottom: '1rem' }}>
        12 секций, охватывающих все аспекты видеоплатформы: upload, transcoding, CDN, storage, streaming, search, recommendations, analytics, live, copyright, reliability
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={expandAll}
          style={{
            padding: '0.4rem 0.8rem',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          Раскрыть все 12 секций
        </button>
        <button
          onClick={collapseAll}
          style={{
            padding: '0.4rem 0.8rem',
            background: '#757575',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          Свернуть всё
        </button>
      </div>

      {capstoneDesignSections.map((section, i) => {
        const isOpen = openSections.has(i)
        return (
          <div
            key={i}
            style={{
              marginBottom: '0.5rem',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => toggleSection(i)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: isOpen ? '#e3f2fd' : '#fafafa',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                textAlign: 'left',
              }}
            >
              <span>{section.title}</span>
              <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                \u25BC
              </span>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: '1rem',
                  background: 'white',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  fontFamily: 'monospace',
                }}
              >
                {section.content}
              </div>
            )}
          </div>
        )
      })}

      {/* Architecture summary table */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
        }}
      >
        <h3 style={{ margin: '0 0 0.5rem' }}>Итоговая архитектура: ключевые решения</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Компонент</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Решение</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Обоснование</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Upload', 'Resumable (tus), S3 multi-part', 'Надёжность для больших файлов, parallel chunks'],
              ['Transcoding', 'Kafka → GPU cluster (DAG)', 'Async, parallel segments, per-title encoding'],
              ['Streaming', 'HLS + DASH (CMAF)', 'iOS + Android/Web, adaptive bitrate'],
              ['CDN', '3-tier: Edge → Mid → Origin', '95%+ cache hit, < 5 ms latency'],
              ['Video Storage', 'S3 tiered (hot/warm/cold)', 'Cost optimization, lifecycle policies'],
              ['Metadata', 'PostgreSQL (sharded)', 'ACID, rich queries, proven at scale'],
              ['Search', 'Elasticsearch', 'Full-text + autocomplete + faceted'],
              ['View Counting', 'Kafka → Flink → Cassandra', 'Aggregated, de-duped, eventual consistent'],
              ['Recommendations', 'Two-tower DNN + Feature Store', 'Real-time ML inference, personalized'],
              ['Live Streaming', 'RTMP → LL-HLS', 'Universal ingest, 2-5 sec latency delivery'],
              ['Copyright', 'Chromaprint + pHash', 'Audio + video fingerprinting at scale'],
              ['Analytics', 'Flink → ClickHouse', 'Real-time OLAP, columnar, fast aggregations'],
            ].map(([component, solution, reason], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                  {component}
                </td>
                <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #eee' }}>{solution}</td>
                <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #eee', color: '#666' }}>
                  {reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interview tips */}
      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#e8f5e9',
          borderRadius: '8px',
          border: '1px solid #c8e6c9',
        }}
      >
        <h4 style={{ margin: '0 0 0.5rem' }}>Interview Deep-Dive Topics</h4>
        <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
          <strong>1. Transcoding Pipeline</strong>: async (Kafka), DAG parallelism (split segments), GPU acceleration, per-title encoding, priority queue.
          <br />
          <strong>2. Adaptive Bitrate</strong>: HLS/DASH, segment-based, player bandwidth estimation, quality switching, buffer management.
          <br />
          <strong>3. CDN Architecture</strong>: 3-tier, push vs pull, cache hit rate 95%+, GGC (ISP caching), multi-CDN redundancy.
          <br />
          <strong>4. View Counting</strong>: Kafka aggregation, HyperLogLog de-dup, eventual consistency, exact batch for monetization.
          <br />
          <strong>5. Live Streaming</strong>: RTMP ingest, LL-HLS delivery, CDN scaling to millions, DVR archive.
          <br />
          <strong>6. Storage at Scale</strong>: tiered (hot/warm/cold), chunked segments, lifecycle policies, 1.5 EB/year.
        </div>
      </div>
    </div>
  )
}
