
# Employee Attendance System

A full-stack attendance tracking system supporting two roles — **Employee** and **Manager** — built using Node.js, Express, MongoDB/PostgreSQL, React, and Redux/Zustand.  

---

## Setup Instructions

### **1. Clone the Repository**


### **2. Install Dependencies**

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

### **3. Configure Environment Variables**

Create a `.env` file in the **backend** folder (refer `.env.example`):

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```


Frontend `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

---

## ▶️ How to Run

### **Start Backend**

```bash
cd backend
npm run dev
```

Backend runs at: **[http://localhost:5000](http://localhost:5000)**

### **Start Frontend**

```bash
cd frontend
npm run dev
```

Frontend runs at: **[http://localhost:3000](http://localhost:3000)**

---

## 🔐 Environment Variables

| Variable                   | Description                        |
| -------------------------- | ---------------------------------- |
| `PORT`                     | Backend port                       |
| `MONGO_URI`                | MongoDB connection string          |
| `JWT_SECRET`               | Secret for JWT signing             |
| `JWT_EXPIRES_IN`           | Token validity duration            |
| `CORS_ORIGIN`              | Allowed frontend URL               |
| `DATABASE_URL`             | PostgreSQL URL (if using Postgres) |
| `NEXT_PUBLIC_API_BASE_URL` | Frontend base API URL              |


---

## 🖼️ Screenshots

Add the following screenshots inside `/screenshots` folder:

```
/screenshots
 ├── employee-dashboard.png
 ├── manager-dashboard.png
 ├── attendance-history.png
 ├── login.png
 ├── checkin.png
 └── reports.png
```

Example Markdown:

```md
### Employee Dashboard
![Employee Dashboard](./screenshots/employee-dashboard.png)

### Manager Dashboard
![Manager Dashboard](./screenshots/manager-dashboard.png)

### Attendance History
![History](./screenshots/attendance-history.png)

### Login Page
![Login](./screenshots/login.png)
```

---

If you want, I can also:

✅ Generate a **perfect `.env.example` file**
✅ Generate **API documentation section**
✅ Write a **more polished README with badges, live demo, folder structure, seed instructions**

Just tell me!
