# Task 10.3: Layer Optimization and Caching

## Objective

Understand how Docker layer caching works, learn to optimize instruction order for maximum cache utilization, combine RUN instructions, and use BuildKit cache mounts.

## Requirements

1. Create a component with three sections: "Instruction Order", "Combining RUN", "Cache mounts"
2. The "Instruction Order" section shows two Dockerfiles: a bad one (`COPY . .` before `npm install`) and a good one (`package.json` before `npm install`), with a cache visualization for each instruction (cached/miss indicators per instruction)
3. Add an interactive "File changed" toggle — when enabled, it shows which layers are invalidated in each of the two variants
4. The "Combining RUN" section shows examples: separate RUN commands vs. combined, with size information (file deleted in a separate layer vs. in the same layer)
5. The "Cache mounts" section shows examples of `--mount=type=cache` for npm, pip, go, apt
6. At the bottom: the rule "Rarely-changing content at the top, frequently-changing at the bottom" with an icon

## Hints

- `useState<string>` for the active section
- `useState<boolean>` for the "File changed" toggle
- Cache visualization: a list of instructions with color indicators (green = cached, red = miss, yellow = rebuild)
- Array: `{ instruction, cached: boolean, reason: string }`

## Checklist

- [ ] Three sections are switchable
- [ ] Two Dockerfiles with layer cache visualization
- [ ] "File changed" toggle updates the cache indicators
- [ ] RUN combination examples with size information
- [ ] Cache mount examples for 4 package managers
- [ ] Summary rule at the bottom

## How to Verify

1. In the "Instruction Order" section, both Dockerfile variants show color indicators
2. The "File changed" toggle changes the indicators (more misses in the bad variant)
3. In "Combining RUN", the size difference is clearly visible
4. Cache mounts: 4 examples for different languages
5. The rule is always visible
