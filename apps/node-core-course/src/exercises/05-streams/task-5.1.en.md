# Task 5.1: Readable Streams

## Goal

Understand Readable Streams: two operating modes (flowing and paused), key events, and the async iterator API.

## Requirements

1. Show the difference between flowing mode (`data` event) and paused mode (`readable` + `read()`)
2. Demonstrate creating a ReadableStream via `fs.createReadStream` with `highWaterMark`
3. Show mode switching: `pause()` and `resume()`
4. Demonstrate async iterator (`for await...of`) as the recommended approach
5. Simulate reading a file in chunks, displaying each chunk's size
6. Show all key events: `data`, `end`, `error`, `close`, `readable`

## Checklist

- [ ] Comparison table of flowing vs paused mode
- [ ] Code examples for both modes
- [ ] pause()/resume() shown
- [ ] Async iterator demonstrated
- [ ] Chunk reading simulation works
- [ ] All key events listed

## How to verify

1. Click "Run" and study the output
2. Verify the simulation shows file reading in chunks
3. Check that each chunk has the correct size
4. Verify async iterator is mentioned as the recommended approach
