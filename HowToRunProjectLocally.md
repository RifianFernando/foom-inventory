# How to Run Project Locally

This guide walks you through setting up and running the Foom Inventory System (Backend & Frontend) locally.

## Prerequisites
- **Node.js** (v18 or higher recommended)
- **pnpm** (Package manager)
- **PostgreSQL** Database running locally or accessible via URL

---

## 1. Backend Setup (Port 4000)

The backend is built with NestJS and uses Prisma ORM for database management.

### Step 1: Configure Environment
Navigate to the `backend` directory:
```bash
cd backend
```
Ensure you have a `.env` file configured. Example `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/foom_db?schema=public"
PORT=4000
```
> **Note:** Replace `user`, `password`, and `foom_db` with your actual Postgres credentials. Ensure the database `foom_db` is created.

### Step 2: Install & Database Setup
Install dependencies and sync the database schema:
```bash
pnpm install

# Generate Prisma Client
pnpm dlx prisma generate

# Push schema changes to the database
pnpm dlx prisma db push

# Seed the database with initial data (Products, Warehouses, etc.)
pnpm run db:seed
```

### Step 3: Run the Backend
Start the development server:
```bash
pnpm run start:dev
```
- **API URL:** [http://localhost:4000](http://localhost:4000)
- **Swagger Documentation:** [http://localhost:4000/api-docs](http://localhost:4000/api)

### Optional: Webhook Testing
If the backend needs to receive webhooks from external services (e.g. for production testing), expose your local port:
```bash
# Using tunnelmole
tmole 4000
# OR using ngrok
ngrok http 4000
```

---

## 2. Frontend Setup (Port 3000)

The frontend is built with Next.js 13+ (App Router) and Material UI.

### Step 1: Configure Environment
Navigate to the `frontend` directory:
```bash
cd frontend
```
Create a `.env.local` file (optional if using defaults):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Step 2: Install Dependencies
```bash
pnpm install
```

### Step 3: Run the Frontend
Start the Next.js development server:
```bash
pnpm run dev
```
- **Application URL:** [http://localhost:3000](http://localhost:3000)

---

## 3. Verification

1.  **Backend Check:** Visit [http://localhost:4000](http://localhost:4000). You should see the Swagger UI with available endpoints (`Stocks`, `Products`, `Purchase Webhook`, etc.).
2.  **Frontend Check:** Visit [http://localhost:3000](http://localhost:3000). You should see the **Inventory Overview** dashboard with stats and stock levels.

## 4. Testing with Postman

You can use the provided Postman collection to test API endpoints directly.

1.  Open **Postman**.
2.  Click **Import**.
3.  Select the file `Foom.postman_collection.json` located in the project root.
4.  You can now execute requests for Stocks, Products, Purchase Requests, and Webhooks against your local backend.

## Troubleshooting

-   **Database Connection Failed:**
    -   Check if Postgres is running (`pg_isready` or check services).
    -   Verify `DATABASE_URL` in `backend/.env`.
-   **Frontend API Errors:**
    -   Ensure the Backend is running on port 4000.
    -   Check CORS issues (Backend enables CORS by default).
    -   Verify `NEXT_PUBLIC_API_URL` correct.
-   **Hydration Errors (Frontend):**
    -   Often caused by browser extensions. Try opening in Incognito mode.
