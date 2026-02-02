<h1 align="center">Task Management System</h1>

<p align="center">A full-stack, real-time collaborative task management app for teams and individuals—designed for productivity, reliability, and instant feedback.</p>

---

[Visit Now](https://your-live-app-url.com) 🚀

## 🔑 Demo Credentials

You can use the following credentials to test the application:

- **Email:** `ekansha13@gmail.com`
- **Password:** `akshat2002`

- **Email:** `ekanshssj@gmail.com`
- **Password:** `akshat2002`

---

## 🖥️ Tech Stack

**Frontend:**  
<img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E" />
<img alt="TailwindCSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img alt="ShadCn" src="https://img.shields.io/badge/ShadCN-000000?style=for-the-badge&logo=radixui&logoColor=white" />

**Backend:**  
<img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img alt="Express" src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
<img alt="Prisma" src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=ffffff" />
<img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img alt="Socket.io" src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" />

**Deployment:**  
<img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />

---

## 📌 Core Features

### 1. User Authentication & Authorization

- **Secure Registration/Login:** Passwords are hashed with bcrypt before storage.
- **Session Management:** Uses JWT stored in HttpOnly cookies—protecting against XSS.
- **User Profiles:** Users can view and update their name/profile.

### 2. Task Management (CRUD)

- **Full CRUD:** Create, update, assign, and delete tasks.
- **Task Model:**
  - `title` (max 100 chars)
  - `description` (multi-line)
  - `dueDate` (date/time)
  - `priority` (Low, Medium, High, Urgent)
  - `status` (To Do, In Progress, Review, Completed)
  - `creatorId` (user who created the task)
  - `assignedToId` (user responsible for task)

### 3. Real-Time Collaboration

- **Live Updates via Socket.io:**  
  All users on the dashboard see changes to any task (status, priority, assignee) in real-time.
- **Assignment Notifications:**  
  Instantly notifies users (in-app and persistently) when they’re assigned a task.

### 4. User Dashboard & Data Exploration

- **Dashboard:**  
  Organized views for: your assigned tasks, tasks you created, and overdue tasks.
- **Notifications Page:**  
  See all recent events—mark as read, clear all.
- **(Planned) Filtering & Sorting:**  
  Extensible frontend and backend for custom queries.

---

## 📌 Screenshots:

![home](/img/home.png)
![login](/img/login.png)

# 📄 API Contract

## 🔐 Auth

| Endpoint            | Method | Description                         |
| ------------------- | ------ | ----------------------------------- |
| `/api/auth/signup`  | POST   | Register new user                   |
| `/api/auth/login`   | POST   | Login and receive JWT cookie        |
| `/api/auth/logout`  | POST   | Logout and clear JWT cookie         |
| `/api/auth/profile` | PATCH  | Update profile name                 |
| `/api/auth/users`   | GET    | List all users                      |
| `/api/auth/me`      | GET    | Get current authenticated user info |

---

## ✅ Tasks

| Endpoint         | Method | Description                        |
| ---------------- | ------ | ---------------------------------- |
| `/api/tasks`     | POST   | Create a new task                  |
| `/api/tasks/:id` | PATCH  | Update an existing task            |
| `/api/tasks/:id` | DELETE | Delete a task                      |
| `/api/tasks/me`  | GET    | Get all tasks for the current user |

---

## 🔔 Notifications

| Endpoint                      | Method | Description                    |
| ----------------------------- | ------ | ------------------------------ |
| `/api/notifications`          | GET    | List user notifications        |
| `/api/notifications/:id/read` | PATCH  | Mark a notification as read    |
| `/api/notifications/read-all` | PATCH  | Mark all notifications as read |

---

# 🏗️ Architecture Overview & Design Decisions

## 🗄️ Database

- **MongoDB with Prisma ORM**
- Chosen for NoSQL scalability, flexible relations, ease of development, and rapid prototyping.

---

## 🔐 Authentication Model

- JWT-based authentication
- Tokens stored in **HttpOnly, Secure cookies** to prevent XSS attacks.

---

## 🔑 Password Security

- Passwords are securely hashed using **bcrypt**
- Plain-text passwords are never stored or exposed.

---

## ⚡ Real-time Integration

- **Socket.io** used for bi-directional real-time updates.
- Backend emits events such as:
  - `task:assigned`
  - `task:updated`
- Notification events are:
  - Stored persistently in the database
  - Displayed instantly in the UI

---

## 🧱 Service-based Backend Architecture

- Clear separation of concerns:
  - **Routes → Services → Repositories**
- Improves testability, scalability, and maintainability.

---

## 🖥️ Frontend State Management

- **React Context** used for authentication and task state.
- Socket subscriptions enable instant UI updates without polling.

---

## 🔌 Extensibility

- Models, APIs, and UI are designed for easy extension.
- Future additions may include:
  - Advanced filtering
  - Roles and permissions
  - Additional notification channels

---

# ⚡ Real-Time (Socket.io) Integration

## 🔄 How It Works

- When a task is updated or assigned, the backend emits corresponding Socket.io events.

## 👥 Affected Clients

- Users currently on dashboards or notification pages see updates instantly.
- No page refresh required.

## 🔔 Instant Notifications

- Assignment toasts appear in real time.
- Notifications are stored persistently so no updates are missed.

---

# ⚖️ Trade-offs & Assumptions

## 👤 Roles

- All users can create, assign, edit, and delete tasks they created.
- No admin or moderator roles implemented in v1.

## 🚀 Getting Started:

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (v6 or later) or [Yarn](https://yarnpkg.com/) (v1 or later)

## Project Structure:

task-management-system/
├── frontend/ # React + Vite app
├── backend/ # Node.js API with Prisma
└── README.md

## 🏠 Running the Project Locally:

Follow these steps to run the Next.js project on your local machine:

1.  **Clone the Repository:**

    ```sh
    git clone https://github.com/Zethyst/Task.git
    cd
    ```

2.  **Install Dependencies:**

    Frontend and Backend using npm:

    ```sh
    npm install
    ```

3.  **Run the Development Server:**

    Frontend and Backend using npm:

    ```sh
    npm run dev
    ```

4.  **Open Your Browser:**

    Open your browser and navigate to [http://localhost:5173](http://localhost:5173). You should see the Vite application running!

# Configure Environment Variables

Create a .env file inside the backend directory:

DATABASE_URL="your_database_connection_string"
FRONTEND_URL=http://localhost:5173
JWT_SECRET="your_jwt_secret"

⚠️ Never commit .env files to version control.

# Initialize Prisma

Generate Prisma client:

    ```sh
    npx prisma generate
    ```

Run database migrations (if applicable):

```sh
npx prisma migrate
```

## Running Both Frontend - Backend Together

Open two terminals:

Terminal 1 (Backend):

```sh
cd backend
npm run dev
```


Terminal 2 (Frontend):

    ```sh
    cd frontend
    npm run dev
    ```


## 📜 License:

This project is licensed under the MIT License.

<h2>📬 Contact</h2>

If you want to contact me, you can reach me through below handles.

[![linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/akshat-jaiswal-4664a2197)

© 2025 Akshat Jaiswal

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
````
