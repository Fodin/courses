# Task 9.2: Capacity Calculator — Paste Service

## Objective

Build an interactive capacity calculator for the Paste Service. Enter load parameters and get storage, bandwidth, server count, and cost estimates. Visualize data growth by months and years.

## Requirements

1. **Input parameters** (with default values):
   - Pastes/day — number of new pastes per day (default: 5M)
   - Average paste size — average paste size in KB (default: 10 KB)
   - Retention — storage period in years (default: 5)
   - Read:Write ratio — read to write ratio (default: 5:1)

2. **Calculation and output**:
   - **QPS**: write QPS, read QPS (average), peak read QPS (x3)
   - **Storage**: content (S3) for the full period, metadata (SQL) for the full period
   - **Bandwidth**: incoming (upload), outgoing (download), peak outgoing
   - **Cost**: approximate S3 storage cost ($0.023/GB/month), bandwidth ($0.09/GB)
   - **Servers**: approximate number of API servers (at 1000 QPS per server)

3. **Growth table**: monthly/yearly storage growth (content + metadata) with cumulative totals

4. All calculations update when any input changes

## Checklist

- [ ] All 4 input parameters implemented with editable values
- [ ] QPS calculated correctly (write = pastes/86400, read = write * ratio)
- [ ] Storage calculated separately for content (S3) and metadata (SQL)
- [ ] Bandwidth calculated with peak (x3) accounted for
- [ ] S3 cost calculated with current pricing
- [ ] Growth table shows cumulative totals per period
- [ ] Interface updates in real time when parameters change

## How to Check Yourself

1. Enter default values (5M pastes/day, 10 KB, 5 years, 5:1)
2. Check: write QPS ~ 58, read QPS ~ 290, peak ~ 870
3. Check: content storage ~ 91 TB over 5 years
4. Change parameters and verify that calculations update
5. Compare your calculator with the reference solution (Solution)
