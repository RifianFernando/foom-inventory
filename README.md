# Foom Inventory System

## 🧠 Design Decisions

### 1. External API Synchronization Strategy
A critical requirement was synchronizing purchase requests with the external Hub API (`https://hub.foomid.id`).
-   We perform the external API call **before** committing the status change to `CONFIRMED` in our local database.

### 2. Transactional Integrity
We leverage Prisma's Interactive Transactions (`$transaction`) for critical workflows:
-   **Purchase Request Update**: When updating items and status, we delete old items and create new ones atomically. If any part fails, the entire update is rolled back.
-   **Stock Reception**: The webhook processing (Stock Increment + Status Update to `COMPLETED`) happens in a single transaction. This guarantees that we never increment stock without closing the purchase request.

### 3. Webhook Idempotency
To handle potential duplicate webhook deliveries:
-   **Logic**: The `receive-stock` service first checks if the Purchase Request is already `COMPLETED`. If so, it returns Success immediately without modifying stock. This prevents double-counting stock if the webhook is retried.

### 4. Frontend Architecture
-   **Client-Side Rendering (CSR)**: The application primarily uses `'use client'` components to handle dynamic interactions and API data fetching, ensuring a responsive user experience.
-   **Material UI (MUI)**: Integrated with Next.js App Router using a custom `EmotionCache`. This ensures that even with Client Components, the initial Server-Side Render (SSR) delivers correctly styled HTML, preventing hydration mismatches.
-   **Component Reusability**: The `PurchaseRequestForm` handles both "Create" and "Edit" modes, reducing code duplication.

---
