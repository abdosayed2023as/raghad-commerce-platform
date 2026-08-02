# PSC-001: Product Service Contract Specification

**Document Identifier**: PSC-001  
**Title**: Product Service Contract Specification  
**Version**: 1.0.1  
**Status**: Draft  
**Effective Date**: August 2, 2026  
**Governing Standard**: ENG-CON-001 Engineering Constitution & Governance Standard  

---

## 1. Purpose

This Product Service Contract (PSC-001) establishes the definitive, technology-agnostic interface boundary for all product domain operations across the Audit Toolkit platform. It defines the formal data structures, operational semantics, validation rules, error categories, event payloads, security boundaries, and governance policies that govern product entity lifecycle management.

The primary purpose of Product Service is to provide a single, unified, deterministic abstraction over product catalog operations, ensuring that all upstream engines, automated auditors, analytics modules, and downstream synchronization integrations interact with product data through an immutable, versioned, and audited service boundary.

---

## 2. Scope

### 2.1 Domain Responsibilities (In Scope)
Product Service SHALL own and govern:
1. Product entity identity, metadata, and lifecycle state management.
2. Variant hierarchy, SKU management, and attribute definitions.
3. Pricing structures, currency association, and promotional tier metadata.
4. Inventory allocation state, stock thresholds, and location availability mappings.
5. Media asset relationships, display ordering, and asset role assignments.
6. Category taxonomy, collection mappings, and brand associations.
7. Product relation graphs (cross-sells, up-sells, bundles, component dependencies).
8. Product domain audit event generation and event stream emission.

### 2.2 Excluded Responsibilities (Out of Scope)
Product Service SHALL NOT own or execute:
1. Customer checkout, payment gateway processing, or financial transaction settlement.
2. Physical warehouse logistics, shipment tracking, or carrier fulfillment APIs.
3. User authentication, identity provider management, or RBAC role storage.
4. Direct database storage management or physical file storage hosting.
5. Content rendering, HTML template generation, or frontend UI layout presentation.
6. Vendor-specific API connector transformations or third-party webhooks.

---

## 3. Single Source of Truth Principle

### Rule: PSC-SST-001
- **Statement**: Product Service SHALL serve as the exclusive, authoritative single source of truth for all product domain data across the platform.
- **Rationale**: Prevents data fragmentation, state divergence, and un-audited product state mutations.
- **Compliance Level**: Mandatory
- **Verification Method**: Architecture Boundaries Audit
- **Exception Policy**: None.

### Rule: PSC-SST-002
- **Statement**: No platform module, sub-agent, external integration, or database client MAY access, query, or mutate product storage data directly. All operations MUST pass through the explicit contract methods defined in PSC-001.
- **Rationale**: Enforces contract isolation and guarantees operational auditability.
- **Compliance Level**: Mandatory
- **Verification Method**: Static Code Analysis & Access Audit
- **Exception Policy**: None.

---

## 4. Product Identity

### 4.1 Global Product Identifier
Every product entity MUST possess a canonical, immutable Global Product ID (`productId`). Global Product IDs MUST be globally unique across all tenants. The `productId` MUST NEVER be modified or reassigned after creation.

### 4.2 Entity Identity Matrix

| Entity | Identifier Field | Immutability | Scope | Description |
| :--- | :--- | :---: | :---: | :--- |
| **Product** | `productId` | Immutable | Global | Primary root product entity identifier. |
| **Variant** | `variantId` | Immutable | Product | Specific product variation identifier. |
| **Stock Unit** | `sku` | Mutable (Governed) | Global | Stock keeping unit identifier. |
| **Barcode** | `barcode` | Mutable (Governed) | Global | EAN, UPC, or GTIN barcode identifier. |
| **External ID** | `externalIds[]` | Mutable | Integration | System mapping array for external channels. |
| **Version** | `version` | Auto-Incrementing | Entity | Optimistic concurrency control integer. |

### 4.3 Lifecycle States
A product entity MUST exist in exactly one of the following lifecycle states at any time:
- `Draft`: Initial creation state. Entity is non-purchasable and hidden from public search indices.
- `Active`: Published state. Entity is fully validated, search-indexed, and available for catalog display.
- `Archived`: Deprecated state. Entity is hidden from public display but retained for historical order integrity.
- `Deleted`: Soft-deleted tombstone state. Entity is flagged for permanent lifecycle retirement.

---

## 5. Product Structure

The Product Service entity model consists of fifteen logical sub-structures:

1. **Product Root**: Contains `productId`, `tenantId`, `title`, `slug`, `description`, `status`, `createdAt`, `updatedAt`, `version`.
2. **Variant**: Sub-entity containing `variantId`, `sku`, `barcode`, `title`, `options[]`, `weight`, `dimensions`, `isDefault`.
3. **Inventory**: Associated structure tracking `availableQuantity`, `reservedQuantity`, `allocatedQuantity`, `safetyStock`, `fulfillmentLocationId`, `allowBackorder`.
4. **Price**: Monetary structure defining `basePrice`, `salePrice`, `costPrice`, `currencyCode`, `taxClass`, `priceTiers[]`.
5. **Media**: Asset reference containing `mediaId`, `url`, `altText`, `mediaType` (`Image`, `Video`, `3DModel`), `displayOrder`, `isPrimary`.
6. **Category**: Organizational structure containing `categoryId`, `name`, `slug`, `parentCategoryId`, `pathHistory[]`.
7. **Brand**: Entity reference containing `brandId`, `name`, `slug`, `logoMediaId`.
8. **Attributes**: Key-value attribute structures (`attributeId`, `key`, `value`, `type`, `isFilterable`, `isSearchable`).
9. **Metadata**: Extensible key-value metadata object for domain-specific annotations.
10. **Relations**: Directional graph links (`relationType`: `CrossSell`, `UpSell`, `Related`, `Replacement`, `targetProductId`).
11. **Bundles**: Assembly mapping containing `componentProductId`, `componentVariantId`, `quantity`, `isOptional`.
12. **Collections**: Grouping references (`collectionId`, `title`, `slug`, `sortOrder`).
13. **Visibility**: Channel access controls (`channelId`, `isSearchable`, `isHidden`).
14. **Publication**: Schedule controls (`publishAt`, `unpublishAt`, `publicationStatus`).
15. **Availability**: Regional and customer segment restrictions (`regionCodes[]`, `customerGroupIds[]`).

---

## 6. Read Operations

All read operations SHALL be idempotent, side-effect-free, and support projection filtering.

### 6.1 Defined Read Contracts
- `GetProduct(productId, projectionOptions)`: Retrieves a single product root entity by ID.
- `SearchProducts(searchCriteria, paginationOptions, sortOptions)`: Executes multi-faceted catalog search.
- `GetVariant(variantId)`: Retrieves a specific variant sub-entity.
- `ListCategories(filterOptions, paginationOptions)`: Retrieves taxonomy category tree.
- `ListBrands(filterOptions, paginationOptions)`: Retrieves registered brand entities.
- `GetInventory(productId, locationId)`: Retrieves current stock levels for a product/variant.
- `GetPricing(productId, contextOptions)`: Retrieves applicable pricing given currency/customer context.
- `BulkRead(productIds[], projectionOptions)`: Batched retrieval of multiple product entities.
- `GetProductChanges(sinceTimestamp, cursor, pageSize)`: Queries incremental product domain mutations occurring since a specified timestamp for efficient downstream change-feed synchronization.

### 6.2 Search, Pagination, and Projection Parameters
Read contracts MUST support standard query parameters:
- **Search Filters**: Equality, range (`minPrice`, `maxPrice`), set inclusion (`categoryIds`), and full-text text query.
- **Pagination**: Cursor-based pagination (`first`, `after`, `last`, `before`) or limit/offset.
- **Sorting**: Deterministic sorting by `createdAt`, `updatedAt`, `title`, `price`, or `relevance`.
- **Projection**: Selection mask restricting returned sub-structures (e.g., exclude `media` or `inventory`).
- **Version Selection**: Optional `version` parameter for retrieving specific snapshot states.

---

## 7. Write Operations

All write operations MUST require authentication, enforce optimistic concurrency via `version` assertion, and emit corresponding domain events upon successful execution.

### 7.1 Defined Write Contracts
- `CreateProduct(createPayload)`: Instantiates a new product root entity in `Draft` status.
- `UpdateProduct(productId, updatePayload, expectedVersion)`: Mutates attributes of an existing product entity.
- `DeleteProduct(productId, expectedVersion)`: Soft-deletes a product entity.
- `ArchiveProduct(productId, expectedVersion)`: Transitions product state to `Archived`.
- `RestoreProduct(productId, expectedVersion)`: Transitions an `Archived` product back to `Active` or `Draft`.
- `CreateVariant(productId, variantPayload)`: Appends a new variant to a product entity.
- `UpdateVariant(variantId, variantPayload, expectedVersion)`: Mutates an existing variant.
- `AdjustInventory(variantId, locationId, adjustmentPayload)`: Modifies stock quantities deterministically.
- `ReserveInventory(variantId, locationId, quantity, reservationTimeout)`: Creates an atomic, time-bound inventory reservation. Returns a unique `reservationId` and guarantees atomic deduction from available stock into reserved stock. Automatically expires after `reservationTimeout` if not committed.
- `ReleaseInventory(reservationId)`: Cancels an active inventory reservation, releasing reserved stock back into available inventory.
- `ChangePrice(variantId, pricePayload)`: Updates price structures and promotional pricing.
- `AttachMedia(productId, mediaPayload)`: Links a media asset reference to a product.
- `DetachMedia(productId, mediaId)`: Unlinks a media asset reference.
- `BulkOperations(batchPayload)`: Executes a transactional batch of write operations.

---

## 8. Validation Rules

### 8.1 Mandatory Field Assertions
- `CreateProduct` MUST include `title`, `tenantId`, and at least one default `Variant`.
- `Variant` MUST include a valid `sku` and non-negative `price`.
- `Price` MUST include a valid ISO-4217 `currencyCode` (e.g., `USD`, `EUR`, `SAR`).

### 8.2 Immutable Field Protection
The following fields MUST NOT be modified once created:
- `productId`
- `variantId`
- `createdAt`
- `tenantId`

### 8.3 Concurrency Control
Write operations MUST validate `expectedVersion` against current entity `version`. If `expectedVersion !== currentVersion`, the write operation MUST fail immediately with error `PSC-ERR-409 ConcurrencyConflict`.

---

## 9. Error Model

Product Service errors SHALL return standardized, structured error responses matching seven canonical categories:

| Error Category | Canonical Code | Description |
| :--- | :--- | :--- |
| **Validation** | `PSC-ERR-400` | Input payload failed structural or business rule validation. |
| **Permission** | `PSC-ERR-403` | Caller lacks authorization to execute the requested contract operation. |
| **Not Found** | `PSC-ERR-404` | Target `productId`, `variantId`, or resource does not exist. |
| **Conflict** | `PSC-ERR-409` | Optimistic concurrency conflict or duplicate SKU/barcode collision. |
| **Rate Limited** | `PSC-ERR-429` | Request volume exceeded service rate limits. |
| **Unavailable** | `PSC-ERR-503` | Underlying storage or dependency service is temporarily offline. |
| **Internal Error** | `PSC-ERR-500` | Unhandled system exception encountered. |

---

## 10. Events

Product Service MUST emit an immutable, structured event stream for every state mutation:

1. `ProductCreated`: Emitted when a new product is instantiated.
2. `ProductUpdated`: Emitted when product metadata or root properties change.
3. `ProductArchived`: Emitted when a product transitions to `Archived`.
4. `ProductDeleted`: Emitted when a product is soft-deleted.
5. `VariantCreated`: Emitted when a new variant is added.
6. `VariantUpdated`: Emitted when variant attributes or options change.
7. `InventoryAdjusted`: Emitted when stock levels are modified.
8. `PriceChanged`: Emitted when pricing structures are modified.
9. `MediaUpdated`: Emitted when media attachments or display orders change.
10. `StatusChanged`: Emitted when lifecycle state transitions occur (e.g., `Draft` $\rightarrow$ `Active`).

### 10.1 Event Payload Modes
Every emitted event MUST explicitly declare its payload mode via `payloadMode`:
- `StateSnapshot`: Payload contains the complete post-mutation entity state. Intended for downstream consumers requiring full entity reconstruction without callback reads.
- `DeltaMutation`: Payload contains only the modified fields and state deltas. Intended for high-throughput, efficient event processing.

Every event envelope MUST include `eventId`, `eventType`, `payloadMode`, `productId`, `tenantId`, `timestamp`, `version`, and `data`.

---

## 11. Security

### 11.1 Authentication & Authorization
All write contracts MUST authenticate the calling identity and verify granular permission scopes (e.g., `product:write`, `inventory:adjust`).

### 11.2 Audit & Traceability
Every mutation MUST record the initiating actor ID, client IP, timestamp, and operation context in a persistent, immutable audit log.

### 11.3 Least Privilege
Read contracts MAY restrict field visibility (e.g., suppress `costPrice` or `safetyStock`) based on the caller's authorized role context.

---

## 12. Versioning

1. **Schema Versioning**: Product Service schemas follow Semantic Versioning (`MAJOR.MINOR.PATCH`).
2. **Contract Compatibility**: Minor updates MUST be non-breaking and additive.
3. **Deprecation Policy**: Contract fields marked for deprecation MUST remain supported for a minimum of two major release cycles prior to removal.

---

## 13. Performance

1. **Caching**: Read contracts MAY utilize read-through caches. Cache invalidation MUST occur synchronously upon receipt of domain events.
2. **Pagination Bounds**: List and search contracts MUST enforce a maximum page size limit (default 100 items).
3. **Bulk Execution Limits**: `BulkOperations` MUST enforce a maximum batch size limit (default 500 items per request).
4. **Response SLA**: Read contracts SHOULD respond within 50ms (p95); write contracts SHOULD respond within 200ms (p95).

---

## 14. Reliability

1. **Idempotency**: All write operations MUST accept an optional `idempotencyKey`. Duplicate requests with identical keys MUST return identical responses without re-executing state mutations.
2. **Consistency**: Product Service SHALL guarantee read-after-write consistency for single-entity operations.
3. **Failure Isolation**: Failures in media processing or search indexing subsystems MUST NOT block core product entity database writes.

---

## 15. Governance

1. **Ownership**: Product Service is owned by the Platform Engineering Committee.
2. **Specification Approval**: Changes to PSC-001 require formal review and approval by the Principal Software Architect and Lead Security Auditor.
3. **Freeze Authority**: Once tagged `FROZEN`, PSC-001 contracts MUST NOT be modified under the baseline version.

---

## Appendix

### Appendix A: Definitions
- **SKU**: Stock Keeping Unit; a unique merchant identifier for a specific product variation.
- **Tenant**: An isolated organizational entity within a multi-tenant platform installation.
- **Variant**: A distinct physical or digital item variation (e.g., Size: Large, Color: Blue) derived from a parent product.

### Appendix B: Naming Conventions
- Entity Identifiers: camelCase with `Id` suffix (e.g., `productId`, `variantId`).
- Events: PascalCase past-tense nouns (e.g., `ProductCreated`, `PriceChanged`).
- Error Codes: Upper-case with hyphenation (`PSC-ERR-400`).

### Appendix C: Identifiers
Global Product IDs MUST be globally unique across all tenants. The identifier generation mechanism is implementation-defined. The contract MUST NOT assume any specific algorithm.

Prefix formatting recommendations:
- Product ID: `prd_<identifier>`
- Variant ID: `var_<identifier>`
- Media ID: `med_<identifier>`

### Appendix D: Revision History

| Version | Date | Author / Role | Description |
| :---: | :---: | :--- | :--- |
| **1.0.0** | 2026-08-02 | Principal Software Architect | Initial Draft Specification |
| **1.0.1** | 2026-08-02 | Principal Software Architect | Additive Architecture Amendments (PSC-ARCH-01..04) |
