# Task 12.2: CQRS

## Goal

Implement a demonstration of the CQRS pattern (Command Query Responsibility Segregation) using a product catalog example. The student should separate write (commands → events → write store) from read (projections → read models) and see how the same events feed several independent read models, each optimized for different scenarios.

## Requirements

1. Define a `CommandType` = `'CreateProduct' | 'UpdatePrice' | 'AddStock' | 'SetInactive'` and a `Command { type: CommandType; payload: Record<string, unknown> }` interface.
2. Define a `CQRSEvent` interface with fields `id: string`, `type: string`, `payload: Record<string, unknown>`, `timestamp: number`.
3. Define a write model interface `ProductWriteModel`: `productId`, `name`, `price: number`, `stock: number`, `active: boolean`, `version: number`.
4. Define two read model interfaces: `ProductCatalogItem` (`productId`, `name`, `price`, `available: boolean`) and `InventoryItem` (`productId`, `name`, `stock: number`, `lowStock: boolean`).
5. Implement a `processCommand(state: Map<string, ProductWriteModel>, command: Command): CQRSEvent | null` function — validates the command against business rules (cannot create an existing product, cannot modify a non-existent one) and returns an event or `null` on rejection.
6. Implement an `applyProductEvent(state: Map<string, ProductWriteModel>, event: CQRSEvent): Map<string, ProductWriteModel>` function — applies the event to the write store, handling `ProductCreated`, `PriceUpdated`, `StockAdded`, `ProductDeactivated` types.
7. Implement a projection function `buildCatalogProjection`: filters only active products, returns `ProductCatalogItem[]` with `available = stock > 0`.
8. Implement a projection function `buildInventoryProjection`: returns `InventoryItem[]` for all products with `lowStock = stock < 10`.
9. Declare a `PRESET_COMMANDS` array of 5 commands: create product A (Widget Pro, $29, stock 50), create product B (Gadget X, $89, stock 8), increase price of A to $39, add 5 units to stock B, deactivate A.
10. Implement states: `writeState: Map<string, ProductWriteModel>`, `eventLog: CQRSEvent[]`, `lastCommandResult: string | null`.
11. Implement a `handleCommand` handler: calls `processCommand`, on `null` — writes a rejection message; otherwise — applies the event via `applyProductEvent`, adds to `eventLog`, writes a success message.
12. Render the write side: five command buttons with color coding + last command result block + Event Store (scrollable event list).
13. Render the read side: two independent projections as tables — "Product Catalog" and "Inventory Management". Both update automatically after each command.

## Checklist

- [ ] Types `CommandType`, `Command`, `CQRSEvent`, `ProductWriteModel` are declared
- [ ] Read models `ProductCatalogItem` and `InventoryItem` are declared
- [ ] `processCommand` returns `null` on business rule violation (duplicate, non-existent product)
- [ ] `applyProductEvent` handles all 4 event types immutably via `new Map(state)`
- [ ] `buildCatalogProjection` filters `active === true` and computes `available`
- [ ] `buildInventoryProjection` includes all products and computes `lowStock < 10`
- [ ] `PRESET_COMMANDS` array contains exactly 5 commands
- [ ] `handleCommand` distinguishes success and rejection, updates `writeState` and `eventLog`
- [ ] Command buttons have color coding
- [ ] Last command result block is displayed
- [ ] Event Store shows accumulated events (scrollable list)
- [ ] "Catalog" table contains only active products with columns: Product, Price, Availability
- [ ] "Inventory" table contains all products with columns: Product, Stock, Status
- [ ] "Low!" is displayed when `stock < 10`
- [ ] On deactivation, the product disappears from the catalog but remains in the inventory table

## How to test yourself

1. Click "Create Product A" — Widget Pro ($29) appears in the catalog, 50 units in inventory, status OK.
2. Click "Create Product A" again — result block: "CreateProduct command rejected (business rule)". Event Store does not grow.
3. Click "Create Product B" — Gadget X in inventory: 8 units, status "Low!" (< 10).
4. Click "Increase Price A" — Widget Pro in catalog: price $39. `PriceUpdated` appears in Event Store.
5. Click "Add Stock B" — Gadget X: 13 units, status OK. Version in write store increased.
6. Click "Deactivate A" — Widget Pro disappears from catalog but remains in the inventory table.
7. Verify that the Event Store contains exactly as many events as accepted commands (excluding rejected ones).
