# TeamSync

TeamSync is a collaboration and contribution tracking tool designed to help teams work efficiently on group projects. It provides features for task management, group discussions, peer assessments, and contribution tracking.

## Prerequisites

Ensure you have the following installed before proceeding:

- **Node.js** (>= 16.x)
- **npm** (>= 8.x) or **yarn**
- **Docker** (If using Docker setup for backend)
- **PostgreSQL** (If running backend locally without Docker)
- **Git** (For cloning the repository)

---


## Features

- User and group management
- Task assignment and tracking
- Group chat functionality
- Peer & Self assessments for tracking individual contributions
- Detailed reports
- Secure authentication and role-based access control
- Integration with github

---

## Deployed Links & Video

- **Frontend:** [https://teamsync-3n5r.onrender.com](https://teamsync-3n5r.onrender.com)
- **Backend:** [https://jkarenzi.tech](https://jkarenzi.tech)
- **API Documentation:** [https://jkarenzi.tech/docs](https://jkarenzi.tech/docs)
- **Demo Video:** [https://youtu.be/c06Zfy_Bkus](https://youtu.be/c06Zfy_Bkus)

---

## How to Run the Project

### 1. Navigate into backend repo
```sh
cd backend
```

### 2. Set Up Environment Variables
Create a `.env` file in the backend root directory and configure the required environment variables:
```sh
DB_NAME=
DB_PORT=
DB_PASS=
JWT_SECRET=
DEFAULT_IMG=
APP_URL=
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
EMAIL_USER=
EMAIL_PASS=
EMAIL_HOST=
EMAIL_PORT=
NODE_ENV=
GITHUB_TOKEN=
GITHUB_USERNAME=
DB_HOST=
DB_USER=
SENDGRID_API_KEY=
```

### 3. Start the Backend

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```

The backend server should now be running at **http://localhost:4000**.

### 4. Set Up the Frontend

Navigate to frontend repo
```sh
cd frontend
```

### 5. Install Dependencies
Using npm:
```sh
npm install
```

### 6. Set Up Frontend Environment Variables
Create a `.env` file in the frontend root directory and configure the required environment variables:
```sh
VITE_BASE_URL=
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_CLOUDINARY_NAME=
VITE_PUSHER_CLUSTER=
VITE_PUSHER_KEY=
```

### 7. Start the Frontend
Using npm:
```sh
npm run dev
```

The frontend should now be running at **http://localhost:5173/** by default.

---

**Happy Collaborating with TeamSync! 🚀**