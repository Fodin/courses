# Task 16.3: Transcoding Pipeline Design

## Goal

Design and visualize a complete transcoding pipeline: from raw video upload to ready HLS segments on CDN. Show stages, parallelism, error handling, and processing time calculation.

## Requirements

1. **Pipeline stages** (flow visualization):
   - **Upload** — file reception (resumable, chunked)
   - **Validation** — format check, codec, duration, malware scan
   - **Splitting** — splitting into 4-sec segments for parallel transcoding
   - **Transcoding** — converting each segment into N resolutions
   - **Thumbnail Generation** — extracting key frames (parallel with transcoding)
   - **Merging** — combining segments, creating HLS/DASH manifest
   - **Quality Check** — automated verification (VMAF score, bitrate compliance)
   - **Storage** — writing to Object Store
   - **CDN Push** — pre-push to edge POPs (for popular channels)
   - **Notification** — webhook / notification to user

2. **Settings** (interactive):
   - Input resolution selection (720p, 1080p, 4K)
   - Target resolution selection (checkboxes)
   - Codec selection (checkboxes)
   - Parallelism: number of parallel workers
   - GPU vs CPU transcoding toggle

3. **Time calculation**:
   - For each stage — estimated time (depending on settings)
   - Total pipeline time
   - With parallelism vs without (show the difference)
   - GPU vs CPU speedup factor (5-10x)

4. **DAG visualization**:
   - Show which stages run in parallel (transcoding different resolutions)
   - Show dependencies: splitting → transcoding → merging
   - Thumbnail generation — parallel with transcoding

5. **Error handling**:
   - Show retry strategy for each stage
   - Dead letter queue for failed jobs
   - Partial success: if 1080p failed, 720p and 480p are still ready

## Checklist

- [ ] Visualization of all 10 pipeline stages with descriptions
- [ ] Interactive selection: resolutions, codecs, parallelism, GPU/CPU
- [ ] Time calculation for each stage and total pipeline time
- [ ] Parallelization shown (DAG): which stages run in parallel
- [ ] GPU vs CPU time comparison
- [ ] Error handling: retry, DLQ, partial success
- [ ] Visual progress: which stage is running, which is complete
- [ ] Statistics: total jobs, queue depth, avg processing time

## How to check yourself

1. Select 1080p input, targets 720p+480p+360p, H.264, GPU — pipeline should be < 2 min
2. Switch to CPU — time should increase 5-10x
3. Increase parallelism from 1 to 4 — total time should decrease
4. 4K input, all resolutions, all codecs — maximum pipeline time
5. Ensure thumbnail generation is shown as a parallel stage
6. Compare with the reference solution (Solution)
