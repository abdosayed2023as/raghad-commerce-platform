# ISC-001: Inventory Service Contract Specification

**Document Identifier**: ISC-001  
**Title**: Inventory Service Contract Specification  
**Version**: 1.0.0  
**Status**: Draft  
**Effective Date**: August 2, 2026  
**Governing Standard**: ENG-CON-001 Engineering Constitution & Governance Standard  
**Related Domain Standards**: PSC-001 Product Service Contract Specification v1.0.1 (FROZEN)  

---

## 1. Purpose

This Inventory Service Contract (ISC-001) establishes the definitive, technology-agnostic interface boundary for all inventory management, stock allocation, warehouse tracking, and stock movement operations across the Audit Toolkit platform. It defines the inventory entity model, location topology, stock movement audit trail, reservation/allocation semantics, error categories, event stream, and governance rules required to operate high-concurrency enterprise inventory systems.

ISC-001 is completely decoupled from product definition logic. While PSC-001 owns product catalog identity, ISC-001 owns physical and logical stock quantities, warehouse locations, stock reservations, inventory movements, and stock replenishment thresholds.

---

## 2. Scope

### 2.1 Domain Responsibilities (In Scope)
Inventory Service (ISC-001) SHALL own and govern:
1. Inventory item state, stock quantity tracking, and stock balance calculations.
2. Warehouse and physical/logical location topology management.
3. Two-phase stock reservations and checkout lock lifecycle management.
4. Order stock allocation, fulfillment reserving, and stock release mechanics.
5. Stock movements, inter-warehouse transfers, goods receiving, and shrinkage adjustments.
6. Stock threshold rules (minimum stock, maximum stock, reorder point alerts).
7. Immutable inventory audit trail logging and movement ledger generation.
8. Inventory domain event generation and event stream emission.

### 2.2 Boundary Exclusions (Out of Scope)
ISC-001 SHALL NOT own or execute:
1. Product catalog definition, titles, attributes, or variant options (owned by PSC-001).
2. Price calculations, discounts, currency conversions, or taxation logic (owned by PSC-001).
3. Customer identity, shopping cart management, or checkout order placement logic.
4. Physical shipping carrier API integrations or logistics label generation.
5. Direct database engine storage management or physical warehouse hardware control.

---

## 3. Responsibilities vs Non-Responsibilities

```text
+-----------------------------------------------------------------------------------+
|               PSC-001: Product Service Contract (Catalog & Identity Domain)       |
|  - Owns productId, variantId, SKU, Title, Attributes, Prices, Media               |
|  - NEVER tracks physical stock balances or warehouse locations                    |
+-----------------------------------------+-----------------------------------------+
                                          | References productId / variantId
                                          v
+-----------------------------------------------------------------------------------+
|               ISC-001: Inventory Service Contract (Stock & Warehouse Domain)      |
|  - Owns inventoryId, warehouseId, locationId, Stock Quantities, Reservations      |
|  - Owns Stock Movement Ledger & Inter-Warehouse Transfer Workflows                |
|  - NEVER modifies product attributes, titles, or catalog data                     |
+-----------------------------------------------------------------------------------+
```

---

## 4. Core Principles

### Rule: ISC-INV-001 (No Product Ownership)
- **Statement**: ISC-001 NEVER owns product catalog entities. All product identity (`productId`, `variantId`, `sku`) is referenced as external immutable context provided by PSC-001.
- **Compliance Level**: Mandatory
- **Verification Method**: Architecture Boundary Audit
- **Exception Policy**: None.

### Rule: ISC-INV-002 (No Catalog Editing)
- **Statement**: ISC-001 MUST NOT edit, mutate, or manage product catalog attributes, pricing, titles, or variant definitions. ISC-001 operations govern physical and logical quantities ONLY.
- **Compliance Level**: Mandatory
- **Verification Method**: Static Code Analysis & Access Audit
- **Exception Policy**: None.

### Rule: ISC-INV-003 (Contract Isolation)
- **Statement**: All platform modules, order engines, fulfillment systems, and ERP connectors MUST interact with stock balances exclusively through explicit ISC-001 contract operations. Direct storage access is strictly prohibited.
- **Compliance Level**: Mandatory
- **Verification Method**: Boundary Access Audit
- **Exception Policy**: None.

---

## 5. Inventory Entity Model

An `Inventory` entity represents stock balances for a specific product variant at a specific warehouse location:

### 5.1 Entity Attribute Schema

| Field Name | Type / Format | Immutability | Description |
| :--- | :--- | :---: | :--- |
| `inventoryId` | Identifier (`inv_<hash>`) | Immutable | Globally unique inventory record identifier. |
| `tenantId` | Identifier (`tenant_<hash>`) | Immutable | Multi-tenant organization boundary identifier. |
| `productId` | Identifier (`prd_<hash>`) | Immutable | Upstream PSC-001 Global Product Identifier. |
| `variantId` | Identifier (`var_<hash>`) | Immutable | Upstream PSC-001 Variant Identifier. |
| `warehouseId` | Identifier (`wh_<hash>`) | Immutable | Target warehouse facility identifier. |
| `locationId` | Identifier (`loc_<hash>`) | Mutable (Governed) | Specific aisle/bin/shelf location identifier within warehouse. |
| `availableQuantity` | Non-negative Integer | System Calculated | Stock available for immediate sale or allocation (`onHand - reserved - allocated`). |
| `reservedQuantity` | Non-negative Integer | System Calculated | Stock held under temporary time-bound checkout reservation locks. |
| `allocatedQuantity` | Non-negative Integer | System Calculated | Stock committed to confirmed orders awaiting physical fulfillment. |
| `damagedQuantity` | Non-negative Integer | Mutable (Governed) | Stock marked as defective, damaged, or un-sellable. |
| `incomingQuantity` | Non-negative Integer | Mutable (Governed) | Expected stock from approved purchase orders or inbound transfers. |
| `minimumQuantity` | Non-negative Integer | Mutable | Safety stock threshold triggering reorder alerts. |
| `maximumQuantity` | Non-negative Integer | Mutable | Maximum storage capacity cap for location. |
| `reorderPoint` | Non-negative Integer | Mutable | Stock level threshold triggering automated replenishment. |
| `unit` | Enum (`Pcs`, `Kg`, `Liter`, `Box`) | Immutable | Measurement unit descriptor. |
| `status` | Enum (`Active`, `Quarantined`, `Discontinued`) | Mutable | Operational lifecycle status of inventory record. |
| `createdAt` | ISO-8601 Timestamp | Immutable | Instantiation timestamp. |
| `updatedAt` | ISO-8601 Timestamp | System Updated | Last mutation timestamp. |
| `version` | Integer | Auto-Incrementing | Optimistic concurrency control integer. |

---

## 6. Warehouse & Location Topology Model

### 6.1 Warehouse Model (`Warehouse`)
Represents a physical or logical storage facility:
- `warehouseId`: Globally unique identifier (`wh_<hash>`).
- `tenantId`: Organization owner.
- `name`: Facility title (e.g., "Central Distribution Center North").
- `code`: Unique warehouse shorthand code (e.g., `CDC-N1`).
- `type`: Enum (`PhysicalWarehouse`, `FulfillmentCenter`, `DropShipper`, `StoreFront`, `VirtualLocation`).
- `address`: Physical location metadata structure.
- `status`: State (`Active`, `Maintenance`, `Decommissioned`).

### 6.2 Location Model (`Location`)
Represents granular storage units within a warehouse:
- `locationId`: Unique storage slot identifier (`loc_<hash>`).
- `warehouseId`: Parent warehouse association.
- `zone`: Storage zone designation (e.g., `Zone-A`).
- `aisle`: Aisle number/code.
- `shelf`: Shelf level.
- `bin`: Bin slot identifier.
- `type`: Enum (`Pickable`, `BulkStorage`, `ReceivingDock`, `QuarantineBin`, `StagingArea`).
- `isPickable`: Boolean flag asserting availability for order picking.

---

## 7. Inventory Lifecycle States

1. **Uninstantiated**: Stock record does not exist for product/location combination.
2. **Active**: Record is active; stock can be received, reserved, allocated, or issued.
3. **Quarantined**: Stock is frozen pending quality audit or inspection; reservations blocked.
4. **Discontinued**: Product variant is phased out; receiving disabled, remaining stock can be cleared.

---

## 8. Read Operations

All read operations SHALL be side-effect-free, idempotent, and support pagination:
- `GetInventory(inventoryId)`: Retrieves a single inventory record by ID.
- `GetInventoryByLocation(variantId, warehouseId, locationId)`: Retrieves stock levels for a specific location.
- `GetInventoryByWarehouse(variantId, warehouseId)`: Aggregates total stock across all locations in a warehouse.
- `SearchInventory(searchCriteria, paginationOptions)`: Multi-faceted inventory search across products, warehouses, and locations.
- `GetInventoryMovements(inventoryId, filterCriteria, paginationOptions)`: Retrieves immutable movement audit ledger records.
- `BulkReadInventory(variantIds[], warehouseIds[])`: Batched retrieval of stock balances for multiple items.

---

## 9. Write Operations

All write contracts require authentication, enforce optimistic concurrency (`version`), and record movement ledger entries:
- `AdjustInventory(inventoryId, quantityDelta, reasonCode, operatorContext)`: Direct stock adjustment.
- `ReserveInventory(variantId, warehouseId, quantity, reservationTimeout)`: Creates atomic, time-bound reservation.
- `ReleaseInventory(reservationId)`: Cancels active reservation, returning stock to available.
- `AllocateInventory(reservationId, orderId)`: Converts temporary reservation into confirmed order allocation.
- `ConsumeInventory(allocationId, quantity, operatorContext)`: Deducts allocated stock upon physical pick/shipment.
- `TransferInventory(sourceLocationId, targetLocationId, variantId, quantity)`: Moves stock between locations/warehouses.
- `ReceiveInventory(warehouseId, locationId, variantId, quantity, purchaseOrderId)`: Logs inbound goods receipt.
- `InventoryCorrection(inventoryId, actualQuantity, auditRefId)`: Reconciles physical count discrepancies.

---

## 10. Inventory Movement Model

Every stock mutation MUST generate an immutable `InventoryMovement` ledger entry:
- `movementId`: Unique ledger entry ID (`mvt_<hash>`).
- `tenantId`: Organization owner.
- `inventoryId`: Associated inventory record ID.
- `variantId`: Associated product variant ID.
- `movementType`: Enum (`Receipt`, `Adjustment`, `ReservationHold`, `ReservationRelease`, `AllocationCommit`, `Consumption`, `TransferIn`, `TransferOut`, `DamageWriteoff`).
- `quantityBefore`: Balance prior to mutation.
- `quantityDelta`: Signed integer mutation value (+/-).
- `quantityAfter`: Balance after mutation.
- `referenceType`: Associated domain entity (`PurchaseOrder`, `CustomerOrder`, `StockTransfer`, `AuditCount`).
- `referenceId`: Domain entity ID.
- `operatorId`: Actor executing the mutation.
- `timestamp`: ISO-8601 execution timestamp.

---

## 11. Reservation & Allocation Model

### 11.1 Two-Phase Stock Reservation
To prevent overselling during high-concurrency checkout:
1. **Phase 1 (Reserve)**: `ReserveInventory` places a temporary hold. `availableQuantity` decreases, `reservedQuantity` increases. A time-bound `reservationId` is generated.
2. **Phase 2A (Allocate/Commit)**: If checkout succeeds, `AllocateInventory` converts hold into `allocatedQuantity`. `reservedQuantity` decreases, `allocatedQuantity` increases.
3. **Phase 2B (Release/Expire)**: If checkout fails or timer expires, `ReleaseInventory` restores stock to `availableQuantity`.

```text
[Available Stock] ---> (ReserveInventory) ---> [Reserved Hold] ---> (AllocateInventory) ---> [Allocated Order]
        ^                                            |                                               |
        |------------ (Release / Expire) ------------+                                       (ConsumeInventory)
                                                                                                     v
                                                                                             [Stock Deducted]
```

---

## 12. Validation Rules

1. **Non-Negative Stock Invariant**: `availableQuantity`, `reservedQuantity`, `allocatedQuantity`, and `damagedQuantity` MUST NEVER drop below zero.
2. **Conservation of Mass Invariant**: `onHandQuantity = availableQuantity + reservedQuantity + allocatedQuantity + damagedQuantity`.
3. **Location Compatibility**: Receiving and transfer operations MUST assert target location status is `Active` and `isPickable` (if applicable).
4. **Optimistic Concurrency**: Write operations MUST fail with `ISC-ERR-409 ConcurrencyConflict` if `version` mismatch occurs.

---

## 13. Error Model

ISC-001 defines seven canonical error categories:

| Error Category | Canonical Code | Description |
| :--- | :--- | :--- |
| **Validation Error** | `ISC-ERR-400` | Input payload failed structural or quantity validation. |
| **Insufficient Stock**| `ISC-ERR-422` | Requested quantity exceeds available stock balance. |
| **Not Found** | `ISC-ERR-404` | Target inventory, warehouse, or location record does not exist. |
| **Concurrency Conflict**| `ISC-ERR-409` | Entity version mismatch during write operation. |
| **Location Blocked** | `ISC-ERR-423` | Warehouse or location is quarantined or decommissioned. |
| **Rate Limited** | `ISC-ERR-429` | Request volume exceeded service rate limits. |
| **Internal Error** | `ISC-ERR-500` | Unhandled system exception encountered. |

---

## 14. Events

ISC-001 emits structured, immutable domain events for every stock state mutation:

1. `InventoryAdjusted`: Emitted when stock balance is manually adjusted.
2. `InventoryReserved`: Emitted when a temporary checkout hold is created.
3. `InventoryReleased`: Emitted when a reservation is released or expired.
4. `InventoryAllocated`: Emitted when stock is committed to a confirmed order.
5. `InventoryConsumed`: Emitted when stock is physically shipped/deducted.
6. `InventoryTransferred`: Emitted when stock is moved between locations.
7. `InventoryReceived`: Emitted when inbound goods are received.
8. `StockThresholdReached`: Emitted when stock drops below `minimumQuantity` or `reorderPoint`.

Every event envelope MUST declare `payloadMode` (`StateSnapshot` | `DeltaMutation`) and include standard envelope metadata (`eventId`, `eventType`, `tenantId`, `timestamp`).

---

## 15. Security

1. **Granular Permissions**: Write operations require explicit scope authorization (`inventory:read`, `inventory:adjust`, `inventory:reserve`, `inventory:transfer`).
2. **Tenant Scoping**: All queries and mutations enforce mandatory multi-tenant isolation (`tenantId`).
3. **Immutable Ledger Audit**: Stock movement ledger records (`InventoryMovement`) are append-only and immutable.

---

## 16. Performance Requirements

1. **High Concurrency SLA**: Reservation and allocation operations MUST execute within 20ms (p95).
2. **Read Operations SLA**: Balance queries MUST respond within 15ms (p95).
3. **Batch Read Limit**: `BulkReadInventory` limits batch queries to a maximum of 200 items per request.

---

## 17. Reliability & Consistency

1. **Read-After-Write Consistency**: Single-location inventory balance queries SHALL guarantee immediate read-after-write consistency.
2. **Idempotent Write Operations**: All write operations MUST accept an `idempotencyKey` to prevent duplicate stock mutations upon network retry.
3. **Automatic Reservation Cleanup**: Expired reservations MUST be released automatically by a background sweeps process.

---

## 18. Versioning Policy

1. **Schema Versioning**: ISC-001 follows Semantic Versioning (`MAJOR.MINOR.PATCH`).
2. **Contract Compatibility**: Minor contract updates MUST be non-breaking and additive.

---

## 19. Governance & Freeze Rules

1. **Ownership**: Governed by the Platform Architecture Committee.
2. **Freeze Policy**: Once tagged `FROZEN`, ISC-001 contracts MUST NOT be altered under the baseline version.

---

## Appendix

### Appendix A: Definitions
- **Available Quantity**: Stock available for immediate sale or new reservation holds.
- **Reserved Quantity**: Stock held under temporary time-bound checkout locks.
- **Allocated Quantity**: Stock committed to confirmed orders awaiting physical pick/pack/shipment.
- **On-Hand Quantity**: Total physical stock present in a warehouse (`available + reserved + allocated + damaged`).

### Appendix B: Naming Conventions
- Domain Identifier: `ISC-001`
- Entity Identifiers: `inv_<hash>`, `wh_<hash>`, `loc_<hash>`, `mvt_<hash>`
- Error Codes: `ISC-ERR-XXX`
- Event Names: `Inventory<Action>` (e.g. `InventoryReserved`)

### Appendix C: Identifiers
Global Inventory IDs MUST be unique across all tenants: `inv_<identifier>`. Generation mechanism is implementation-defined.

### Appendix D: Revision History

| Version | Date | Author / Role | Description |
| :---: | :---: | :--- | :--- |
| **1.0.0** | 2026-08-02 | Principal Enterprise Software Architect | Initial Specification Draft |
