# SuperLabs Ecommerce Product Listing System
Developed a full-stack eCommerce product listing system with complete admin management features, including adding, editing, updating, and deleting products along with image upload functionality. The platform also provides user features such as viewing product listings, accessing product details, and searching products efficiently.
---

## Introduction
This project was developed as part of the SuperLabs candidate task. The focus is on **Product Listing functionality**, including backend APIs, product search, product detail, and an admin interface for managing products. A minimal frontend is included to verify and demonstrate the APIs.

---

## Technology Stack
- Backend: Node.js (Express.js)
- Database: PostgreSQL
- Authentication: JWT with role-based access (Admin/User)
- Frontend: Vanilla HTML/JS for testing (React/Tailwind optional upgrade)
- Deployment: Localhost (port 3334)

---

## Implemented Features

### Backend
- Product Model: `products` and `product_images` tables with proper relations.
- Search API:
  - `GET /api/v1/user/products?q=keyword&page=1`
  - Supports pagination and keyword search by name, description, SKU, or ID.
- Product Detail API:
  - `GET /api/v1/user/products/:searchWord`
  - Returns product details including name, description, price, SKU, availability, and aggregated image URLs.
- Admin APIs:
  - Create, update, delete products.
  - Upload product images (stored as `/uploads/products/...` or external `https://...` URLs).
  - Secure login with JWT.

### Frontend (Minimal Testing UI)
- Product Listing Page:
  - Displays product grid with images, name, description, price, and “View” button.
  - Handles both local image paths and external URLs.
  - Fallback to `default.jpg` if no image exists.
- Search Bar:
  - Filters products by keyword.
- Product Detail Page:
  - Shows product information and multiple images.
- Admin Login Page:
  - Simple form to authenticate and access admin features.

---

## Project Structure


<img width="280" height="560" alt="image" src="https://github.com/user-attachments/assets/b96cc3a5-b631-4b4b-98c4-bfca33184ba8" />








---

## Admin Credentials
- Email: `admin@superlabs.com`
- Password: `Admin@123`

---

### Prerequisites
- Node.js v18+
- PostgreSQL
- npm or pnpm

### Setup
```bash
# Clone repo
git clone git@github.com:your-username/ecomm-superlabs.git
cd ecommerce_task


IN Database 
Kindly run the backend/schema/schema_diff.sql
kindly run the backend/schema/data_diff.sql

Please run the above file database create a database ecommerce

Change the env file for the database data

### Run
cd backend
npm i 
node index.js
