## 💡 Possible Improvements

These features were out of scope for the MVP but would significantly enhance the system:

### 1. Robust Queue System (Resilience)

-   **Current**: The External API call is synchronous. If the Hub is slow, the user waits.
-   **Improvement**: Implement a Job Queue (e.g., BullMQ with Redis) to handle External API calls asynchronously.
    -   **Automatic Retries**: If the Hub is down, the job or scheduler retries later automatically.
    -   **Better UX**: Unblocks the user interface immediately.

### 2. Authentication & Security

-   **Current**: Endpoints are public.
-   **Improvement**: Implement JWT Authentication (NestJS Guards and passport local guards) for frontend users and an API Key/Signature verification for the Webhook endpoint to ensure requests truly come from the Hub.

### 3. Real-Time Updates

-   **Current**: Dashboard stock levels require a refresh to update.
-   **Improvement**: Implement WebSockets (e.g., Socket.io) to push "Stock Updated" events to the frontend. The Dashboard would update live as soon as the webhook is processed.

### 4. Advanced Inventory Tracking

-   **Current**: Simple Quantity tracking.
-   **Improvement**: Add `StockMovement` logs (Audit Trail) to track every single addition or subtraction (Who, When, Reason). This provides better accountability than just a current balance. in database currently we can use createdAt and updatedAt deletedat, and by whom can be added as well.
