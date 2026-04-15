import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Task 10.3: Suspense Waterfall vs Parallel
//
// Visualize the waterfall problem and its solution using Suspense + createResource.
//
// Simulated fetch functions (implement these):
//   fetchProfile(id): Promise<ProfileData> — delay 1200ms
//   fetchPosts(id): Promise<PostData[]>    — delay 800ms
//
// createResource<T>(promise: Promise<T>): { read(): T }
//   Same implementation as Task 10.1 — needed here as well.
//
// MiniSuspense — same class-based boundary as in Task 10.1.
//
// ─── Waterfall scenario ───────────────────────────────────────────────────────
//
// WaterfallProfile receives a profile resource.
// Inside WaterfallProfile (after profile.read() returns data):
//   const [postsResource] = useState(() => createResource(fetchPosts(id)))
//   // Posts fetch starts HERE — only after profile resolves
//
// <MiniSuspense fallback={<SkeletonProfile />}>
//   <WaterfallProfile resource={profileResource}>
//     <MiniSuspense fallback={<SkeletonPosts />}>
//       <WaterfallPosts resource={postsResource} />
//     </MiniSuspense>
//   </WaterfallProfile>
// </MiniSuspense>
//
// Total time: ~1200 + 800 = 2000ms
//
// ─── Parallel scenario ───────────────────────────────────────────────────────
//
// Both resources created SIMULTANEOUSLY in the parent before render:
//   const profileResource = createResource(fetchProfile(id))
//   const postsResource = createResource(fetchPosts(id))
//
// Both components can suspend at the same time, waiting in parallel.
// Total time: ~max(1200, 800) = 1200ms
//
// ─── Timeline visualization ───────────────────────────────────────────────────
//
// Under each scenario show two colored bars:
//   Profile fetch (blue, 1200ms width units)
//   Posts fetch (green, 800ms width units)
// In waterfall: posts bar starts after profile bar ends.
// In parallel: both bars start at the same position.
//
// Also show measured time: "Итого: Xms" (use Date.now() timestamps).

// ─── TODO: implement createResource ─────────────────────────────────────────

// function createResource<T>(promise: Promise<T>): { read(): T } { ... }

// ─── TODO: implement MiniSuspense ────────────────────────────────────────────

// ─── TODO: implement fetch simulators ────────────────────────────────────────

// function fetchProfile(id: string): Promise<ProfileData> { ... }
// function fetchPosts(id: string): Promise<PostData[]> { ... }

// ─── TODO: implement ProfileCard, PostsList, Skeletons ───────────────────────

// ─── TODO: implement WaterfallScenario ───────────────────────────────────────

// function WaterfallScenario() { ... }

// ─── TODO: implement ParallelScenario ────────────────────────────────────────

// function ParallelScenario() { ... }

// ─── Main component ───────────────────────────────────────────────────────────

export function Task10_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.10.3')}</h2>

      {/* TODO: render WaterfallScenario and ParallelScenario side by side */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{
          flex: 1,
          padding: 16,
          borderRadius: 10,
          border: '2px solid #fde68a',
          background: '#fff',
        }}>
          <p style={{ fontWeight: 700, color: '#92400e' }}>Waterfall</p>
          <p style={{ color: '#9ca3af', fontSize: 13 }}>
            Posts fetch запускается только после Profile resolve (~2000ms)
          </p>
        </div>
        <div style={{
          flex: 1,
          padding: 16,
          borderRadius: 10,
          border: '2px solid #86efac',
          background: '#fff',
        }}>
          <p style={{ fontWeight: 700, color: '#065f46' }}>Parallel</p>
          <p style={{ color: '#9ca3af', fontSize: 13 }}>
            Оба fetch стартуют одновременно (~1200ms)
          </p>
        </div>
      </div>
    </div>
  )
}
