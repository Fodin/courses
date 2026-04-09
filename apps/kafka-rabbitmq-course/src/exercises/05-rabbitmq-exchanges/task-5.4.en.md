# Task 5.4: Headers Exchange and Type Comparison

## Goal

Implement a Headers Exchange simulator with support for `x-match: all` and `x-match: any` modes, as well as an interactive comparison table of all 4 Exchange types.

## Requirements

1. Define the `HeadersBinding` interface with properties: `id` (string), `queue` (string), `headers` (Record<string, string>), `xMatch: 'all' | 'any'`, `color` (string), `bgColor` (string).
2. Define the `ExchangeType` interface with properties: `name`, `icon`, `color`, `bgColor`, `routing`, `speed`, `complexity`, `useCases` (string[]), `when` (string), `example` (string).
3. Create the `headersBindings` array with 4 fixed bindings:
   - `eu-mobile-orders`: `{ region: 'eu', platform: 'mobile' }`, xMatch: `all`
   - `premium-orders`: `{ tier: 'premium' }`, xMatch: `any`
   - `mobile-or-tablet`: `{ platform: 'mobile', platform2: 'tablet' }`, xMatch: `any`
   - `us-all-platforms`: `{ region: 'us' }`, xMatch: `all`
4. Create the `exchangeTypes` array with data for Direct, Fanout, Topic, Headers (routing algorithm, performance, complexity, scenarios, when to use, example).
5. Implement states: `messageHeaders` (Record<string, string>), `headerInput` ({key, value}), `view: 'headers' | 'comparison'`, `activeExchange`, `log`.
6. Implement the `matchHeaders(binding: HeadersBinding): boolean` function:
   - When `xMatch === 'all'`: all binding headers must match
   - When `xMatch === 'any'`: at least one binding header must match
7. Compute `matchedBindings` as derived state.
8. Implement the `publish()` function: writes to the log a line with the message headers and recipient queues.
9. Implement the `addHeader()` function: adds a header to `messageHeaders`.
10. Implement the `removeHeader(key)` function: removes a header from `messageHeaders`.
11. Implement tab switching (`view`) via "Headers Exchange" and "Type Comparison" buttons.
12. On the Headers tab, display:
    - Message headers editor (list of key-value pairs with delete, add form)
    - Bindings list: each card shows the queue name, an `x-match` badge, a ✅/❌ icon, and a detailed check of each header (green — matched, red — not)
    - Publication log
13. On the Comparison tab, display:
    - Toggle buttons for 4 Exchange types
    - A card for the selected type with fields: routing algorithm, performance, complexity, use cases, when to choose, example
    - A comparison matrix table of all 4 types by key characteristics

## Checklist

- [ ] `HeadersBinding` and `ExchangeType` interfaces declared correctly
- [ ] `matchHeaders` correctly implements `all` (all matched) and `any` (at least one) logic
- [ ] `matchedBindings` is computed reactively
- [ ] Detailed check in the binding card shows each header with its result
- [ ] `addHeader` and `removeHeader` work correctly
- [ ] Tab switching works
- [ ] On the comparison tab, all 4 types are switchable
- [ ] Comparison card shows all fields from `ExchangeType`
- [ ] Headers Exchange log shows headers and recipients

## How to Test Yourself

1. With default headers `{ region: eu, platform: mobile, tier: standard }`:
   - `eu-mobile-orders` (all: region=eu AND platform=mobile) — matches
   - `mobile-or-tablet` (any: platform=mobile OR platform2=tablet) — matches
   - `premium-orders` (any: tier=premium) — does not match
   - `us-all-platforms` (all: region=us) — does not match
2. Add a header `tier: premium` — the `premium-orders` queue should start matching.
3. Change `region` to `us` — `us-all-platforms` matches, `eu-mobile-orders` stops matching.
4. Switch to the "Type Comparison" tab and click each of the 4 Exchange types — the card updates.
