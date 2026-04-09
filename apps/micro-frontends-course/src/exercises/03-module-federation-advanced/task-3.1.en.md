# Task 3.1 — Shared Version Conflict Simulator

## Goal

Create an interactive simulator that explains how Module Federation resolves shared dependency version conflicts based on singleton, strictVersion, and requiredVersion settings.

## Requirements

1. Two configuration panels — Host and Remote — with fields:
   - version (current library version, e.g. `18.2.0`)
   - requiredVersion (semver range, e.g. `^18.0.0`)
   - singleton (checkbox)
   - strictVersion (checkbox)

2. "Check Compatibility" button starts analysis and shows:
   - Which version will be loaded (resolved version)
   - Whether duplication occurs (both MFEs load their own copy)
   - Whether an error occurs (strictVersion + incompatible versions)
   - Status indicator: green (ok), yellow (warning), red (error)

3. Visual dependency tree:
   - Lines: host → react@X, remote → react@Y, resolved → react@Z
   - The resolved line color matches the status (green/yellow/red)

4. At least 4 scenario presets:
   - "All Compatible" — ideal case
   - "Minor Mismatch" — versions differ but within range
   - "Major Conflict" — incompatible major versions, strictVersion enabled
   - "Duplication" — singleton disabled

5. Version resolution logic:
   - If `singleton: false` for both — duplication
   - If `strictVersion: true` and version out of range — error
   - If versions in the same semver range — warning with explanation
   - If versions match — ok

## Checklist

- [ ] Both configuration panels with four fields
- [ ] Button starts the check and shows result
- [ ] Three statuses: ok / warning / error with color coding
- [ ] Dependency tree (host → remote → resolved)
- [ ] All 4 presets apply correctly and give expected results
- [ ] When manually editing fields, result is reset

## How to Check Yourself

- "Major Conflict" preset should show error status
- "Duplication" preset should show a warning about two instances
- "Minor Mismatch" preset should show a warning with resolved version (the newer one)
- When strictVersion + incompatible versions → error
- When strictVersion + compatible versions → no error

## Hint

Understand how the `^X.Y.Z` semver range works: it allows any X.y.z where y >= Y or (y === Y and z >= Z), provided X matches. For X=0 the rules are stricter — only minor matches.
