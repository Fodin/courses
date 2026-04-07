# Task 16.2: Video Infrastructure Calculator

## Goal

Create an interactive calculator that estimates the cost and resources of a video platform based on input parameters: number of uploads, duration, resolutions, retention. Visualize breakdown by category and growth forecast.

## Requirements

1. **Input parameters** (controls):
   - Videos/day: number of uploaded videos per day (slider or input, 1K-1M)
   - Avg duration: average video duration in minutes (1-60)
   - Resolutions: checkboxes for selection (240p, 360p, 480p, 720p, 1080p, 4K)
   - Codecs: checkboxes (H.264, H.265, VP9, AV1)
   - Retention: storage period in years (1-10)
   - Peak viewers multiplier: ratio of peak to average traffic (2x-10x)

2. **Calculations** (automatic, on parameter change):
   - **Storage/year**: raw + transcoded for all selected resolutions × codecs × retention
   - **Transcoding compute**: GPU-hours/day, cost (AWS GPU instance pricing)
   - **CDN bandwidth**: daily egress based on views × avg bitrate × duration
   - **Monthly costs**: storage + compute + CDN + metadata DB
   - **Total cost/year**: accounting for retention and growth

3. **Bitrate table** (show for each resolution):
   - Resolution → bitrate (Mbps) → size per minute → size per video
   - Total size of one video across all variants

4. **Visualization**:
   - Breakdown pie/bar chart of costs: Storage vs Compute vs CDN vs Other
   - Growth table: Year 1, Year 2, ... Year N (storage accumulation)
   - Color coding: green (OK), yellow (expensive), red (very expensive)

5. **Preset scenarios** (quick-fill buttons):
   - "Startup" — 1K videos/day, 5 min avg, 720p+480p, H.264, 1 year
   - "Medium platform" — 50K videos/day, 10 min, up to 1080p, H.264+VP9, 3 years
   - "YouTube-scale" — 500K videos/day, 10 min, up to 4K, all codecs, 5 years

## Checklist

- [ ] Parameter input: videos/day, duration, resolutions, codecs, retention
- [ ] Bitrate table for each resolution with size per video
- [ ] Storage/year calculation (raw + transcoded, all resolution/codec combinations)
- [ ] Transcoding compute calculation (GPU-hours and cost)
- [ ] CDN bandwidth calculation and cost
- [ ] Total cost: monthly and yearly
- [ ] Breakdown by category (visual)
- [ ] Growth table by year (storage accumulation)
- [ ] Preset scenarios (startup, medium, YouTube-scale)
- [ ] Cost color coding

## How to check yourself

1. Select "Startup" preset — monthly cost should be ~$5-50K
2. Select "YouTube-scale" — monthly cost should be ~$50-500M
3. Increase retention from 1 to 5 years — storage cost should grow ~5x
4. Add 4K resolution — storage and compute should increase significantly
5. Compare breakdown: for startup, CDN is the main cost; for YouTube — storage
6. Compare with the reference solution (Solution)
