> **⚠️ ARCHIVED — SCOPE DRIFT (2026-08-10).** Produced during a period of scope
> inflation in this toolkit's development. Describes an enterprise commerce system
> (orders / inventory / product services) that is NOT part of the Raghad Commerce
> Platform architecture — Raghad's commerce backend is the Easy Orders platform.
> Preserved for reference only. Do not treat as intended architecture.
> (Business Owner statement, 2026-08-09.)

# ORD-000: Order Domain Architecture Blueprint

**Document Identifier**: ORD-000  
**Title**: Order Domain Architecture Blueprint  
**Version**: 1.0.1  
**Status**: Draft Architecture Blueprint  
**Effective Date**: August 2, 2026  
**Governing Standard**: ENG-CON-001 Engineering Constitution & Governance Standard  
**Related Upstream Domain Standards**:  
- PSC-001 Product Service Contract Specification v1.0.1 (FROZEN)  
- PSC-002 Product Provider Contract Specification v1.0.1 (FROZEN)  
- ISC-001 Inventory Service Contract Specification v1.0.0 (DRAFT)  

---

## 1. Purpose

This Order Domain Architecture Blueprint (ORD-000) establishes the supreme architectural blueprint for all order processing, checkout orchestration, payment settlement, fulfillment tracking, returns, replacements, and customer timeline services across the Audit Toolkit platform.

It defines the formal state machine, domain boundaries, cross-service interaction flows (Product, Inventory, Payment, Logistics), saga compensation patterns, event structures, AI automation integration points, and future contract roadmaps required to operate an enterprise-grade order management ecosystem.

---

## 2. Scope

### 2.1 Order Domain Boundaries (In Scope)
The Order Domain owns and governs:
1. Order entity lifecycle orchestration from cart checkout draft to final completion or settlement.
2. The canonical Order State Machine and legal/forbidden state transitions.
3. Order-to-Inventory two-phase reservation, allocation, consumption, and release workflows.
4. Order-to-Payment authorization, capture, void, and refund orchestration.
5. Order-to-Shipping shipment creation, tracking updates, and delivery confirmation.
6. Order exception handling, cancellations, returns, replacements, and partial/full refunds.
7. Order Domain event stream generation and saga compensation workflows.
8. AI agent integration touch points for fraud detection, order validation, and customer communication.

### 2.2 Boundary Exclusions (Out of Scope)
The Order Domain SHALL NOT own or execute:
1. Product catalog definitions, prices, variants, or media storage (owned by PSC-001).
2. Physical stock counts, warehouse bin locations, or inventory movement ledgers (owned by ISC-001).
3. Raw external provider ingestion or external catalog synchronization (owned by PSC-002).
4. Direct credit card processing or payment gateway vault storage.
5. Physical shipping vehicle fleet management or carrier routing algorithms.

---

## 3. Architectural Principles

### Rule: ORD-ARC-001 (Saga-Based Eventual Consistency)
- **Statement**: Cross-domain order workflows involving Product (PSC-001), Inventory (ISC-001), Payment, and Logistics MUST execute via asynchronous Saga Orchestration patterns. Distributed ACID transactions across domain boundaries are strictly prohibited.
- **Compliance Level**: Mandatory
- **Verification Method**: Architecture Saga Audit

### Rule: ORD-ARC-002 (Immutable Order Snapshots)
- **Statement**: When an order transitions from `Draft` to `Pending`/`Confirmed`, all relevant product attributes, variant titles, unit prices, tax rates, and shipping addresses MUST be frozen into an immutable Order Snapshot. Future mutations in PSC-001 catalog prices or product titles MUST NOT alter existing orders.
- **Compliance Level**: Mandatory
- **Verification Method**: Data Immutability Audit

### Rule: ORD-ARC-003 (Deterministic State Machine)
- **Statement**: Order state transitions MUST be strictly deterministic and enforced by the canonical Order State Machine defined in Section 7. Illegal state transitions MUST throw explicit domain exceptions.
- **Compliance Level**: Mandatory
- **Verification Method**: State Machine Static Analysis

---

## 4. Domain Responsibilities

```text
+-----------------------------------------------------------------------------------+
|                        Order Domain Architecture Boundary                         |
|                                                                                   |
|  +-----------------------+   +-----------------------+   +---------------------+  |
|  |  ORD-001 Order Service|   | ORD-002 Payment Service|  |ORD-003 Ship Service |  |
|  +-----------+-----------+   +-----------+-----------+   +----------+----------+  |
|              |                           |                          |             |
|  +-----------v-----------+   +-----------v-----------+   +----------v----------+  |
|  |  ORD-004 Return Svc   |   |  ORD-005 Refund Svc   |   | ORD-006 Timeline Svc|  |
|  +-----------------------+   +-----------------------+   +---------------------+  |
+-----------------------------------------+-----------------------------------------+
                                          | Orchestrates Contracts
                                          v
+-----------------------------------------------------------------------------------+
|                        Upstream Platform Service Domains                          |
|  - PSC-001 Product Service (Catalog & Price Snapshot Context)                     |
|  - ISC-001 Inventory Service (Reserve -> Allocate -> Consume -> Release)          |
|  - External Payment Gateways & Courier Logistics Carriers                         |
+-----------------------------------------------------------------------------------+
```

---

## 5. Domain Boundaries & Interactions

### 5.1 Interaction with Product Service (PSC-001)
- During checkout (`Draft` $\rightarrow$ `Pending`), Order Domain queries `PSC-001` via `GetProduct`, `GetVariant`, and `GetPricing`.
- Order Domain captures an immutable product snapshot (`title`, `sku`, `price`, `taxClass`, `currencyCode`).
- Order Domain NEVER calls PSC-001 write contracts.

### 5.2 Interaction with Product Provider (PSC-002)
- Order Domain receives external channel order imports via `PSC-002` mapping events.
- Order Domain resolves provider external IDs $(\text{providerId}, \text{externalProductId})$ to canonical platform IDs before initializing order processing.

### 5.3 Interaction with Inventory Service (ISC-001)
- **Draft/Pending State**: Invokes `ISC-001` `ReserveInventory()` to place temporary checkout locks.
- **Confirmed State**: Invokes `ISC-001` `AllocateInventory()` to commit reserved stock to confirmed orders.
- **Packed/Shipped State**: Invokes `ISC-001` `ConsumeInventory()` to physically deduct stock balances.
- **Cancelled/Expired State**: Invokes `ISC-001` `ReleaseInventory()` to restore stock to `availableQuantity`.

---

## 6. Order Lifecycle

The Order Domain orchestrates ten primary aggregate lifecycle states plus partial execution states:

```text
  [Draft]
     |
     v
  [Pending] --------(Payment/Inventory Failure)--------> [Failed] / [Expired]
     |
     v
  [Confirmed] ------(Customer / Admin Cancel)---------> [Cancelled]
     |
     v
  [Processing]
     |
     +------------------------------+
     |                              | (Partial Consignments Staged)
     v                              v
  [Packed]                   [Partially Shipped]
     |                              |
     v                              v
[Ready For Shipment]            [In Transit]
     |                              |
     +--------------+---------------+
                    |
                    v
               [Delivered]
                    |
                    +-----------------------+
                    | (Full Completion)     | (Partial Item Return)
                    v                       v
               [Completed] <------- [Partially Returned]
                                            |
                                            v
                                   [Partially Refunded]
```

### Lifecycle Paths Summary:
1. **Happy Path**: `Draft` $\rightarrow$ `Pending` $\rightarrow$ `Confirmed` $\rightarrow$ `Processing` $\rightarrow$ `Packed` $\rightarrow$ `Ready For Shipment` $\rightarrow$ `In Transit` $\rightarrow$ `Delivered` $\rightarrow$ `Completed`.
2. **Partial Fulfillment Path**: `Processing` $\rightarrow$ `Partially Shipped` $\rightarrow$ `In Transit` $\rightarrow$ `Delivered` $\rightarrow$ `Completed`.
3. **Partial Return Path**: `Delivered` $\rightarrow$ `Partially Returned` $\rightarrow$ `Partially Refunded` $\rightarrow$ `Completed`.
4. **Cancellation Path**: `Pending` or `Confirmed` $\rightarrow$ `Cancelled` (triggers `ReleaseInventory` and payment authorization void).
5. **Failure / Expiration Path**: `Pending` $\rightarrow$ `Failed` / `Expired` (due to payment decline or reservation timeout).

---

## 7. Order State Machine

### 7.1 Legal State Transitions

| Current State | Target State | Triggering Event / Action | Authorized Actors |
| :--- | :--- | :--- | :--- |
| `Draft` | `Pending` | Checkout initiated | Customer, System |
| `Pending` | `Confirmed` | Payment authorized & Inventory reserved | Payment Gateway, System |
| `Pending` | `Failed` | Payment declined or authorization error | Payment Gateway, System |
| `Pending` | `Expired` | Reservation timer expired before payment | System (Cleaner Sweep) |
| `Confirmed` | `Processing` | Order dispatched to warehouse fulfillment | Warehouse System |
| `Confirmed` | `Cancelled` | Customer/Admin cancels order prior to packing | Customer, Admin |
| `Processing` | `Packed` | All line items picked, packed, and boxed | Warehouse Operator |
| `Processing` | `Partially Shipped` | Subset of consignments dispatched | Warehouse Operator |
| `Packed` | `Ready For Shipment` | Shipping label generated & package staged | Warehouse Operator |
| `Partially Shipped` | `In Transit` | Carrier picks up partial shipment | Carrier Courier |
| `Partially Shipped` | `Delivered` | Partial shipment delivered | Carrier Courier |
| `Ready For Shipment`| `In Transit` | Carrier picks up package and scans manifest | Carrier Courier |
| `In Transit` | `Delivered` | Delivery confirmation scan | Carrier Courier, Customer |
| `In Transit` | `Delivery Failed` | Courier failed delivery attempts | Carrier Courier |
| `Delivered` | `Completed` | Return window expires without dispute | System |
| `Delivered` | `Return Requested` | Customer opens full return request | Customer |
| `Delivered` | `Partially Returned` | Customer returns a subset of line items | Customer, Warehouse |
| `Partially Returned`| `Partially Refunded`| Refund issued for returned line items | System, Admin |
| `Partially Refunded`| `Completed` | Return window expires for remaining items | System |

### 7.2 Forbidden Transitions (Enforced Invariants)
- `Completed` MUST NOT transition to `Draft`, `Pending`, `Processing`, or `Partially Shipped`.
- `Cancelled` MUST NOT transition to `In Transit`, `Delivered`, `Partially Shipped`, `Partially Returned`, or `Partially Refunded`.
- `Packed` MUST NOT transition directly to `Completed` without passing through `In Transit` and `Delivered`.
- `Partially Shipped` MUST NOT transition back to `Draft` or `Pending`.

### 7.3 Guest Checkout Identity Context
Order creation MUST support both authenticated customer account checkouts and guest checkouts:
- **Guest Identity Context**: Unauthenticated checkouts record `guestEmail`, `guestPhone`, `guestSessionToken`, and `anonymousIdentity` flags within the order snapshot.
- **Order Claim Process**: A guest order MAY later be claimed and associated with a registered customer account (`orderClaimProcess`) via verification of `guestEmail` and `guestSessionToken`. Claiming an order updates customer link context without altering canonical order history or state machine transitions.

---

## 8. Inventory Interaction Flow

```text
[Customer Checkout] ---> ISC-001: ReserveInventory() (Hold generated)
                                 |
           +---------------------+---------------------+
           | Success                                   | Payment Failed / Expired
           v                                           v
ISC-001: AllocateInventory()                ISC-001: ReleaseInventory()
(Committed to Order)                        (Stock Restored to Available)
           |
           v
ISC-001: ConsumeInventory()
(Physical Stock Deducted upon Shipment)
```

---

## 9. Payment Interaction Flow

1. **Pending**: Order awaits payment processing.
2. **Authorized**: Funds reserved on customer credit/debit facility via two-phase authorization.
3. **Captured**: Funds physically transferred upon order confirmation or packing dispatch.
4. **Failed**: Gateway declined transaction; triggers order `Failed` state and inventory release.
5. **Cancelled / Voided**: Uncaptured authorization released upon early order cancellation.
6. **Refunded**: Funds returned to customer following approved return or order adjustment.
7. **Partial Refund**: Partial monetary compensation issued while order remains active/completed.

---

## 10. Shipping & Logistics Interaction Flow

1. **Create Shipment**: Generate shipping consignment record upon order reaching `Processing`.
2. **Assign Courier**: Select optimal carrier based on destination, weight, and SLA cost parameters.
3. **Pickup**: Courier scans package manifest at warehouse staging dock (`In Transit`).
4. **Transit**: Asynchronous tracking events updated via carrier webhooks.
5. **Delivery**: Final delivery scan triggers transition to `Delivered`.
6. **Delivery Failure / Return to Origin (RTO)**: Repeated delivery failures trigger RTO flow back to warehouse receiving dock.

### 10.1 Multi-Package Consignment Model
Orders containing multiple items or fulfilled from separate warehouse facilities operate via a Multi-Package Consignment structure ($1 \text{ Order} \rightarrow 1..N \text{ Consignments}$):
- `consignmentId`: Globally unique consignment package identifier.
- `shipmentId`: Associated carrier shipment record identifier.
- `carrierCode`: Assigned shipping courier service provider code.
- `trackingNumber`: Carrier tracking code assigned to consignment.
- `lineItemIds[]`: Array of order line item identifiers contained within the specific consignment package.

Each consignment tracks its own shipping lifecycle independently while aggregating status into the parent order state (`Partially Shipped` vs `In Transit` vs `Delivered`).

---

## 11. Return Flow

1. Customer/Support submits return request specifying line items, quantities, and reason code.
2. System verifies eligibility against policy rules (e.g. within 30-day window, item returnable).
3. Return authorization (RMA) issued with return shipping label.
4. Goods received at warehouse quarantine dock (`ISC-001 ReceiveInventory`).
5. Quality inspection verifies item condition (Restockable vs Damaged).
6. Restockable items returned to active inventory (`ISC-001 AdjustInventory`); Refund triggered.

### 11.1 Line Item Lifecycle Architecture
Order line items maintain a granular line-item state machine independent of the aggregate order state:

```text
[Unfulfilled] ---> [Fulfilled] ---> [Return Requested] ---> [Returned] ---> [Refunded]
                                   |
                                   +---> [Replacement Requested] ---> [Replacement Completed]
```

- `Unfulfilled`: Item is pending picking, packing, or dispatch.
- `Fulfilled`: Item has been packaged and shipped to customer.
- `Return Requested`: Customer opened an RMA request for this specific item.
- `Returned`: Item received and inspected at warehouse.
- `Replacement Requested`: Customer opted for item replacement rather than refund.
- `Replacement Completed`: Replacement item dispatched under new consignment.
- `Refunded`: Monetary refund issued for this line item.

The aggregate order state transitions to `Partially Returned` or `Partially Refunded` based on the status of individual line items.

---

## 12. Replacement Flow

1. Approved return specifies replacement preference instead of monetary refund.
2. Replacement Order generated referencing original order ID (`parentOrderId`).
3. `ISC-001 ReserveInventory` invoked for replacement item.
4. Replacement order enters standard fulfillment flow (`Confirmed` $\rightarrow$ `Processing` $\rightarrow$ `Shipped`).

---

## 13. Refund Flow

1. Refund requested via return approval, order cancellation, or price correction.
2. Monetary calculation determines refundable amount (items + prorated tax + shipping adjustment).
3. Refund contract executes transaction with payment provider (`ORD-005 Refund Service`).
4. Financial ledger entry recorded; `OrderRefunded` event emitted.

---

## 14. Major Order Domain Events

- `OrderCreated`: Emitted when an order enters `Pending` state.
- `OrderConfirmed`: Emitted when payment authorization and inventory reservation succeed.
- `OrderCancelled`: Emitted when an order is cancelled prior to shipment.
- `OrderPacked`: Emitted when items are boxed and staged for shipment.
- `OrderShipped`: Emitted when carrier scans package into transit.
- `OrderDelivered`: Emitted upon successful customer delivery confirmation.
- `OrderCompleted`: Emitted when return window closes and order reaches final state.
- `OrderFailed`: Emitted when payment or inventory reservation fails.
- `OrderReturnRequested`: Emitted when a customer initiates a return.
- `OrderRefundIssued`: Emitted when monetary funds are refunded.

Every event MUST declare `payloadMode` (`StateSnapshot` | `DeltaMutation`) and include standard envelope metadata.

---

## 15. Automation Touch Points

Automated background workers intervene at key orchestration points:
- **Reservation Cleaner Sweep**: Automatically releases expired inventory holds for abandoned checkouts.
- **Auto-Fulfillment Dispatch**: Automatically routes confirmed orders to optimal fulfillment centers based on proximity and stock.
- **Tracking Webhook Poller**: Ingests carrier tracking updates asynchronously.
- **Auto-Completion Job**: Automatically marks orders `Completed` 14 days after delivery if no return is opened.

---

## 16. AI Touch Points

Artificial Intelligence Agents participate across five explicit touch points:

```text
[Inbound Checkout] ---> [AI Agent: Fraud & Risk Assessment] ---> (High Risk -> Flag for Review)
                                                                 (Low Risk -> Auto-Approve)

[Order Processing] ---> [AI Agent: Smart Routing & Batching] ---> Selects Optimal Warehouse

[Customer Query]   ---> [AI Agent: CX Support Agent]        ---> Real-time Status & RMA Generation

[Return Request]   ---> [AI Agent: Automated Return Evaluator]-> Auto-Approves Low-Risk RMA

[Exceptions]       ---> [AI Agent: Escalation Classifier]   ---> Routes Edge Cases to Support
```

---

## 17. Cross-Domain Dependencies

- **PSC-001 Product Service**: Provides canonical product snapshot data.
- **ISC-001 Inventory Service**: Provides stock availability, reservations, and allocation.
- **PSC-002 Product Provider**: Provides external channel order synchronization.
- **External Payment Gateways**: Executes financial transactions.
- **External Logistics Carriers**: Executes physical transport and tracking updates.

---

## 18. Reliability & Saga Compensation Architecture

### 18.1 Reliability Principles
1. **Saga Compensation**: Every step in order orchestration MUST define an explicit compensating transaction.
2. **Idempotent Operations**: All state transition requests MUST require an `idempotencyKey`.
3. **Dead Letter Queue (DLQ) Isolation**: Unrecoverable saga failures MUST quarantine into DLQ buffers for manual audit intervention.

### 18.2 Multi-Step Saga Compensation Matrix

| Distributed Failure Scenario | Initiating Trigger | Compensating Rollback Chain | Resulting State |
| :--- | :--- | :--- | :--- |
| **Payment Authorized, Inventory Allocation Failed** | `ISC-001 AllocateInventory` returns out-of-stock error | 1. Invoke `ISC-001 ReleaseInventory(reservationId)`<br>2. Invoke Payment Gateway `VoidAuthorization(paymentId)` | Order `Failed` |
| **Inventory Reserved, Payment Declined** | Payment Gateway returns card decline | 1. Invoke `ISC-001 ReleaseInventory(reservationId)` | Order `Failed` |
| **Inventory Reserved, Checkout Abandoned** | Reservation timeout threshold reached | 1. Invoke `ISC-001 ReleaseInventory(reservationId)` via Cleaner Sweep | Order `Expired` |
| **Shipment Creation Failed** | Courier API returns unserviceable address | 1. Roll back allocation: `ISC-001 ReleaseInventory(allocationId)`<br>2. Re-reserve stock for warehouse re-routing: `ISC-001 ReserveInventory()` | Order `Processing` (Re-route) |
| **Order Cancelled Post-Packing** | Customer/Admin cancels order prior to shipping | 1. Unpack items & restock: `ISC-001 AdjustInventory()`<br>2. Reverse payment: Void Auth or `ORD-005 IssueRefund()` | Order `Cancelled` |
| **Delivery Failed / Return to Origin (RTO)** | Carrier exhausted delivery attempts | 1. Receive returned package: `ISC-001 ReceiveInventory()`<br>2. Process refund deducting RTO fee: `ORD-005 IssueRefund()` | Order `Returned To Origin` |

---

## 19. Scalability Principles

1. **Partitioning**: Orders SHALL be partitioned by `tenantId` and `orderId`.
2. **Read/Write Segregation**: Order queries (customer timeline, dashboard metrics) MUST utilize read-optimized projections refreshed via event streams.
3. **Asynchronous Processing**: Non-critical workflows (notifications, analytics, AI recommendations) MUST execute asynchronously out of line from core checkout operations.

---

## 20. Governance

1. **Ownership**: Governed by the Platform Architecture Committee.
2. **Specification Authority**: Changes require formal architectural review and security sign-off.

---

## 21. Freeze Rules

1. Once tagged `FROZEN`, `ORD-000` architecture blueprint principles and state machine invariants MUST NOT be altered under the baseline version.
2. Future contracts (`ORD-001` through `ORD-007`) MUST strictly conform to `ORD-000`.

---

## 22. Future Contract Roadmap

The Order Domain architecture will be implemented across seven dedicated contract specifications:

| Contract ID | Contract Name | Core Responsibility |
| :--- | :--- | :--- |
| `ORD-001` | **Order Service Contract** | Core order CRUD, state machine enforcement, and line item management. |
| `ORD-002` | **Payment Service Contract** | Payment gateway abstraction, authorizations, captures, and voids. |
| `ORD-003` | **Shipping Service Contract** | Consignment creation, carrier integration, label generation, and tracking. |
| `ORD-004` | **Return Service Contract** | RMA generation, return shipping, item inspection, and quarantine workflows. |
| `ORD-005` | **Refund Service Contract** | Monetary refund calculations, ledger entries, and payout execution. |
| `ORD-006` | **Customer Timeline Service** | Consolidated customer-facing audit timeline and tracking history. |
| `ORD-007` | **Notification Service Contract**| Customer email/SMS transactional notifications and event alerts. |

---

## Appendix

### Appendix A: Definitions
- **Saga**: A sequence of local transactions where each transaction updates data within a single service and publishes an event to trigger the next transaction.
- **RMA**: Return Merchandise Authorization; a tracking code assigned to a customer return.
- **RTO**: Return to Origin; carrier process returning undeliverable shipments back to the sender.

### Appendix B: Terminology
- **Order State Machine**: The deterministic state transition manager governing order lifecycles.
- **Order Snapshot**: The immutable point-in-time copy of product and price data captured during checkout.

### Appendix C: Revision History

| Version | Date | Author / Role | Description |
| :---: | :---: | :--- | :--- |
| **1.0.0** | 2026-08-02 | Principal Enterprise Software Architect | Initial Architecture Blueprint Draft |
| **1.0.1** | 2026-08-02 | Principal Enterprise Software Architect | Additive Architecture Amendments (ARCH-ORD-01..05) |
