# Task 7.4: Transactions & Pooling

## 🎯 Goal

Master transactions (pg, Prisma) and connection pool configuration: atomic operations, deadlock prevention, and pool size formula.

## Requirements

1. Implement a pg transaction: BEGIN -> operations -> COMMIT / ROLLBACK + client.release()
2. Show a Prisma transaction: `prisma.$transaction(async (tx) => { ... })`
3. Demonstrate an atomic bank transfer: debit + credit + journal entry
4. Explain connection pool tuning: formula `(cpu_cores * 2) + disk_spindles`, min/max, timeouts
5. Show deadlock prevention: resource sorting + SELECT FOR UPDATE

## Checklist

- [ ] pg: BEGIN/COMMIT/ROLLBACK with try/catch/finally and client.release()
- [ ] Prisma: $transaction with interactive callback
- [ ] Bank transfer: 3 operations atomically, balance check inside transaction
- [ ] Pool: size formula, min/max, idle/connection/query timeouts
- [ ] Deadlock: lock resources in the same order (sorted IDs + FOR UPDATE)

## How to Verify

Click "Run" and verify that: transactions shown in pg and Prisma, bank transfer is atomic, pool configured by formula, and deadlock prevention is explained.
