# Task 4.3: Database Selector (DB Recommender)

## Objective

Create an interactive tool that recommends the optimal database type based on project parameters, with detailed explanation.

## Requirements

1. Implement parameter input via sliders/toggles:
   - **Read/Write ratio** — from "mostly reads" to "mostly writes"
   - **Consistency** — from "eventual (stale data acceptable)" to "strong (ACID required)"
   - **Data structure** — toggle: tabular (tables), document (nested JSON), key-value, graph (relationships)
   - **Scale** — from "thousands of records" to "billions of records"
2. Based on the parameter combination, provide a recommendation:
   - DB type (PostgreSQL, MongoDB, Redis, Cassandra, Neo4j)
   - Explanation of why this type fits
   - Warnings about potential issues
3. Show the "confidence" of the recommendation (high/medium/low)
4. Show alternative options with explanation of when they are better

## Checklist

- [ ] 4 parameters with visual labels
- [ ] Recommendation updates when any parameter changes
- [ ] Includes: DB type, explanation, warnings
- [ ] Recommendation confidence level
- [ ] Alternative options
- [ ] Extreme values give logical results

## How to Check Yourself

1. Read-heavy + strong consistency + tabular → PostgreSQL
2. Write-heavy + eventual + tabular → Cassandra
3. Read-heavy + eventual + document → MongoDB
4. Key-value + any scale → Redis
5. Graph data structure → Neo4j
6. Strong consistency + billions of records → PostgreSQL + sharding (with complexity warning)
