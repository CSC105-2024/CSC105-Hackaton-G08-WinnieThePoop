## :pushpin: Winnie The Poop

  Winnie The Poop is a web app that helps users track their digestive health by logging the color and texture of their poop in a simple, fun way. With a friendly design and lighthearted tone, it flags abnormalities and encourages early detection, making it easier to talk about and take care of gut health.

## :rocket: Getting Started
1. Clone the repository: bash git clone https://github.com/CSC105-2024/CSC105-Hackaton-G08-WinnieThePoop.git `cd CSC105-Hackaton-G08-WinnieThePoop`


## :hammer: Frontend - React
### :wrench: Tech Stack
- @hookform/resolvers
- tailwindcss/vite
- axios
- date-fns
- dayjs
- jwt-decode
- react
- react-dom
- react-hook-form
- react-icons
- react-modal
- react-router-dom
- tailwind
- tailwindcss
- zod

## :rocket: Getting Started - React Client
1. Navigate to the frontend directory: `bash cd frontend`
2. Install dependencies: `bash npm install`
3. Start the development server: `bash npm run dev`
4. The client will be running on `http://localhost:5173/`

---
## :wrench: Backend - Node.js
### :hammer_and_wrench: Tech Stack

- Node.js
- Hono
- @hono/node-server
- Prisma ORM (@prisma/client)
- SQLite
- dotenv
- bcrypt
- jsonwebtoken
- cloudinary
- node-cron
- Zod

---
## :electric_plug: API Endpoints


## 📥 Create (POST / PUT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/record` | Create a new health record |
| PUT    | `/record/:id` | Update a specific health record |
| POST   | `/user/signup` | Create new user |
| POST   | `/user/login` | User login |
| POST   | `/user/profile/upload-profile-pic` | Upload user profile picture |

---

## 📄 Read (GET)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/record` | Get all health records |
| GET    | `/record/count/:date` | Get record count by date |
| GET    | `/record/status/:date` | Get health status by date |
| GET    | `/user/profile` | Get user profile |

---

## ♻️ Update (PUT / PATCH)

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT    | `/record/:id` | Update a specific health record |
| PATCH  | `/user/profile` | Update user profile |

---

## ❌ Delete (DELETE)

| Method | Endpoint | Description |
|--------|----------|-------------|
| DELETE | `/record/:id` | Delete a specific health record |

---


## :rocket: Getting Started - Node.js Server

1. Navigate to the backend directory: `bash cd backend`
2. Install dependencies: `bash npm install`
3. Create a `.env` file and configure the following variables:
```env
DATABASE_URL = "mysql://cs25_g08:JurtG+ehhQ@cshackathon.sit.kmutt.ac.th:3306/cs25_g08_hackathon"
SHADOW_DATABASE_URL = "mysql://cs25_g08:JurtG+ehhQ@cshackathon.sit.kmutt.ac.th:3306/cs25_g08_hackathon_shadow"

EMAIL_USER=nichahongsri@gmail.com
EMAIL_PASSWORD=jqpluldihxbqltfr

CLOUDINARY_URL=cloudinary://669586894727277:iz08b5ge_2qDAjAzUbgKL748Zpo@demkf5dzm
CLOUDINARY_API_KEY=669586894727277
CLOUDINARY_API_SECRET=iz08b5ge_2qDAjAzUbgKL748Zpo


JWT_SECRET=oWoPoo-KieLuvU
```
4. Start the development server: `bash npm run dev`
5. The server will be running on `http://localhost:3000`


